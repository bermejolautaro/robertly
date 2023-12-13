import { Injectable, computed, signal, effect } from '@angular/core';
import { ExerciseLog } from '@models/excercise-log.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import * as R from 'remeda';
import { Subject, delay, tap } from 'rxjs';
import {
  getPersonalRecord,
  groupExcerciseLogs,
  amountDaysTrainedByUser,
  mapGroupedToExcerciseRows,
  getSeriesAmountPerUserPerMuscleGroupPerMonth,
  groupByMonth,
} from '@helpers/excercise-log.helper';
import { Exercise } from '@models/exercise.model';
import { parseDate } from '@helpers/date.helper';

interface SelectedExcercise {
  name: string;
  type: string;
}

type State = {
  logs: ExerciseLog[];
  filteredLogs: ExerciseLog[];
  exercises: Exercise[];
  selectedExercise: SelectedExcercise | null;
  selectedUsername: string | null;
  selectedType: string | null;
  selectedMonth: string | null;
  selectedWeight: number | null;
  loaded: boolean;
  error: string | null;
};

export const EXERCISE_DEFAULT_LABEL = 'Exercise';
export const WEIGHT_DEFAULT_LABEL = 'Weight';

@Injectable()
export class ExerciseLogService {
  private readonly state = signal<State>({
    logs: [],
    filteredLogs: [],
    exercises: [],
    selectedExercise: null,
    selectedUsername: null,
    selectedType: null,
    selectedMonth: null,
    selectedWeight: null,
    loaded: false,
    error: null,
  });

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

  public readonly logs = computed(() => {
    return R.pipe(this.state().logs, this.state().selectedUsername ? R.filter(x => x.user === this.state().selectedUsername) : R.identity);
  });

  public readonly filteredLogs = computed(() => {
    return this.state().filteredLogs;
  });

  public readonly types = computed(() =>
    R.pipe(
      this.state().filteredLogs,
      R.map(x => x.type),
      R.uniq()
    )
  );

  public readonly usernames = computed(() =>
    R.pipe(
      this.state().filteredLogs,
      R.map(x => x.user),
      R.uniq()
    )
  );

  public readonly exercises = computed(() => {
    return R.pipe(
      this.state().filteredLogs,
      R.map(x => ({ name: x.name, type: x.type })),
      R.uniqBy(x => x.name)
    );
  });

  public readonly selectedType = computed(() => this.state().selectedType);
  public readonly selectedUsername = computed(() => this.state().selectedUsername);
  public readonly selectedMonth = computed(() => this.state().selectedMonth);
  public readonly selectedExercise = computed(() => this.state().selectedExercise);
  public readonly selectedWeight = computed(() => this.state().selectedWeight);

  public readonly selectedTypeLabel = computed(() => this.state().selectedType ?? 'Type');
  public readonly selectedExerciseLabel = computed(() => this.state().selectedExercise?.name ?? EXERCISE_DEFAULT_LABEL);
  public readonly selectedUsernameLabel = computed(() => this.state().selectedUsername ?? 'All Users');
  public readonly selectedWeightLabel = computed(() => `${this.state().selectedWeight ?? WEIGHT_DEFAULT_LABEL}`);

  public readonly groupedLogs = computed(() => {
    const groups = groupExcerciseLogs(this.state().filteredLogs, this.state().exercises);
    const selectedUsername = this.state().selectedUsername;
    const selectedExcercise = this.state().selectedExercise;
    const selectedType = this.state().selectedType;

    const result = R.pipe(
      groups,
      R.map(([date, valuesByDate]) => {
        const filteredValuesByDate = R.pipe(
          valuesByDate,
          R.filter(([username]) => (!selectedUsername ? true : selectedUsername === username)),
          R.map(([username, valuesByUsername]) => {
            const filteredValuesByUsername = R.pipe(
              valuesByUsername,
              R.filter(([_excercise, row]) => (!selectedType ? true : row.type === selectedType)),
              R.filter(([excercise]) => (!selectedExcercise ? true : excercise === selectedExcercise.name)),
              R.filter(x => x.length > 0)
            );

            return [username, filteredValuesByUsername] as const;
          }),
          R.filter(([_, x]) => x.length > 0)
        );

        return [date, filteredValuesByDate] as const;
      }),
      R.filter(([_, x]) => x.length > 0)
    );

    return result;
  });

  public readonly exerciseRows = computed(() => {
    const rows = mapGroupedToExcerciseRows(this.groupedLogs());
    return R.pipe(
      rows,
      this.state().selectedType ? R.filter(x => x.type === this.state().selectedType) : R.identity,
      this.state().selectedExercise ? R.filter(x => x.excerciseName === this.state().selectedExercise?.name) : R.identity,
      this.state().selectedUsername ? R.filter(x => x.username === this.state().selectedUsername) : R.identity,
      this.state().selectedWeight ? R.filter(x => x.series.map(x => x.weightKg).includes(this.state().selectedWeight)) : R.identity
    );
  });

