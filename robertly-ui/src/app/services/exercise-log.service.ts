import { Injectable, computed, signal, inject, effect } from '@angular/core';
import { ExerciseLogDto } from '@models/exercise-log.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import * as R from 'remeda';
import { Observable, Subject, first, switchMap, tap } from 'rxjs';
import { groupByMonth } from '@helpers/exercise-log.helper';
import { Exercise } from '@models/exercise.model';
import { DayjsService } from '@services/dayjs.service';

type State = {
  logs: ExerciseLogDto[];
  exercises: Exercise[];
  selectedExercise: Exercise | null;
  selectedUsername: string | null;
  selectedType: string | null;
  selectedMonth: string | null;
  selectedWeight: number | null;
  loaded: boolean;
  grouped: boolean;
  error: string | null;
};

export const EXERCISE_DEFAULT_LABEL = 'Exercise';
export const WEIGHT_DEFAULT_LABEL = 'Weight';

@Injectable({ providedIn: 'root' })
export class ExerciseLogService {
  private readonly dayjsService = inject(DayjsService);

  private readonly state = signal<State>({
    logs: [],
    exercises: [],
    selectedExercise: null,
    selectedUsername: null,
    selectedType: null,
    selectedMonth: null,
    selectedWeight: null,
    loaded: false,
    grouped: false,
    error: null,
  });

  public readonly startLoading$: Subject<void> = new Subject();
  public readonly stopLoading$: Subject<void> = new Subject();

  public readonly updateLogs$: Subject<ExerciseLogDto[]> = new Subject();

  public readonly createLogClicked$: Subject<void> = new Subject();
  public readonly logClicked$: Subject<ExerciseLogDto> = new Subject();
  public readonly deleteLog$: Subject<ExerciseLogDto> = new Subject();
  public readonly updateExercises$: Subject<Exercise[]> = new Subject();

  public readonly selectedExercise$: Subject<Exercise | null> = new Subject();
  public readonly selectedUsername$: Subject<string | null> = new Subject();
  public readonly selectedType$: Subject<string | null> = new Subject();
  public readonly selectedMonth$: Subject<string | null> = new Subject();
  public readonly selectedWeight$: Subject<number | null> = new Subject();

  public withLoading<T>(obs$: Observable<T>): void {
    this.startLoading$
      .pipe(
        first(),
        switchMap(() => obs$.pipe(tap(() => this.stopLoading$.next())))
      )
      .subscribe();

    this.startLoading$.next();
  }

  public readonly loaded = computed(() => this.state().loaded);

  public readonly logs = computed(() => {
    return this.state().logs;
  });

  public readonly filteredLogs = computed(() => {
    return this.state().logs.filter(x => !!x.exercise);
  });

  public readonly types = computed(() =>
    R.pipe(
      this.exercises(),
      R.map(x => x.type),
      R.uniq()
    )
  );

  public readonly exercises = computed(() => {
    return this.state().exercises
  });

  public readonly selectedType = computed(() => this.state().selectedType);
  public readonly selectedUsername = computed(() => this.state().selectedUsername);
  public readonly selectedMonth = computed(() => this.state().selectedMonth);
  public readonly selectedExercise = computed(() => this.state().selectedExercise);
  public readonly selectedWeight = computed(() => this.state().selectedWeight);

  public readonly weights = computed(() => {
    return R.pipe(
      this.filteredLogs(),
      this.state().selectedExercise ? R.filter(x => x.exercise.name === this.state().selectedExercise?.name) : R.identity,
      R.flatMap(x => x.series.map(x => x.weightInKg)),
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

  public readonly daysAmountByDayInSelectedMonth = computed(() => {
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
  });

  public readonly daysTrainedByMonth = computed(() => R.mapValues(groupByMonth(this.logs()), x => x.length));

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
        })),
    });

    this.selectedExercise$.pipe(takeUntilDestroyed()).subscribe({
      next: selectedExercise =>
        this.state.update(state => ({
          ...state,
          selectedExercise: selectedExercise,
          selectedType: selectedExercise?.type ?? null,
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
      next: exercises => this.state.update(state => ({ ...state, exercises })),
    });

    this.startLoading$.pipe(takeUntilDestroyed()).subscribe({ next: () => this.state.update(state => ({ ...state, loaded: false })) });
    this.stopLoading$.pipe(takeUntilDestroyed()).subscribe({ next: () => this.state.update(state => ({ ...state, loaded: true })) });
  }
}
