import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ExerciseLog, ExerciseLogDto, Serie } from '@models/exercise-log.model';
import { Observable, map } from 'rxjs';

import { API_URL } from 'src/main';

type ExercisesLogsDto = {
  data: ExerciseLogDto[];
};

export type CreateExerciseLogRequest = {
  exerciseLog: ExerciseLog;
};

export type UpdateExerciseLogRequest = {
  id: number;
  exerciseLog: ExerciseLog;
};

@Injectable({
  providedIn: 'root',
})
export class ExerciseLogApiService {
  private readonly http = inject(HttpClient);
  private readonly netApiUrl = inject(API_URL);

  public getExerciseLogs(): Observable<ExerciseLogDto[]> {
    return this.http
      .get<ExercisesLogsDto>(`${this.netApiUrl}/logs?page=0&count=5`)
      .pipe(map(x => x.data));
  }

  public getExerciseLogsLatestWorkout(): Observable<ExerciseLogDto[]> {
    return this.http
      .get<ExercisesLogsDto>(`${this.netApiUrl}/logs/latest-workout`)
      .pipe(map(x => x.data));
  }

  public createExerciseLog(
    request: CreateExerciseLogRequest
  ): Observable<void> {
    return this.http.post<void>(`${this.netApiUrl}/logs`, request);
  }

  public updateExerciseLog(
    request: UpdateExerciseLogRequest
  ): Observable<void> {
    return this.http.put<void>(`${this.netApiUrl}/logs/${request.id}`, request);
  }

  public deleteExerciseLog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.netApiUrl}/logs/${id}`);
  }
}
