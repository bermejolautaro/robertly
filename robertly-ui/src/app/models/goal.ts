export interface Goal {
  goalId?: number;
  userId?: number;
  goalType: 'bodyweight' | 'series-per-muscle' | 'exercise-personal-record' | 'calories' | 'protein';
  targetValue: number;
  targetDate?: string;
  exerciseId?: number;
  muscleGroup?: string;
  createdAtUtc?: string;
}