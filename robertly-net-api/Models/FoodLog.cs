using System;

namespace robertly.Models;

public record FoodLog
{
  public int? FoodLogId { get; init; }
  public int? FoodId { get; init; }
  public int? UserId { get; init; }
  public DateTime? Date { get; init; }
  public DateTime? CreatedAtUtc { get; init; }
  public int? CreatedByUserId { get; init; }
  public DateTime? LastUpdatedAtUtc { get; init; }
  public int? LastUpdatedByUserId { get; init; }
}