  public readonly personalRecord = computed(() => {
    const excercise = this.state().selectedExercise?.name;
    const username = this.state().selectedUsername;
    return excercise && username ? getPersonalRecord(this.exerciseRows(), excercise, username) : null;
  });

  public readonly amountDaysTrainedPerUser = computed(() => {
    return amountDaysTrainedByUser(this.logs());
  });

  public readonly exercisesNames = computed(() => {
    return R.pipe(
      this.state().exercises,
      R.map(x => x.exercise),
      R.uniqBy(x => x)
    );
  });

  public readonly weights = computed(() => {
    return R.pipe(
      this.state().filteredLogs,
      this.state().selectedExercise ? R.filter(x => x.name === this.state().selectedExercise?.name) : R.identity,
      this.state().selectedUsername ? R.filter(x => x.user === this.state().selectedUsername) : R.identity,
      R.map(x => x.weightKg),
      R.uniq(),
      R.filter(x => !!x),
      R.sort((a, b) => a! - b!)
    );
  });

  public readonly muscleGroups = computed(() => {
    return R.pipe(
      this.state().exercises,
      R.map(x => x.muscleGroup),
      R.uniqBy(x => x)
    );
  });

  public readonly seriesPerMuscleGroupPerUserPerMonth = computed(() => getSeriesAmountPerUserPerMuscleGroupPerMonth(this.exerciseRows()));

  public readonly daysAmountByDayInSelectedMonth = computed(() => {
    const result = R.toPairs(R.mapValues(groupByMonth(this.logs()), x => x));
    const daysInMonth = result.filter(x => x[0] === this.selectedMonth()).flatMap(x => x[1].map(x => parseDate(x).format('dddd')));

    const daysAmountByDay = R.pipe(
      daysInMonth,
      R.groupBy(x => x),
      R.mapValues(x => x.length)
    );

    return daysAmountByDay;
  });

  public readonly daysTrainedByMonth = computed(() => R.mapValues(groupByMonth(this.logs()), x => x.length));
  public readonly months = computed(() => R.keys(this.seriesPerMuscleGroupPerUserPerMonth()));

  public readonly daysTrainedInSelectedMonthMessage = computed(() => {
    const selectedMonth = this.selectedMonth();
    const daysTrained = selectedMonth ? this.daysTrainedByMonth()[selectedMonth] : 0;
    return `${daysTrained ?? 0} ${daysTrained === 1 ? 'day' : 'days'} trained this month`;
  });

  public constructor() {
    effect(() => console.log(this.state()));

    this.updateLogs$.pipe(takeUntilDestroyed()).subscribe({
      next: logs =>
        this.state.update(state => ({
          ...state,
          logs,
          filteredLogs: logs.filter(x => !!x.name),
          loaded: true,
        })),
    });

    this.appendLogs$.pipe(takeUntilDestroyed()).subscribe({
      next: logs =>
        this.state.update(state => ({
          ...state,
          logs: [...state.logs, ...logs],
          filteredLogs: [...state.filteredLogs, ...logs],
        })),
    });

    this.selectedExercise$.pipe(takeUntilDestroyed()).subscribe({
      next: selectedExcercise =>
        this.state.update(state => ({
          ...state,
          selectedExercise: selectedExcercise,
          selectedType: selectedExcercise?.type ?? null,
        })),
    });

    this.selectedType$.pipe(takeUntilDestroyed()).subscribe({
      next: selectedType => {
        let selectedExercise = this.state().selectedExercise;
        let selectedWeight = this.state().selectedWeight;

        if (selectedType && selectedExercise?.type && selectedType !== selectedExercise.type) {
          selectedExercise = null;
          selectedWeight = null;
        }

        this.state.update(state => ({
          ...state,
          selectedType,
          selectedExercise,
          selectedWeight,
        }));
      },
    });

    this.selectedUsername$.pipe(takeUntilDestroyed()).subscribe({
      next: selectedUsername =>
        this.state.update(state => ({
          ...state,
          selectedUsername,
        })),
    });

    this.selectedMonth$.pipe(takeUntilDestroyed()).subscribe(selectedMonth => {
      this.state.update(state => ({
        ...state,
        selectedMonth,
      }));
    });

    this.selectedWeight$.pipe(takeUntilDestroyed()).subscribe(selectedWeight => {
      this.state.update(state => ({
        ...state,
        selectedWeight,
      }));
    });

    this.updateExercises$.pipe(takeUntilDestroyed()).subscribe({
      next: exercises => this.state.update(state => ({ ...state, exercises, loaded: true })),
    });

    this.startLoading$.pipe(takeUntilDestroyed()).subscribe({ next: () => this.state.update(state => ({ ...state, loaded: false })) });
  }
}
