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
using robertly.Repositories;

namespace robertly.Helpers;

public class MigrationHelper
{
  private readonly string _migrationsFolder = "./Scripts";
  private readonly SchemaHelper _schema;
  private readonly ConnectionHelper _connection;
  private readonly GenericRepository _genericRepository;
  private readonly ILogger<MigrationHelper> _logger;

  public MigrationHelper(GenericRepository genericRepository, SchemaHelper schema, ConnectionHelper connection, ILogger<MigrationHelper> logger) =>
      (_genericRepository, _schema, _connection, _logger) = (genericRepository, schema, connection, logger);

  public async Task ApplyMigrations()
  {
    try
    {
      using var connection = _connection.Create();

      var appliedMigrations = await _genericRepository.GetAll<DataModels.Migration>();

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

        var sql = await File.ReadAllTextAsync(script);
        sql = _schema.AddSchemaToQuery(sql);

        await connection.ExecuteAsync(sql);

        await _genericRepository.CreateAsync<DataModels.Migration>(new DataModels.Migration { Slug = slug, AppliedAtUtc = DateTime.UtcNow });
      }
    }
    catch (Exception e)
    {
      _logger.LogError(e, "Error applying migrations");
      throw;
    }
  }
}