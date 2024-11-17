using System.Collections.Generic;

namespace robertly.Models;

public record Filter
{
  public required IEnumerable<string> Types { get; init; } = [];
  public required IEnumerable<decimal> Weights { get; init; } = [];
  public required IEnumerable<int> ExercisesIds { get; init; } = [];
}