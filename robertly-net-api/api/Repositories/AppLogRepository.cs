using System;
using System.Threading.Tasks;
using Dapper;
using robertly.Helpers;

namespace robertly.Repositories;

public class AppLogsRepository
{
  private readonly ConnectionHelper _connection;

  public AppLogsRepository(ConnectionHelper connection) => (_connection) = (connection);

  public async Task LogError(string error, Exception e)
  {
    using var connection = _connection.Create();

    var query =
        $"""
        INSERT INTO {_connection.Schema}.AppLogs (Message, TimeStamp, Exception, StackTrace) VALUES
        (@Message, @TimeStamp, @Exception, @StackTrace);
        """;

    await connection.ExecuteAsync(
        query,
        new
        {
          Message = error,
          TimeStamp = DateTime.Now.ToUniversalTime(),
          Exception = e.Message,
          e.StackTrace
        }
    );
  }
}
