using System.Threading.Tasks;
using Dapper;
using robertly.Helpers;
using robertly.Models;

namespace robertly.Repositories;

public class UserRepository
{
  private readonly ConnectionHelper _connection;

  public UserRepository(ConnectionHelper connection) => (_connection) = (connection);

  public async Task<User?> GetUserByFirebaseUuidAsync(string firebaseUuid)
  {

    using var connection = _connection.Create();
    var query =
      $"""
      SELECT
         U.UserId
        ,U.UserFirebaseUuid
        ,U.Email
        ,U.Name
      FROM {_connection.Schema}.Users U
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
      FROM {_connection.Schema}.AssignedUsers AU
      INNER JOIN {_connection.Schema}.Users U ON AU.AssignedUserId = U.UserId
      WHERE AU.OwnerUserId = @UserId
      """;

    var assignedUsers = await connection.QueryAsync<User>(queryAssignedUsers, new { UserId = user?.UserId });

    user!.AssignedUsers = assignedUsers;

    return user;
  }

  public async Task<int> CreateUserAsync(User user)
  {

    using var connection = _connection.Create();

    var query =
        $"""
        INSERT INTO {_connection.Schema}.Users (UserFirebaseUuid, Email, Name)
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
