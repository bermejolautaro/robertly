import { ExerciseLog } from "./exercise-log.model";

export interface ExerciseLogsSyncPushRequest {
  creates: ExerciseLog[];
  updates: ExerciseLog[];
  deletes: number[];
  seriesIdsToDelete: number[];
}

export interface ExerciseLogsSyncPullResponse {
  exerciseLogs: ExerciseLog[];
  serverTimeUtc: string;
}