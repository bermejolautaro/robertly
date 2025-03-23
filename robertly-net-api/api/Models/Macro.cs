using System;

namespace robertly.Models;

public record Macro
{
  public DateTime? Date { get; set; }
  public decimal? Calories { get; set; }
  public decimal? Protein { get; set; }
}