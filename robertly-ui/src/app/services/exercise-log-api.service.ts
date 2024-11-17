import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ExerciseLog, ExerciseLogDto } from '@models/exercise-log.model';
import { Filter } from '@models/filter';
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
  private readonly apiUrl = inject(API_URL);

  public getExerciseLogById(exerciseLogId: number): Observable<ExerciseLogDto> {
    return this.http.get<ExerciseLogDto>(`${this.apiUrl}/logs/${exerciseLogId}`);
  }

  public getExerciseLogs(
    page: number = 0,
    userFirebaseUuid: string | null = null,
    exerciseType: string | null = null,
    exerciseId: number | null = null,
    weightInKg: number | null = null
  ): Observable<ExerciseLogDto[]> {
    let queryParams = new HttpParams();

    if (!!userFirebaseUuid) {
      queryParams = queryParams.append('userFirebaseUuid', userFirebaseUuid);
    }

    if (!!exerciseType) {
      queryParams = queryParams.append('exerciseType', exerciseType);
    }

    if (!!exerciseId) {
      queryParams = queryParams.append('exerciseId', exerciseId);
    }

    if (!!weightInKg) {
      queryParams = queryParams.append('weightInKg', weightInKg);
    }

    return this.http
      .get<ExercisesLogsDto>(`${this.apiUrl}/logs?page=${page}&count=10`, { params: queryParams })
      .pipe(map(x => x.data));
  }

  public getExerciseLogsLatestWorkout(): Observable<ExerciseLogDto[]> {
    return this.http.get<ExercisesLogsDto>(`${this.apiUrl}/logs/latest-workout`).pipe(map(x => x.data));
  }

  public getFilters(
    userFirebaseUuid: string | null = null,
    exerciseId: number | null,
    type: string | null = null,
    weightInKg: number | null = null
  ): Observable<Filter> {
    let queryParams = new HttpParams();

    if (!!userFirebaseUuid) {
      queryParams = queryParams.append('userFirebaseUuid', userFirebaseUuid);
    }

    if (!!exerciseId) {
      queryParams = queryParams.append('exerciseId', exerciseId);
    }

    if (!!type) {
      queryParams = queryParams.append('type', type);
    }

    if (!!weightInKg) {
      queryParams = queryParams.append('weightInKg', weightInKg);
    }

    return this.http.get<Filter>(`${this.apiUrl}/logs/filters`, { params: queryParams });
  }

  public createExerciseLog(request: CreateExerciseLogRequest): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/logs`, request);
  }

  public updateExerciseLog(request: UpdateExerciseLogRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/logs/${request.id}`, request);
  }

  public deleteExerciseLog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/logs/${id}`);
  }
}
