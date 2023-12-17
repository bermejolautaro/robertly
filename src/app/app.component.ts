import ***REMOVED*** Component, Injector, OnInit, inject ***REMOVED*** from '@angular/core';
import ***REMOVED*** RouterLinkActive, RouterLinkWithHref, RouterOutlet ***REMOVED*** from '@angular/router';
import ***REMOVED*** SwUpdate, VersionReadyEvent ***REMOVED*** from '@angular/service-worker';

import ***REMOVED*** debounceTime, filter, first, forkJoin, map, of, switchMap, tap ***REMOVED*** from 'rxjs';
import ***REMOVED*** LOGS_PATH, STATS_PATH ***REMOVED*** from 'src/main';

import ***REMOVED*** ExerciseLogService ***REMOVED*** from '@services/excercise-log.service';

import ***REMOVED*** ExerciseLogApiService ***REMOVED*** from '@services/excercise-log-api.service';
import ***REMOVED*** DOCUMENT, NgClass, TitleCasePipe ***REMOVED*** from '@angular/common';

import ***REMOVED*** ExerciseLog ***REMOVED*** from '@models/excercise-log.model';
import ***REMOVED*** NgbDropdownModule, NgbModal, NgbTypeaheadModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';
import ***REMOVED*** ExerciseApiService ***REMOVED*** from '@services/exercises-api.service';
import ***REMOVED*** Exercise ***REMOVED*** from '@models/exercise.model';
import ***REMOVED*** FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators ***REMOVED*** from '@angular/forms';
import ***REMOVED*** parseDate ***REMOVED*** from '@helpers/date.helper';
import ***REMOVED*** DayjsService ***REMOVED*** from '@services/dayjs.service';
import ***REMOVED*** CreateOrUpdateLogModalComponent ***REMOVED*** from '@components/create-or-update-log-modal.component';
import ***REMOVED*** takeUntilDestroyed ***REMOVED*** from '@angular/core/rxjs-interop';
import ***REMOVED*** ExerciseRow ***REMOVED*** from '@models/excercise-row.model';

const GET_DATA_CACHE_KEY = 'robertly-get-data-cache';
const EXERCISE_LOGS_CACHE_KEY = 'robertly-exercise-logs';
const EXERCISES_CACHE_KEY = 'robertly-exercises';
const CREATE_LOG_VALUE_CACHE_KEY = 'robertly-create-log-value';

export type CreateOrUpdateLogFormGroup = FormGroup<***REMOVED***
  user: FormControl<string | null>;
  exercise: FormControl<string | null>;
  series: FormArray<
    FormGroup<***REMOVED***
      reps: FormControl<number | null>;
      weightInKg: FormControl<number | null>;
***REMOVED***>
  >;
***REMOVED***>;

const createOrUpdateLogFormValidator =
  (exerciseLogService: ExerciseLogService): ValidatorFn =>
  control => ***REMOVED***
    const typedControl = control as CreateOrUpdateLogFormGroup;
    let errors: Record<string, string> | null = null;

    const userRequiredErrors = Validators.required(typedControl.controls.user);
    if (userRequiredErrors) ***REMOVED***
      errors = ***REMOVED*** ...(errors ?? ***REMOVED******REMOVED***), ...***REMOVED*** userRequired: 'Username is required' ***REMOVED*** ***REMOVED***;
***REMOVED***

    if (typedControl.value.user === 'peron') ***REMOVED***
      errors = ***REMOVED*** ...(errors ?? ***REMOVED******REMOVED***), ...***REMOVED*** userInvalidPeron: 'Peron is not allowed' ***REMOVED*** ***REMOVED***;
***REMOVED***

    const exerciseRequiredErrors = Validators.required(typedControl.controls.exercise);
    if (exerciseRequiredErrors) ***REMOVED***
      errors = ***REMOVED*** ...(errors ?? ***REMOVED******REMOVED***), ...***REMOVED*** exerciseRequired: 'Exercise is required' ***REMOVED*** ***REMOVED***;
***REMOVED***

    if (typedControl.value.exercise === 'peron') ***REMOVED***
      errors = ***REMOVED*** ...(errors ?? ***REMOVED******REMOVED***), ...***REMOVED*** exerciseInvalidPeron: 'Peron is not allowed' ***REMOVED*** ***REMOVED***;
