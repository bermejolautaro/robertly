import { MuscleGroup } from '@models/constants';
import { ExcerciseLog } from '@models/excercise-log.model';

export interface ExcerciseRow {
  date: string;
  excerciseName: string;
  type: string;
  username: string;
  series: ExcerciseLog[];
  highlighted: 'green' | 'yellow' | null;
  total: number | null;
  average: number | null;
  muscleGroup: MuscleGroup;
}
