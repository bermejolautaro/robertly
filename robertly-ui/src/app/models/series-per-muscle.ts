export interface SeriesPerMuscleRow {
  muscleGroup: string;
  year: number;
  month: number;
  week: number;
  totalSeries: number;
  firstDateInPeriod: string;
  target: number;
}

export interface SeriesPerMuscle {
  seriesPerMuscleWeekly: SeriesPerMuscleRow[];
  seriesPerMuscleMonthly: SeriesPerMuscleRow[];
  seriesPerMuscleYearly: SeriesPerMuscleRow[];
}
