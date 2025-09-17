using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using robertly.Models;

namespace robertly.Helpers;

public class SchemaHelper
{
  public string Schema { get; }
  private readonly HashSet<string> _tables = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
  private readonly ConnectionHelper _connection;
  private readonly ILogger<SchemaHelper> _logger;

  public SchemaHelper(IOptions<ConfigurationOptions> config, ConnectionHelper connection, ILogger<SchemaHelper> logger)
  {
    _connection = connection;
    _logger = logger;
    Schema = config.Value.DatabaseEnvironment ?? throw new ArgumentException($"{nameof(ConfigurationOptions.DatabaseEnvironment)} is not set");
  }

  public async Task LoadTableNamesAsync()
  {
    try
    {
      var connection = _connection.Create();

      var query =
          $"""
          SELECT TABLE_NAME
          FROM INFORMATION_SCHEMA.TABLES
          WHERE TABLE_SCHEMA = @Schema
          AND TABLE_TYPE = 'BASE TABLE';
          """;

      var tables = await connection.QueryAsync<string>(query, new { Schema = Schema });
      _tables.Clear();
      _tables.UnionWith(tables);
    }
    catch (Exception e)
    {
      _logger.LogError(e, "Error loading table names");
    }
  }

  public string AddSchemaToQuery(string query)
  {
    query = Regex.Replace(query, @"\b([a-zA-Z_][a-zA-Z0-9_]*)\b", match =>
    {
      var word = match.Value;
      return _tables.Contains(word) ? $"{Schema}.{word}" : word;
    }, RegexOptions.IgnoreCase);

    return Regex.Replace(query, @"\bCREATE\s+TABLE\s+(IF\s+NOT\s+EXISTS\s+)?(?:\w+\.)?(\w+)\b", match =>
    {
      var ifNotExists = match.Groups[1].Value;
      var tableName = match.Groups[2].Value;

      return $"CREATE TABLE {ifNotExists} {Schema}.{tableName}";
    }, RegexOptions.IgnoreCase);
  }
}