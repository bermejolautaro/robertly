import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { ExerciseLog, ExerciseLogDto } from '@models/exercise-log.model';
import { Filter } from '@models/filter';
import { SeriesPerMuscle } from '@models/series-per-muscle';
import { Stats } from '@models/stats';
import { Observable, map, tap } from 'rxjs';

import { API_URL } from 'src/main';

type ExercisesLogsDto = {
  data: ExerciseLogDto[];
  pageCount: number;
};

export type CreateExerciseLogRequest = {
  exerciseLog: ExerciseLog;
  seriesIdsToDelete: number[];
};

export type UpdateExerciseLogRequest = {
  id: number;
  exerciseLog: ExerciseLog;
  seriesIdsToDelete: number[];
};

@Injectable({
  providedIn: 'root',
})
export class ExerciseLogApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  private readonly endpoint = `${this.apiUrl}/exercise-logs`;
  private readonly recentlyUpdatedCache = signal<ExerciseLogDto[]>([]);
  public readonly recentlyUpdated = this.recentlyUpdatedCache.asReadonly();

  public getExerciseLogById(exerciseLogId: number): Observable<ExerciseLogDto> {
    return this.http.get<ExerciseLogDto>(`${this.endpoint}/${exerciseLogId}`);
  }

  public getExerciseLogs(
    page: number = 0,
    userId: number | null = null,
    exerciseType: string | null = null,
    exerciseId: number | null = null,
    weightInKg: number | null = null
  ): Observable<ExercisesLogsDto> {
    let queryParams = new HttpParams();

    if (!!userId) {
      queryParams = queryParams.append('userId', userId);
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

    return this.http.get<ExercisesLogsDto>(`${this.endpoint}?page=${page}&count=10`, { params: queryParams });
  }

  public getSeriesPerMuscle(): Observable<SeriesPerMuscle> {
    return this.http.get<SeriesPerMuscle>(`${this.endpoint}/series-per-muscle?serviceWorkerCache=true`);
  }

  public getDaysTrained(): Observable<Stats> {
    return this.http.get<Stats>(`${this.endpoint}/days-trained?serviceWorkerCache=true`);
  }

  public getRecentlyUpdated(): Observable<ExerciseLogDto[]> {
    return this.http.get<ExercisesLogsDto>(`${this.endpoint}/recently-updated`).pipe(
      map(x => x.data),
      tap(x => this.recentlyUpdatedCache.set(x))
    );
  }

  public getExerciseLogsLatestWorkout(): Observable<ExerciseLogDto[]> {
    return this.http.get<ExercisesLogsDto>(`${this.endpoint}/latest-workout`).pipe(map(x => x.data));
  }

  public getFilters(
    userId: number | null = null,
    exerciseId: number | null,
    type: string | null = null,
    weightInKg: number | null = null
  ): Observable<Filter> {
    let queryParams = new HttpParams();

    if (!!userId) {
      queryParams = queryParams.append('userId', userId);
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

    return this.http.get<Filter>(`${this.endpoint}/filters`, { params: queryParams });
  }

  public createExerciseLog(request: CreateExerciseLogRequest): Observable<number> {
    return this.http.post<number>(`${this.endpoint}`, request);
  }

  public updateExerciseLog(request: UpdateExerciseLogRequest): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/${request.id}`, request);
  }

  public deleteExerciseLog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
