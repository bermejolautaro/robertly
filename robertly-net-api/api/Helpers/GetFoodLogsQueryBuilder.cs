using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Dapper;
using robertly.Models;

namespace robertly.Helpers;

public class GetFoodLogsQueryBuilder
{
  private int _index = 0;
  private readonly StringBuilder _filters = new();
  private readonly Dictionary<string, object> _params = [];
  private readonly List<string> orderBy = [];

  private readonly string _baseQuery =
    """
    SELECT DISTINCT
       FL.FoodLogId
      ,FL.FoodId AS FoodLogFoodId
      ,FL.UserId AS FoodLogUserId
      ,FL.Date
      ,FL.Amount
      ,FL.CreatedAtUtc
      ,FL.CreatedByUserId
      ,FL.LastUpdatedAtUtc
      ,FL.LastUpdatedByUserId
      ,F.FoodId
      ,F.Name
      ,F.Calories
      ,F.Protein
      ,F.Fat
      ,F.Unit
      ,F.Amount
      ,U.UserId
      ,U.UserFirebaseUuid
      ,U.Email
      ,U.Name
    FROM FoodLogs FL
    INNER JOIN Foods F ON FL.FoodId = F.FoodId
    INNER JOIN Users U ON FL.UserId = U.UserId
    WHERE 1 = 1
    %filters%
    %orderBy%
    %offset%;
    """;

  private readonly string _baseQueryCount =
    """
    SELECT COUNT(DISTINCT FL.FoodLogId)
    FROM FoodLogs FL
    INNER JOIN Foods F ON FL.FoodId = F.FoodId
    INNER JOIN Users U ON FL.UserId = U.UserId
    WHERE 1 = 1
    %filters%;
    """;

  public GetFoodLogsQueryBuilder() { }

  public GetFoodLogsQueryBuilder AndFoodLogId(int foodLogId)
  {
    var param = $"@FoodLogId_{UseIndex()}";
    _filters.AppendLine($"AND FL.FoodlogId = {param}");
    _params.Add(param, foodLogId);

    return this;
  }

  public GetFoodLogsQueryBuilder AndUserIds(List<int> userIds)
  {
    List<(string Param, int Value)> paramsWithValue = userIds.Select(x => ($"UserId_{UseIndex()}", x)).ToList();
    var parameters = string.Join(", ", paramsWithValue.Select(x => $"@{x.Param}"));
    _filters.AppendLine($"AND U.UserId IN ({parameters})");

    foreach (var (param, value) in paramsWithValue)
    {
      _params.Add(param, value);
    }

    return this;
  }

  public GetFoodLogsQueryBuilder AndLastUpdatedByUserId(List<int> userIds)
  {
    List<(string Param, int Value)> paramsWithValue = userIds.Select(x => ($"LastUpdatedByUserId_{UseIndex()}", x)).ToList();
    var @params = string.Join(", ", paramsWithValue.Select(x => $"@{x.Param}"));
    _filters.AppendLine($"AND FL.LastUpdatedByUserId IN ({@params})");

    foreach (var (param, value) in @paramsWithValue)
    {
      _params.Add(param, value);
    }

    return this;
  }

  public GetFoodLogsQueryBuilder AndDate(List<DateTime> dates)
  {
    List<(string Param, DateTime Value)> paramsWithValue = dates.Select(x => ($"Date_{UseIndex()}", x)).ToList();
    var @params = string.Join(", ", paramsWithValue.Select(x => $"@{x.Param}"));
    _filters.AppendLine($"AND FL.Date IN ({@params})");

    foreach (var (param, value) in @paramsWithValue)
    {
      _params.Add(param, value);
    }

    return this;
  }

  public GetFoodLogsQueryBuilder AndDate(DateTime date, string comparisonOperator = "=")
  {
    var param = $"@Date_{UseIndex()}";
    _filters.AppendLine($"AND FL.Date {comparisonOperator} {param}");
    _params.Add(param, date);

    return this;
  }

  public GetFoodLogsQueryBuilder OrderByDate(Direction direction)
  {
    orderBy.Add($"FL.Date {ParseDirection(direction)}");
    return this;
  }

  public GetFoodLogsQueryBuilder OrderByLastUpdatedAtUtc(Direction direction)
  {
    orderBy.Add($"FL.LastUpdatedAtUtc {ParseDirection(direction)}");
    return this;
  }

  public (string query, DynamicParameters parameters) Build(int page, int count)
  {
    var query = _baseQuery
      .Replace("%filters%", _filters.ToString())
      .Replace("%orderBy%", BuildOrderBy())
      .Replace("%offset%", $"OFFSET {page * count} LIMIT {count}")
      .Split(Environment.NewLine)
      .Where(x => !String.IsNullOrWhiteSpace(x))
      .StringJoin(Environment.NewLine);

    return (query, new DynamicParameters(_params));
  }

  public (string query, DynamicParameters parameters) BuildCountQuery()
  {
    var query = _baseQueryCount
      .Replace("%filters%", _filters.ToString())
      .Split(Environment.NewLine)
      .Where(x => !String.IsNullOrWhiteSpace(x))
      .StringJoin(Environment.NewLine);

    return (query, new DynamicParameters(_params));
  }

  private string BuildOrderBy()
  {
    if (orderBy.Count == 0)
    {
      return $"ORDER BY FL.Date DESC, FL.FoodLogId DESC";
    }

    return $"ORDER BY {string.Join(",", orderBy)}";
  }

  private int UseIndex()
  {
    var previousIndex = _index;
    _index++;
    return previousIndex;
  }

  private static string ParseDirection(Direction direction)
  {
    return direction switch
    {
      Direction.Asc => "ASC",
      Direction.Desc => "DESC",
      _ => throw new ArgumentException("Impossible State"),
    };
  }
}