import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ExerciseLog } from '@models/excercise-log.model';
import { Observable, map } from 'rxjs';

import { NET_API_URL } from 'src/main';

type GetExerciseLogsV2Response = {
  data: ExerciseLog[];
};

type CreateExerciseLogRequest = {
  user: string;
  exerciseId: string;
  date: string;
  series: { reps: number; weightInKg: number }[];
};

type UpdateExerciseLogRequest = {
  id: string;
  user: string;
  exerciseId: string;
  date: string;
  series: { reps: number; weightInKg: number }[];
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
  private readonly netApiUrl = inject(NET_API_URL);

  public getExerciseLogsv2(): Observable<ExerciseLog[]> {
    return this.http.get<GetExerciseLogsV2Response>(`${this.netApiUrl}/logs`).pipe(map(x => x.data));
  }

  public createExerciseLog(request: CreateExerciseLogRequest): Observable<void> {
    return this.http.post<void>(`${this.netApiUrl}/logs`, request);
  }

  public updateExerciseLog(request: UpdateExerciseLogRequest): Observable<void> {
    return this.http.put<void>(`${this.netApiUrl}/logs/${request.id}`, request);
  }

  public deleteExerciseLog(id: string): Observable<void> {
    return this.http.delete<void>(`${this.netApiUrl}/logs/${id}`);
  }
}
