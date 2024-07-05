using System;
using System.Collections.Generic;

namespace robertly;

#region Entities
public record Serie(int Reps, decimal WeightInKg);

public record Log(
    string Id,
    string User,
    string? ExerciseId,
    DateTime Date,
    IEnumerable<Serie> Series
);

public record LogV2(
    string Id,
    string? User,
    string? UserId,
    string? ExerciseId,
    DateTime Date,
    IEnumerable<Serie> Series
);

public record LogDb(string User, string? ExerciseId, DateTime Date, IEnumerable<Serie>? Series);

public record LogDbV2(
    string? UserId,
    string? User,
    string? ExerciseId,
    DateTime Date,
    IEnumerable<Serie>? Series
);

#endregion

#region Auth

#region Requests
public record SignInRequest(string Email, string Password);

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

public record User(
    int Id,
    string? UserFirebaseUuid,
    string Email,
    string Name,
    Dictionary<string, string> RelatedUsers
);

public record User2()
{
    public required int UserId { get; init; }
    public required string UserFirebaseUuid { get; init; }
    public required string Email { get; init; }
    public required string Name { get; init; }
}

#endregion
#endregion

#region Technical
public record PaginationRequest(int? Page, int? Count);
#endregion
