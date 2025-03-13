namespace robertly.DataModels;

public record Serie : IDataModel
{
  public int? SerieId { get; init; }
  public int ExerciseLogId { get; init; }
  public int Reps { get; init; }
  public decimal WeightInKg { get; init; }
}