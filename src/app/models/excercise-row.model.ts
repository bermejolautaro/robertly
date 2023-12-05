import ***REMOVED*** MuscleGroup ***REMOVED*** from '@models/constants';
import ***REMOVED*** ExerciseLog ***REMOVED*** from '@models/excercise-log.model';

export interface ExerciseRow ***REMOVED***
  date: string;
  excerciseName: string;
  type: string;
  username: string;
  series: ExerciseLog[];
  highlighted: 'green' | 'yellow' | null;
  total: number | null;
  average: number | null;
  tonnage: number;
  muscleGroup: MuscleGroup;
***REMOVED***
