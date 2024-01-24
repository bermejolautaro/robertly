import { Component, Injector, OnInit, TemplateRef, inject } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';

import { debounceTime, filter, forkJoin, of, switchMap, tap } from 'rxjs';
import { EXERCISES_PATH, LOGS_PATH, STATS_PATH } from 'src/main';

import { ExerciseLogService } from '@services/exercise-log.service';

import { ExerciseLogApiService } from '@services/exercise-log-api.service';
import { DOCUMENT, NgClass, TitleCasePipe } from '@angular/common';

import { ExerciseLog } from '@models/exercise-log.model';
import { NgbAlertModule, NgbDropdownModule, NgbModal, NgbOffcanvas, NgbOffcanvasModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ExerciseApiService } from '@services/exercises-api.service';
import { Exercise } from '@models/exercise.model';
import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DayjsService } from '@services/dayjs.service';
import { CreateOrUpdateLogModalComponent } from '@components/create-or-update-log-modal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExerciseRow } from '@models/exercise-row.model';
import { FiltersComponent } from '@components/filters.component';
import { ToastService } from '@services/toast.service';

const GET_DATA_CACHE_KEY = 'robertly-get-data-cache';
const EXERCISE_LOGS_CACHE_KEY = 'robertly-exercise-logs';
const EXERCISES_CACHE_KEY = 'robertly-exercises';
const CREATE_LOG_VALUE_CACHE_KEY = 'robertly-create-log-value';

export type CreateOrUpdateLogFormGroup = FormGroup<{
  user: FormControl<string | null>;
  date: FormControl<string | null>;
  exercise: FormControl<Exercise | null>;
  series: FormArray<
    FormGroup<{
      reps: FormControl<number | null>;
      weightInKg: FormControl<number | null>;
    }>
  >;
}>;

