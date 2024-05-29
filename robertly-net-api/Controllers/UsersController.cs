using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.Threading.Tasks;

namespace robertly.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController
{
    private readonly IConfiguration _config;
    private readonly string _schema;

    public UsersController(IConfiguration config) 
    {
        _config = config;
        _schema = config["DatabaseEnvironment"] ?? throw new ArgumentException("DatabaseEnvironment is null");
    }

    [HttpGet("firebase-uuid/{firebaseUuid}")]
    public async Task<User2?> GetUserByFirebaseUuidAsync(string firebaseUuid)
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

        var user = await connection.QuerySingleOrDefaultAsync<User2>(query, new
        {
            FirebaseUuid = firebaseUuid
        });

        return user;
    }
}
