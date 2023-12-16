import ***REMOVED*** Injectable, computed, signal, effect, inject ***REMOVED*** from '@angular/core';
import ***REMOVED*** ExerciseLog ***REMOVED*** from '@models/excercise-log.model';
import ***REMOVED*** takeUntilDestroyed ***REMOVED*** from '@angular/core/rxjs-interop';

import * as R from 'remeda';
import ***REMOVED*** Subject ***REMOVED*** from 'rxjs';
import ***REMOVED***
  getPersonalRecord,
  groupExcerciseLogs,
  amountDaysTrainedByUser,
  mapGroupedToExcerciseRows,
  getSeriesAmountPerUserPerMuscleGroupPerMonth,
  groupByMonth,
***REMOVED*** from '@helpers/excercise-log.helper';
import ***REMOVED*** Exercise ***REMOVED*** from '@models/exercise.model';
import ***REMOVED*** DayjsService ***REMOVED*** from '@services/dayjs.service';

interface SelectedExcercise ***REMOVED***
  name: string;
  type: string;
***REMOVED***

type State = ***REMOVED***
  logs: ExerciseLog[];
  exercises: Exercise[];
  selectedExercise: SelectedExcercise | null;
  selectedUsername: string | null;
  selectedType: string | null;
  selectedMonth: string | null;
  selectedWeight: number | null;
  loaded: boolean;
  error: string | null;
***REMOVED***;

export const EXERCISE_DEFAULT_LABEL = 'Exercise';
export const WEIGHT_DEFAULT_LABEL = 'Weight';

