import { Component, ElementRef, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';

import {
  Observable,
  OperatorFunction,
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  first,
  forkJoin,
  map,
  merge,
  switchMap,
  tap,
} from 'rxjs';
import { LOGS_PATH, STATS_PATH } from 'src/main';

import { ExerciseLogService } from '@services/excercise-log.service';

import { ExerciseLogApiService } from '@services/excercise-log-api.service';
import { DOCUMENT, NgClass, TitleCasePipe } from '@angular/common';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import { ExerciseLog } from '@models/excercise-log.model';
import { NgbDropdownModule, NgbModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ExerciseApiService } from '@services/exercises-api.service';
import { Exercise } from '@models/exercise.model';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { parseDate } from '@helpers/date.helper';

const GET_DATA_CACHE_KEY = 'robertly-get-data-cache';
const EXERCISE_LOGS_CACHE_KEY = 'robertly-exercise-logs';
const EXERCISES_CACHE_KEY = 'robertly-exercises';
const CREATE_LOG_VALUE_CACHE_KEY = 'robertly-create-log-value';

type CreateLogFormGroup = FormGroup<{
  user: FormControl<string | null>;
  exercise: FormControl<string | null>;
  series: FormArray<
    FormGroup<{
      reps: FormControl<number | null>;
      weightInKg: FormControl<number | null>;
    }>
  >;
}>;

const createLogFormValidator =
  (exerciseLogService: ExerciseLogService): ValidatorFn =>
  control => {
    const typedControl = control as CreateLogFormGroup;
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

    if (typedControl.value.exercise === 'peron') {
      errors = { ...(errors ?? {}), ...{ exerciseInvalidPeron: 'Peron is not allowed' } };
    }

    const exerciseExists = exerciseLogService.exercises().find(x => x.name.toLowerCase() === typedControl.value.exercise?.toLowerCase());

    if (!exerciseExists) {
      errors = { ...(errors ?? {}), ...{ exerciseDoesNotExist: 'Exercise does not exists' } };
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
    `,
  standalone: true,
  providers: [ExerciseLogService],
  imports: [
    NgClass,
    RouterLinkWithHref,
    RouterLinkActive,
    RouterOutlet,
    TitleCasePipe,
    NgbDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTypeaheadModule,
  ],
})
export class AppComponent implements OnInit {
  public readonly exerciseLogService = inject(ExerciseLogService);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);
  private readonly exerciseApiService = inject(ExerciseApiService);
  private readonly serviceWorkerUpdates = inject(SwUpdate);
  private readonly modalService = inject(NgbModal);
  private readonly document = inject(DOCUMENT);

  @ViewChild('usernameTypeaheadInput', { static: true }) usernameTypeaheadInput: ElementRef<HTMLInputElement> | null = null;
  public readonly usernameFocus$: Subject<string> = new Subject<string>();

  public readonly usernameSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(distinctUntilChanged());

    return merge(debouncedText$, this.usernameFocus$).pipe(
      map(() => {
        const usernames = this.exerciseLogService.usernames().map(x => x);

        return this.formGroup.value.user === ''
          ? usernames
          : usernames.filter(x => !!x).filter(v => v.toLowerCase().includes(this.formGroup.value.user?.toLowerCase() ?? ''));
      })
    );
  };

  @ViewChild('exerciseTypeaheadInput', { static: true }) exerciseTypeaheadInput: ElementRef<HTMLInputElement> | null = null;
  public readonly exerciseFocus$: Subject<string> = new Subject<string>();

  public readonly exerciseSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(distinctUntilChanged());

    return merge(debouncedText$, this.exerciseFocus$).pipe(
      map(() => {
        const exercises = this.exerciseLogService.exercises().map(x => x.name);

        return this.formGroup.value.exercise === ''
          ? exercises
          : exercises.filter(x => !!x).filter(v => v.toLowerCase().includes(this.formGroup.value.exercise?.toLowerCase() ?? ''));
      })
    );
  };

  public readonly formGroup: CreateLogFormGroup = new FormGroup(
    {
      user: new FormControl(''),
      exercise: new FormControl(''),
      series: new FormArray([
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
      ]),
    },
    [createLogFormValidator(this.exerciseLogService)]
  );

  public isSpinning: boolean = false;

  public readonly STATS_PATH = STATS_PATH;
  public readonly LOGS_PATH = LOGS_PATH;

  public constructor() {
    dayjs.extend(customParseFormat);
    dayjs.extend(weekOfYear);
    dayjs.extend(isoWeek);

    const cacheTimestamp = localStorage.getItem(GET_DATA_CACHE_KEY);

    let shouldFetchExerciseLogs = false;

    if (!cacheTimestamp) {
      localStorage.setItem(GET_DATA_CACHE_KEY, dayjs().unix().toString());
      shouldFetchExerciseLogs = true;
    } else {
      const x = dayjs.unix(+cacheTimestamp);
      const difference = dayjs().diff(x, 'seconds');

      if (difference > 5 * 60) {
        shouldFetchExerciseLogs = true;
        localStorage.setItem(GET_DATA_CACHE_KEY, dayjs().unix().toString());
      }
    }

    if (shouldFetchExerciseLogs) {
      this.fetchData();
    } else {
      const exerciseLogs: ExerciseLog[] = JSON.parse(localStorage.getItem(EXERCISE_LOGS_CACHE_KEY) ?? '[]');
      const exercises: Exercise[] = JSON.parse(localStorage.getItem(EXERCISES_CACHE_KEY) ?? '[]');
      this.exerciseLogService.updateLogs$.next(exerciseLogs);
      this.exerciseLogService.updateExercises$.next(exercises);
    }

    this.serviceWorkerUpdates.unrecoverable.subscribe(x => console.error(x));

    this.serviceWorkerUpdates.versionUpdates
      .pipe(
        tap(x => console.log(x)),
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        first()
      )
      .subscribe(() => {
        this.document.location.reload();
      });

    this.formGroup.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(value => localStorage.setItem(CREATE_LOG_VALUE_CACHE_KEY, JSON.stringify(value)));
  }

  public ngOnInit(): void {
    const formGroupValue = JSON.parse(localStorage.getItem(CREATE_LOG_VALUE_CACHE_KEY) ?? 'null');

    if (formGroupValue) {
      this.formGroup.patchValue(formGroupValue);
    }
  }

  public open(content: TemplateRef<unknown>): void {
    this.modalService.open(content, { centered: true }).result.then(
      () => {
        const request = {
          date: dayjs().format('DD-MM-YYYY'),
          exercise: this.formGroup.value.exercise!.toLowerCase(),
          user: this.formGroup.value.user!.toLowerCase(),
          payload: {
            series: (this.formGroup.value.series ?? [])
              .filter(x => !!x.reps && !!x.weightInKg)
              .map(x => ({ reps: +x.reps!, weightInKg: +x.weightInKg!.toFixed(1) })),
          },
        };

        const exerciseLogs: ExerciseLog[] = request.payload.series.map((s, i) => ({
          date: parseDate(request.date).format('DD/MM/YYYY'),
          name: request.exercise,
          reps: s.reps,
          serie: i + 1,
          type: '',
          user: request.user,
          weightKg: s.weightInKg,
        }));

        this.exerciseLogService.appendLogs$.next(exerciseLogs);
        this.exerciseLogApiService.createExerciseLog(request).subscribe({
          next: () => {
            this.formGroup.reset();
            localStorage.removeItem(CREATE_LOG_VALUE_CACHE_KEY);
            this.fetchData(false);
          },
          error: () => {
            this.fetchData();
          },
        });
      },
      () => {}
    );
  }

  public fetchData(showLoading: boolean = true): void {
    if (showLoading) {
      this.exerciseLogService.startLoading$.next();
    }
    const exerciseLogs$ = forkJoin([this.exerciseLogApiService.getExerciseLogs(), this.exerciseLogApiService.getExerciseLogsv2()]).pipe(
      map(([a, b]) => a.concat(b))
    );
    const logsAndExercises$ = this.exerciseApiService.getExercises().pipe(
      switchMap(exercises => exerciseLogs$.pipe(map(logs => [logs, exercises] as const))),
      tap(([logs, exercises]) => {
        for (const log of logs) {
          if (!log.type) {
            log.type = exercises.find(x => x.exercise === log.name)?.type ?? '';
          }
        }
      })
    );
    logsAndExercises$.subscribe(([exerciseLogs, exercises]) => {
      localStorage.setItem(EXERCISE_LOGS_CACHE_KEY, JSON.stringify(exerciseLogs));
      localStorage.setItem(EXERCISES_CACHE_KEY, JSON.stringify(exercises));
      this.exerciseLogService.updateLogs$.next(exerciseLogs);
      this.exerciseLogService.updateExercises$.next(exercises);
    });
  }
}
