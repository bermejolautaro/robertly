import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

// import * as R from 'remeda';

import { ExcerciseLog } from 'src/app/models/excercise-log.model';
import { BACKEND_URL } from 'src/main';

type GetDataResponse = {
  lautaro: string[][];
  roberto: string[][];
  nikito: string[][];
  matias: string[][];
  peque: string[][];
};

type FirstStepResult = {
  header: boolean;
  value: string | null;
  row: number;
  col: number;
};

type SecondStepResult = {
  value: string | null;
  rowIndex: number;
  columnIndex: number;
  type: string;
};

type ThirdStepResult = {
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
export class ExcerciseLogApiService {
  private readonly http = inject(HttpClient);
  private readonly url = inject(BACKEND_URL);

  public getExcerciseLogs(): Observable<ExcerciseLog[]> {
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

export function processDataFirstStep(data: string[][]): FirstStepResult[] {
  const result: FirstStepResult[] = [];
  const firstColumn = data.map(x => x[0] || null);

  for (let rowIndex = 0; rowIndex < firstColumn.length; rowIndex++) {
    const prevRow = firstColumn[rowIndex - 1] ?? null;
    const row = firstColumn[rowIndex] ?? null;
    const nextRow = firstColumn[rowIndex + 1] ?? null;

    if (!row) {
      continue;
    }

    const element = firstColumn[rowIndex] ?? null;

    // Assume last element is an excercise and not a header
    const isHeader = !prevRow && !nextRow && rowIndex !== firstColumn.length - 1;
    const isExerciseName = !isHeader && !!element;

    if (isHeader) {
      result.push({ header: true, value: element, row: rowIndex, col: 0 });
    } else if (isExerciseName) {
      result.push({ header: false, value: element, row: rowIndex, col: 0 });
    }
  }

  return result;
}

export function processDataSecondStep(data: FirstStepResult[]): [SecondStepResult[], Record<string, number>] {
  const result = [];

  const dateRowIndexByType: Record<string, number> = {};

  let lastHeader = '';

  for (const element of data) {
    if (element.header && element.value) {
      dateRowIndexByType[element.value] = element.row + 1;
      lastHeader = element.value ?? '';
    } else {
      result.push({
        value: element.value,
        rowIndex: element.row,
        columnIndex: element.col,
        type: lastHeader,
      });
    }
  }

  return [result, dateRowIndexByType];
}

export function processDataThirdStep(
  secondStepResult: SecondStepResult[],
  data: string[][],
  dateRowIndexByType: Record<string, number>,
  username: string = ''
): ThirdStepResult[] {
  const result = [];

  for (const element of secondStepResult) {
    const dateRowIndex = dateRowIndexByType[element.type] ?? -1;

    const emptyDateAlreadyAdded: Record<string, boolean> = {};

    const columns = data[dateRowIndex] ?? [];

    for (let col = 1; col < columns.length; col++) {
      const row = data[element.rowIndex] ?? [];
      const repsString = row[col] || null;
      const series = repsString?.split('|') ?? [];

      const date = data[dateRowIndex]![col]!;

      if (!series.length && !emptyDateAlreadyAdded[date]) {
        emptyDateAlreadyAdded[date] = true;

        result.push({
          type: element.type.toLowerCase(),
          name: null!,
          date,
          serie: null,
          weightKg: null,
          reps: null,
          user: username,
        });
        continue;
      }

      for (let j = 0; j < series!.length; j++) {
        const serie = series![j]!;
        const [kg, reps] = serie.split('-');

        if (!kg || !reps) {
          continue;
        }

        result.push({
          type: element.type.toLowerCase(),
          name: element.value!.toLowerCase(),
          date: data[dateRowIndex]![col]!,
          serie: j + 1,
          weightKg: Number(kg.replace(',', '.')),
          reps: Number(reps),
          user: username,
        });
      }
    }
  }

  return result;
}

export function processData(data: string[][], username: string = ''): ExcerciseLog[] {
  const [secondStepResult, dateRowIndexByType] = processDataSecondStep(processDataFirstStep(data));
  const result = processDataThirdStep(secondStepResult, data, dateRowIndexByType, username);

  return result;
}
