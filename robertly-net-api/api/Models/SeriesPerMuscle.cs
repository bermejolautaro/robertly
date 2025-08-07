using System;
using System.Collections.Generic;

namespace robertly.Models;

public record SeriesPerMuscleRow
{
  public required string MuscleGroup { get; init; }
  public required int Year { get; init; }
  public required int Month { get; init; }
  public required int Week { get; init; }
  public required int TotalSeries { get; init; }
  public int TargetValue { get; set; }

}

public record SeriesPerMuscle
{
  public required IEnumerable<SeriesPerMuscleRow> SeriesPerMuscleWeekly { get; init; } = [];
  public required IEnumerable<SeriesPerMuscleRow> SeriesPerMuscleMonthly { get; init; } = [];
  public required IEnumerable<SeriesPerMuscleRow> SeriesPerMuscleYearly { get; init; } = [];
}