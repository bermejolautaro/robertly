export interface SeriesPerMuscleRow {
  muscleGroup: string | null;
  year: number | null;
  month: number | null;
  week: number | null;
  totalSeries: number | null;
  firstDateInPeriod: string | null;
  targetValue: number | null;
}

export interface SeriesPerMuscle {
  seriesPerMuscleWeekly: SeriesPerMuscleRow[];
  seriesPerMuscleMonthly: SeriesPerMuscleRow[];
  seriesPerMuscleYearly: SeriesPerMuscleRow[];
}
