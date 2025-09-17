using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using robertly.DataModels;
using robertly.Models;
using robertly.Repositories;

namespace robertly.Helpers;

public class MigrationHelper
{
  private readonly string _migrationsFolder = "./Scripts";
  private readonly SchemaHelper _schema;
  private readonly ConnectionHelper _connection;
  private readonly GenericRepository _genericRepository;
  private readonly ILogger<MigrationHelper> _logger;

  public MigrationHelper(
    GenericRepository genericRepository,
    SchemaHelper schema,
    ConnectionHelper connection,
    ILogger<MigrationHelper> logger,
    IOptions<ConfigurationOptions> config)
  {
    _genericRepository = genericRepository;
    _schema = schema;
    _connection = connection;
    _logger = logger;
  }

  public async Task ApplyMigrations()
  {
    try
    {
      using var connection = _connection.Create();

      var createTableQuery =
        $"""
        CREATE SCHEMA IF NOT EXISTS {_schema.Schema};

        CREATE TABLE IF NOT EXISTS {_schema.Schema}.Migrations (
          MigrationId INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
          Slug VARCHAR NOT NULL,
          AppliedAtUtc TIMESTAMP WITHOUT TIME ZONE NOT NULL
        );
        """;

      await connection.ExecuteAsync(createTableQuery);

      var appliedMigrations = await _genericRepository.GetAllAsync<DataModels.Migration>("Migrations", _schema.Schema);

      var scripts = Directory.GetFiles(_migrationsFolder, "*.sql")
        .OrderBy(Path.GetFileName)
        .ToList();

      foreach (var script in scripts)
      {
        var slug = Path.GetFileNameWithoutExtension(script);

        if (appliedMigrations.Any(m => m.Slug == slug))
        {
          continue;
        }

        await _schema.LoadTableNamesAsync();

        var sql = await File.ReadAllTextAsync(script);
        sql = _schema.AddSchemaToQuery(sql);

        _logger.LogInformation("Applying migration \"{Slug}\"...", slug);

        await connection.ExecuteAsync(sql);

        await _genericRepository.CreateAsync<DataModels.Migration>(new DataModels.Migration { Slug = slug, AppliedAtUtc = DateTime.UtcNow });

        _logger.LogInformation("Applied migration \"{Slug}\" successfully!", slug);
      }
    }
    catch (Exception e)
    {
      _logger.LogError(e, "Error applying migrations");
      throw;
    }
  }
}