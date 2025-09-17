using System;

namespace robertly.DataModels;

public record FoodLog : IDataModel
{
  public int? FoodLogId { get; init; }
  public int? FoodId { get; init; }
  public int? UserId { get; init; }
  public decimal? Amount { get; init; }
  public DateTime? Date { get; init; }
  public DateTime? CreatedAtUtc { get; init; }
  public int? CreatedByUserId { get; init; }
  public DateTime? LastUpdatedAtUtc { get; init; }
  public int? LastUpdatedByUserId { get; init; }
  public bool? QuickAdd { get; init; }
  public string? Description { get; init; }
  public decimal? Calories { get; init; }
  public decimal? Protein { get; init; }
  public decimal? Fat { get; init; }
}