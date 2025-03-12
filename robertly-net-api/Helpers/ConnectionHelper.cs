using System;
using System.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Npgsql;
using robertly.Models;

namespace robertly.Helpers;

public class ConnectionHelper
{
  public string ConnectionString { get; }
  public string Schema { get; }

  public ConnectionHelper(IOptions<ConfigurationOptions> config) => (ConnectionString, Schema) =
    (config.Value.PostgresConnectionString ?? throw new ArgumentException($"{nameof(ConfigurationOptions.PostgresConnectionString)} is not set"),
     config.Value.DatabaseEnvironment ?? throw new ArgumentException($"{nameof(ConfigurationOptions.DatabaseEnvironment)} is not set"));

  public IDbConnection Create()
  {
    return new NpgsqlConnection(ConnectionString);
  }
}