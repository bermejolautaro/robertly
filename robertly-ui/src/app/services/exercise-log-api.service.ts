import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ExerciseLog, Serie } from '@models/exercise-log.model';
import { Observable, map } from 'rxjs';

import { API_URL } from 'src/main';

type GetExerciseLogsV2Response = {
  data: ExerciseLog[];
};

type CreateExerciseLogRequest = {
  user: string;
  userId: string | null;
  exerciseId: string;
  date: string;
  series: Serie[];
};

type UpdateExerciseLogRequest = {
  id: string;
  user: string;
  userId: string | null;
  exerciseId: string;
  date: string;
  series: Serie[];
};

@Injectable({
  providedIn: 'root',
})
export class ExerciseLogApiService {
  private readonly http = inject(HttpClient);
  private readonly netApiUrl = inject(API_URL);

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
