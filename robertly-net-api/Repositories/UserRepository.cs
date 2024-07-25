using System;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;

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
                 UserId
                ,UserFirebaseUuid
                ,Email
                ,Name
            FROM {_schema}.Users
            WHERE UserFirebaseUuid = @FirebaseUuid
            """;

    var user = await connection.QuerySingleOrDefaultAsync<User>(query, new
    {
      FirebaseUuid = firebaseUuid
    });

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
