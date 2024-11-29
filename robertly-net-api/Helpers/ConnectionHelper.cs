using System;
using System.Data;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace robertly.Helpers;

public class ConnectionHelper
{
  public string ConnectionString { get; }
  public string Schema { get; }

  public ConnectionHelper(IConfiguration config) => (ConnectionString, Schema) =
    (config["PostgresConnectionString"] ?? throw new ArgumentException("PostgresConnectionString is null"),
     config["DatabaseEnvironment"] ?? throw new ArgumentException("DatabaseEnvironment is null"));

  public IDbConnection Create()
  {
    return new NpgsqlConnection(ConnectionString);
  }
}