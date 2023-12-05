import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { processData } from '@helpers/excercise-log-api.helper';
import { Observable, map } from 'rxjs';

import { ExerciseLog } from 'src/app/models/excercise-log.model';
import { BACKEND_URL } from 'src/main';

type GetDataResponse = {
  lautaro: string[][];
  roberto: string[][];
  nikito: string[][];
  matias: string[][];
  peque: string[][];
};

export type FirstStepResult = {
  header: boolean;
  value: string | null;
  row: number;
  col: number;
};

export type SecondStepResult = {
  value: string | null;
  rowIndex: number;
  columnIndex: number;
  type: string;
};

export type ThirdStepResult = {
  type: string;
  name: string;
  date: string;
  serie: number | null;
  weightKg: number | null;
  reps: number | null;
  user: string;
};

@Injectable({
  providedIn: 'root',
})
export class ExerciseLogApiService {
  private readonly http = inject(HttpClient);
  private readonly url = inject(BACKEND_URL);

  public getExerciseLogs(): Observable<ExerciseLog[]> {
    return this.http
      .get<GetDataResponse>(`${this.url}/get-data`)
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
}
