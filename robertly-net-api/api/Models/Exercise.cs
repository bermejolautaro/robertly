using System.Collections.Generic;

namespace robertly.Models;

public record Exercise
{
    public int? ExerciseId { get; init; }
    public string? Name { get; init; }
    public string? MuscleGroup { get; init; }
    public string? Type { get; init; }
}

public record GetExercisesResponse
{
    public IEnumerable<Models.Exercise> Data { get; init;} = [];
};