using System;

namespace robertly.DataModels;

public record ExerciseLog : IDataModel
{
  public int? ExerciseLogId { get; init; }
  public int UserId { get; init; }
  public int ExerciseId { get; init; }
  public DateTime Date { get; init; }
  public int CreatedByUserId { get; init; }
  public DateTime CreatedAtUtc { get; init; }
  public int LastUpdatedByUserId { get; init; }
  public DateTime LastUpdatedAtUtc { get; init; }
}
