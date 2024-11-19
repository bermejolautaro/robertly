using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace robertly.Helpers;

public class GetExerciseLogsQueryBuilder
{
  private int _index = 0;
  private readonly StringBuilder _sb = new();
  private readonly Dictionary<string, object> _params = [];

  private readonly string _exerciseLogAlias;
  private readonly string _usersAlias;
  private readonly string _exercisesAlias;
  private readonly string _seriesAlias;

  public GetExerciseLogsQueryBuilder(string exerciseLogsAlias, string usersAlias, string exercisesAlias, string seriesAlias) =>
    (_exerciseLogAlias, _usersAlias, _exercisesAlias, _seriesAlias) = (exerciseLogsAlias, usersAlias, exercisesAlias, seriesAlias);

  public GetExerciseLogsQueryBuilder AndExerciseLogId(int exerciseLogId)
  {
    var param = $"@ExerciseLogId_{UseIndex()}";
    _sb.AppendLine($"AND {_exerciseLogAlias}.ExerciseLogId = {param}");
    _params.Add(param, exerciseLogId);

    return this;
  }

  public GetExerciseLogsQueryBuilder AndUserFirebaseUuid(string userFirebaseUuid)
  {
    var param = $"@UserFirebaseUuid_{UseIndex()}";
    _sb.AppendLine($"AND {_usersAlias}.UserFirebaseUuid = {param}");
    _params.Add(param, userFirebaseUuid);

    return this;
  }

  public GetExerciseLogsQueryBuilder AndUserIds(List<int> userIds)
  {
    List<(string Param, int Value)> paramsWithValue = userIds.Select(x => ($"UserId_{UseIndex()}", x)).ToList();
    var @params = string.Join(", ", paramsWithValue.Select(x => $"@{x.Param}"));
    _sb.AppendLine($"AND {_usersAlias}.UserId IN ({@params})");

    foreach (var (param, value) in @paramsWithValue)
    {
      _params.Add(param, value);
    }

    return this;
  }

  public GetExerciseLogsQueryBuilder AndDate(List<DateTime> dates)
  {
    List<(string Param, DateTime Value)> paramsWithValue = dates.Select(x => ($"Date_{UseIndex()}", x)).ToList();
    var @params = string.Join(", ", paramsWithValue.Select(x => $"@{x.Param}"));
    _sb.AppendLine($"AND {_exerciseLogAlias}.Date IN ({@params})");

    foreach (var (param, value) in @paramsWithValue)
    {
      _params.Add(param, value);
    }

    return this;
  }

  public GetExerciseLogsQueryBuilder AndDate(DateTime date, string comparisonOperator = "=")
  {
    var param = $"@Date_{UseIndex()}";
    _sb.AppendLine($"AND {_exerciseLogAlias}.Date {comparisonOperator} {param}");
    _params.Add(param, date);

    return this;
  }

  public GetExerciseLogsQueryBuilder AndExerciseId(int exerciseId)
  {
    var param = $"@ExerciseId_{UseIndex()}";
    _sb.AppendLine($"AND {_exercisesAlias}.ExerciseId = {param}");
    _params.Add(param, exerciseId);

    return this;
  }

  public GetExerciseLogsQueryBuilder AndExerciseType(string exerciseType)
  {
    var param = $"@ExerciseType_{UseIndex()}";
    _sb.AppendLine($"AND {_exercisesAlias}.Type = {param}");
    _params.Add(param, exerciseType);

    return this;
  }

  public GetExerciseLogsQueryBuilder AndWeightInKg(decimal weightInKg)
  {
    var param = $"@WeightInKg_{UseIndex()}";
    _sb.AppendLine($"AND {_seriesAlias}.WeightInKg = {param}");
    _params.Add(param, weightInKg);

    return this;
  }

  public (string Query, IReadOnlyDictionary<string, object> Params) BuildFilters()
  {
    return (_sb.ToString(), _params.AsReadOnly());
  }

  private int UseIndex()
  {
    var previousIndex = _index;
    _index++;
    return previousIndex;
  }
}