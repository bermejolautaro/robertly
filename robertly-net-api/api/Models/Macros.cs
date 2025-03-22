namespace robertly.Models;

public record Macros
{
  public decimal? CaloriesInDate { get; set; }
  public decimal? ProteinInDate { get; set; }
  public decimal? CaloriesInWeek { get; set; }
  public decimal? ProteinInWeek { get; set; }
  public decimal? CaloriesInMonth { get; set; }
  public decimal? ProteinInMonth { get; set; }
  public decimal? CaloriesInYear { get; set; }
  public decimal? ProteinInYear { get; set; }
}