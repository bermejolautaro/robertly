using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using robertly.Helpers;

public class SchemaHelper
{
  private readonly string _schema;
  private readonly HashSet<string> _tables = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
  private readonly ConnectionHelper _connection;

  public SchemaHelper(IConfiguration config, ConnectionHelper connection) =>
      (_schema, _connection) = (config["DatabaseEnvironment"] ?? throw new ArgumentException("DatabaseEnvironment is null"), connection);

  public async Task LoadTableNamesAsync()
  {
    var connection = _connection.Create();

    var query = $"""
    SELECT TABLE_NAME
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = @Schema
    AND TABLE_TYPE = 'BASE TABLE';
    """;

    var tables = await connection.QueryAsync<string>(query, new { Schema = _schema });
    _tables.Clear();
    _tables.UnionWith(tables);
  }

  public string AddSchemaToQuery(string query)
  {
    return Regex.Replace(query, @"\b([a-zA-Z_][a-zA-Z0-9_]*)\b", match =>
    {
      var word = match.Value;
      return _tables.Contains(word) ? $"{_schema}.{word}" : word;
    }, RegexOptions.IgnoreCase);
  }
}