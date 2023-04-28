import { ExcerciseLog } from "@models/excercise-log.model";

export interface ExcerciseRow {
  date: string;
  excerciseName: string;
  type: string;
  username: string;
  series: ExcerciseLog[];
  highlighted: boolean;
  total: number | null;
}