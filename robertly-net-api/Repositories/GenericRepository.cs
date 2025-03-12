using System.Threading.Tasks;
using robertly.Helpers;
using Dapper;
using System.Linq;
using System.Collections.Generic;
using robertly.DataModels;

namespace robertly.Repositories;

public class GenericRepository
{
  private readonly ConnectionHelper _connection;
  private readonly SchemaHelper _schema;

  public GenericRepository(ConnectionHelper connection, SchemaHelper schema) => (_connection, _schema) = (connection, schema);

  public async Task<IEnumerable<T>> GetAll<T>(string tableName = "") where T : IDataModel
  {
    using var connection = _connection.Create();

    if (string.IsNullOrEmpty(tableName))
    {
      tableName = GetTableName<T>();
    }

    var query = $"""SELECT * FROM {tableName}""";

    query = _schema.AddSchemaToQuery(query);
    var parameters = new DynamicParameters();

    return await connection.QueryAsync<T>(query, parameters);
  }

  public async Task<T?> GetByIdAsync<T>(int entityId, string tableName = "") where T : IDataModel
  {
    using var connection = _connection.Create();

    if (string.IsNullOrEmpty(tableName))
    {
      tableName = GetTableName<T>();
    }

    var query =
      $"""
      SELECT *
      FROM {tableName}
      WHERE {GetTablePrimaryKey<T>()} = {GetTablePrimaryKey<T>()}
      """;

    query = _schema.AddSchemaToQuery(query);
    var parameters = new DynamicParameters();
    parameters.Add(GetTablePrimaryKey<T>(), entityId);

    return await connection.QuerySingleOrDefaultAsync<T>(query, parameters);
  }

  public async Task<int> CreateAsync<T>(T entity, string tableName = "") where T : IDataModel
  {
    using var connection = _connection.Create();

    if (string.IsNullOrEmpty(tableName))
    {
      tableName = GetTableName<T>();
    }

    var properties = typeof(T).GetProperties().Where(x => x.Name != GetTablePrimaryKey<T>());
    var columns = string.Join(",\n", properties.Select(x => $"{x.Name}"));
    var parametersString = string.Join(",\n", properties.Select(x => $"@{x.Name}"));

    var query =
      $"""
      INSERT INTO {tableName}
        ({columns})
      VALUES
        ({parametersString})
      RETURNING {GetTablePrimaryKey<T>()};
      """;

    query = _schema.AddSchemaToQuery(query);
    var parameters = CreateParameters(entity);

    return await connection.ExecuteScalarAsync<int>(query, parameters);
  }

  public async Task<bool> UpdateAsync<T>(T entity, string tableName = "") where T : IDataModel
  {
    using var connection = _connection.Create();

    if (string.IsNullOrEmpty(tableName))
    {
      tableName = GetTableName<T>();
    }

    var properties = typeof(T).GetProperties().Where(x => x.Name != GetTablePrimaryKey<T>());
    var setClause = string.Join(",\n", properties.Select(x => $"{x.Name} = @{x.Name}"));

    var query =
      $"""
      UPDATE {tableName} SET
      {setClause}
      WHERE {GetTablePrimaryKey<T>()} = @{GetTablePrimaryKey<T>()}
      """;

    query = _schema.AddSchemaToQuery(query);
    var parameters = CreateParameters(entity);
    return await connection.ExecuteAsync(query, parameters) > 0;
  }

  public async Task<bool> DeleteAsync<T>(int entityId, string tableName = "") where T : IDataModel
  {
    using var connection = _connection.Create();

    if (string.IsNullOrEmpty(tableName))
    {
      tableName = GetTableName<T>();
    }

    var query =
      $"""
      DELETE FROM {tableName} WHERE {GetTablePrimaryKey<T>()} = @{GetTablePrimaryKey<T>()}
      """;

    query = _schema.AddSchemaToQuery(query);
    var parameters = new DynamicParameters();
    parameters.Add(GetTablePrimaryKey<T>(), entityId);

    return await connection.ExecuteAsync(query, parameters) > 0;
  }

  private static DynamicParameters CreateParameters<T>(T entity)
  {
    var parameters = new DynamicParameters();

    foreach (var prop in typeof(T).GetProperties())
    {
      parameters.Add($"@{prop.Name}", prop.GetValue(entity));
    }

    return parameters;
  }

  private static string GetTableName<T>()
  {
    return $"{typeof(T).Name}s";
  }

  private static string GetTablePrimaryKey<T>()
  {
    return $"{typeof(T).Name}Id";
  }
}