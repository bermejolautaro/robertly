using System;
using System.Collections.Generic;
using System.Text;

namespace robertly.Helpers;

public class GetExerciseLogsQueryBuilder
{
  private int _index = 0;
  private readonly StringBuilder _sb = new();
  private readonly Dictionary<string, object> _params = [];

  public GetExerciseLogsQueryBuilder AndBeginParen()
  {
    _sb.AppendLine($"AND (");
    return this;
  }

  public GetExerciseLogsQueryBuilder CloseParen()
  {
    _sb.AppendLine($")");
    return this;
  }

  public GetExerciseLogsQueryBuilder AndExerciseLogId(int exerciseLogId)
  {
    var param = $"@ExerciseLogId_{UseIndex()}";
    _sb.AppendLine($"AND EL.ExerciseLogId = {param}");
    _params.Add(param, exerciseLogId);

    return this;
  }

  public GetExerciseLogsQueryBuilder AndUserFirebaseUuid(string userFirebaseUuid)
  {
    var param = $"@UserFirebaseUuid_{UseIndex()}";
    _sb.AppendLine($"AND U.UserFirebaseUuid = {param}");
    _params.Add(param, userFirebaseUuid);

    return this;
  }

  public GetExerciseLogsQueryBuilder WhereDate(DateTime date, string comparisonOperator = "=")
  {
    var param = $"@Date_{UseIndex()}";
    _sb.AppendLine($"EL.Date {comparisonOperator} {param}");
    _params.Add(param, date);

    return this;
  }

  public GetExerciseLogsQueryBuilder AndDate(DateTime date, string comparisonOperator = "=")
  {
    var param = $"@Date_{UseIndex()}";
    _sb.AppendLine($"AND EL.Date {comparisonOperator} {param}");
    _params.Add(param, date);

    return this;
  }

  public GetExerciseLogsQueryBuilder OrDate(DateTime date, string comparisonOperator = "=")
  {
    var param = $"@Date_{UseIndex()}";
    _sb.AppendLine($"OR EL.Date {comparisonOperator} {param}");
    _params.Add(param, date);

    return this;
  }

  public GetExerciseLogsQueryBuilder AndExerciseId(int exerciseId)
  {
    var param = $"@ExerciseId_{UseIndex()}";
    _sb.AppendLine($"AND E.ExerciseId = {param}");
    _params.Add(param, exerciseId);

    return this;
  }

  public GetExerciseLogsQueryBuilder AndExerciseType(string exerciseType)
  {
    var param = $"@ExerciseType_{UseIndex()}";
    _sb.AppendLine($"AND E.Type = {param}");
    _params.Add(param, exerciseType);

    return this;
  }

  public GetExerciseLogsQueryBuilder AndWeightInKg(decimal weightInKg)
  {
    var param = $"@WeightInKg_{UseIndex()}";
    _sb.AppendLine($"AND S.WeightInKg = {param}");
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