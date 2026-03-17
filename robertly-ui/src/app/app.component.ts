import {
  Component,
  OnInit,
  TemplateRef,
  inject,
  signal,
  DOCUMENT,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLinkWithHref,
  RouterOutlet,
} from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { filter, firstValueFrom, map, take } from 'rxjs';
import { Paths } from 'src/main';

import {
  NgbAlertModule,
  NgbDropdownModule,
  NgbModal,
  NgbOffcanvas,
  NgbOffcanvasModule,
  NgbToastModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ExerciseApiService } from '@services/exercises-api.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ToastService } from '@services/toast.service';
import { AuthApiService } from '@services/auth-api.service';
import { HeaderComponent } from '@components/header.component';
import { FooterComponent } from '@components/footer/footer.component';
import { AuthService } from '@services/auth.service';
import { ConfirmModalComponent } from '@components/confirm-modal.component';
import { CacheService } from '@services/cache.service';
import { OfflineQueueService } from '@services/offline-queue.service';
import { Auth } from '@angular/fire/auth';
import { DatabaseService } from '@services/database.service';
import { UsersService } from '@services/users.service';
import { ExerciseLogApiService } from '@services/exercise-log-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterOutlet,
    RouterLinkWithHref,
    NgbDropdownModule,
    NgbOffcanvasModule,
    NgbToastModule,
    NgbAlertModule,
  ],
})
export class AppComponent implements OnInit {
  public readonly auth = inject(Auth);
  
  public readonly toastService = inject(ToastService);
  public readonly authApiService = inject(AuthApiService);
  public readonly authService = inject(AuthService);

  private readonly offlineQueueService = inject(OfflineQueueService);
  private readonly cacheService = inject(CacheService);
  private readonly exerciseApiService = inject(ExerciseApiService);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);
  private readonly usersService = inject(UsersService);
  private readonly dbService = inject(DatabaseService);
  private readonly serviceWorkerUpdates = inject(SwUpdate);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly offcanvasService = inject(NgbOffcanvas);
  private readonly modalService = inject(NgbModal);

  public readonly Paths = Paths;
  public readonly currentRoute = toSignal(
    this.router.events.pipe(filter(x => x instanceof NavigationEnd))
  );
  public readonly isLoading = signal(false);
  public readonly preloaderProgress = signal(25);

  public constructor() {
    this.serviceWorkerUpdates.unrecoverable
      .pipe(takeUntilDestroyed())
      .subscribe(x => console.error(x));

    this.serviceWorkerUpdates.versionUpdates.subscribe({
      next: evnt => {
        if (evnt.type === 'VERSION_DETECTED') {
          this.toastService.ok('New version found.');
        } else if (evnt.type === 'NO_NEW_VERSION_DETECTED') {
          this.toastService.ok('Everything up to date.');
        } else if (evnt.type === 'VERSION_READY') {
          const modalRef = this.modalService.open(ConfirmModalComponent, {
            centered: true,
          });
          const instance: ConfirmModalComponent = modalRef.componentInstance;

          instance.configure({
            title: 'Update Available',
            subtitle: '<strong>New version found</strong>',
            body: 'Do you want to install it now?',
            cancelText: 'Later',
            okText: 'Update',
          });

          modalRef.closed.pipe(take(1)).subscribe(() => {
            this.document.location.reload();
          });
        } else if (evnt.type === 'VERSION_INSTALLATION_FAILED') {
          this.toastService.error('Failed to install new version.');
        } else {
          throw new Error('Impossible state');
        }
      },
    });

    this.auth.onAuthStateChanged(async user => {
      this.preloaderProgress.set(75);

      if (!user) {
        throw new Error('No user from firebase');
      }

      const userFromDb = await firstValueFrom(
        this.usersService.getUserByFirebaseUuid(user?.uid).pipe(
          map(userFromDb => ({
            email: userFromDb.email,
            userId: userFromDb.userId,
            name: userFromDb.name,
            userFirebaseUuid: userFromDb.userFirebaseUuid,
            assignedUsers: userFromDb.assignedUsers,
          }))
        )
      );

      if (!userFromDb) {
        throw new Error('No user from API');
      }

      try {
        this.exerciseApiService.fetchExercises();
      } catch (error) {}

      this.dbService.init(user.uid);
      
      const DAYS_AGO_90 = new Date(); 
      DAYS_AGO_90.setDate(DAYS_AGO_90.getDate() - 90);

      await this.exerciseLogApiService.syncPull(DAYS_AGO_90.toISOString());

      this.offlineQueueService.processQueue();

      this.preloaderProgress.set(100);
      this.isLoading.set(false);
    });

    window.addEventListener('online', () => {
      this.offlineQueueService.processQueue();
    });
  }

  public async ngOnInit(): Promise<void> {
    this.isLoading.set(true);
    this.cacheService.load();
    this.cacheService.cleanupExpired();
  }

  public async signOut(): Promise<void> {
    await this.authApiService.signOut();
    this.router.navigate([Paths.SIGN_IN]);
  }

  public openSidebar(content: TemplateRef<unknown>): void {
    this.offcanvasService.open(content, { position: 'end' });
  }
}
