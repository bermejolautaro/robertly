using System;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace robertly.Repositories;

public class AppLogsRepository
{
    private readonly IConfiguration _config;
    private readonly string _schema;

    public AppLogsRepository(IConfiguration config)
    {
        _config = config;
        _schema =
            config["DatabaseEnvironment"]
            ?? throw new ArgumentException("DatabaseEnvironment is null");
    }

    public async Task LogError(string error, Exception e)
    {
        using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);

        var query = $"""
             INSERT INTO {_schema}.AppLogs (Message, TimeStamp, Exception, StackTrace) VALUES
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
