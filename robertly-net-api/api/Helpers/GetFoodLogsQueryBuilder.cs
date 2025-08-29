using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using robertly.Models;

namespace robertly.Helpers;

public class GetFoodLogsQueryBuilder
{
  private int _index = 0;
  private readonly List<string> _filters = [];
  private readonly Dictionary<string, object> _params = [];
  private readonly List<string> _orderBy = [];

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
    """;

  private readonly string _baseQueryCount =
    """
    SELECT COUNT(DISTINCT FL.FoodLogId)
    FROM FoodLogs FL
    INNER JOIN Foods F ON FL.FoodId = F.FoodId
    INNER JOIN Users U ON FL.UserId = U.UserId
    """;

  public GetFoodLogsQueryBuilder() { }

  public GetFoodLogsQueryBuilder AndFoodLogId(int foodLogId)
  {
    var param = $"@FoodLogId_{UseIndex()}";
    _filters.Add($"FL.FoodlogId = {param}");
    _params.Add(param, foodLogId);

    return this;
  }

  public GetFoodLogsQueryBuilder AndUserIds(List<int> userIds)
  {
    if (userIds.IsNullOrEmpty())
    {
      return this;
    }

    List<(string Param, int Value)> paramsWithValue = userIds.Select(x => ($"UserId_{UseIndex()}", x)).ToList();
    var parameters = string.Join(", ", paramsWithValue.Select(x => $"@{x.Param}"));
    _filters.Add($"U.UserId IN ({parameters})");

    foreach (var (param, value) in paramsWithValue)
    {
      _params.Add(param, value);
    }

    return this;
  }

  public GetFoodLogsQueryBuilder AndLastUpdatedByUserId(List<int> userIds)
  {
    if (userIds.IsNullOrEmpty())
    {
      return this;
    }

    List<(string Param, int Value)> paramsWithValue = userIds.Select(x => ($"LastUpdatedByUserId_{UseIndex()}", x)).ToList();
    var sqlParams = string.Join(", ", paramsWithValue.Select(x => $"@{x.Param}"));
    _filters.Add($"FL.LastUpdatedByUserId IN ({sqlParams})");

    foreach (var (param, value) in paramsWithValue)
    {
      _params.Add(param, value);
    }

    return this;
  }

  public GetFoodLogsQueryBuilder AndDate(List<DateTime> dates)
  {
    if (dates.IsNullOrEmpty())
    {
      return this;
    }

    List<(string Param, DateTime Value)> paramsWithValue = dates.Select(x => ($"Date_{UseIndex()}", x)).ToList();
    var sqlParams = string.Join(", ", paramsWithValue.Select(x => $"@{x.Param}"));
    _filters.Add($"FL.Date IN ({sqlParams})");

    foreach (var (param, value) in paramsWithValue)
    {
      _params.Add(param, value);
    }

    return this;
  }

  public GetFoodLogsQueryBuilder AndDate(DateTime date, string comparisonOperator = "=")
  {
    var param = $"@Date_{UseIndex()}";
    _filters.Add($"FL.Date {comparisonOperator} {param}");
    _params.Add(param, date);

    return this;
  }

  public GetFoodLogsQueryBuilder OrderByDate(Direction direction)
  {
    _orderBy.Add($"FL.Date {ParseDirection(direction)}");
    return this;
  }

  public GetFoodLogsQueryBuilder OrderByLastUpdatedAtUtc(Direction direction)
  {
    _orderBy.Add($"FL.LastUpdatedAtUtc {ParseDirection(direction)}");
    return this;
  }

  public (string query, Dictionary<string, object> parameters) Build(int page, int count)
  {
    var whereClause = _filters.Count switch
    {
      0 => "",
      1 => $"\nWHERE {_filters[0]}",
      _ => $"\nWHERE {_filters[0]}\nAND {string.Join("\nAND ", _filters.Skip(1))}"
    };

    var orderByClause = _orderBy.Count == 0
      ? $"\nORDER BY FL.Date DESC, FL.FoodLogId DESC"
      : $"\nORDER BY {string.Join(", ", _orderBy)}";

    var query = $"{_baseQuery}{whereClause}{orderByClause}\nOFFSET {page * count} LIMIT {count};";

    return (query, _params);
  }

  public (string query, Dictionary<string, object> parameters) BuildCountQuery()
  {
    var whereClause = _filters.Count switch
    {
      0 => "",
      1 => $"\nWHERE {_filters[0]}",
      _ => $"\nWHERE {_filters[0]}\nAND {string.Join("\nAND ", _filters.Skip(1))}"
    };

    var query = $"{_baseQueryCount}{whereClause};";

    return (query, _params);
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