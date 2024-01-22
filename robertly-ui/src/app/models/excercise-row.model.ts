import { Serie } from '@models/excercise-log.model';

export interface ExerciseRow {
  id: string;
  date: string;
  excerciseName: string;
  type: string;
  username: string;
  series: Serie[];
  highlighted: 'green' | 'yellow' | null;
  total: number | null;
  average: number | null;
  tonnage: number;
  muscleGroup: string;
}
