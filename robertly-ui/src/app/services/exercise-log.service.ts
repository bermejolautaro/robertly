import { Injectable, computed, signal, effect } from '@angular/core';
import { ExerciseLogDto } from '@models/exercise-log.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import * as R from 'remeda';
import { Subject } from 'rxjs';
import { Exercise } from '@models/exercise.model';

type State = {
  exercises: Exercise[];
};

export const EXERCISE_DEFAULT_LABEL = 'Exercise';
export const WEIGHT_DEFAULT_LABEL = 'Weight';

@Injectable({ providedIn: 'root' })
export class ExerciseLogService {
  private readonly state = signal<State>({
    exercises: [],
  });

  public readonly refreshLogs$: Subject<void> = new Subject();
  public readonly createLogClicked$: Subject<void> = new Subject();
  public readonly logClicked$: Subject<ExerciseLogDto> = new Subject();
  public readonly deleteLog$: Subject<ExerciseLogDto> = new Subject();
  public readonly updateExercises$: Subject<Exercise[]> = new Subject();

  public readonly types = computed(() =>
    R.pipe(
      this.exercises(),
      R.map(x => x.type ?? 'No type'),
      R.unique()
    )
  );

  public readonly exercises = computed(() => {
    return this.state().exercises;
  });

  public readonly muscleGroups = computed(() => {
    return R.pipe(
      this.state().exercises,
      R.map(x => x.muscleGroup ?? 'No muscle group'),
      R.uniqueBy(x => x)
    );
  });

  public constructor() {
    effect(() => console.log(this.state()));

    this.updateExercises$.pipe(takeUntilDestroyed()).subscribe({
      next: exercises => this.state.update(state => ({ ...state, exercises })),
    });
  }
}
