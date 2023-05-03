import ***REMOVED*** HttpClient ***REMOVED*** from '@angular/common/http';
import ***REMOVED*** Injectable, inject ***REMOVED*** from '@angular/core';
import ***REMOVED*** Observable, map ***REMOVED*** from 'rxjs';

import * as R from 'remeda';

import ***REMOVED*** ExcerciseLog ***REMOVED*** from '@models/excercise-log.model';

@Injectable(***REMOVED***
  providedIn: 'root',
***REMOVED***)
export class ExcerciseLogApiService ***REMOVED***
  private readonly http = inject(HttpClient);

  public getExcerciseLogs(): Observable<ExcerciseLog[]> ***REMOVED***
    return this.http
      .get<***REMOVED*** lautaro: string[][]; roberto: string[][] ***REMOVED***>('https://gym-nodejs-excel-bermejolautaro.vercel.app/api/get-data')
      .pipe(
        map(data =>
          R.concat(
            processData(data.lautaro).map(x => (***REMOVED*** ...x, user: 'lautaro' ***REMOVED***)),
            processData(data.roberto).map(x => (***REMOVED*** ...x, user: 'roberto' ***REMOVED***))
          )
        )
      );
***REMOVED***
***REMOVED***

function processData(data: string[][]): ExcerciseLog[] ***REMOVED***
  const result = [];

  for (let i = 0; i < data.length; i++) ***REMOVED***
    const prevRow = data[i - 1];
    const row = data[i];
    const nextRow = data[i + 1];

    for (let j = 0; j < row.length; j++) ***REMOVED***
      const element = row[j];

      const isHeader = j === 0 && (i === 0 || ((prevRow.length === 0 || prevRow[0] === '') && (nextRow.length === 0 || nextRow[0] === '')));
      const isExerciseName = j === 0 && !isHeader && !!element;

      if (isHeader) ***REMOVED***
        result.push(***REMOVED*** header: true, value: element, row: i, col: j ***REMOVED***);
  ***REMOVED*** else if (isExerciseName) ***REMOVED***
        result.push(***REMOVED*** header: false, value: element, row: i, col: j ***REMOVED***);
  ***REMOVED***
***REMOVED***
***REMOVED***

  const result2 = [];

  const dateRowIndexByType: Record<string, number> = ***REMOVED******REMOVED***;

  let lastHeader = '';

  for (const element of result) ***REMOVED***
    if (element.header) ***REMOVED***
      dateRowIndexByType[element.value] = element.row + 1;
      lastHeader = element.value;
***REMOVED*** else ***REMOVED***
      result2.push(***REMOVED***
        value: element.value,
        row: element.row,
        col: element.col,
        type: lastHeader,
  ***REMOVED***);
***REMOVED***
***REMOVED***

  const result3 = [];

  for (const element of result2) ***REMOVED***
    const dateRowIndex = dateRowIndexByType[element.type];

    for (let i = 1; i < data[dateRowIndex].length; i++) ***REMOVED***
      const repsString = data[element.row][i];
      const series = repsString?.split('|') ?? '';

      if (!series) ***REMOVED***
        continue;
  ***REMOVED***

      for (let j = 0; j < series.length; j++) ***REMOVED***
        const serie = series[j];
        const [kg, reps] = serie.split('-');

        if (!kg || !reps) ***REMOVED***
          continue;
    ***REMOVED***

        result3.push(***REMOVED***
          type: element.type.toLowerCase(),
          name: element.value.toLowerCase(),
          date: data[dateRowIndex][i],
          serie: j + 1,
          weightKg: Number(kg.replace(',', '.')),
          reps: Number(reps),
          user: '',
    ***REMOVED***);
  ***REMOVED***
***REMOVED***
***REMOVED***

  return result3;
***REMOVED***
