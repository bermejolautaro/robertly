import { parseAndCompare, parseDate } from '@helpers/date.helper';
import { type ExerciseLog } from '@models/excercise-log.model';
import { type ExerciseRow } from '@models/excercise-row.model';
import { Exercise } from '@models/exercise.model';
import { type GroupedLog } from '@models/grouped-log.model';
import * as R from 'remeda';

export function groupExcerciseLogs(excerciseLogs: ExerciseLog[], exercises: Exercise[]): GroupedLog[] {
  return R.pipe(
    excerciseLogs,
    R.groupBy(x => x.date),
    R.mapValues((x, date) =>
      R.pipe(
        x,
        R.groupBy(y => y.user),
        R.mapValues((y, username) =>
          R.pipe(
            y,
            R.groupBy(z => z.name),
            R.mapValues((series, excerciseName) => mapToExcerciseRow(date, username, excerciseName, series, exercises)),
            R.toPairs
          )
        ),
        R.toPairs
      )
    ),
    R.toPairs,
    R.sort(([a], [b]) => parseAndCompare(a, b))
  );
}

export function amountDaysTrainedByUser(exerciseLogs: ExerciseLog[]) {
  return R.pipe(
    exerciseLogs,
    R.groupBy(x => x.user),
    R.mapValues(logs => amountDaysTrained(logs))
  );
}

function mapToExcerciseRow(
  date: PropertyKey,
  username: PropertyKey,
  excerciseName: PropertyKey,
  series: [ExerciseLog, ...ExerciseLog[]],
  exercises: Exercise[]
): ExerciseRow {
  const total = series.every(x => x.weightKg === R.first(series).weightKg) ? R.sumBy(series, x => x.reps!) : null;

  return {
    date: date.toString(),
    username: username.toString(),
    excerciseName: excerciseName.toString(),
    type: R.first(series).type,
    series: [...series],
    highlighted: series.every(x => x.weightKg === R.first(series).weightKg)
      ? series.every(x => x.reps! >= 12)
        ? ('green' as const)
        : series.every(x => x.reps! >= 8)
          ? ('yellow' as const)
          : null
      : null,
    total,
    tonnage: series.reduce((prev, curr) => prev + curr.reps! * curr.weightKg!, 0),
    average: total ? Math.ceil(total / series.length) : null,
    muscleGroup: exercises.find(x => x.exercise === excerciseName)?.muscleGroup ?? '',
  };
}

export function mapGroupedToExcerciseRows(groupedLogs: GroupedLog[]): ExerciseRow[] {
  return R.pipe(
    groupedLogs,
    R.flatMap(([_, v]) => v.flatMap(([_, vv]) => vv.flatMap(([_, vvv]) => vvv))),
    R.sort((a, b) => parseAndCompare(a.date, b.date))
  );
}

export function amountDaysTrained(logs: ExerciseLog[]): number {
  const result = R.pipe(
    logs,
    R.map(x => x.date),
    R.uniq()
  );

  return result.length;
}

export function getPersonalRecord(rows: ExerciseRow[], excerciseName: string, username: string): ExerciseRow | null {
  const result = R.pipe(
    rows,
    R.filter(x => x.username === username && x.excerciseName === excerciseName),
    R.sort((a, b) => {
      const bestSerieFromA = R.first(R.sort(a.series, sortByWeightAndRepsDesc))!;
      const bestSerieFromB = R.first(R.sort(b.series, sortByWeightAndRepsDesc))!;

      return sortByWeightAndRepsDesc(bestSerieFromA, bestSerieFromB);
    }),
    R.first()
  );

  return result ?? null;
}

function sortByWeightAndRepsDesc(a: ExerciseLog, b: ExerciseLog): number {
  const differenceWeight = b.weightKg! - a.weightKg!;
  const differenceReps = b.reps! - a.reps!;

  return differenceWeight !== 0 ? differenceWeight : differenceReps;
}

export function getSeriesAmountPerMuscleGroupPerWeek(excerciseRows: ExerciseRow[]) {
  return R.pipe(
    excerciseRows,
    R.groupBy(row => parseDate(row.date).startOf('isoWeek').format('DD/MM/YYYY')),
    R.mapValues(x =>
      R.pipe(
        x,
        R.groupBy(y => y.username),
        R.mapValues(y =>
          R.pipe(
            y,
            R.groupBy(z => z.muscleGroup),
            R.mapValues(w =>
              R.pipe(
                w,
                R.filter(x => !!x.series.at(0)?.serie),
                R.sumBy(x => x.series.length)
              )
            )
          )
        )
      )
    )
  );
}

export function getSeriesAmountPerUserPerMuscleGroupPerMonth(excerciseRows: ExerciseRow[]) {
  return R.pipe(
    excerciseRows,
    R.groupBy(row => parseDate(row.date).startOf('month').format('DD/MM/YYYY')),
    R.mapValues(x =>
      R.pipe(
        x,
        R.groupBy(y => y.username),
        R.mapValues(y =>
          R.pipe(
            y,
            R.groupBy(z => z.muscleGroup),
            R.mapValues(w =>
              R.pipe(
                w,
                R.filter(x => !!x.series.at(0)?.serie),
                R.sumBy(x => x.series.length)
              )
            )
          )
        )
      )
    )
  );
}

export function getSeriesAmountPerUserPerMuscleGroupPerYear(excerciseRows: ExerciseRow[]) {
  return R.pipe(
    excerciseRows,
    R.groupBy(row => parseDate(row.date).startOf('year').format('DD/MM/YYYY')),
    R.mapValues(x =>
      R.pipe(
        x,
        R.groupBy(y => y.username),
        R.mapValues(y =>
          R.pipe(
            y,
            R.groupBy(z => z.muscleGroup),
            R.mapValues(w =>
              R.pipe(
                w,
                R.filter(x => !!x.series.at(0)?.serie),
                R.sumBy(x => x.series.length)
              )
            )
          )
        )
      )
    )
  );
}

export function groupByWeek(excerciseRows: ExerciseLog[]) {
  return R.pipe(
    excerciseRows,
    R.groupBy(x => parseDate(x.date).startOf('isoWeek').format('DD/MM/YYYY')),
    R.mapValues(x => R.sort(R.uniq(x.map(y => y.date)), (a, b) => parseAndCompare(a, b) * -1))
  );
}

export function groupByMonth(excerciseRows: ExerciseLog[]) {
  return R.pipe(
    excerciseRows,
    R.groupBy(x => parseDate(x.date).startOf('month').format('DD/MM/YYYY')),
    R.mapValues(x => R.sort(R.uniq(x.map(y => y.date)), (a, b) => parseAndCompare(a, b) * -1))
  );
}

export function groupByYear(excerciseRows: ExerciseLog[]) {
  return R.pipe(
    excerciseRows,
    R.groupBy(x => parseDate(x.date).startOf('year').format('DD/MM/YYYY')),
    R.mapValues(x => R.sort(R.uniq(x.map(y => y.date)), (a, b) => parseAndCompare(a, b) * -1))
  );
}
