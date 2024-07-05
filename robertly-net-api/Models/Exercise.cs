using System.Collections.Generic;

namespace robertly.Models;

public record Exercise()
{
    public int? ExerciseId { get; init; }
    public required string? Name { get; init; }
    public required string? MuscleGroup { get; init; }
    public required string? Type { get; init; }

}

public record GetExercisesResponse()
{
    public required IEnumerable<Exercise> Data { get; init;}
};