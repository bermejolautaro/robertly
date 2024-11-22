namespace robertly.Models;

public record DaysTrained
{
  public required int DaysTrainedThisWeek { get; init; } = 0;
  public required int DaysTrainedThisMonth { get; init; } = 0;
  public required int DaysTrainedThisYear { get; init; } = 0;
}