const createOrUpdateLogFormValidator: ValidatorFn = control => {
  const typedControl = control as CreateOrUpdateLogFormGroup;
  let errors: Record<string, string> | null = null;

  const userRequiredErrors = Validators.required(typedControl.controls.user);
  if (userRequiredErrors) {
    errors = { ...(errors ?? {}), ...{ userRequired: 'Username is required' } };
  }

  if (typedControl.value.user === 'peron') {
    errors = { ...(errors ?? {}), ...{ userInvalidPeron: 'Peron is not allowed' } };
  }

  const exerciseRequiredErrors = Validators.required(typedControl.controls.exercise);
  if (exerciseRequiredErrors) {
    errors = { ...(errors ?? {}), ...{ exerciseRequired: 'Exercise is required' } };
  }

  if (typedControl.value.exercise?.name?.toLowerCase() === 'peron') {
    errors = { ...(errors ?? {}), ...{ exerciseInvalidPeron: 'Peron is not allowed' } };
  }

  if (typedControl.controls.series.value.map(x => (x.reps ?? 0) > 0 && (x.weightInKg ?? 0) > 0).every(x => !x)) {
    errors = { ...(errors ?? {}), ...{ seriesAllSeriesAreEmpty: 'Needs at least one serie' } };
  }

  if (typedControl.controls.series.value.some(x => !Number.isInteger(x.reps ?? 0))) {
    errors = { ...(errors ?? {}), ...{ seriesRepsMustBeInteger: 'Reps needs to be whole numbers' } };
  }

  return errors;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: `
      nav.navbar.fixed-bottom {
        padding-bottom: max(env(safe-area-inset-bottom), 0.8rem);
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }

      button:focus i.fa.fa-refresh.spin {
        animation: rotate 1s ease-in-out 0s;
      }

      @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(720deg); }
      }

      button:has(.fa.fa-plus) {
        border-radius: 100%;
        position: fixed;
        right: 25px;
        bottom: 75px;

        @supports (-webkit-hyphens: none) {
          bottom: 100px;
        }

        z-index: 4;
      }

      .toast-container {
        position: fixed;
        top: 15px;
        left: 50%;
        transform: translate(-50%);
        z-index: 1200;

        & > :not(:last-child) {
          --bs-toast-spacing: .5rem;
        }
      }
    `,
  standalone: true,
  providers: [ExerciseLogService],
  imports: [
    NgClass,
    TitleCasePipe,
    FiltersComponent,
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
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);
  private readonly exerciseApiService = inject(ExerciseApiService);
  private readonly serviceWorkerUpdates = inject(SwUpdate);
  private readonly modalService = inject(NgbModal);
  private readonly document = inject(DOCUMENT);
  private readonly dayjsService = inject(DayjsService);
  private readonly dayjs = this.dayjsService.instance;
  private readonly injector = inject(Injector);
  private readonly offcanvasService = inject(NgbOffcanvas);

  public readonly createLogFormGroup: CreateOrUpdateLogFormGroup = new FormGroup(
    {
      user: new FormControl(''),
      exercise: new FormControl<Exercise | null>(null),
      date: new FormControl(''),
      series: new FormArray([
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
      ]),
    },
    [createOrUpdateLogFormValidator]
  );

  public readonly updateLogFormGroup: CreateOrUpdateLogFormGroup = new FormGroup(
    {
      user: new FormControl(''),
      exercise: new FormControl<Exercise | null>(null),
      date: new FormControl(''),
      series: new FormArray([
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
      ]),
    },
    [createOrUpdateLogFormValidator]
  );

  public isSpinning: boolean = false;

  public readonly STATS_PATH = STATS_PATH;
  public readonly LOGS_PATH = LOGS_PATH;
  public readonly EXERCISES_PATH = EXERCISES_PATH;

  public constructor() {
    const cacheTimestamp = localStorage.getItem(GET_DATA_CACHE_KEY);

    let shouldFetchExerciseLogs = false;

    if (!cacheTimestamp) {
      localStorage.setItem(GET_DATA_CACHE_KEY, this.dayjs().unix().toString());
      shouldFetchExerciseLogs = true;
    } else {
      const x = this.dayjs.unix(+cacheTimestamp);
      const difference = this.dayjs().diff(x, 'seconds');

      if (difference > 5 * 60) {
        shouldFetchExerciseLogs = true;
        localStorage.setItem(GET_DATA_CACHE_KEY, this.dayjs().unix().toString());
      }
    }

    if (shouldFetchExerciseLogs) {
      this.fetchData(true);
    } else {
      const exerciseLogs: ExerciseLog[] = JSON.parse(localStorage.getItem(EXERCISE_LOGS_CACHE_KEY) ?? '[]');
      const exercises: Exercise[] = JSON.parse(localStorage.getItem(EXERCISES_CACHE_KEY) ?? '[]');
      this.exerciseLogService.updateLogs(of([exerciseLogs, exercises]));
    }

    this.serviceWorkerUpdates.unrecoverable.pipe(takeUntilDestroyed()).subscribe(x => console.error(x));

    this.serviceWorkerUpdates.versionUpdates
      .pipe(
        tap(x => {
          console.log(x);
          this.toastService.show({ text: x.type, type: 'secondary' });
        }),
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      )
      .subscribe(() => {
        this.document.location.reload();
      });

    this.createLogFormGroup.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(1000))
      .subscribe(value => localStorage.setItem(CREATE_LOG_VALUE_CACHE_KEY, JSON.stringify(value)));

    this.exerciseLogService.logClicked$.pipe(takeUntilDestroyed()).subscribe(exerciseRow => {
      this.updateLogFormGroup.reset();
      this.updateLogFormGroup.patchValue({
        exercise: exerciseRow.exercise,
        date: this.dayjsService.parseDate(exerciseRow.date).format('YYYY-MM-DD'),
        user: exerciseRow.username,
        series: exerciseRow.series.map(x => ({ reps: x.reps, weightInKg: x.weightInKg })),
      });
      this.open('update', exerciseRow);
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

  public open(mode: 'update' | 'create', exerciseRow?: ExerciseRow): void {
    const modalRef = this.modalService.open(CreateOrUpdateLogModalComponent, { centered: true, injector: this.injector });
    const instance = modalRef.componentInstance as CreateOrUpdateLogModalComponent;
    instance.createOrUpdateLogFormGroup = mode === 'update' ? this.updateLogFormGroup : this.createLogFormGroup;
    instance.mode = mode;

    if (mode === 'create' && !this.createLogFormGroup.value.date) {
      this.createLogFormGroup.controls.date.patchValue(this.dayjs().format('YYYY-MM-DD'));
    }

    if (exerciseRow) {
      instance.originalValue = exerciseRow;
    }

    modalRef.result.then(
      () => {
        if (mode === 'create') {
          if (this.createLogFormGroup.invalid) {
            return;
          }

          const request = {
            date: this.dayjsService.parseDate(this.createLogFormGroup.value.date!).format('YYYY-MM-DD'),
            exerciseId: this.createLogFormGroup.value.exercise!.id,
            user: this.createLogFormGroup.value.user!.toLowerCase(),
            series: (this.createLogFormGroup.value.series ?? [])
              .filter(x => !!x.reps && !!x.weightInKg)
              .map(x => ({ reps: +x.reps!, weightInKg: +x.weightInKg!.toFixed(1) })),
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
        } else {
          if (this.updateLogFormGroup.invalid) {
            return;
          }

          const request = {
            id: exerciseRow!.id,
            date: this.dayjsService.parseDate(this.updateLogFormGroup.value.date!).format('YYYY-MM-DD'),
            exerciseId: this.updateLogFormGroup.value.exercise!.id,
            user: this.updateLogFormGroup.value.user!.toLowerCase(),
            series: (this.updateLogFormGroup.value.series ?? [])
              .filter(x => !!x.reps && !!x.weightInKg)
              .map(x => ({ reps: +x.reps!, weightInKg: +x.weightInKg!.toFixed(1) })),
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
      },
      () => {
        this.createLogFormGroup.markAsPristine();
        this.updateLogFormGroup.markAsPristine();
      }
    );
  }

  public fetchData(fetchExercises: boolean = false): void {
    const cachedExercises: Exercise[] = JSON.parse(localStorage.getItem(EXERCISES_CACHE_KEY) ?? '[]');
    let exercises$ = this.exerciseApiService.getExercises();

    if (!fetchExercises && cachedExercises.length) {
      exercises$ = of(cachedExercises);
    }
    this.exerciseLogService.updateLogs(
      forkJoin([this.exerciseLogApiService.getExerciseLogsv2(), exercises$]).pipe(
        tap(([exerciseLogs, exercises]) => {
          localStorage.setItem(EXERCISE_LOGS_CACHE_KEY, JSON.stringify(exerciseLogs));
          localStorage.setItem(EXERCISES_CACHE_KEY, JSON.stringify(exercises));
          this.exerciseLogService.updateLogs$.next(exerciseLogs);
          this.exerciseLogService.updateExercises$.next(exercises);
        })
      )
    );
  }

  public openSidebar(content: TemplateRef<unknown>): void {
    this.offcanvasService.open(content, { position: 'end' });
  }
}
