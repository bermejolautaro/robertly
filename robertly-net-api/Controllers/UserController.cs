using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.Threading.Tasks;

namespace robertly.Controllers;

[ApiController]
[Route("api/users")]
public class UserController
{
    private readonly IConfiguration _config;
    private readonly string _schema;

    public UserController(IConfiguration config)
    {
        _config = config;
        _schema = config["DatabaseEnvironment"] ?? throw new ArgumentException("DatabaseEnvironment is null");
    }

    [HttpGet("firebase-uuid/{firebaseUuid}")]
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
}
