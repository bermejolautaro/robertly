import { parseAndCompare, parseDate } from '@helpers/date.helper';
import { Serie, type ExerciseLogDto } from '@models/exercise-log.model';
import { type ExerciseRow } from '@models/exercise-row.model';
import { type GroupedLog } from '@models/grouped-log.model';
import * as R from 'remeda';

// export function groupExerciseLogs(exerciseLogs: ExerciseLog[]) {
//   const result = R.pipe(
//     exerciseLogs,
//     R.groupBy(x => x.date),
//     R.mapValues(x =>
//       R.pipe(
//         x,
//         R.groupBy(y => y.user),
//         R.mapValues(y => y.map(mapToExerciseRow)),
//         R.toPairs
//       )
//     ),
//     R.toPairs,
//     R.sort(([dateA], [dateB]) => parseAndCompare(dateA, dateB))
//   );

//   return result;
// }

// export function amountDaysTrainedByUser(exerciseLogs: ExerciseLog[]) {
//   return R.pipe(
//     exerciseLogs,
//     R.groupBy(x => x.user),
//     R.mapValues(logs => amountDaysTrained(logs))
//   );
// }

// function mapToExerciseRow(log: ExerciseLog): ExerciseRow {
//   const firstSerie = log.series.at(0);
//   const total = log.series.every(x => x.weightInKg === firstSerie?.weightInKg) ? R.sumBy(log.series, x => x.reps!) : null;

//   return {
//     id: log.id,
//     date: log.date.toString(),
//     username: log.user.name,
//     userId: log.user.id,
//     exercise: log.exercise,
//     type: log.exercise.type,
//     series: [...log.series],
//     highlighted: log.series.every(x => x.weightInKg === firstSerie?.weightInKg)
//       ? log.series.every(x => x.reps! >= 12)
//         ? ('green' as const)
//         : log.series.every(x => x.reps! >= 8)
//           ? ('yellow' as const)
//           : null
//       : null,
//     total,
//     tonnage: log.series.reduce((prev, curr) => prev + curr.reps! * curr.weightInKg!, 0),
//     average: total ? Math.ceil(total / log.series.length) : null,
//     muscleGroup: log.exercise.muscleGroup,
//   };
// }

export function mapGroupedToExerciseRows(groupedLogs: GroupedLog[]): ExerciseRow[] {
  return R.pipe(
    groupedLogs,
    R.flatMap(([_, v]) => v.flatMap(([_, vv]) => vv)),
    R.sort((a, b) => parseAndCompare(a.date, b.date))
  );
}

export function amountDaysTrained(logs: ExerciseLogDto[]): number {
  const result = R.pipe(
    logs,
    R.map(x => x.date),
    R.unique()
  );

  return result.length;
}

export function getPersonalRecord(rows: ExerciseRow[], exerciseName: string, username: string): ExerciseRow | null {
  const result = R.pipe(
    rows,
    R.filter(x => x.username === username && x.exercise.name === exerciseName),
    R.sort((a, b) => {
      const bestSerieFromA = R.first(R.sort(a.series, sortByWeightAndRepsDesc))!;
      const bestSerieFromB = R.first(R.sort(b.series, sortByWeightAndRepsDesc))!;

      return sortByWeightAndRepsDesc(bestSerieFromA, bestSerieFromB);
    }),
    R.first()
  );

  return result ?? null;
}

function sortByWeightAndRepsDesc(a: Serie, b: Serie): number {
  const differenceWeight = b.weightInKg! - a.weightInKg!;
  const differenceReps = b.reps! - a.reps!;

  return differenceWeight !== 0 ? differenceWeight : differenceReps;
}

export function getSeriesAmountPerMuscleGroupPerWeek(exerciseRows: ExerciseRow[]) {
  return R.pipe(
    exerciseRows,
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
                R.filter(x => !!x.series.at(0)),
                R.sumBy(x => x.series.length)
              )
            )
          )
        )
      )
    )
  );
}

export function getSeriesAmountPerUserPerMuscleGroupPerMonth(exerciseRows: ExerciseRow[]) {
  return R.pipe(
    exerciseRows,
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
                R.filter(x => !!x.series.at(0)),
                R.sumBy(x => x.series.length)
              )
            )
          )
        )
      )
    )
  );
}

export function getSeriesAmountPerUserPerMuscleGroupPerYear(exerciseRows: ExerciseRow[]) {
  return R.pipe(
    exerciseRows,
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
                R.filter(x => !!x.series.at(0)),
                R.sumBy(x => x.series.length)
              )
            )
          )
        )
      )
    )
  );
}

export function groupByWeek(exerciseRows: ExerciseLogDto[]) {
  return R.pipe(
    exerciseRows,
    R.groupBy(x => parseDate(x.date).startOf('isoWeek').format('DD/MM/YYYY')),
    R.mapValues(x => R.sort(R.unique(x.map(y => y.date)), (a, b) => parseAndCompare(a, b) * -1))
  );
}

export function groupByMonth(exerciseRows: ExerciseLogDto[]) {
  return R.pipe(
    exerciseRows,
    R.groupBy(x => parseDate(x.date).startOf('month').format('DD/MM/YYYY')),
    R.mapValues(x => R.sort(R.unique(x.map(y => y.date)), (a, b) => parseAndCompare(a, b) * -1))
  );
}

export function groupByYear(exerciseRows: ExerciseLogDto[]) {
  return R.pipe(
    exerciseRows,
    R.groupBy(x => parseDate(x.date).startOf('year').format('DD/MM/YYYY')),
    R.mapValues(x => R.sort(R.unique(x.map(y => y.date)), (a, b) => parseAndCompare(a, b) * -1))
  );
}
