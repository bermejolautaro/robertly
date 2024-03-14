import { Serie } from '@models/exercise-log.model';
import { Exercise } from './exercise.model';

export interface ExerciseRow {
  id: string;
  date: string;
  exercise: Exercise;
  type: string;
  username: string;
  userId: string;
  series: Serie[];
  highlighted: 'green' | 'yellow' | null;
  total: number | null;
  average: number | null;
  tonnage: number;
  muscleGroup: string;
}
