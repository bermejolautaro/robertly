using robertly.DataModels;

namespace robertly.DataModels;

public record Exercise : IDataModel
{
  public int? ExerciseId { get; init; }
  public string? Name { get; init; }
  public string? MuscleGroup { get; init; }
  public string? Type { get; init; }
}