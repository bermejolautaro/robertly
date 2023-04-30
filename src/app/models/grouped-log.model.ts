import { ExcerciseRow } from './excercise-row.model';

export type GroupedLog = readonly [string, Array<readonly [string, Array<readonly [string, ExcerciseRow]>]>];
