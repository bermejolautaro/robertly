import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import * as R from 'remeda';

import { ExcerciseLog } from '@models/excercise-log.model';
import { BACKEND_URL } from 'src/main';

type GetDataResponse = {
  lautaro: string[][],
  roberto: string[][],
  nikito: string[][]
}

@Injectable({
  providedIn: 'root',
})
export class ExcerciseLogApiService {
  private readonly http = inject(HttpClient);
  private readonly url = inject(BACKEND_URL);

  public getExcerciseLogs(): Observable<ExcerciseLog[]> {
    return this.http.get<GetDataResponse>(`${this.url}/get-data`).pipe(
      map(data => ([
        ...processData(data.lautaro).map(x => ({ ...x, user: 'lautaro' })),
        ...processData(data.roberto).map(x => ({ ...x, user: 'roberto' })),
        ...processData(data.nikito).map(x => ({ ...x, user: 'nikito' }))
      ])
    ));
  }
}

function processData(data: string[][]): ExcerciseLog[] {
  const result = [];

  for (let i = 0; i < data.length; i++) {
    const prevRow = data[i - 1];
    const row = data[i];
    const nextRow = data[i + 1];

    for (let j = 0; j < row.length; j++) {
      const element = row[j];

      const isHeader = j === 0 && (i === 0 || ((prevRow.length === 0 || prevRow[0] === '') && (nextRow.length === 0 || nextRow[0] === '')));
      const isExerciseName = j === 0 && !isHeader && !!element;

      if (isHeader) {
        result.push({ header: true, value: element, row: i, col: j });
      } else if (isExerciseName) {
        result.push({ header: false, value: element, row: i, col: j });
      }
    }
  }

  const result2 = [];

  const dateRowIndexByType: Record<string, number> = {};

  let lastHeader = '';

  for (const element of result) {
    if (element.header) {
      dateRowIndexByType[element.value] = element.row + 1;
      lastHeader = element.value;
    } else {
      result2.push({
        value: element.value,
        row: element.row,
        col: element.col,
        type: lastHeader,
      });
    }
  }

  const result3 = [];

  for (const element of result2) {
    const dateRowIndex = dateRowIndexByType[element.type];

    for (let i = 1; i < data[dateRowIndex].length; i++) {
      const repsString = data[element.row][i];
      const series = repsString?.split('|') ?? '';

      if (!series) {
        result3.push({
          type: element.type.toLowerCase(),
          name: element.value.toLowerCase(),
          date: data[dateRowIndex][i],
          serie: null,
          weightKg: null,
          reps: null,
          user: '',
        });
        continue;
      }

      for (let j = 0; j < series.length; j++) {
        const serie = series[j];
        const [kg, reps] = serie.split('-');

        if (!kg || !reps) {
          continue;
        }

        result3.push({
          type: element.type.toLowerCase(),
          name: element.value.toLowerCase(),
          date: data[dateRowIndex][i],
          serie: j + 1,
          weightKg: Number(kg.replace(',', '.')),
          reps: Number(reps),
          user: '',
        });
      }
    }
  }

  return result3;
}
