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
  private readonly StringBuilder _sb = new();
  private readonly Dictionary<string, object> _params = [];
  private readonly List<string> orderBy = [];

  private readonly string _baseQuery =
  """
  SELECT DISTINCT
     FL.ExerciseLogId
    ,FL.UserId AS ExerciseLogUserId
    ,FL.ExerciseId AS ExerciseLogExerciseId
    ,FL.Date AS ExerciseLogDate
    ,FL.CreatedByUserId
    ,FL.CreatedAtUtc
    ,FL.LastUpdatedByUserId
    ,FL.LastUpdatedAtUtc
    ,F.ExerciseId
    ,F.Name
    ,F.MuscleGroup
    ,F.Type
    ,U.UserId
    ,U.UserFirebaseUuid
    ,U.Email
    ,U.Name
  FROM FoodLogs FL
  INNER JOIN Foods F ON EL.ExerciseId = E.ExerciseId
  INNER JOIN Users U ON EL.UserId = U.UserId
  WHERE 1 = 1
  %filters%
  %orderBy%
  OFFSET %offset% LIMIT %limit%;
  """;

  public GetFoodLogsQueryBuilder() { }

  public GetFoodLogsQueryBuilder AndFoodLogId(int foodLogId)
  {
    var param = $"@FoodLogId_{UseIndex()}";
    _sb.AppendLine($"AND FL.FoodlogId = {param}");
    _params.Add(param, foodLogId);

    return this;
  }

  public GetFoodLogsQueryBuilder AndUserIds(List<int> userIds)
  {
    List<(string Param, int Value)> paramsWithValue = userIds.Select(x => ($"UserId_{UseIndex()}", x)).ToList();
    var @params = string.Join(", ", paramsWithValue.Select(x => $"@{x.Param}"));
    _sb.AppendLine($"AND U.UserId IN ({@params})");

    foreach (var (param, value) in @paramsWithValue)
    {
      _params.Add(param, value);
    }

    return this;
  }

  public GetFoodLogsQueryBuilder AndLastUpdatedByUserId(List<int> userIds)
  {
    List<(string Param, int Value)> paramsWithValue = userIds.Select(x => ($"LastUpdatedByUserId_{UseIndex()}", x)).ToList();
    var @params = string.Join(", ", paramsWithValue.Select(x => $"@{x.Param}"));
    _sb.AppendLine($"AND FL.LastUpdatedByUserId IN ({@params})");

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
    _sb.AppendLine($"AND FL.Date IN ({@params})");

    foreach (var (param, value) in @paramsWithValue)
    {
      _params.Add(param, value);
    }

    return this;
  }

  public GetFoodLogsQueryBuilder AndDate(DateTime date, string comparisonOperator = "=")
  {
    var param = $"@Date_{UseIndex()}";
    _sb.AppendLine($"AND FL.Date {comparisonOperator} {param}");
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

  public (string query, DynamicParameters parameters) Build()
  {
    var query = _baseQuery
      .Replace("%filters%", _sb.ToString())
      .Replace("%orderBy%", BuildOrderBy());

    return (query, new DynamicParameters(_params));
  }

  public (string Query, IReadOnlyDictionary<string, object> Params) BuildFilters()
  {
    return (_sb.ToString(), _params.AsReadOnly());
  }

  public string BuildOrderBy()
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