using System.Linq;
using System.Threading.Tasks;
using Dapper;
using robertly.DataModels;
using robertly.Helpers;
using robertly.Models;

namespace robertly.Repositories;

public class UserRepository
{
  private readonly ConnectionHelper _connection;
  private readonly SchemaHelper _schema;

  public UserRepository(ConnectionHelper connection, SchemaHelper schema)
  {
    _connection = connection;
    _schema = schema;
  }

  public async Task<Models.User?> GetUserByFirebaseUuidAsync(string firebaseUuid)
  {

    using var connection = _connection.Create();
    var query =
      $"""
      SELECT
         U.UserId
        ,U.UserFirebaseUuid
        ,U.Email
        ,U.Name
      FROM Users U
      WHERE UserFirebaseUuid = @FirebaseUuid
      """;

    var user = await connection.QuerySingleOrDefaultAsync<DataModels.User>(
      _schema.AddSchemaToQuery(query),
      new { FirebaseUuid = firebaseUuid });

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
      FROM AssignedUsers AU
      INNER JOIN Users U ON AU.AssignedUserId = U.UserId
      WHERE AU.OwnerUserId = @UserId
      """;

    var assignedUsers = await connection.QueryAsync<DataModels.User>(
      _schema.AddSchemaToQuery(queryAssignedUsers),
      new { UserId = user.UserId });

    var userModel = user.Map<Models.User>();

    if (userModel is null) {
      return null;
    }

    userModel.AssignedUsers = assignedUsers.Select(x => x.Map<Models.User>());

    return userModel;
  }

  public async Task<int> CreateUserAsync(Models.User user)
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
