import { Component, ElementRef, Injector, OnInit, ViewChild, effect, inject } from '@angular/core';
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
  of,
  switchMap,
  tap,
} from 'rxjs';
import { LOGS_PATH, STATS_PATH } from 'src/main';

import { EXERCISE_DEFAULT_LABEL, ExerciseLogService, WEIGHT_DEFAULT_LABEL } from '@services/exercise-log.service';

import { ExerciseLogApiService } from '@services/exercise-log-api.service';
import { DOCUMENT, NgClass, TitleCasePipe } from '@angular/common';

import { ExerciseLog } from '@models/excercise-log.model';
import { NgbDropdownModule, NgbModal, NgbTypeaheadModule, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { ExerciseApiService } from '@services/exercises-api.service';
import { Exercise } from '@models/exercise.model';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { parseDate } from '@helpers/date.helper';
import { DayjsService } from '@services/dayjs.service';
import { CreateOrUpdateLogModalComponent } from '@components/create-or-update-log-modal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExerciseRow } from '@models/excercise-row.model';
import { ViewModelApiService } from '@services/viewmodel-api.service';

const GET_DATA_CACHE_KEY = 'robertly-get-data-cache';
const EXERCISE_LOGS_CACHE_KEY = 'robertly-exercise-logs';
const EXERCISES_CACHE_KEY = 'robertly-exercises';
const CREATE_LOG_VALUE_CACHE_KEY = 'robertly-create-log-value';

export type CreateOrUpdateLogFormGroup = FormGroup<{
  user: FormControl<string | null>;
  date: FormControl<string | null>;
  exercise: FormControl<string | null>;
  series: FormArray<
    FormGroup<{
      reps: FormControl<number | null>;
      weightInKg: FormControl<number | null>;
    }>
  >;
}>;

const CLEAR_FILTER_LABEL = 'Clear Filter';

const createOrUpdateLogFormValidator =
  (exerciseLogService: ExerciseLogService): ValidatorFn =>
  control => {
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

    if (typedControl.value.exercise === 'peron') {
      errors = { ...(errors ?? {}), ...{ exerciseInvalidPeron: 'Peron is not allowed' } };
    }

    const exerciseExists = exerciseLogService
      .exercises()
      .find(x => x.name.toLowerCase() === typedControl.value.exercise?.toLowerCase());

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
  private readonly viewModelApiService = inject(ViewModelApiService);
  private readonly serviceWorkerUpdates = inject(SwUpdate);
  private readonly modalService = inject(NgbModal);
  private readonly document = inject(DOCUMENT);
  private readonly dayjsService = inject(DayjsService);
  private readonly dayjs = this.dayjsService.instance;
  private readonly injector = inject(Injector);
  private readonly titleCasePipe = inject(TitleCasePipe);

  public readonly createLogFormGroup: CreateOrUpdateLogFormGroup = new FormGroup(
    {
      user: new FormControl(''),
      exercise: new FormControl(''),
      date: new FormControl(''),
      series: new FormArray([
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
      ]),
    },
    [createOrUpdateLogFormValidator(this.exerciseLogService)]
  );

  public readonly updateLogFormGroup: CreateOrUpdateLogFormGroup = new FormGroup(
    {
      user: new FormControl(''),
      exercise: new FormControl(''),
      date: new FormControl(''),
      series: new FormArray([
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
        new FormGroup({ reps: new FormControl(), weightInKg: new FormControl() }),
      ]),
    },
    [createOrUpdateLogFormValidator(this.exerciseLogService)]
  );

  public isSpinning: boolean = false;

  public readonly STATS_PATH = STATS_PATH;
  public readonly LOGS_PATH = LOGS_PATH;

  public exerciseTypeahead: string = '';

  @ViewChild('exerciseTypeaheadInput', { static: true }) exerciseTypeaheadInput: ElementRef<HTMLInputElement> | null = null;
  public readonly exerciseFocus$: Subject<string> = new Subject<string>();

  public readonly exerciseSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(distinctUntilChanged());

    return merge(debouncedText$, this.exerciseFocus$).pipe(
      map(() => {
        const selectedType = this.exerciseLogService.selectedType();
        const exercises = this.exerciseLogService
          .exercises()
          .filter(x => (!!selectedType ? x.type.toLowerCase() === selectedType.toLowerCase() : true))
          .map(x => x.name);

        if (this.exerciseLogService.selectedExercise()) {
          exercises.unshift(CLEAR_FILTER_LABEL);
        }

        return this.exerciseTypeahead === '' || this.exerciseTypeahead === EXERCISE_DEFAULT_LABEL
          ? exercises
          : exercises.filter(x => !!x).filter(x => x.toLowerCase().includes(this.exerciseTypeahead.toLowerCase()));
      })
    );
  };

  public weightTypeahead: string = '';

  @ViewChild('weightTypeaheadInput', { static: true }) weightTypeaheadInput: ElementRef<HTMLInputElement> | null = null;
  public readonly weightFocus$: Subject<string> = new Subject<string>();

  public readonly weightSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(distinctUntilChanged());

    return merge(debouncedText$, this.weightFocus$).pipe(
      map(() => {
        const weights = this.exerciseLogService.weights().map(x => `${x}`);

        if (this.exerciseLogService.selectedWeight()) {
          weights.unshift(CLEAR_FILTER_LABEL);
        }

        return this.weightTypeahead === '' || this.weightTypeahead === WEIGHT_DEFAULT_LABEL
          ? weights
          : weights.filter(x => !!x).filter(x => x.includes(this.weightTypeahead));
      })
    );
  };

  public readonly exerciseFormatter = (x: string) => {
    return this.titleCasePipe.transform(x);
  };
  public readonly weightFormatter = (x: string) => (!isNaN(parseInt(x)) ? `${x}kg` : x);

  public constructor() {
    effect(() => (this.exerciseTypeahead = this.exerciseLogService.selectedExerciseLabel()));
    effect(() => (this.weightTypeahead = this.exerciseLogService.selectedWeightLabel()));
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
      this.fetchData();
    } else {
      const exerciseLogs: ExerciseLog[] = JSON.parse(localStorage.getItem(EXERCISE_LOGS_CACHE_KEY) ?? '[]');
      const exercises: Exercise[] = JSON.parse(localStorage.getItem(EXERCISES_CACHE_KEY) ?? '[]');
      this.exerciseLogService.updateLogs$.next(exerciseLogs);
      this.exerciseLogService.updateExercises$.next(exercises);
    }

    this.serviceWorkerUpdates.unrecoverable.pipe(takeUntilDestroyed()).subscribe(x => console.error(x));

    this.serviceWorkerUpdates.versionUpdates
      .pipe(
        tap(x => console.log(x)),
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        first()
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
        exercise: exerciseRow.excerciseName,
        date: this.dayjsService.parseDate(exerciseRow.date).format('YYYY-MM-DD'),
        user: exerciseRow.username,
        series: exerciseRow.series.map(x => ({ reps: x.reps, weightInKg: x.weightInKg })),
      });
      this.open('update', exerciseRow);
    });

    this.exerciseLogService.deleteLog$
      .pipe(
        switchMap(x => this.exerciseLogApiService.deleteExerciseLog(x.id).pipe(tap(() => this.fetchData(false, false)))),
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
            exercise: this.createLogFormGroup.value.exercise!.toLowerCase(),
            user: this.createLogFormGroup.value.user!.toLowerCase(),
            series: (this.createLogFormGroup.value.series ?? [])
              .filter(x => !!x.reps && !!x.weightInKg)
              .map(x => ({ reps: +x.reps!, weightInKg: +x.weightInKg!.toFixed(1) })),
          };

          this.exerciseLogApiService.createExerciseLog(request).subscribe({
            next: () => {
              this.createLogFormGroup.reset();
              localStorage.removeItem(CREATE_LOG_VALUE_CACHE_KEY);
              this.fetchData(false, false);
            },
            error: () => {
              this.fetchData(true, false);
            },
          });
        } else {
          if (this.updateLogFormGroup.invalid) {
            return;
          }

          const request = {
            id: exerciseRow!.id,
            date: this.dayjsService.parseDate(this.updateLogFormGroup.value.date!).format('YYYY-MM-DD'),
            exercise: this.updateLogFormGroup.value.exercise!.toLowerCase(),
            user: this.updateLogFormGroup.value.user!.toLowerCase(),
            series: (this.updateLogFormGroup.value.series ?? [])
              .filter(x => !!x.reps && !!x.weightInKg)
              .map(x => ({ reps: +x.reps!, weightInKg: +x.weightInKg!.toFixed(1) })),
          };

          this.exerciseLogApiService.updateExerciseLog(request).subscribe({
            next: () => {
              this.updateLogFormGroup.reset();
              this.fetchData(false, false);
            },
            error: () => {
              this.fetchData(true, false);
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

  public fetchData(showLoading: boolean = true, fetchExercises: boolean = true): void {
    if (showLoading) {
      this.exerciseLogService.startLoading$.next();
    }

    const cachedExercises: Exercise[] = JSON.parse(localStorage.getItem(EXERCISES_CACHE_KEY) ?? '[]');
    let exercises$ = this.exerciseApiService.getExercises();

    if (!fetchExercises && cachedExercises.length) {
      exercises$ = of(cachedExercises);
    }

    this.viewModelApiService.getViewModel().subscribe(x => console.log(x));

    forkJoin([this.exerciseLogApiService.getExerciseLogsv2(), exercises$]).subscribe(([exerciseLogs, exercises]) => {
      localStorage.setItem(EXERCISE_LOGS_CACHE_KEY, JSON.stringify(exerciseLogs));
      localStorage.setItem(EXERCISES_CACHE_KEY, JSON.stringify(exercises));
      this.exerciseLogService.updateLogs$.next(exerciseLogs);
      this.exerciseLogService.updateExercises$.next(exercises);
    });
  }

  public onExerciseTypeaheadChange(event: NgbTypeaheadSelectItemEvent<string>): void {
    let selectedExercise =
      this.exerciseLogService
        .exercises()
        .filter(x => x.name === event.item)
        .at(0) ?? null;

    if (event.item === CLEAR_FILTER_LABEL) {
      selectedExercise = null;
    }

    this.exerciseLogService.selectedExercise$.next(
      selectedExercise ? { name: selectedExercise.name, type: selectedExercise.type } : null
    );
    this.exerciseTypeahead = this.exerciseLogService.selectedExerciseLabel();
    this.exerciseTypeaheadInput?.nativeElement.blur();

    this.exerciseLogService.selectedWeight$.next(null);
    this.weightTypeahead = this.exerciseLogService.selectedWeightLabel();
  }

  public onWeightTypeaheadChange(event: NgbTypeaheadSelectItemEvent<string>): void {
    let selectedWeight =
      this.exerciseLogService
        .weights()
        .filter(x => `${x}` === event.item)
        .at(0) ?? null;

    if (event.item === CLEAR_FILTER_LABEL) {
      selectedWeight = null;
    }

    this.exerciseLogService.selectedWeight$.next(selectedWeight);
    this.weightTypeaheadInput?.nativeElement.blur();
  }
}
