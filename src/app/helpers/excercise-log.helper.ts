import ***REMOVED*** parseAndCompare, parseDate ***REMOVED*** from '@helpers/date.helper';
import ***REMOVED*** type ExcerciseName, MUSCLE_GROUP_PER_EXCERCISE, EXCERCISES_NAMES ***REMOVED*** from '@models/constants';
import ***REMOVED*** type ExcerciseLog ***REMOVED*** from '@models/excercise-log.model';
import ***REMOVED*** type ExcerciseRow ***REMOVED*** from '@models/excercise-row.model';
import ***REMOVED*** type GroupedLog ***REMOVED*** from '@models/grouped-log.model';
import * as R from 'remeda';

export function groupExcerciseLogs(excerciseLogs: ExcerciseLog[]): GroupedLog[] ***REMOVED***
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
***REMOVED***

function mapToExcerciseRow(
  date: PropertyKey,
  username: PropertyKey,
  excerciseName: PropertyKey,
  series: [ExcerciseLog, ...ExcerciseLog[]]
): ExcerciseRow ***REMOVED***
  const total = series.every(x => x.weightKg === R.first(series).weightKg) ? R.sumBy(series, x => x.reps) : null;

  return ***REMOVED***
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
***REMOVED***;
***REMOVED***

export function mapGroupedToExcerciseRows(groupedLogs: GroupedLog[]): ExcerciseRow[] ***REMOVED***
  return R.pipe(
    groupedLogs,
    R.flatMap(([_, v]) => v.flatMap(([_, vv]) => vv.flatMap(([_, vvv]) => vvv))),
    R.sort((a, b) => parseAndCompare(a.date, b.date))
  );
***REMOVED***

export function getMissingExcerciseNames(rows: ExcerciseRow[]): string[] ***REMOVED***
  return R.pipe(
    rows,
    R.map(x => x.excerciseName.toLowerCase()),
    R.uniqBy(x => x),
    R.difference(EXCERCISES_NAMES)
  );
***REMOVED***

export function getPersonalRecord(rows: ExcerciseRow[], excerciseName: string, username: string): ExcerciseRow | null ***REMOVED***
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
***REMOVED***

export function getSeriesAmountPerMuscleGroupWeekly(excerciseRows: ExcerciseRow[]) ***REMOVED***
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
***REMOVED***

export function getSeriesAmountPerMuscleGroupMonthly(excerciseRows: ExcerciseRow[]) ***REMOVED***
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
***REMOVED***

export function groupByWeek(excerciseRows: ExcerciseRow[]) ***REMOVED***
  return R.pipe(
    excerciseRows,
    R.groupBy(x => parseDate(x.date).startOf('isoWeek').format('DD/MM/YYYY')),
    R.mapValues(x => R.sort(R.uniq(x.map(y => y.date)), (a, b) => parseAndCompare(a, b) * -1))
  );
***REMOVED***

export function groupByMonth(excerciseRows: ExcerciseRow[]) ***REMOVED***
  return R.pipe(
    excerciseRows,
    R.groupBy(x => parseDate(x.date).startOf('month').format('DD/MM/YYYY')),
    R.mapValues(x => R.sort(R.uniq(x.map(y => y.date)), (a, b) => parseAndCompare(a, b) * -1))
  );
***REMOVED***
