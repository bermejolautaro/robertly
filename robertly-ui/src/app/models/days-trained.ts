export interface DaysTrainedRow {
  year: number;
  month: number;
  week: number;
  daysTrained: number;
}

export interface DaysTrained {
  daysTrainedWeekly: DaysTrainedRow[];
  daysTrainedMonthly: DaysTrainedRow[];
  daysTrainedYearly: DaysTrainedRow[];
}