***REMOVED***

    const exerciseExists = exerciseLogService
      .exercises()
      .find(x => x.exercise.toLowerCase() === typedControl.value.exercise?.toLowerCase());

    if (!exerciseExists) ***REMOVED***
      errors = ***REMOVED*** ...(errors ?? ***REMOVED******REMOVED***), ...***REMOVED*** exerciseDoesNotExist: 'Exercise does not exists' ***REMOVED*** ***REMOVED***;
***REMOVED***

    if (typedControl.controls.series.value.map(x => (x.reps ?? 0) > 0 && (x.weightInKg ?? 0) > 0).every(x => !x)) ***REMOVED***
      errors = ***REMOVED*** ...(errors ?? ***REMOVED******REMOVED***), ...***REMOVED*** seriesAllSeriesAreEmpty: 'Needs at least one serie' ***REMOVED*** ***REMOVED***;
***REMOVED***

    if (typedControl.controls.series.value.some(x => !Number.isInteger(x.reps ?? 0))) ***REMOVED***
      errors = ***REMOVED*** ...(errors ?? ***REMOVED******REMOVED***), ...***REMOVED*** seriesRepsMustBeInteger: 'Reps needs to be whole numbers' ***REMOVED*** ***REMOVED***;
***REMOVED***

    return errors;
***REMOVED***;

