using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using robertly.Models;

namespace robertly.Helpers;

public class GetExerciseLogsQueryBuilder
{
  private int _index = 0;
  private readonly Dictionary<string, object> _params = [];
  private readonly List<string> _filters = [];
  private readonly List<string> _orderBy = [];

  private readonly string _baseQuery =
    """
    SELECT DISTINCT
       EL.ExerciseLogId
      ,EL.UserId AS ExerciseLogUserId
      ,EL.ExerciseId AS ExerciseLogExerciseId
      ,EL.Date AS ExerciseLogDate
      ,EL.CreatedByUserId
      ,EL.CreatedAtUtc
      ,EL.LastUpdatedByUserId
      ,EL.LastUpdatedAtUtc
      ,S2.TotalReps
      ,S2.AverageReps
      ,S2.Tonnage
      ,S2.AverageBrzycki
      ,S2.AverageEpley
      ,S2.AverageLander
      ,S2.AverageLombardi
      ,S2.AverageMayhew
      ,S2.AverageOConner
      ,S2.AverageWathan
      ,S2.MaxReps
      ,S2.MinReps
      ,E.ExerciseId
      ,E.Name
      ,E.MuscleGroup
      ,E.Type
      ,U.UserId
      ,U.UserFirebaseUuid
      ,U.Email
      ,U.Name
    FROM ExerciseLogs EL
    INNER JOIN Exercises E ON EL.ExerciseId = E.ExerciseId
    INNER JOIN Users U ON EL.UserId = U.UserId
    LEFT JOIN Series S ON EL.ExerciseLogId = S.ExerciseLogId
    LEFT JOIN (
      SELECT 
         A.ExerciseLogId
        ,MAX(A.Reps)                                                        AS MaxReps
        ,MIN(A.Reps)                                                        AS MinReps
        ,SUM(A.Reps)                                                        AS TotalReps
        ,ROUND(AVG(A.Reps), 0)                                              AS AverageReps
        ,SUM(A.Reps * A.WeightInKg)                                         AS Tonnage
        ,ROUND(AVG(A.WeightInKg * (36.0 / (37.0 - A.Reps))), 2)             AS AverageBrzycki
        ,AVG(A.WeightInKg * (1 + 0.0333 * A.Reps))                          AS AverageEpley
        ,AVG((100 * A.WeightInKg) / (101.3 - 2.67123 * A.Reps))             AS AverageLander
        ,AVG(A.WeightInKg * POWER(ABS(A.Reps), 0.1))                        AS AverageLombardi
        ,AVG((100 * A.WeightInKg) / (52.2 + (41.9 * EXP(-0.055 * A.Reps)))) AS AverageMayhew
        ,AVG(A.WeightInKg * (1 + 0.025 * A.Reps))                           AS AverageOConner
        ,AVG((100 * A.WeightInKg) / (48.8 + (53.8 * EXP(-0.075 * A.Reps)))) AS AverageWathan
        ,STRING_AGG(CAST(A.Reps AS VARCHAR), '-')                           AS RepsString
        ,STRING_AGG(CAST(A.WeightInKg AS VARCHAR), '-')                     AS WeightsString
      FROM Series A
      GROUP BY A.ExerciseLogId
    ) S2 ON EL.ExerciseLogId = S2.ExerciseLogId
    """;

  private readonly string _baseQueryCount =
    """
    SELECT COUNT(DISTINCT EL.ExerciseLogId)
    FROM ExerciseLogs EL
    INNER JOIN Exercises E ON EL.ExerciseId = E.ExerciseId
    INNER JOIN Users U ON EL.UserId = U.UserId
    LEFT JOIN Series S ON EL.ExerciseLogId = S.ExerciseLogId
    """;

  public GetExerciseLogsQueryBuilder() { }

  public GetExerciseLogsQueryBuilder AndExerciseLogId(int exerciseLogId)
  {
    var param = $"@ExerciseLogId_{UseIndex()}";
    _filters.Add($"EL.ExerciseLogId = {param}");
    _params.Add(param, exerciseLogId);

    return this;
  }

