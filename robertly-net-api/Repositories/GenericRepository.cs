using System.Threading.Tasks;
using robertly.Helpers;
using Dapper;
using System.Linq;

public class GenericRepository
{
  private readonly ConnectionHelper _connection;

  public GenericRepository(ConnectionHelper connection) => (_connection) = (connection);

  public async Task<int> CreateAsync<T>(T entity)
  {
    using var connection = _connection.Create();
    var query = GetInsertQuery<T>();
    var parameters = CreateParameters(entity);

    return await connection.ExecuteScalarAsync<int>(query, parameters);
  }

  private static string GetInsertQuery<T>(string tableName = "")
  {
    if (string.IsNullOrEmpty(tableName))
    {
      tableName = GetTableName<T>();
    }

    var properties = typeof(T).GetProperties().Where(x => x.Name != $"{typeof(T).Name}Id");
    var columns = string.Join(",\n", properties.Select(x => x.Name));
    var parameters = string.Join(",\n", properties.Select(x => $"@{x}"));

    var query = $"""
    INSERT INTO {tableName}
      ({columns})
    VALUES
      ({parameters})
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

    var query = $"""
    UPDATE {tableName} SET
    {setClause}
    WHERE {typeof(T).Name}Id = @{typeof(T).Name}Id
    """;

    return query;
  }

  private static string GetSelectQuery<T>(string tableName = "")
  {
    if (!string.IsNullOrEmpty(tableName))
    {
      tableName = GetTableName<T>();
    }

    var query = $"""
    SELECT * FROM {tableName} WHERE {typeof(T).Name}Id = @{typeof(T).Name}Id
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