@Component(***REMOVED***
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: `
      nav.navbar.fixed-bottom ***REMOVED***
        padding-bottom: max(env(safe-area-inset-bottom), 0.8rem);
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
  ***REMOVED***

      button:focus i.fa.fa-refresh.spin ***REMOVED***
        animation: rotate 1s ease-in-out 0s;
  ***REMOVED***

      @keyframes rotate ***REMOVED***
          from ***REMOVED*** transform: rotate(0deg); ***REMOVED***
          to ***REMOVED*** transform: rotate(720deg); ***REMOVED***
  ***REMOVED***

      button:has(.fa.fa-plus) ***REMOVED***
        border-radius: 100%;
        position: fixed;
        right: 25px;
        bottom: 75px;

        @supports (-webkit-hyphens: none) ***REMOVED***
          bottom: 100px;
    ***REMOVED***

        z-index: 4;
  ***REMOVED***
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
***REMOVED***)
export class AppComponent implements OnInit ***REMOVED***
  public readonly exerciseLogService = inject(ExerciseLogService);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);
  private readonly exerciseApiService = inject(ExerciseApiService);
  private readonly serviceWorkerUpdates = inject(SwUpdate);
  private readonly modalService = inject(NgbModal);
  private readonly document = inject(DOCUMENT);
  private readonly dayjsService = inject(DayjsService);
  private readonly dayjs = this.dayjsService.instance;
  private readonly injector = inject(Injector);

  public readonly createLogFormGroup: CreateOrUpdateLogFormGroup = new FormGroup(
    ***REMOVED***
      user: new FormControl(''),
      exercise: new FormControl(''),
      series: new FormArray([
        new FormGroup(***REMOVED*** reps: new FormControl(), weightInKg: new FormControl() ***REMOVED***),
        new FormGroup(***REMOVED*** reps: new FormControl(), weightInKg: new FormControl() ***REMOVED***),
        new FormGroup(***REMOVED*** reps: new FormControl(), weightInKg: new FormControl() ***REMOVED***),
        new FormGroup(***REMOVED*** reps: new FormControl(), weightInKg: new FormControl() ***REMOVED***),
        new FormGroup(***REMOVED*** reps: new FormControl(), weightInKg: new FormControl() ***REMOVED***),
      ]),
***REMOVED***,
    [createOrUpdateLogFormValidator(this.exerciseLogService)]
  );

  public readonly updateLogFormGroup: CreateOrUpdateLogFormGroup = new FormGroup(
    ***REMOVED***
      user: new FormControl(''),
      exercise: new FormControl(''),
      series: new FormArray([
        new FormGroup(***REMOVED*** reps: new FormControl(), weightInKg: new FormControl() ***REMOVED***),
        new FormGroup(***REMOVED*** reps: new FormControl(), weightInKg: new FormControl() ***REMOVED***),
        new FormGroup(***REMOVED*** reps: new FormControl(), weightInKg: new FormControl() ***REMOVED***),
        new FormGroup(***REMOVED*** reps: new FormControl(), weightInKg: new FormControl() ***REMOVED***),
        new FormGroup(***REMOVED*** reps: new FormControl(), weightInKg: new FormControl() ***REMOVED***),
      ]),
***REMOVED***,
    [createOrUpdateLogFormValidator(this.exerciseLogService)]
  );

  public isSpinning: boolean = false;

  public readonly STATS_PATH = STATS_PATH;
  public readonly LOGS_PATH = LOGS_PATH;

  public constructor() ***REMOVED***
    const cacheTimestamp = localStorage.getItem(GET_DATA_CACHE_KEY);

    let shouldFetchExerciseLogs = false;

    if (!cacheTimestamp) ***REMOVED***
      localStorage.setItem(GET_DATA_CACHE_KEY, this.dayjs().unix().toString());
      shouldFetchExerciseLogs = true;
***REMOVED*** else ***REMOVED***
      const x = this.dayjs.unix(+cacheTimestamp);
      const difference = this.dayjs().diff(x, 'seconds');

      if (difference > 5 * 60) ***REMOVED***
        shouldFetchExerciseLogs = true;
        localStorage.setItem(GET_DATA_CACHE_KEY, this.dayjs().unix().toString());
  ***REMOVED***
***REMOVED***

    if (shouldFetchExerciseLogs) ***REMOVED***
      this.fetchData();
***REMOVED*** else ***REMOVED***
      const exerciseLogs: ExerciseLog[] = JSON.parse(localStorage.getItem(EXERCISE_LOGS_CACHE_KEY) ?? '[]');
      const exercises: Exercise[] = JSON.parse(localStorage.getItem(EXERCISES_CACHE_KEY) ?? '[]');
      this.exerciseLogService.updateLogs$.next(exerciseLogs);
      this.exerciseLogService.updateExercises$.next(exercises);
***REMOVED***

    this.serviceWorkerUpdates.unrecoverable.pipe(takeUntilDestroyed()).subscribe(x => console.error(x));

    this.serviceWorkerUpdates.versionUpdates
      .pipe(
        tap(x => console.log(x)),
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        first()
      )
      .subscribe(() => ***REMOVED***
        this.document.location.reload();
  ***REMOVED***);

    this.createLogFormGroup.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(1000))
      .subscribe(value => localStorage.setItem(CREATE_LOG_VALUE_CACHE_KEY, JSON.stringify(value)));

    this.exerciseLogService.logClicked$.pipe(takeUntilDestroyed()).subscribe(exerciseRow => ***REMOVED***
      this.updateLogFormGroup.patchValue(***REMOVED***
        exercise: exerciseRow.excerciseName,
        user: exerciseRow.username,
        series: exerciseRow.series.map(x => (***REMOVED***
          reps: x.reps,
          weightInKg: x.weightKg,
    ***REMOVED***)),
  ***REMOVED***);
      this.open('update', exerciseRow);
***REMOVED***);

    this.exerciseLogService.deleteLog$.pipe(takeUntilDestroyed()).subscribe(x => ***REMOVED***
      const request = ***REMOVED***
        date: this.dayjsService.parseDate(x.date).format('DD-MM-YYYY'),
        exercise: x.excerciseName,
        user: x.username,
  ***REMOVED***;

      this.exerciseLogApiService.deleteExerciseLog(request).subscribe(() => ***REMOVED***
        this.fetchData(false, false);
  ***REMOVED***);
***REMOVED***);
***REMOVED***

  public ngOnInit(): void ***REMOVED***
    const formGroupValue = JSON.parse(localStorage.getItem(CREATE_LOG_VALUE_CACHE_KEY) ?? 'null');

    if (formGroupValue) ***REMOVED***
      this.createLogFormGroup.patchValue(formGroupValue);
***REMOVED***
***REMOVED***

  public open(mode: 'update' | 'create', exerciseRow?: ExerciseRow): void ***REMOVED***
    const modalRef = this.modalService.open(CreateOrUpdateLogModalComponent, ***REMOVED*** centered: true, injector: this.injector ***REMOVED***);
    modalRef.componentInstance.createLogFormGroup = mode === 'update' ? this.updateLogFormGroup : this.createLogFormGroup;
    modalRef.componentInstance.mode = mode;

    if (exerciseRow) ***REMOVED***
      modalRef.componentInstance.originalValue = exerciseRow;
***REMOVED***

    modalRef.result.then(
      () => ***REMOVED***
        if (mode === 'create') ***REMOVED***
          if (this.createLogFormGroup.invalid) ***REMOVED***
            return;
      ***REMOVED***

          const request = ***REMOVED***
            date: this.dayjs().format('DD-MM-YYYY'),
            exercise: this.createLogFormGroup.value.exercise!.toLowerCase(),
            user: this.createLogFormGroup.value.user!.toLowerCase(),
            payload: ***REMOVED***
              series: (this.createLogFormGroup.value.series ?? [])
                .filter(x => !!x.reps && !!x.weightInKg)
                .map(x => (***REMOVED*** reps: +x.reps!, weightInKg: +x.weightInKg!.toFixed(1) ***REMOVED***)),
        ***REMOVED***,
      ***REMOVED***;

          const exerciseLogs: ExerciseLog[] = request.payload.series.map((s, i) => (***REMOVED***
            date: parseDate(request.date).format('DD/MM/YYYY'),
            name: request.exercise,
            reps: s.reps,
            serie: i + 1,
            type: '',
            user: request.user,
            weightKg: s.weightInKg,
      ***REMOVED***));

          this.exerciseLogService.appendLogs$.next(exerciseLogs);

          this.exerciseLogApiService.createExerciseLog(request).subscribe(***REMOVED***
            next: () => ***REMOVED***
              this.createLogFormGroup.reset();
              localStorage.removeItem(CREATE_LOG_VALUE_CACHE_KEY);
              this.fetchData(false, false);
        ***REMOVED***,
            error: () => ***REMOVED***
              this.fetchData(true, false);
        ***REMOVED***,
      ***REMOVED***);
    ***REMOVED*** else ***REMOVED***
          if (this.updateLogFormGroup.invalid) ***REMOVED***
            return;
      ***REMOVED***

          const request = ***REMOVED***
            date: this.dayjs().format('DD-MM-YYYY'),
            exercise: this.updateLogFormGroup.value.exercise!.toLowerCase(),
            user: this.updateLogFormGroup.value.user!.toLowerCase(),
            payload: ***REMOVED***
              series: (this.updateLogFormGroup.value.series ?? [])
                .filter(x => !!x.reps && !!x.weightInKg)
                .map(x => (***REMOVED*** reps: +x.reps!, weightInKg: +x.weightInKg!.toFixed(1) ***REMOVED***)),
        ***REMOVED***,
      ***REMOVED***;

          this.exerciseLogApiService.updateExerciseLog(request).subscribe(***REMOVED***
            next: () => ***REMOVED***
              this.updateLogFormGroup.reset();
              this.fetchData(false, false);
        ***REMOVED***,
            error: () => ***REMOVED***
              this.fetchData(true, false);
        ***REMOVED***,
      ***REMOVED***);
    ***REMOVED***
  ***REMOVED***,
      () => ***REMOVED***
        this.createLogFormGroup.markAsPristine();
        this.updateLogFormGroup.markAsPristine();
  ***REMOVED***
    );
***REMOVED***

  public fetchData(showLoading: boolean = true, fetchExercises: boolean = true): void ***REMOVED***
    if (showLoading) ***REMOVED***
      this.exerciseLogService.startLoading$.next();
***REMOVED***

    const cachedExercises: Exercise[] = JSON.parse(localStorage.getItem(EXERCISES_CACHE_KEY) ?? '[]');
    let exercises$ = this.exerciseApiService.getExercises();

    if (!fetchExercises && cachedExercises.length) ***REMOVED***
      exercises$ = of(cachedExercises);
***REMOVED***

    const exerciseLogs$ = forkJoin([this.exerciseLogApiService.getExerciseLogs(), this.exerciseLogApiService.getExerciseLogsv2()]).pipe(
      map(([a, b]) => a.concat(b))
    );

    const logsAndExercises$ = exercises$.pipe(
      switchMap(exercises => exerciseLogs$.pipe(map(logs => [logs, exercises] as const))),
      tap(([logs, exercises]) => ***REMOVED***
        for (const log of logs) ***REMOVED***
          if (!log.type) ***REMOVED***
            log.type = exercises.find(x => x.exercise === log.name)?.type ?? '';
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***)
    );

    logsAndExercises$.subscribe(([exerciseLogs, exercises]) => ***REMOVED***
      localStorage.setItem(EXERCISE_LOGS_CACHE_KEY, JSON.stringify(exerciseLogs));
      localStorage.setItem(EXERCISES_CACHE_KEY, JSON.stringify(exercises));
      this.exerciseLogService.updateLogs$.next(exerciseLogs);
      this.exerciseLogService.updateExercises$.next(exercises);
***REMOVED***);
***REMOVED***
***REMOVED***
