using System;

namespace robertly.DataQueries;

public record Macro
{
  public DateTime? Date { get; set; }
  public decimal? Calories { get; set; }
  public decimal? Protein { get; set; }
}