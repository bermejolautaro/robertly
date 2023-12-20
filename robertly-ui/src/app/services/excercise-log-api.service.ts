import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { processData } from '@helpers/excercise-log-api.helper';
import { DayjsService } from '@services/dayjs.service';
import { Observable, map } from 'rxjs';

import { ExerciseLog } from 'src/app/models/excercise-log.model';
import { BACKEND_URL } from 'src/main';

type GetExerciseLogsResponse = {
  lautaro: string[][];
  roberto: string[][];
  nikito: string[][];
  matias: string[][];
  peque: string[][];
};

type GetExerciseLogsV2Response = {
  data: {
    user: string;
    exercise: string;
    date: string;
    payload: {
      series: { reps: number; weightInKg: number }[];
    };
  }[];
};

type CreateOrUpdateExerciseLogRequest = {
  user: string;
  exercise: string;
  date: string;
  payload: {
    series: { reps: number; weightInKg: number }[];
  };
};

export type DeleteLogRequest = {
  user: string;
  exercise: string;
  date: string;
};

@Injectable({
  providedIn: 'root',
})
export class ExerciseLogApiService {
  private readonly http = inject(HttpClient);
  private readonly url = inject(BACKEND_URL);
  private readonly dayjsService = inject(DayjsService);

  public getExerciseLogs(): Observable<ExerciseLog[]> {
    return this.http
      .get<GetExerciseLogsResponse>(`${this.url}/logs/get-logs`)
      .pipe(
        map(data => [
          ...processData(data.lautaro, 'lautaro'),
          ...processData(data.roberto, 'roberto'),
          ...processData(data.nikito, 'nikito'),
          ...processData(data.matias, 'matias'),
          ...processData(data.peque, 'peque'),
        ])
      );
  }

  public getExerciseLogsv2(): Observable<ExerciseLog[]> {
    return this.http.get<GetExerciseLogsV2Response>(`${this.url}/firebase-logs`).pipe(
      map(x => {
        return x.data.flatMap(y => {
          return y.payload.series.map((s, i) => ({
            date: this.dayjsService.parseDate(y.date).format('DD/MM/YYYY'),
            name: y.exercise,
            reps: s.reps,
            serie: i + 1,
            type: '',
            user: y.user,
            weightKg: s.weightInKg,
          }));
        });
      })
    );
  }

  public createExerciseLog(request: CreateOrUpdateExerciseLogRequest): Observable<void> {
    return this.http.post<void>(`${this.url}/firebase-logs`, request);
  }

  public updateExerciseLog(request: CreateOrUpdateExerciseLogRequest): Observable<void> {
    return this.http.put<void>(`${this.url}/firebase-logs`, request);
  }

  public deleteExerciseLog(request: DeleteLogRequest): Observable<void> {
    return this.http.delete<void>(`${this.url}/firebase-logs`, { body: request });
  }
}
