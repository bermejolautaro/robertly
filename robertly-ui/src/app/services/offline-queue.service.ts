import { inject, Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import {
  CreateExerciseLogRequest,
  ExerciseLogApiService,
  UpdateExerciseLogRequest,
} from './exercise-log-api.service';

export interface SerializableQueuedAction {
  id: string;
  method: 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  payload: unknown;
  retries: number;
  maxRetries: number;
  optimisticType: string;
  userUuid: string;
}

const QUEUE_KEY = 'offline-queue';

@Injectable({ providedIn: 'root' })
export class OfflineQueueService {
  private readonly dbService = inject(DatabaseService);
  private readonly exerciseLogApiService = inject(ExerciseLogApiService);

  public constructor() {}

  public async enqueue(action: SerializableQueuedAction): Promise<void> {
    await this.dbService.db?.queue.add(action);
  }

  public async processQueue(): Promise<void> {
    if (!navigator.onLine) return;

    const items = await this.dbService.db!.queue.toArray();

    const creates = items
      .filter(x => x.method === 'POST')
      .map(x => (x.payload as CreateExerciseLogRequest).exerciseLog);

    const updates = items
      .filter(x => x.method === 'PUT')
      .map(x => (x.payload as UpdateExerciseLogRequest).exerciseLog);

    const seriesIdsToDelete = items
      .filter(x => x.method === 'PUT')
      .flatMap(x => (x.payload as UpdateExerciseLogRequest).seriesIdsToDelete);

    const deletes = items
      .filter(x => x.method === 'DELETE')
      .map(x => x.payload as number);

    try {
      await this.dbService.db!.exerciseLogs.bulkDelete(
        creates.map(x => x.exerciseLogId ?? -1)
      );

      for (const create of creates) {
        create.exerciseLogId = null;
      }

      await this.exerciseLogApiService.syncPush({
        creates,
        updates,
        deletes,
        seriesIdsToDelete,
      });

      const DAYS_AGO_90 = new Date();
      DAYS_AGO_90.setDate(DAYS_AGO_90.getDate() - 90);

      await this.exerciseLogApiService.syncPull(DAYS_AGO_90.toISOString());

      await this.dbService.db!.queue.clear();
    } catch (e) {
      console.error(e);
    }
  }
}