@Injectable()
export class ExerciseLogService ***REMOVED***
  private readonly dayjsService = inject(DayjsService);

  private readonly state = signal<State>(***REMOVED***
    logs: [],
    exercises: [],
    selectedExercise: null,
    selectedUsername: null,
    selectedType: null,
    selectedMonth: null,
    selectedWeight: null,
    loaded: false,
    error: null,
***REMOVED***);

  public readonly startLoading$: Subject<void> = new Subject();
  public readonly updateExercises$: Subject<Exercise[]> = new Subject();
  public readonly appendLogs$: Subject<ExerciseLog[]> = new Subject();
  public readonly updateLogs$: Subject<ExerciseLog[]> = new Subject();
  public readonly selectedExercise$: Subject<SelectedExcercise | null> = new Subject();
  public readonly selectedUsername$: Subject<string | null> = new Subject();
  public readonly selectedType$: Subject<string | null> = new Subject();
  public readonly selectedMonth$: Subject<string | null> = new Subject();
  public readonly selectedWeight$: Subject<number | null> = new Subject();

  public readonly loaded = computed(() => this.state().loaded);

  public readonly logs = computed(() => ***REMOVED***
    return R.pipe(this.state().logs, this.state().selectedUsername ? R.filter(x => x.user === this.state().selectedUsername) : R.identity);
***REMOVED***);

  public readonly filteredLogs = computed(() => ***REMOVED***
    return this.state().logs.filter(x => !!x.name);
***REMOVED***);

  public readonly types = computed(() =>
    R.pipe(
      this.filteredLogs(),
      R.map(x => x.type),
      R.uniq()
    )
  );

  public readonly usernames = computed(() =>
    R.pipe(
      this.filteredLogs(),
      R.map(x => x.user),
      R.uniq()
    )
  );

  public readonly exercises = computed(() => ***REMOVED***
    return R.pipe(
      this.state().exercises,
      R.map(x => x),
      R.uniqBy(x => x)
    );
***REMOVED***);

  public readonly selectedType = computed(() => this.state().selectedType);
  public readonly selectedUsername = computed(() => this.state().selectedUsername);
  public readonly selectedMonth = computed(() => this.state().selectedMonth);
  public readonly selectedExercise = computed(() => this.state().selectedExercise);
  public readonly selectedWeight = computed(() => this.state().selectedWeight);

  public readonly selectedTypeLabel = computed(() => this.state().selectedType ?? 'Type');
  public readonly selectedExerciseLabel = computed(() => this.state().selectedExercise?.name ?? EXERCISE_DEFAULT_LABEL);
  public readonly selectedUsernameLabel = computed(() => this.state().selectedUsername ?? 'All Users');
  public readonly selectedWeightLabel = computed(() => `$***REMOVED***this.state().selectedWeight ?? WEIGHT_DEFAULT_LABEL***REMOVED***`);

  public readonly groupedLogs = computed(() => ***REMOVED***
    const groups = groupExcerciseLogs(this.filteredLogs(), this.state().exercises);
    const selectedUsername = this.state().selectedUsername;
    const selectedExcercise = this.state().selectedExercise;
    const selectedType = this.state().selectedType;

    const result = R.pipe(
      groups,
      R.map(([date, valuesByDate]) => ***REMOVED***
        const filteredValuesByDate = R.pipe(
          valuesByDate,
          R.filter(([username]) => (!selectedUsername ? true : selectedUsername === username)),
          R.map(([username, valuesByUsername]) => ***REMOVED***
            const filteredValuesByUsername = R.pipe(
              valuesByUsername,
              R.filter(([_excercise, row]) => (!selectedType ? true : row.type === selectedType)),
              R.filter(([excercise]) => (!selectedExcercise ? true : excercise === selectedExcercise.name)),
              R.filter(x => x.length > 0)
            );

            return [username, filteredValuesByUsername] as const;
      ***REMOVED***),
          R.filter(([_, x]) => x.length > 0)
        );

        return [date, filteredValuesByDate] as const;
  ***REMOVED***),
      R.filter(([_, x]) => x.length > 0)
    );

    return result;
***REMOVED***);

  public readonly exerciseRows = computed(() => ***REMOVED***
    const rows = mapGroupedToExcerciseRows(this.groupedLogs());
    return R.pipe(
      rows,
      this.state().selectedType ? R.filter(x => x.type === this.state().selectedType) : R.identity,
      this.state().selectedExercise ? R.filter(x => x.excerciseName === this.state().selectedExercise?.name) : R.identity,
      this.state().selectedUsername ? R.filter(x => x.username === this.state().selectedUsername) : R.identity,
      this.state().selectedWeight ? R.filter(x => x.series.map(x => x.weightKg).includes(this.state().selectedWeight)) : R.identity
    );
***REMOVED***);

  public readonly personalRecord = computed(() => ***REMOVED***
    const excercise = this.state().selectedExercise?.name;
    const username = this.state().selectedUsername;
    return excercise && username ? getPersonalRecord(this.exerciseRows(), excercise, username) : null;
***REMOVED***);

  public readonly amountDaysTrainedPerUser = computed(() => ***REMOVED***
    return amountDaysTrainedByUser(this.logs());
***REMOVED***);

  public readonly weights = computed(() => ***REMOVED***
    return R.pipe(
      this.filteredLogs(),
      this.state().selectedExercise ? R.filter(x => x.name === this.state().selectedExercise?.name) : R.identity,
      this.state().selectedUsername ? R.filter(x => x.user === this.state().selectedUsername) : R.identity,
      R.map(x => x.weightKg),
      R.uniq(),
      R.filter(x => !!x),
      R.sort((a, b) => a! - b!)
    );
***REMOVED***);

  public readonly muscleGroups = computed(() => ***REMOVED***
    return R.pipe(
      this.state().exercises,
      R.map(x => x.muscleGroup),
      R.uniqBy(x => x)
    );
***REMOVED***);

  public readonly seriesPerMuscleGroupPerUserPerMonth = computed(() => getSeriesAmountPerUserPerMuscleGroupPerMonth(this.exerciseRows()));

  public readonly daysAmountByDayInSelectedMonth = computed(() => ***REMOVED***
    const result = R.toPairs(R.mapValues(groupByMonth(this.logs()), x => x));
    const daysInMonth = result
      .filter(x => x[0] === this.selectedMonth())
      .flatMap(x => x[1].map(x => this.dayjsService.parseDate(x).format('dddd')));

    const daysAmountByDay = R.pipe(
      daysInMonth,
      R.groupBy(x => x),
      R.mapValues(x => x.length)
    );

    return daysAmountByDay;
***REMOVED***);

  public readonly daysTrainedByMonth = computed(() => R.mapValues(groupByMonth(this.logs()), x => x.length));
  public readonly months = computed(() => R.keys(this.seriesPerMuscleGroupPerUserPerMonth()));

  public readonly daysTrainedInSelectedMonthMessage = computed(() => ***REMOVED***
    const selectedMonth = this.selectedMonth();
    const daysTrained = selectedMonth ? this.daysTrainedByMonth()[selectedMonth] : 0;
    return `$***REMOVED***daysTrained ?? 0***REMOVED*** $***REMOVED***daysTrained === 1 ? 'day' : 'days'***REMOVED*** trained this month`;
***REMOVED***);

  public constructor() ***REMOVED***
    effect(() => console.log(this.state()));

    this.updateLogs$.pipe(takeUntilDestroyed()).subscribe(***REMOVED***
      next: logs =>
        this.state.update(state => (***REMOVED***
          ...state,
          logs,
          loaded: true,
    ***REMOVED***)),
***REMOVED***);

    this.appendLogs$.pipe(takeUntilDestroyed()).subscribe(***REMOVED***
      next: logs =>
        this.state.update(state => (***REMOVED***
          ...state,
          logs: [...state.logs, ...logs],
    ***REMOVED***)),
***REMOVED***);

    this.selectedExercise$.pipe(takeUntilDestroyed()).subscribe(***REMOVED***
      next: selectedExcercise =>
        this.state.update(state => (***REMOVED***
          ...state,
          selectedExercise: selectedExcercise,
          selectedType: selectedExcercise?.type ?? null,
    ***REMOVED***)),
***REMOVED***);

    this.selectedType$.pipe(takeUntilDestroyed()).subscribe(***REMOVED***
      next: selectedType => ***REMOVED***
        let selectedExercise = this.state().selectedExercise;
        let selectedWeight = this.state().selectedWeight;

        if (selectedType && selectedExercise?.type && selectedType !== selectedExercise.type) ***REMOVED***
          selectedExercise = null;
          selectedWeight = null;
    ***REMOVED***

        this.state.update(state => (***REMOVED***
          ...state,
          selectedType,
          selectedExercise,
          selectedWeight,
    ***REMOVED***));
  ***REMOVED***,
***REMOVED***);

    this.selectedUsername$.pipe(takeUntilDestroyed()).subscribe(***REMOVED***
      next: selectedUsername =>
        this.state.update(state => (***REMOVED***
          ...state,
          selectedUsername,
    ***REMOVED***)),
***REMOVED***);

    this.selectedMonth$.pipe(takeUntilDestroyed()).subscribe(selectedMonth => ***REMOVED***
      this.state.update(state => (***REMOVED***
        ...state,
        selectedMonth,
  ***REMOVED***));
***REMOVED***);

    this.selectedWeight$.pipe(takeUntilDestroyed()).subscribe(selectedWeight => ***REMOVED***
      this.state.update(state => (***REMOVED***
        ...state,
        selectedWeight,
  ***REMOVED***));
***REMOVED***);

    this.updateExercises$.pipe(takeUntilDestroyed()).subscribe(***REMOVED***
      next: exercises => this.state.update(state => (***REMOVED*** ...state, exercises, loaded: true ***REMOVED***)),
***REMOVED***);

    this.startLoading$.pipe(takeUntilDestroyed()).subscribe(***REMOVED*** next: () => this.state.update(state => (***REMOVED*** ...state, loaded: false ***REMOVED***)) ***REMOVED***);
***REMOVED***
***REMOVED***
