import { ExerciseRow } from './excercise-row.model';

type Date = string;
type Username = string;
export type GroupedLog = readonly [Date, Array<readonly [Username, ExerciseRow[]]>];
