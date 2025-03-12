using System;

namespace robertly.DataModels;

public record Migration : IDataModel
{
  public int MigrationId { get; set; }
  public string? Slug { get; set; }
  public DateTime? AppliedAtUtc { get; set; }
}