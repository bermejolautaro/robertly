import { ExerciseLog } from '@models/excercise-log.model';

export interface ExerciseRow {
  date: string;
  excerciseName: string;
  type: string;
  username: string;
  series: ExerciseLog[];
  highlighted: 'green' | 'yellow' | null;
  total: number | null;
  average: number | null;
  tonnage: number;
  muscleGroup: string;
}