import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Exercise } from '@models/exercise.model';
import { Observable, lastValueFrom, map, tap } from 'rxjs';
import { API_URL } from 'src/main';
import * as R from 'remeda';

type ExercisesResponse = {
  data: Exercise[];
};

export type CreateExerciseRequest = {
  name: string;
  muscleGroup: string;
  type: string;
};

export type UpdateExerciseRequest = {
  id: number;
  name: string;
  muscleGroup: string;
  type: string;
};

@Injectable({
  providedIn: 'root',
})
export class ExerciseApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  public readonly exercises = signal<Exercise[]>([]);

  public readonly types = computed(() =>
    R.pipe(
      this.exercises(),
      R.map(x => x.type ?? 'No type'),
      R.unique()
    )
  );

  public readonly muscleGroups = computed(() => {
    return R.pipe(
      this.exercises(),
      R.map(x => x.muscleGroup ?? 'No muscle group'),
      R.uniqueBy(x => x)
    );
  });

  public async fetchExercises(): Promise<void> {
    await lastValueFrom(this.getExercises());
  }

  public getExercises(): Observable<Exercise[]> {
    return this.http.get<ExercisesResponse>(`${this.apiUrl}/exercises`).pipe(
      map(x => x.data),
      tap(x => this.exercises.set(x))
    );
  }

  public createExercise(request: CreateExerciseRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/exercises`, request);
  }

  public updateExercise(request: UpdateExerciseRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/exercises/${request.id}`, request);
  }

  public deleteExercise(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/exercises/${id}`);
  }
}
