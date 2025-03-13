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
    private readonly string _schema;
    private readonly HashSet<string> _tables = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
    private readonly ConnectionHelper _connection;
    private readonly ILogger<SchemaHelper> _logger;

    public SchemaHelper(IOptions<ConfigurationOptions> config, ConnectionHelper connection, ILogger<SchemaHelper> logger) =>
        (_schema, _connection, _logger) = (config.Value.DatabaseEnvironment ?? throw new ArgumentException($"{nameof(ConfigurationOptions.DatabaseEnvironment)} is not set"), connection, logger);

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

            var tables = await connection.QueryAsync<string>(query, new { Schema = _schema });
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
            return _tables.Contains(word) ? $"{_schema}.{word}" : word;
        }, RegexOptions.IgnoreCase);

        return Regex.Replace(query, @"\bCREATE\s+TABLE\s+(?:\w+\.)?(\w+)\b", match =>
        {
            return $"CREATE TABLE {_schema}.{match.Groups[1].Value}";
        }, RegexOptions.IgnoreCase);
    }
}