import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { Router, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { debounceTime, forkJoin, switchMap, take, tap } from 'rxjs';
import { Paths } from 'src/main';

import { ExerciseLogService } from '@services/exercise-log.service';

import { ExerciseLogApiService } from '@services/exercise-log-api.service';
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
import { DayjsService } from '@services/dayjs.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '@services/toast.service';
import { AuthApiService } from '@services/auth-api.service';
import { HeaderComponent } from '@components/header.component';
import { FooterComponent } from '@components/footer.component';
import { AuthService } from '@services/auth.service';
import { createLogFormGroup, CreateOrUpdateLogFormGroup } from '@models/create-or-update-log';
import { CREATE_LOG_VALUE_CACHE_KEY } from '@models/constants';
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
  public readonly exerciseLogService = inject(ExerciseLogService);
  public readonly toastService = inject(ToastService);
  public readonly authApiService = inject(AuthApiService);
  public readonly authService = inject(AuthService);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);
  private readonly exerciseApiService = inject(ExerciseApiService);
  private readonly serviceWorkerUpdates = inject(SwUpdate);
  private readonly document = inject(DOCUMENT);
  private readonly dayjsService = inject(DayjsService);
  private readonly dayjs = this.dayjsService.instance;
  private readonly router = inject(Router);
  private readonly offcanvasService = inject(NgbOffcanvas);
  private readonly modalService = inject(NgbModal);

  public readonly createLogFormGroup: CreateOrUpdateLogFormGroup = createLogFormGroup();

  public readonly updateLogFormGroup: CreateOrUpdateLogFormGroup = createLogFormGroup();

  public readonly Paths = Paths;
  public hasAppLoaded: boolean = true;
  public preloaderMessage: string = 'Searching for updates...';
  public preloaderProgress: number = 10;

  public constructor() {
    this.fetchData();

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

          instance.title = 'Version Update';
          instance.subtitle = '<strong>New version found</strong>';
          instance.body = 'Do you want to install it now?';
          instance.cancelText = 'Later';
          instance.okText = 'Update';

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

    this.createLogFormGroup.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(1000))
      .subscribe(value => localStorage.setItem(CREATE_LOG_VALUE_CACHE_KEY, JSON.stringify(value)));

    this.exerciseLogService.logClicked$.pipe(takeUntilDestroyed()).subscribe(exerciseLog => {
      this.updateLogFormGroup.reset();
      this.updateLogFormGroup.patchValue({
        exercise: exerciseLog.exercise,
        date: this.dayjsService.parseDate(exerciseLog.date).format('YYYY-MM-DD'),
        user: exerciseLog.user.name,
        series: exerciseLog.series.map(x => ({
          exerciseLogId: x.exerciseLogId,
          serieId: x.serieId,
          reps: x.reps,
          weightInKg: x.weightInKg,
        })),
      });

      this.router.navigate([Paths.LOGS, Paths.LOGS_EDIT, exerciseLog.id]);
    });

    this.exerciseLogService.createLogClicked$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.navigateToCreateLog();
    });

    this.exerciseLogService.deleteLog$
      .pipe(
        switchMap(x =>
          this.exerciseLogApiService.deleteExerciseLog(x.id).pipe(
            tap(() => {
              this.fetchData();
              this.toastService.ok('Log deleted successfully!');
              this.router.navigate([Paths.LOGS]);
            })
          )
        ),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  public ngOnInit(): void {
    const formGroupValue = JSON.parse(localStorage.getItem(CREATE_LOG_VALUE_CACHE_KEY) ?? 'null');

    if (formGroupValue) {
      this.createLogFormGroup.patchValue(formGroupValue);
    }
  }

  public navigateToCreateLog(): void {
    this.router.navigate([Paths.LOGS, Paths.LOGS_CREATE]);
  }

  public fetchData(): void {
    this.exerciseLogService.refreshLogs$.next();
    let exercises$ = this.exerciseApiService.getExercises();

    forkJoin([exercises$]).pipe(
      tap(([exercises]) => {
        this.exerciseLogService.updateExercises$.next(exercises);
      })
    ).subscribe();
  }

  public signOut(): void {
    this.authApiService.signOut();
    this.router.navigate([Paths.SIGN_IN]);
  }

  public openSidebar(content: TemplateRef<unknown>): void {
    this.offcanvasService.open(content, { position: 'end' });
  }
}
