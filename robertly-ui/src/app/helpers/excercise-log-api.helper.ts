import ***REMOVED*** ExerciseLog ***REMOVED*** from '@models/excercise-log.model';

type FirstStepResult = ***REMOVED***
  header: boolean;
  value: string | null;
  row: number;
  col: number;
***REMOVED***;

type SecondStepResult = ***REMOVED***
  value: string | null;
  rowIndex: number;
  columnIndex: number;
  type: string;
***REMOVED***;

type ThirdStepResult = ***REMOVED***
  type: string;
  name: string;
  date: string;
  serie: number | null;
  weightKg: number | null;
  reps: number | null;
  user: string;
***REMOVED***;

export function processDataFirstStep(data: string[][]): FirstStepResult[] ***REMOVED***
  const result: FirstStepResult[] = [];
  const firstColumn = data.map(x => x[0] || null);

  for (let rowIndex = 0; rowIndex < firstColumn.length; rowIndex++) ***REMOVED***
    const prevRow = firstColumn[rowIndex - 1] ?? null;
    const row = firstColumn[rowIndex] ?? null;
    const nextRow = firstColumn[rowIndex + 1] ?? null;

    if (!row) ***REMOVED***
      continue;
***REMOVED***

    const element = firstColumn[rowIndex] ?? null;

    // Assume last element is an excercise and not a header
    const isHeader = !prevRow && !nextRow && rowIndex !== firstColumn.length - 1;
    const isExerciseName = !isHeader && !!element;

    if (isHeader) ***REMOVED***
      result.push(***REMOVED*** header: true, value: element, row: rowIndex, col: 0 ***REMOVED***);
***REMOVED*** else if (isExerciseName) ***REMOVED***
      result.push(***REMOVED*** header: false, value: element, row: rowIndex, col: 0 ***REMOVED***);
***REMOVED***
***REMOVED***

  return result;
***REMOVED***

export function processDataSecondStep(data: FirstStepResult[]): [SecondStepResult[], Record<string, number>] ***REMOVED***
  const result = [];

  const dateRowIndexByType: Record<string, number> = ***REMOVED******REMOVED***;

  let lastHeader = '';

  for (const element of data) ***REMOVED***
    if (element.header && element.value) ***REMOVED***
      dateRowIndexByType[element.value] = element.row + 1;
      lastHeader = element.value ?? '';
***REMOVED*** else ***REMOVED***
      result.push(***REMOVED***
        value: element.value,
        rowIndex: element.row,
        columnIndex: element.col,
        type: lastHeader,
  ***REMOVED***);
***REMOVED***
***REMOVED***

  return [result, dateRowIndexByType];
***REMOVED***

export function processDataThirdStep(
  secondStepResult: SecondStepResult[],
  data: string[][],
  dateRowIndexByType: Record<string, number>,
  username: string = ''
): ThirdStepResult[] ***REMOVED***
  const result = [];

  for (const element of secondStepResult) ***REMOVED***
    const dateRowIndex = dateRowIndexByType[element.type] ?? -1;

    const emptyDateAlreadyAdded: Record<string, boolean> = ***REMOVED******REMOVED***;

    const columns = data[dateRowIndex] ?? [];

    for (let col = 1; col < columns.length; col++) ***REMOVED***
      const row = data[element.rowIndex] ?? [];
      const repsString = row[col] || null;
      const series = repsString?.split('|') ?? [];

      const date = data[dateRowIndex]![col]!;

      if (!series.length && !emptyDateAlreadyAdded[date]) ***REMOVED***
        emptyDateAlreadyAdded[date] = true;

        result.push(***REMOVED***
          type: element.type.toLowerCase(),
          name: null!,
          date,
          serie: null,
          weightKg: null,
          reps: null,
          user: username,
    ***REMOVED***);
        continue;
  ***REMOVED***

      for (let j = 0; j < series!.length; j++) ***REMOVED***
        const serie = series![j]!;
        const [kg, reps] = serie.split('-');

        if (!kg || !reps) ***REMOVED***
          continue;
    ***REMOVED***

        result.push(***REMOVED***
          type: element.type.toLowerCase(),
          name: element.value!.toLowerCase(),
          date: data[dateRowIndex]![col]!,
          serie: j + 1,
          weightKg: Number(kg.replace(',', '.')),
          reps: Number(reps),
          user: username,
    ***REMOVED***);
  ***REMOVED***
***REMOVED***
***REMOVED***

  return result;
***REMOVED***

export function processData(data: string[][], username: string = ''): ExerciseLog[] ***REMOVED***
  const [secondStepResult, dateRowIndexByType] = processDataSecondStep(processDataFirstStep(data));
  const result = processDataThirdStep(secondStepResult, data, dateRowIndexByType, username);

  return result;
***REMOVED***