  public GetExerciseLogsQueryBuilder AndUserFirebaseUuid(string userFirebaseUuid)
  {
    var param = $"@UserFirebaseUuid_{UseIndex()}";
    _filters.Add($"U.UserFirebaseUuid = {param}");
    _params.Add(param, userFirebaseUuid);

    return this;
  }

  public GetExerciseLogsQueryBuilder AndUserIds(List<int> userIds)
  {
    if (userIds.IsNullOrEmpty())
    {
      return this;
    }

    List<(string Param, int Value)> paramsWithValue = userIds.Select(x => ($"UserId_{UseIndex()}", x)).ToList();
    var @params = string.Join(", ", paramsWithValue.Select(x => $"@{x.Param}"));
    _filters.Add($"U.UserId IN ({@params})");

    foreach (var (param, value) in @paramsWithValue)
    {
      _params.Add(param, value);
    }

    return this;
  }

  public GetExerciseLogsQueryBuilder AndLastUpdatedByUserId(List<int> userIds)
  {
    if (userIds.IsNullOrEmpty())
    {
      return this;
    }

    List<(string Param, int Value)> paramsWithValue = userIds.Select(x => ($"LastUpdatedByUserId_{UseIndex()}", x)).ToList();
    var @params = string.Join(", ", paramsWithValue.Select(x => $"@{x.Param}"));
    _filters.Add($"EL.LastUpdatedByUserId IN ({@params})");

    foreach (var (param, value) in @paramsWithValue)
    {
      _params.Add(param, value);
    }

    return this;
  }

  public GetExerciseLogsQueryBuilder AndDate(List<DateTime> dates)
  {
    if (dates.IsNullOrEmpty())
    {
      return this;
    }
    List<(string Param, DateTime Value)> paramsWithValue = dates.Select(x => ($"Date_{UseIndex()}", x)).ToList();
    var @params = string.Join(", ", paramsWithValue.Select(x => $"@{x.Param}"));
    _filters.Add($"EL.Date IN ({@params})");

    foreach (var (param, value) in @paramsWithValue)
    {
      _params.Add(param, value);
    }

    return this;
  }

  public GetExerciseLogsQueryBuilder AndDate(DateTime date, string comparisonOperator = "=")
  {
    var param = $"@Date_{UseIndex()}";
    _filters.Add($"EL.Date {comparisonOperator} {param}");
    _params.Add(param, date);

    return this;
  }

  public GetExerciseLogsQueryBuilder AndExerciseId(int? exerciseId)
  {
    if (exerciseId is null)
    {
      return this;
    }

    var param = $"@ExerciseId_{UseIndex()}";
    _filters.Add($"E.ExerciseId = {param}");
    _params.Add(param, exerciseId);

    return this;
  }

  public GetExerciseLogsQueryBuilder AndExerciseType(string? exerciseType)
  {
    if (string.IsNullOrEmpty(exerciseType))
    {
      return this;
    }

    var param = $"@ExerciseType_{UseIndex()}";
    _filters.Add($"E.Type = {param}");
    _params.Add(param, exerciseType);

    return this;
  }

  public GetExerciseLogsQueryBuilder AndWeightInKg(decimal? weightInKg)
  {
    if (weightInKg is null)
    {
      return this;
    }

    var param = $"@WeightInKg_{UseIndex()}";
    _filters.Add($"S.WeightInKg = {param}");
    _params.Add(param, weightInKg);

    return this;
  }

  public GetExerciseLogsQueryBuilder OrderByDate(Direction direction)
  {
    _orderBy.Add($"EL.Date {ParseDirection(direction)}");
    return this;
  }

  public GetExerciseLogsQueryBuilder OrderByLastUpdatedAtUtc(Direction direction)
  {
    _orderBy.Add($"EL.LastUpdatedAtUtc {ParseDirection(direction)}");
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
      ? $"\nORDER BY EL.Date DESC, EL.ExerciseLogId DESC"
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

  private static string ParseDirection(Direction direction) =>
    direction switch
    {
      Direction.Asc => "ASC",
      Direction.Desc => "DESC",
      _ => throw new ArgumentException("Impossible State"),
    };
}