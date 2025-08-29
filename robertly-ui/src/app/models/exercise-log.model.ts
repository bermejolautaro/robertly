import { Exercise } from './exercise.model';
import { User } from './user.model';

export interface Serie {
  serieId: number | null;
  exerciseLogId: number | null;
  reps: number | null;
  weightInKg: number | null;
  brzycki: number | null;
}

export interface ExerciseLog {
  exerciseLogId: number | null;
  exerciseLogUserId: number | null;
  exerciseLogExerciseId: number | null;
  exerciseLogDate: string | null;
  createdByUserId: number | null;
  createdAtUtc: string | null;
  lastUpdatedByUserId: number | null;
  lastUpdatedAtUtc: string | null;
  totalReps: number | null;
  tonnage: number | null;
  averageReps: number | null;
  averageBrzycki: number | null;
  averageEpley: number | null;
  averageLander: number | null;
  averageLombardi: number | null;
  averageMayhew: number | null;
  averageOConner: number | null;
  averageWathan: number | null;
  exercise: Exercise | null;
  user: User | null;
  series: Serie[] | null;
  recentLogs: ExerciseLog[] | null;
}
