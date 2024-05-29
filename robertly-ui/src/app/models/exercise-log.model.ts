import { Exercise } from "./exercise.model";
import { User } from "./user.model";

export interface Serie {
  reps: number;
  weightInKg: number;
}

export interface ExerciseLogDto {
  id: string;
  user: User;
  exercise: Exercise;
  date: string;
  series: Serie[];
  highlighted: string | null;
  totalReps: number | null;
  tonnage: number;
  average: number | null;
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
