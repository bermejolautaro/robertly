import ***REMOVED*** ExcerciseLog ***REMOVED*** from '@models/excercise-log.model';

export interface ExcerciseRow ***REMOVED***
  date: string;
  excerciseName: string;
  type: string;
  username: string;
  series: ExcerciseLog[];
  highlighted: 'green' | 'yellow' | null;
  total: number | null;
***REMOVED***