import ***REMOVED*** HttpClient ***REMOVED*** from '@angular/common/http';
import ***REMOVED*** Injectable, inject ***REMOVED*** from '@angular/core';
import ***REMOVED*** processData ***REMOVED*** from '@helpers/excercise-log-api.helper';
import ***REMOVED*** DayjsService ***REMOVED*** from '@services/dayjs.service';
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

type CreateOrUpdateExerciseLogRequest = ***REMOVED***
  user: string;
  exercise: string;
  date: string;
  payload: ***REMOVED***
    series: ***REMOVED*** reps: number; weightInKg: number ***REMOVED***[];
***REMOVED***;
***REMOVED***;

export type DeleteLogRequest = ***REMOVED***
  user: string;
  exercise: string;
  date: string;
***REMOVED***;

@Injectable(***REMOVED***
  providedIn: 'root',
***REMOVED***)
export class ExerciseLogApiService ***REMOVED***
  private readonly http = inject(HttpClient);
  private readonly url = inject(BACKEND_URL);
  private readonly dayjsService = inject(DayjsService);

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
    return this.http.get<GetExerciseLogsV2Response>(`$***REMOVED***this.url***REMOVED***/firebase/logs`).pipe(
      map(x => ***REMOVED***
        return x.data.flatMap(y => ***REMOVED***
          return y.payload.series.map((s, i) => (***REMOVED***
            date: this.dayjsService.parseDate(y.date).format('DD/MM/YYYY'),
            name: y.exercise,
            reps: s.reps,
            serie: i + 1,
            type: '',
            user: y.user,
            weightKg: s.weightInKg,
      ***REMOVED***));
    ***REMOVED***);
  ***REMOVED***)
    );
***REMOVED***

  public createExerciseLog(request: CreateOrUpdateExerciseLogRequest): Observable<void> ***REMOVED***
    return this.http.post<void>(`$***REMOVED***this.url***REMOVED***/firebase/logs`, request);
***REMOVED***

  public updateExerciseLog(request: CreateOrUpdateExerciseLogRequest): Observable<void> ***REMOVED***
    return this.http.put<void>(`$***REMOVED***this.url***REMOVED***/firebase/logs`, request);
***REMOVED***

  public deleteExerciseLog(request: DeleteLogRequest): Observable<void> ***REMOVED***
    return this.http.delete<void>(`$***REMOVED***this.url***REMOVED***/firebase/logs`, ***REMOVED*** body: request ***REMOVED***);
***REMOVED***
***REMOVED***