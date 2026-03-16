import { ExerciseLog } from '@models/exercise-log.model';
import { SerializableQueuedAction } from '@services/offline-queue.service';
import Dexie, { Table } from 'dexie';

export class Database extends Dexie {
  public readonly exerciseLogs!: Table<ExerciseLog, number>;
  public readonly queue!: Table<SerializableQueuedAction, string>;

  public constructor(userUuid: string) {
    super(`robertly-db-${userUuid}`);

    this.version(1).stores({
      exerciseLogs: 'exerciseLogId, exerciseLogDate, lastUpdatedAtUtc',
      queue: 'id',
    });
  }
}
