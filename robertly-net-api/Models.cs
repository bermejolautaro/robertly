﻿using System;
using System.Collections.Generic;

namespace robertly;

#region Logs

#region Entities
public record Serie(int Reps, float WeightInKg);
public record ExcelLog(string Type, string Name, string Date, int? Serie, float? WeightKg, int? Reps, string User);
public record Log(string Id, string User, string? ExerciseId, DateTime Date, IEnumerable<Serie> Series);
public record LogV2(string Id, string? User, string? UserId, string? ExerciseId, DateTime Date, IEnumerable<Serie> Series);

public record LogDb(string User, string? ExerciseId, DateTime Date, IEnumerable<Serie>? Series);
public record LogDbV2(string? UserId, string? User, string? ExerciseId, DateTime Date, IEnumerable<Serie>? Series);

public record LogDto(string Id, string User, Exercise? Exercise, DateTime Date, IEnumerable<Serie>? Series);
public record LogDtoV2(string Id, string? User, string? UserId, Exercise? Exercise, DateTime Date, IEnumerable<Serie>? Series);


#endregion

#region Responses
public record GetLogsResponse(IEnumerable<LogDto> Data);
public record GetLogsResponseV2(IEnumerable<LogDtoV2> Data);


#endregion

#region Requests
public record PostPutLogRequest()
{
    public required string User { get; set; }
    public string? UserId { get; set; }
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
public record PostPutExerciseRequest()
{
    public required string Name { get; set; }
    public required string MuscleGroup { get; set; }
    public required string Type{ get; set; }
};
#endregion

#endregion

#region Auth

#region Requests
public record SignInRequest()
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public record SignUpRequest()
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string DisplayName { get; set; }
}


public record SignUpGoogleRequest()
{
    public required string AccessToken { get; set; }
}
#endregion

#endregion

#region Users
#region Entities
public record UserDb(string Uid, string Email, string DisplayName);
public record User(string Id, string Uid, string Email, string DisplayName, Dictionary<string, string> RelatedUsers);

#endregion
#endregion
