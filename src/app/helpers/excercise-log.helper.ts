import { parseAndCompare } from '@helpers/date.helper';
import { type ExcerciseName, MUSCLE_GROUP_PER_EXCERCISE } from '@models/constants';
import { type ExcerciseLog } from '@models/excercise-log.model';
import { ExcerciseRow } from '@models/excercise-row.model';
import { GroupedLog } from '@models/grouped-log.model';

import * as dayjs from 'dayjs';
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

export function getPersonalRecord(rows: ExcerciseRow[], excerciseName: string, username: string): ExcerciseRow | null {
  const result = R.pipe(
    rows,
    R.filter(x => x.username === username && x.excerciseName === excerciseName),
    R.sort(
      (a, b) =>
        R.first(R.sort(b.series, (aa, bb) => bb.weightKg - aa.weightKg))!.weightKg -
        R.first(R.sort(a.series, (aa, bb) => bb.weightKg - aa.weightKg))!.weightKg
    ),
    R.first()
  );

  return result ?? null;
}

export function getSeriesAmountPerMuscleGroupWeekly(excerciseRows: ExcerciseRow[]) {
  return R.pipe(
    excerciseRows,
    R.groupBy(row => dayjs(row.date, 'DD/MM/YYYY').startOf('isoWeek').format('DD/MM/YYYY')),
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
    R.groupBy(row => dayjs(row.date, 'DD/MM/YYYY').startOf('month').format('DD/MM/YYYY')),
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
    R.groupBy(x => dayjs(x.date, 'DD/MM/YYYY').startOf('isoWeek').format('DD/MM/YYYY')),
    R.mapValues(x => R.sort(R.uniq(x.map(y => y.date)), (a, b) => parseAndCompare(a, b) * -1))
  );
}

export function groupByMonth(excerciseRows: ExcerciseRow[]) {
  return R.pipe(
    excerciseRows,
    R.groupBy(x => dayjs(x.date, 'DD/MM/YYYY').startOf('month').format('DD/MM/YYYY')),
    R.mapValues(x => R.sort(R.uniq(x.map(y => y.date)), (a, b) => parseAndCompare(a, b) * -1))
  );
}