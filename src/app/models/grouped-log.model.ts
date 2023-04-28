import { ExcerciseLog } from "@models/excercise-log.model";

export type GroupedLog = readonly [string, Array<readonly [string, Array<readonly [string, Array<ExcerciseLog>]>]>];
