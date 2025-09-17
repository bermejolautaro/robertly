using System;

namespace robertly.DataModels;

public record ExerciseLog : IDataModel
{
  public required int? ExerciseLogId { get; init; }
  public required int UserId { get; init; }
  public required int ExerciseId { get; init; }
  public required DateTime Date { get; init; }
  public required int CreatedByUserId { get; init; }
  public required DateTime CreatedAtUtc { get; init; }
  public required int LastUpdatedByUserId { get; init; }
  public required DateTime LastUpdatedAtUtc { get; init; }
}
