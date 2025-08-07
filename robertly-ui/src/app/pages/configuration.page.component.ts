import { Component, computed, inject, linkedSignal, signal, WritableSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Goal } from '@models/goal';
import { ExerciseApiService } from '@services/exercises-api.service';
import { GoalsApiService } from '@services/goals-api.service';
import { ToastService } from '@services/toast.service';
import { OnlyNumbersDirective } from 'src/app/directives/only-numbers.directive';

type GoalData  = {
  goalType: Goal['goalType'];
  label: string;
  targetValue: WritableSignal<number>;
  exerciseId?: number;
  muscleGroup?: string;
}

@Component({
  selector: 'app-configuration-page',
  templateUrl: './configuration.page.component.html',
  styles: ``,
  standalone: true,
  imports: [OnlyNumbersDirective, FormsModule],
})
export class ConfigurationPageComponent {
  private readonly exerciseApiService = inject(ExerciseApiService);
  private readonly goalsApiService = inject(GoalsApiService);
  private readonly toastService = inject(ToastService);

  public readonly muscleGroups = computed(() => this.exerciseApiService.muscleGroups());
  public readonly exercises = computed(() => this.exerciseApiService.exercises());

  public readonly goalsResource = rxResource({
    loader: () => this.goalsApiService.getGoals(),
  });

  public readonly goals = linkedSignal({
    source: () => ({ goals: this.goalsResource.value(), muscleGroups: this.muscleGroups(), exercises: this.exercises() }),
    computation: ({ goals, muscleGroups, exercises }) => {
      return [
        {
          goalType: 'bodyweight',
          label: 'Target Weight (kg)',
          targetValue: signal(goals?.find(x => x.goalType === 'bodyweight')?.targetValue ?? 0),
        },
        {
          goalType: 'calories',
          label: 'Calories (cal)',
          targetValue: signal(goals?.find(x => x.goalType === 'calories')?.targetValue ?? 0),
        },
        {
          goalType: 'protein',
          label: 'Protein (g)',
          targetValue: signal(goals?.find(x => x.goalType === 'protein')?.targetValue ?? 0),
        },
        ...muscleGroups.map(muscleGroup => ({
          goalType: 'series-per-muscle',
          label: `Series per muscle for ${muscleGroup}`,
          targetValue: signal(goals?.find(x => x.goalType === 'series-per-muscle' && x.muscleGroup === muscleGroup)?.targetValue ?? 0),
          muscleGroup: muscleGroup
        })),
        ...exercises.map(exercise => ({
          goalType: 'exercise-personal-record',
          label: `Personal record target for ${exercise.name}`,
          targetValue: signal(goals?.find(x => x.goalType === 'exercise-personal-record' && x.exerciseId === exercise.exerciseId)?.targetValue ?? 0),
          exerciseId: exercise.exerciseId
        }))
      ] as GoalData[];
    },
  });

  public onSave(goal: GoalData): void {
    this.goalsApiService.saveGoal({
      goalType: goal.goalType,
      targetValue: goal.targetValue(),
      exerciseId: goal.exerciseId,
      muscleGroup: goal.muscleGroup,
    } as Goal).subscribe({
      next: () => {
        this.toastService.ok('Goal saved successfully!');
        this.goalsResource.reload();
      }
    });
  }
}
