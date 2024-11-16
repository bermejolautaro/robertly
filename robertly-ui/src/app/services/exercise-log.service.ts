import { Injectable, computed, signal, inject, effect } from '@angular/core';
import { ExerciseLogDto } from '@models/exercise-log.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import * as R from 'remeda';
import { Observable, Subject, first, forkJoin, switchMap, tap } from 'rxjs';
import { Exercise } from '@models/exercise.model';
import { ExerciseLogApiService } from './exercise-log-api.service';

type State = {
  logs: ExerciseLogDto[];
  exercises: Exercise[];
  loaded: boolean;
  grouped: boolean;
  error: string | null;
};

export const EXERCISE_DEFAULT_LABEL = 'Exercise';
export const WEIGHT_DEFAULT_LABEL = 'Weight';

@Injectable({ providedIn: 'root' })
export class ExerciseLogService {
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);

  private readonly state = signal<State>({
    logs: [],
    exercises: [],
    loaded: false,
    grouped: false,
    error: null,
  });

  public readonly startLoading$: Subject<void> = new Subject();
  public readonly stopLoading$: Subject<void> = new Subject();

  public readonly refreshLogs$: Subject<void> = new Subject();
  public readonly updateLogs$: Subject<ExerciseLogDto[]> = new Subject();
  public readonly createLogClicked$: Subject<void> = new Subject();
  public readonly logClicked$: Subject<ExerciseLogDto> = new Subject();
  public readonly deleteLog$: Subject<ExerciseLogDto> = new Subject();
  public readonly updateExercises$: Subject<Exercise[]> = new Subject();

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

  public readonly types = computed(() =>
    R.pipe(
      this.exercises(),
      R.map(x => x.type),
      R.unique()
    )
  );

  public readonly exercises = computed(() => {
    return this.state().exercises;
  });


  public readonly muscleGroups = computed(() => {
    return R.pipe(
      this.state().exercises,
      R.map(x => x.muscleGroup),
      R.uniqueBy(x => x)
    );
  });

  public constructor() {
    effect(() => console.log(this.state()));

    this.refreshLogs$.pipe(takeUntilDestroyed()).subscribe(x => {
      const exerciseLogs$ = this.exerciseLogApiService.getExerciseLogsLatestWorkout();

      this.withLoading(
        forkJoin([exerciseLogs$]).pipe(
          tap(([exerciseLogs]) => {
            this.updateLogs$.next(exerciseLogs);
          })
        )
      );
    });

    this.updateLogs$.pipe(takeUntilDestroyed()).subscribe({
      next: logs =>
        this.state.update(state => ({
          ...state,
          logs,
        })),
    });

    this.updateExercises$.pipe(takeUntilDestroyed()).subscribe({
      next: exercises => this.state.update(state => ({ ...state, exercises })),
    });

    this.startLoading$
      .pipe(takeUntilDestroyed())
      .subscribe({ next: () => this.state.update(state => ({ ...state, loaded: false })) });

    this.stopLoading$
      .pipe(takeUntilDestroyed())
      .subscribe({ next: () => this.state.update(state => ({ ...state, loaded: true })) });
  }
}
