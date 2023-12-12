import ***REMOVED*** HttpClient ***REMOVED*** from '@angular/common/http';
import ***REMOVED*** Injectable, inject ***REMOVED*** from '@angular/core';
import ***REMOVED*** processData ***REMOVED*** from '@helpers/excercise-log-api.helper';
import ***REMOVED*** Observable, map ***REMOVED*** from 'rxjs';

import ***REMOVED*** ExerciseLog ***REMOVED*** from 'src/app/models/excercise-log.model';
import ***REMOVED*** BACKEND_URL ***REMOVED*** from 'src/main';

type GetExerciseLogsResponse = ***REMOVED***
  lautaro: string[][];
  roberto: string[][];
  nikito: string[][];
  matias: string[][];
  peque: string[][];
***REMOVED***;

type GetExerciseLogsV2Response = ***REMOVED***
  data: ***REMOVED***
    user: string;
    exercise: string;
    date: string;
    payload: ***REMOVED***
      series: ***REMOVED*** reps: number; weightInKg: number ***REMOVED***[];
***REMOVED***;
***REMOVED***[];
***REMOVED***;

type CreateExerciseLogRequest = ***REMOVED***
  user: string;
  exercise: string;
  date: string;
  payload: ***REMOVED***
    series: ***REMOVED*** reps: number; weightInKg: number ***REMOVED***[];
***REMOVED***;
***REMOVED***;

@Injectable(***REMOVED***
  providedIn: 'root',
***REMOVED***)
export class ExerciseLogApiService ***REMOVED***
  private readonly http = inject(HttpClient);
  private readonly url = inject(BACKEND_URL);

  public getExerciseLogs(): Observable<ExerciseLog[]> ***REMOVED***
    return this.http
      .get<GetExerciseLogsResponse>(`$***REMOVED***this.url***REMOVED***/logs/get-logs`)
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

  public getExerciseLogsv2(): Observable<ExerciseLog[]> ***REMOVED***
    return this.http.get<GetExerciseLogsV2Response>(`$***REMOVED***this.url***REMOVED***/logs`).pipe(
      map(x => ***REMOVED***
        return x.data.flatMap(y => ***REMOVED***
          return y.payload.series.map(
            (s, i) =>
              (***REMOVED***
                date: y.date,
                name: y.exercise,
                reps: s.reps,
                serie: i + 1,
                type: '',
                user: y.user,
                weightKg: s.weightInKg,
          ***REMOVED***)
          );
    ***REMOVED***);
  ***REMOVED***)
    );
***REMOVED***

  public createExerciseLog(request: CreateExerciseLogRequest): Observable<void> ***REMOVED***
    return this.http.post<void>(`$***REMOVED***this.url***REMOVED***/logs`, request);
***REMOVED***
***REMOVED***
