using System;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using robertly.Models;

namespace robertly.Repositories;

public class UserRepository
{
  private readonly IConfiguration _config;
  private readonly string _schema;

  public UserRepository(IConfiguration config)
  {
    _config = config;
    _schema = config["DatabaseEnvironment"] ?? throw new ArgumentException("DatabaseEnvironment is null");
  }

  public async Task<User?> GetUserByFirebaseUuidAsync(string firebaseUuid)
  {

    using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);
    var query =
      $"""
      SELECT
         U.UserId
        ,U.UserFirebaseUuid
        ,U.Email
        ,U.Name
      FROM {_schema}.Users U
      WHERE UserFirebaseUuid = @FirebaseUuid
      """;

    var user = await connection.QuerySingleOrDefaultAsync<User>(query, new
    {
      FirebaseUuid = firebaseUuid
    });

    if (user is null) {
      return null;
    }

    var queryAssignedUsers =
      $"""
      SELECT
         U.UserId
        ,U.UserFirebaseUuid
        ,U.Email
        ,U.Name
      FROM {_schema}.AssignedUsers AU
      INNER JOIN {_schema}.Users U ON AU.AssignedUserId = U.UserId
      WHERE AU.OwnerUserId = @UserId
      """;

    var assignedUsers = await connection.QueryAsync<User>(queryAssignedUsers, new { UserId = user?.UserId });

    user!.AssignedUsers = assignedUsers;

    return user;
  }

  public async Task<int> CreateUserAsync(User user)
  {

    using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);

    var query =
        $"""
        INSERT INTO {_schema}.Users (UserFirebaseUuid, Email, Name)
        VALUES (@UserFirebaseUuid, @Email, @Name)
        RETURNING Users.UserId
        """;

    var userId = await connection.QuerySingleAsync<int>(
        query,
        new
        {
          user.UserFirebaseUuid,
          user.Email,
          user.Name,
        }
    );

    return userId;
  }
}
