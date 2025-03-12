import { Component, OnInit, TemplateRef, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { filter, take } from 'rxjs';
import { AUTH_CHECKS_ENABLED, Paths } from 'src/main';

import { DOCUMENT } from '@angular/common';

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
import { HeaderComponent } from '@components/header/header.component';
import { FooterComponent } from '@components/footer/footer.component';
import { AuthService } from '@services/auth.service';
import { ConfirmModalComponent } from '@components/confirm-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterLinkWithHref,
    RouterOutlet,
    NgbDropdownModule,
    NgbOffcanvasModule,
    NgbToastModule,
    NgbAlertModule,
  ],
})
export class AppComponent implements OnInit {
  public readonly toastService = inject(ToastService);
  public readonly authApiService = inject(AuthApiService);
  public readonly authService = inject(AuthService);

  private readonly exerciseApiService = inject(ExerciseApiService);
  private readonly serviceWorkerUpdates = inject(SwUpdate);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly offcanvasService = inject(NgbOffcanvas);
  private readonly modalService = inject(NgbModal);
  private readonly authChecksEnabled = inject(AUTH_CHECKS_ENABLED);

  public readonly Paths = Paths;
  public readonly currentRoute = toSignal(this.router.events.pipe(filter(x => x instanceof NavigationEnd)));
  public readonly isLoading = signal(false);
  public readonly preloaderProgress = signal(25);

  public constructor() {
    this.serviceWorkerUpdates.unrecoverable.pipe(takeUntilDestroyed()).subscribe(x => console.error(x));

    this.serviceWorkerUpdates.versionUpdates.subscribe({
      next: evnt => {
        if (evnt.type === 'VERSION_DETECTED') {
          this.toastService.ok('New version found.');
        } else if (evnt.type === 'NO_NEW_VERSION_DETECTED') {
          this.toastService.ok('Everything up to date.');
        } else if (evnt.type === 'VERSION_READY') {
          const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true });
          const instance: ConfirmModalComponent = modalRef.componentInstance;

          instance.title.set('Version Update');
          instance.subtitle.set('<strong>New version found</strong>');
          instance.body.set('Do you want to install it now?');
          instance.cancelText.set('Later');
          instance.okText.set('Update');

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
  }

  public async ngOnInit(): Promise<void> {
    this.isLoading.set(true);
    if (this.authChecksEnabled) {
      await this.authApiService.tryRefreshToken();
    }
    this.preloaderProgress.set(75);
    await this.exerciseApiService.fetchExercises();
    this.preloaderProgress.set(100);
    await new Promise(resolve => setTimeout(resolve, 500));
    this.isLoading.set(false);
  }

  public navigateToCreateLog(): void {
    this.router.navigate([Paths.LOGS, Paths.LOGS_CREATE]);
  }

  public async signOut(): Promise<void> {
    await this.authApiService.signOut();
    this.router.navigate([Paths.SIGN_IN]);
  }

  public openSidebar(content: TemplateRef<unknown>): void {
    this.offcanvasService.open(content, { position: 'end' });
  }
}
