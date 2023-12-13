import ***REMOVED*** Component, ElementRef, OnInit, TemplateRef, ViewChild, inject ***REMOVED*** from '@angular/core';
import ***REMOVED*** RouterLinkActive, RouterLinkWithHref, RouterOutlet ***REMOVED*** from '@angular/router';
import ***REMOVED*** SwUpdate, VersionReadyEvent ***REMOVED*** from '@angular/service-worker';

import ***REMOVED***
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
***REMOVED*** from 'rxjs';
import ***REMOVED*** LOGS_PATH, STATS_PATH ***REMOVED*** from 'src/main';

import ***REMOVED*** ExerciseLogService ***REMOVED*** from '@services/excercise-log.service';

import ***REMOVED*** ExerciseLogApiService ***REMOVED*** from '@services/excercise-log-api.service';
import ***REMOVED*** DOCUMENT, NgClass, TitleCasePipe ***REMOVED*** from '@angular/common';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import ***REMOVED*** ExerciseLog ***REMOVED*** from '@models/excercise-log.model';
import ***REMOVED*** NgbDropdownModule, NgbModal, NgbTypeaheadModule ***REMOVED*** from '@ng-bootstrap/ng-bootstrap';
import ***REMOVED*** ExerciseApiService ***REMOVED*** from '@services/exercises-api.service';
import ***REMOVED*** Exercise ***REMOVED*** from '@models/exercise.model';
import ***REMOVED*** FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators ***REMOVED*** from '@angular/forms';
import ***REMOVED*** parseDate ***REMOVED*** from '@helpers/date.helper';

const GET_DATA_CACHE_KEY = 'robertly-get-data-cache';
const EXERCISE_LOGS_CACHE_KEY = 'robertly-exercise-logs';
const EXERCISES_CACHE_KEY = 'robertly-exercises';
const CREATE_LOG_VALUE_CACHE_KEY = 'robertly-create-log-value';

type CreateLogFormGroup = FormGroup<***REMOVED***
  user: FormControl<string | null>;
  exercise: FormControl<string | null>;
  series: FormArray<
    FormGroup<***REMOVED***
      reps: FormControl<number | null>;
      weightInKg: FormControl<number | null>;
***REMOVED***>
  >;
***REMOVED***>;

const createLogFormValidator =
  (exerciseLogService: ExerciseLogService): ValidatorFn =>
  control => ***REMOVED***
    const typedControl = control as CreateLogFormGroup;
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

    const exerciseExists = exerciseLogService.exercises().find(x => x.name.toLowerCase() === typedControl.value.exercise?.toLowerCase());

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

  @ViewChild('usernameTypeaheadInput', ***REMOVED*** static: true ***REMOVED***) usernameTypeaheadInput: ElementRef<HTMLInputElement> | null = null;
  public readonly usernameFocus$: Subject<string> = new Subject<string>();

  public readonly usernameSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => ***REMOVED***
    const debouncedText$ = text$.pipe(distinctUntilChanged());

    return merge(debouncedText$, this.usernameFocus$).pipe(
      map(() => ***REMOVED***
        const usernames = this.exerciseLogService.usernames().map(x => x);

        return this.formGroup.value.user === ''
          ? usernames
          : usernames.filter(x => !!x).filter(v => v.toLowerCase().includes(this.formGroup.value.user?.toLowerCase() ?? ''));
  ***REMOVED***)
    );
***REMOVED***;

  @ViewChild('exerciseTypeaheadInput', ***REMOVED*** static: true ***REMOVED***) exerciseTypeaheadInput: ElementRef<HTMLInputElement> | null = null;
  public readonly exerciseFocus$: Subject<string> = new Subject<string>();

  public readonly exerciseSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => ***REMOVED***
    const debouncedText$ = text$.pipe(distinctUntilChanged());

    return merge(debouncedText$, this.exerciseFocus$).pipe(
      map(() => ***REMOVED***
        const exercises = this.exerciseLogService.exercises().map(x => x.name);

        return this.formGroup.value.exercise === ''
          ? exercises
          : exercises.filter(x => !!x).filter(v => v.toLowerCase().includes(this.formGroup.value.exercise?.toLowerCase() ?? ''));
  ***REMOVED***)
    );
***REMOVED***;

  public readonly formGroup: CreateLogFormGroup = new FormGroup(
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
    [createLogFormValidator(this.exerciseLogService)]
  );

  public isSpinning: boolean = false;

  public readonly STATS_PATH = STATS_PATH;
  public readonly LOGS_PATH = LOGS_PATH;

  public constructor() ***REMOVED***
    dayjs.extend(customParseFormat);
    dayjs.extend(weekOfYear);
    dayjs.extend(isoWeek);

    const cacheTimestamp = localStorage.getItem(GET_DATA_CACHE_KEY);

    let shouldFetchExerciseLogs = false;

    if (!cacheTimestamp) ***REMOVED***
      localStorage.setItem(GET_DATA_CACHE_KEY, dayjs().unix().toString());
      shouldFetchExerciseLogs = true;
***REMOVED*** else ***REMOVED***
      const x = dayjs.unix(+cacheTimestamp);
      const difference = dayjs().diff(x, 'seconds');

      if (difference > 5 * 60) ***REMOVED***
        shouldFetchExerciseLogs = true;
        localStorage.setItem(GET_DATA_CACHE_KEY, dayjs().unix().toString());
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

    this.serviceWorkerUpdates.unrecoverable.subscribe(x => console.error(x));

    this.serviceWorkerUpdates.versionUpdates
      .pipe(
        tap(x => console.log(x)),
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        first()
      )
      .subscribe(() => ***REMOVED***
        this.document.location.reload();
  ***REMOVED***);

    this.formGroup.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(value => localStorage.setItem(CREATE_LOG_VALUE_CACHE_KEY, JSON.stringify(value)));
***REMOVED***

  public ngOnInit(): void ***REMOVED***
    const formGroupValue = JSON.parse(localStorage.getItem(CREATE_LOG_VALUE_CACHE_KEY) ?? 'null');

    if (formGroupValue) ***REMOVED***
      this.formGroup.patchValue(formGroupValue);
***REMOVED***
***REMOVED***

  public open(content: TemplateRef<unknown>): void ***REMOVED***
    this.modalService.open(content, ***REMOVED*** centered: true ***REMOVED***).result.then(
      () => ***REMOVED***
        const request = ***REMOVED***
          date: dayjs().format('DD-MM-YYYY'),
          exercise: this.formGroup.value.exercise!.toLowerCase(),
          user: this.formGroup.value.user!.toLowerCase(),
          payload: ***REMOVED***
            series: (this.formGroup.value.series ?? [])
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
            this.formGroup.reset();
            localStorage.removeItem(CREATE_LOG_VALUE_CACHE_KEY);
            this.fetchData(false);
      ***REMOVED***,
          error: () => ***REMOVED***
            this.fetchData();
      ***REMOVED***,
    ***REMOVED***);
  ***REMOVED***,
      () => ***REMOVED******REMOVED***
    );
***REMOVED***

  public fetchData(showLoading: boolean = true): void ***REMOVED***
    if (showLoading) ***REMOVED***
      this.exerciseLogService.startLoading$.next();
***REMOVED***
    const exerciseLogs$ = forkJoin([this.exerciseLogApiService.getExerciseLogs(), this.exerciseLogApiService.getExerciseLogsv2()]).pipe(
      map(([a, b]) => a.concat(b))
    );
    const logsAndExercises$ = this.exerciseApiService.getExercises().pipe(
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
