export interface DaysTrainedRow {
  year: number;
  month: number;
  week: number;
  date: string;
  daysTrained: number;
}

export interface DaysTrained {
  daysTrainedYearly: DaysTrainedRow[];
  daysTrainedMonthly: DaysTrainedRow[];
  daysTrainedWeekly: DaysTrainedRow[];
  daysTrained: DaysTrainedRow[];
}

