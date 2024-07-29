import { Exercise } from "./exercise.model";
import { User } from "./user.model";

export interface Serie {
  serieId?: number;
  exerciseLogId: number;
  reps: number;
  weightInKg: number;
  brzycki: number | null;
}

export interface ExerciseLogDto {
  id: number;
  user: User;
  exercise: Exercise;
  date: string;
  series: Serie[];
  highlighted: string | null;
  totalReps: number | null;
  tonnage: number;
  average: number | null;
  recentLogs: ExerciseLogDto[] | null;
  brzyckiAverage: number | null;
}


export interface ExerciseLog {
  exerciseLogId?: number;
  exerciseLogUsername?: string;
  exerciseLogUserId?: number;
  exerciseLogExerciseId?: number;
  exerciseLogDate?: string;
  exercise?: Exercise;
  user?: User;
  series?: Serie[];
}
