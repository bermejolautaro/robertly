using System.Threading.Tasks;
using robertly.Helpers;
using Dapper;
using System.Linq;

namespace robertly.Repositories;

public class GenericRepository
{
  private readonly ConnectionHelper _connection;
  private readonly SchemaHelper _schema;

  public GenericRepository(ConnectionHelper connection, SchemaHelper schema) => (_connection, _schema) = (connection, schema);

  public async Task<int> CreateAsync<T>(T entity)
  {
    using var connection = _connection.Create();
    var query = _schema.AddSchemaToQuery(GetInsertQuery<T>());
    var parameters = CreateParameters(entity);

    return await connection.ExecuteScalarAsync<int>(query, parameters);
  }

  public async Task<T?> GetByIdAsync<T>(int entityId)
  {
    using var connection = _connection.Create();
    var query = _schema.AddSchemaToQuery(GetSelectQuery<T>());
    var parameters = new DynamicParameters();
    parameters.Add($"{typeof(T).Name}Id", entityId);

    return await connection.QuerySingleOrDefaultAsync<T>(query, parameters);
  }

  public async Task<bool> UpdateAsync<T>(T entity)
  {
    using var connection = _connection.Create();
    var query = _schema.AddSchemaToQuery(GetUpdateQuery<T>());
    var parameters = CreateParameters(entity);
    return await connection.ExecuteAsync(query, parameters) > 0;
  }

  private static string GetInsertQuery<T>(string tableName = "")
  {
    if (string.IsNullOrEmpty(tableName))
    {
      tableName = GetTableName<T>();
    }

    var properties = typeof(T).GetProperties().Where(x => x.Name != $"{typeof(T).Name}Id");
    var columns = string.Join(",\n", properties.Select(x => x.Name));
    var parameters = string.Join(",\n", properties.Select(x => $"@{x.Name}"));

    var query =
      $"""
      INSERT INTO {tableName}
        ({columns})
      VALUES
        ({parameters})
      RETURNING {tableName}.{typeof(T).Name}Id;
      """;

    return query;
  }

  private static string GetUpdateQuery<T>(string tableName = "")
  {
    if (string.IsNullOrEmpty(tableName))
    {
      tableName = GetTableName<T>();
    }

    var properties = typeof(T).GetProperties().Where(x => x.Name != $"{typeof(T).Name}Id");
    var setClause = string.Join(",\n", properties.Select(x => $"{x.Name} = @{x.Name}"));

    var query =
      $"""
      UPDATE {tableName} SET
      {setClause}
      WHERE {typeof(T).Name}Id = @{typeof(T).Name}Id
      """;

    return query;
  }

  private static string GetSelectQuery<T>(string tableName = "")
  {
    if (string.IsNullOrEmpty(tableName))
    {
      tableName = GetTableName<T>();
    }

    var query =
    $"""
    SELECT *
    FROM {tableName}
    WHERE {typeof(T).Name}Id = @{typeof(T).Name}Id
    """;

    return query;
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
}