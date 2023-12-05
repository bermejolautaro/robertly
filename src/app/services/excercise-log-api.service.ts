import ***REMOVED*** HttpClient ***REMOVED*** from '@angular/common/http';
import ***REMOVED*** Injectable, inject ***REMOVED*** from '@angular/core';
import ***REMOVED*** processData ***REMOVED*** from '@helpers/excercise-log-api.helper';
import ***REMOVED*** Observable, map ***REMOVED*** from 'rxjs';

import ***REMOVED*** ExerciseLog ***REMOVED*** from 'src/app/models/excercise-log.model';
import ***REMOVED*** BACKEND_URL ***REMOVED*** from 'src/main';

type GetDataResponse = ***REMOVED***
  lautaro: string[][];
  roberto: string[][];
  nikito: string[][];
  matias: string[][];
  peque: string[][];
***REMOVED***;

export type FirstStepResult = ***REMOVED***
  header: boolean;
  value: string | null;
  row: number;
  col: number;
***REMOVED***;

export type SecondStepResult = ***REMOVED***
  value: string | null;
  rowIndex: number;
  columnIndex: number;
  type: string;
***REMOVED***;

export type ThirdStepResult = ***REMOVED***
  type: string;
  name: string;
  date: string;
  serie: number | null;
  weightKg: number | null;
  reps: number | null;
  user: string;
***REMOVED***;

@Injectable(***REMOVED***
  providedIn: 'root',
***REMOVED***)
export class ExerciseLogApiService ***REMOVED***
  private readonly http = inject(HttpClient);
  private readonly url = inject(BACKEND_URL);

  public getExerciseLogs(): Observable<ExerciseLog[]> ***REMOVED***
    return this.http
      .get<GetDataResponse>(`$***REMOVED***this.url***REMOVED***/get-data`)
      .pipe(
        map(data => [
          ...processData(data.lautaro, 'lautaro'),
          ...processData(data.roberto, 'roberto'),
          ...processData(data.nikito, 'nikito'),
          ...processData(data.matias, 'matias'),
          ...processData(data.peque, 'peque'),
        ])
      );
***REMOVED***
***REMOVED***
