using System;
using System.Collections.Generic;

namespace robertly;

#region Logs

#region Entities
public record Serie(int Reps, float WeightInKg);
public record ExcelLog(string Type, string Name, string Date, int? Serie, float? WeightKg, int? Reps, string User);
public record Log(string Id, string User, string? ExerciseId, DateTime Date, IEnumerable<Serie> Series);
public record LogDb(string User, string? ExerciseId, DateTime Date, IEnumerable<Serie>? Series);
public record LogDto(string Id, string User, Exercise? Exercise, DateTime Date, IEnumerable<Serie>? Series);

#endregion

#region Responses
public record GetLogsResponse(IEnumerable<LogDto> Data);

#endregion

#region Requests
public record PostPutLogRequest()
{
    public required string User { get; set; }
    public required string ExerciseId { get; set; }
    public required DateTime Date { get; set; }
    public required IEnumerable<Serie> Series { get; set; } = [];
};
#endregion

#endregion

#region Exercises
public record Exercise(string Id, string Name, string MuscleGroup, string Type);
public record ExerciseDb(string Exercise, string MuscleGroup, string Type);

#region Responses
public record GetExercisesResponse(IEnumerable<Exercise> Data);
#endregion

#region Requests
#endregion

#endregion

