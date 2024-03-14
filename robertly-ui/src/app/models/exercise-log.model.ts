import { Exercise } from "./exercise.model";

export interface Serie {
  reps: number;
  weightInKg: number;
}

export interface ExerciseLog {
  id: string;
  user: string;
  userId: string;
  exercise: Exercise;
  date: string;
  series: Serie[];
}
