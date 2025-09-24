using System;

namespace robertly.DataQueries;

public record FoodLog
{
  public required int? FoodLogId { get; init; }
  public required int? FoodId { get; init; }
  public required int? UserId { get; init; }
  public required decimal? Amount { get; init; }
  public required DateTime? Date { get; init; }
  public required DateTime? CreatedAtUtc { get; init; }
  public required int? CreatedByUserId { get; init; }
  public required DateTime? LastUpdatedAtUtc { get; init; }
  public required int? LastUpdatedByUserId { get; init; }
  public required bool? QuickAdd { get; init; }
  public required string? Description { get; init; }
  public required decimal? Calories { get; init; }
  public required decimal? Protein { get; init; }
  public required decimal? Fat { get; init; }
  public required decimal? TotalCalories { get; init; }
  public required decimal? TotalProtein { get; init; }
}