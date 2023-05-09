import { parseAndCompare, parseDate } from '@helpers/date.helper';
import { type ExcerciseName, MUSCLE_GROUP_PER_EXCERCISE, EXCERCISES_NAMES } from '@models/constants';
import { type ExcerciseLog } from '@models/excercise-log.model';
import { type ExcerciseRow } from '@models/excercise-row.model';
import { type GroupedLog } from '@models/grouped-log.model';
import * as R from 'remeda';

export function groupExcerciseLogs(excerciseLogs: ExcerciseLog[]): GroupedLog[] {
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
            R.mapValues((series, excerciseName) => mapToExcerciseRow(date, username, excerciseName, series)),
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

function mapToExcerciseRow(
  date: PropertyKey,
  username: PropertyKey,
  excerciseName: PropertyKey,
  series: [ExcerciseLog, ...ExcerciseLog[]]
): ExcerciseRow {
  const total = series.every(x => x.weightKg === R.first(series).weightKg) ? R.sumBy(series, x => x.reps) : null;

  return {
    date: date.toString(),
    username: username.toString(),
    excerciseName: excerciseName.toString(),
    type: R.first(series).type,
    series: [...series],
    highlighted: series.every(x => x.weightKg === R.first(series).weightKg)
      ? series.every(x => x.reps >= 12)
        ? ('green' as const)
        : series.every(x => x.reps >= 8)
        ? ('yellow' as const)
        : null
      : null,
    total,
    average: total ? Math.ceil(total / series.length) : null,
    muscleGroup: MUSCLE_GROUP_PER_EXCERCISE[excerciseName as ExcerciseName],
  };
}

export function mapGroupedToExcerciseRows(groupedLogs: GroupedLog[]): ExcerciseRow[] {
  return R.pipe(
    groupedLogs,
    R.flatMap(([_, v]) => v.flatMap(([_, vv]) => vv.flatMap(([_, vvv]) => vvv))),
    R.sort((a, b) => parseAndCompare(a.date, b.date))
  );
}

export function getMissingExcerciseNames(rows: ExcerciseRow[]): string[] {
  return R.pipe(
    rows,
    R.map(x => x.excerciseName.toLowerCase()),
    R.uniqBy(x => x),
    R.difference(EXCERCISES_NAMES)
  );
}

export function getPersonalRecord(rows: ExcerciseRow[], excerciseName: string, username: string): ExcerciseRow | null {
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

function sortByWeightAndRepsDesc(a: ExcerciseLog, b: ExcerciseLog): number {
  const differenceWeight = b.weightKg - a.weightKg;
  const differenceReps = b.reps - a.reps;

  return differenceWeight !== 0 ? differenceWeight : differenceReps;
}

export function getSeriesAmountPerMuscleGroupWeekly(excerciseRows: ExcerciseRow[]) {
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
                R.sumBy(x => x.series.length)
              )
            )
          )
        )
      )
    )
  );
}

export function getSeriesAmountPerMuscleGroupMonthly(excerciseRows: ExcerciseRow[]) {
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
                R.sumBy(x => x.series.length)
              )
            )
          )
        )
      )
    )
  );
}

export function groupByWeek(excerciseRows: ExcerciseRow[]) {
  return R.pipe(
    excerciseRows,
    R.groupBy(x => parseDate(x.date).startOf('isoWeek').format('DD/MM/YYYY')),
    R.mapValues(x => R.sort(R.uniq(x.map(y => y.date)), (a, b) => parseAndCompare(a, b) * -1))
  );
}

export function groupByMonth(excerciseRows: ExcerciseRow[]) {
  return R.pipe(
    excerciseRows,
    R.groupBy(x => parseDate(x.date).startOf('month').format('DD/MM/YYYY')),
    R.mapValues(x => R.sort(R.uniq(x.map(y => y.date)), (a, b) => parseAndCompare(a, b) * -1))
  );
}
