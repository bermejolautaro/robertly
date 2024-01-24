import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Exercise } from '@models/exercise.model';
import { Observable, map } from 'rxjs';
import { API_URL } from 'src/main';

type ExercisesResponse = {
  data: Exercise[];
};

export type CreateExerciseRequest = {
  name: string;
  muscleGroup: string;
  type: string;
};

export type UpdateExerciseRequest = {
  id: string;
  name: string;
  muscleGroup: string;
  type: string;
};

@Injectable({
  providedIn: 'root',
})
export class ExerciseApiService {
  private readonly http = inject(HttpClient);
  private readonly netApiUrl = inject(API_URL);

  public getExercises(): Observable<Exercise[]> {
    return this.http.get<ExercisesResponse>(`${this.netApiUrl}/exercises`).pipe(map(x => x.data));
  }

  public createExercise(request: CreateExerciseRequest): Observable<void> {
    return this.http.post<void>(`${this.netApiUrl}/exercises`, request);
  }

  public updateExercise(request: UpdateExerciseRequest): Observable<void> {
    return this.http.put<void>(`${this.netApiUrl}/exercises/${request.id}`, request);
  }

  public deleteExercise(id: string): Observable<void> {
    return this.http.delete<void>(`${this.netApiUrl}/exercises/${id}`);
  }
}
