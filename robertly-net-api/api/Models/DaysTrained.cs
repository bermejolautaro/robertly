using System;
using System.Collections.Generic;

namespace robertly.Models;

public record DaysTrained
{
  public required int DaysTrainedThisWeek { get; init; } = 0;
  public required int DaysTrainedThisMonth { get; init; } = 0;
  public required int DaysTrainedThisYear { get; init; } = 0;
}

public record DaysTrainedRow
{
  public required int? Year { get; init; }
  public required int? Month { get; init; }
  public required int? Week { get; init; }
  public required int? DaysTrained { get; init; }
}

public record DaysTrained2
{
  public required IEnumerable<DaysTrainedRow> DaysTrainedWeekly { get; init; } = [];
  public required IEnumerable<DaysTrainedRow> DaysTrainedMonthly { get; init; } = [];
  public required IEnumerable<DaysTrainedRow> DaysTrainedYearly { get; init; } = [];
}