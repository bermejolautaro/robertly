import { Component, Injector, OnInit, TemplateRef, inject, isDevMode } from '@angular/core';
import { Router, RouterLinkActive, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { debounceTime, forkJoin, switchMap, tap } from 'rxjs';
import { Paths } from 'src/main';

import { ExerciseLogService } from '@services/exercise-log.service';

import {
  CreateExerciseLogRequest,
  ExerciseLogApiService,
  UpdateExerciseLogRequest,
} from '@services/exercise-log-api.service';
import { DOCUMENT, JsonPipe, NgClass, TitleCasePipe } from '@angular/common';

import { ExerciseLogDto } from '@models/exercise-log.model';
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
import { CreateOrUpdateLogModalComponent } from '@components/create-or-update-log-modal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FiltersComponent } from '@components/filters.component';
import { ToastService } from '@services/toast.service';
import { AuthApiService } from '@services/auth-api.service';
import { HeaderComponent } from '@components/header.component';
import { FooterComponent } from '@components/footer.component';
import { AuthService } from '@services/auth.service';
import { createLogFormGroup, CreateOrUpdateLogFormGroup } from '@models/create-or-update-log';
import { CREATE_LOG_VALUE_CACHE_KEY } from '@models/constants';

const GET_DATA_CACHE_KEY = 'robertly-get-data-cache';
const EXERCISE_LOGS_CACHE_KEY = 'robertly-exercise-logs';
const EXERCISES_CACHE_KEY = 'robertly-exercises';
const MINUTES_5 = 5 * 60;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    NgClass,
    TitleCasePipe,
    JsonPipe,
    FiltersComponent,
    HeaderComponent,
    FooterComponent,
    RouterLinkWithHref,
    RouterLinkActive,
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
  private readonly injector = inject(Injector);
  private readonly router = inject(Router);
  private readonly modalService = inject(NgbModal);
  private readonly offcanvasService = inject(NgbOffcanvas);

  public readonly createLogFormGroup: CreateOrUpdateLogFormGroup = createLogFormGroup();

  public readonly updateLogFormGroup: CreateOrUpdateLogFormGroup = createLogFormGroup();

  public readonly Paths = Paths;
  public hasAppLoaded: boolean = isDevMode();
  public preloaderMessage: string = 'Searching for updates...';
  public preloaderProgress: number = 10;

  public constructor() {
    const cacheTimestamp = localStorage.getItem(GET_DATA_CACHE_KEY);

    let shouldFetchFromBackend = false;

    if (!cacheTimestamp) {
      localStorage.setItem(GET_DATA_CACHE_KEY, this.dayjs().unix().toString());
      shouldFetchFromBackend = true;
    } else {
      const x = this.dayjs.unix(+cacheTimestamp);
      const difference = this.dayjs().diff(x, 'seconds');

      if (difference > MINUTES_5) {
        shouldFetchFromBackend = true;
        localStorage.setItem(GET_DATA_CACHE_KEY, this.dayjs().unix().toString());
      }
    }

    this.fetchData();

    this.serviceWorkerUpdates.unrecoverable.pipe(takeUntilDestroyed()).subscribe(x => console.error(x));

    this.serviceWorkerUpdates.versionUpdates.subscribe(evnt => {
      if (evnt.type === 'VERSION_DETECTED') {
        this.preloaderMessage = 'New version found. Preparing to install...';
        this.preloaderProgress = 60;
      } else if (evnt.type === 'NO_NEW_VERSION_DETECTED') {
        this.preloaderMessage = 'Everything up to date';
        this.preloaderProgress = 100;
        setTimeout(() => {
          this.hasAppLoaded = true;
        }, 500);
      } else if (evnt.type === 'VERSION_READY') {
        this.document.location.reload();
      } else if (evnt.type === 'VERSION_INSTALLATION_FAILED') {
        this.preloaderMessage = 'Failed to install new version';
        this.preloaderProgress = 100;
        setTimeout(() => {
          this.hasAppLoaded = true;
        }, 500);
      } else {
        throw new Error('Impossible state');
      }
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
      // this.open('update', exerciseLog);
    });

    this.exerciseLogService.createLogClicked$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.open('create');
    });

    this.exerciseLogService.deleteLog$
      .pipe(
        switchMap(x =>
          this.exerciseLogApiService.deleteExerciseLog(x.id).pipe(
            tap(() => {
              this.fetchData();
              this.toastService.ok('Log deleted successfully!');
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

  public open(mode: 'update' | 'create', exerciseLog?: ExerciseLogDto): void {
    const modalRef = this.modalService.open(CreateOrUpdateLogModalComponent, {
      injector: this.injector,
      fullscreen: true,
      animation: false,
    });
    const instance = modalRef.componentInstance as CreateOrUpdateLogModalComponent;
    instance.createOrUpdateLogFormGroup = mode === 'update' ? this.updateLogFormGroup : this.createLogFormGroup;
    instance.mode = mode;

    if (mode === 'create' && !this.createLogFormGroup.value.date) {
      this.createLogFormGroup.controls.date.patchValue(this.dayjs().format('YYYY-MM-DD'));
    }

    if (exerciseLog) {
      instance.originalValue = exerciseLog;
    }

    modalRef.result.then(
      () => {
        if (mode === 'create') {
          this.createExerciseLog();
        } else {
          this.updateExerciseLog(exerciseLog);
        }
      },
      () => {
        this.createLogFormGroup.markAsPristine();
        this.updateLogFormGroup.markAsPristine();
      }
    );
  }

  private createExerciseLog(): void {
    if (this.createLogFormGroup.invalid) {
      return;
    }

    if (typeof this.createLogFormGroup.value.exercise === 'string') {
      return;
    }

    const user = this.authService.user();

    const request: CreateExerciseLogRequest = {
      exerciseLog: {
        exerciseLogUsername: user?.name ?? this.createLogFormGroup.value.user!.toLocaleLowerCase(),
        exerciseLogUserId: user?.userId,
        exerciseLogExerciseId: this.createLogFormGroup.value.exercise!.exerciseId,
        exerciseLogDate: this.dayjsService.parseDate(this.createLogFormGroup.value.date!).format('YYYY-MM-DD'),
        series: (this.createLogFormGroup.value.series ?? [])
          .filter(x => !!x.reps && !!x.weightInKg)
          .map(x => ({
            exerciseLogId: x.exerciseLogId!,
            serieId: x.serieId!,
            reps: +x.reps!,
            weightInKg: +x.weightInKg!.toFixed(1),
          })),
      },
    };

    this.exerciseLogApiService.createExerciseLog(request).subscribe({
      next: () => {
        this.createLogFormGroup.reset();
        localStorage.removeItem(CREATE_LOG_VALUE_CACHE_KEY);
        this.fetchData();
        this.toastService.ok('Log created successfully!');
      },
      error: () => {
        this.fetchData();
        this.toastService.error();
      },
    });
  }

  private updateExerciseLog(exerciseLog?: ExerciseLogDto): void {
    if (this.updateLogFormGroup.invalid) {
      return;
    }

    if (typeof this.updateLogFormGroup.value.exercise === 'string') {
      return;
    }

    const user = this.authService.user();

    const request: UpdateExerciseLogRequest = {
      id: exerciseLog?.id!,
      exerciseLog: {
        exerciseLogUsername: user?.name ?? this.updateLogFormGroup.value.user!.toLocaleLowerCase(),
        exerciseLogUserId: user?.userId,
        exerciseLogExerciseId: this.updateLogFormGroup.value.exercise!.exerciseId,
        exerciseLogDate: this.dayjsService.parseDate(this.updateLogFormGroup.value.date!).format('YYYY-MM-DD'),
        series: (this.updateLogFormGroup.value.series ?? [])
          .filter(x => !!x.reps && !!x.weightInKg)
          .map(x => ({
            exerciseLogId: x.exerciseLogId!,
            serieId: x.serieId!,
            reps: +x.reps!,
            weightInKg: +x.weightInKg!.toFixed(1),
          })),
      },
    };

    this.exerciseLogApiService.updateExerciseLog(request).subscribe({
      next: () => {
        this.updateLogFormGroup.reset();
        this.fetchData();
        this.toastService.ok('Log updated successfully!');
      },
      error: () => {
        this.fetchData();
        this.toastService.error();
      },
    });
  }

  public fetchData(): void {
    this.exerciseLogService.refreshLogs$.next();
    let exercises$ = this.exerciseApiService.getExercises();

    this.exerciseLogService.withLoading(
      forkJoin([exercises$]).pipe(
        tap(([exercises]) => {
          this.exerciseLogService.updateExercises$.next(exercises);
        })
      )
    );
  }

  public signOut(): void {
    this.authApiService.signOut();
    this.router.navigate([Paths.SIGN_IN]);
  }

  public openSidebar(content: TemplateRef<unknown>): void {
    this.offcanvasService.open(content, { position: 'end' });
  }
}
