using System;

namespace robertly.Models;

public record FoodLog
{
  public int? FoodLogId { get; init; }
  public Food? Food { get; init; }
  public User? User { get; init; }
  public DateTime? Date { get; init; }
  public DateTime? CreatedAtUtc { get; init; }
  public int? CreatedByUserId { get; init; }
  public DateTime? LastUpdatedAtUtc { get; init; }
  public int? LastUpdatedByUserId { get; init; }
}