using System;

namespace robertly.DataModels;

public record Food : IDataModel
{
  public int? FoodId { get; init; }
  public string? Name { get; init; }
  public decimal? Calories { get; init; }
  public decimal? Protein { get; init; }
  public decimal? Fat { get; init; }
  public string? Unit { get; init; }
  public int? Amount { get; init; }
  public DateTime? CreatedAtUtc { get; init; }
  public int? CreatedByUserId { get; init; }
  public DateTime? LastUpdatedAtUtc { get; init; }
  public int? LastUpdatedByUserId { get; init; }
}