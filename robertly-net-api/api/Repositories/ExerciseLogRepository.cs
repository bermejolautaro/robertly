using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using robertly.DataModels;
using robertly.Helpers;
using robertly.Models;

namespace robertly.Repositories;

public enum FilterEnum
{
  Exercise,
  Weight,
  Type
}

public class ExerciseLogRepository
{
  private readonly ConnectionHelper _connection;
  private readonly SchemaHelper _schema;

  public ExerciseLogRepository(ConnectionHelper connection, SchemaHelper schema)
  {
    _connection = connection;
    _schema = schema;
  }

  public async Task<Models.SeriesPerMuscle> GetSeriesPerMuscle(int userId)
  {
    using var connection = _connection.Create();

    var query = $"""
    WITH MuscleGroups AS (
      SELECT DISTINCT MuscleGroup FROM Exercises
    ),
    MuscleGroupsPerYearAndWeek AS (
      SELECT 
        MG.MuscleGroup,
        EXTRACT(ISOYEAR FROM EL.Date) AS Year,
        EXTRACT(WEEK FROM EL.Date) AS Week,
        COUNT(S.SerieId) AS TotalSeries,
        MIN(EL.Date) AS FirstDateInPeriod
      FROM MuscleGroups MG
      CROSS JOIN ExerciseLogs EL
      LEFT JOIN Exercises E ON EL.ExerciseId = E.ExerciseId
      LEFT JOIN Series S ON EL.ExerciseLogId = S.ExerciseLogId AND MG.MuscleGroup = E.MuscleGroup
      WHERE UserId = @UserId
      GROUP BY MG.MuscleGroup, EXTRACT(ISOYEAR FROM EL.Date), EXTRACT(WEEK FROM EL.Date)
    )
    SELECT 
      MYW.MuscleGroup,
      MYW.Year,
      MYW.Week,
      MYW.TotalSeries,
      CAST(
        CASE 
          WHEN G.TargetValue IS NULL
          THEN 
            CASE
              WHEN MYW.MuscleGroup = 'biceps' THEN 6
              WHEN MYW.MuscleGroup = 'triceps' THEN 6
              WHEN MYW.MuscleGroup = 'calves' THEN 6
              WHEN MYW.MuscleGroup = 'shoulders' THEN 6
              WHEN MYW.MuscleGroup = 'back' THEN 9
              WHEN MYW.MuscleGroup = 'legs' THEN 9
              WHEN MYW.MuscleGroup = 'chest' THEN 9
              WHEN MYW.MuscleGroup = 'forearms' THEN 3
              WHEN MYW.MuscleGroup = 'glutes' THEN 3
              ELSE 3
            END
        ELSE G.TargetValue
        END AS INT
      ) AS TargetValue
    FROM MuscleGroupsPerYearAndWeek MYW
    LEFT JOIN Goals G ON MYW.MuscleGroup = G.MuscleGroup 
      AND G.UserId = @UserId
      AND G.CreatedAtUtc = (SELECT MAX(G2.CreatedAtUtc)
                            FROM Goals G2
                            WHERE G2.CreatedAtUtc <= MYW.FirstDateInPeriod
                            AND G2.MuscleGroup = MYW.MuscleGroup
                            AND G2.UserId = @UserId)
    ORDER BY MYW.Year DESC, MYW.Week DESC, MYW.MuscleGroup ASC;

    WITH RECURSIVE Months AS (
      SELECT 1 AS MonthNumber
      UNION ALL
      SELECT MonthNumber + 1
      FROM Months
      WHERE MonthNumber < 12
    ),
    MuscleGroups AS (
      SELECT DISTINCT MuscleGroup FROM Exercises
    ),
    MuscleGroupsPerYearAndMonth AS (
      SELECT 
        MG.MuscleGroup,
        EXTRACT(YEAR FROM EL.Date) AS Year,
        M.MonthNumber AS Month,
        COUNT(S.SerieId) AS TotalSeries,
        MIN(EL.Date) AS FirstDateInPeriod
      FROM MuscleGroups MG
      CROSS JOIN Months M
      CROSS JOIN ExerciseLogs EL
      LEFT JOIN Exercises E ON EL.ExerciseId = E.ExerciseId
      LEFT JOIN Series S ON EL.ExerciseLogId = S.ExerciseLogId 
           AND MG.MuscleGroup = E.MuscleGroup 
           AND EXTRACT(MONTH FROM El.Date) = MonthNumber
      WHERE UserId = @UserId
      GROUP BY MG.MuscleGroup, EXTRACT(YEAR FROM EL.Date), M.MonthNumber
      HAVING(EXTRACT(MONTH FROM MAX(EL.Date)) >= M.MonthNumber)
    )
    SELECT 
      MYM.MuscleGroup,
      MYM.Year,
      MYM.Month,
      MYM.TotalSeries,
      CAST(
        CASE 
          WHEN G.TargetValue IS NULL
          THEN 
            CASE
              WHEN MYM.MuscleGroup = 'biceps' THEN 6 * 4
              WHEN MYM.MuscleGroup = 'triceps' THEN 6 * 4
              WHEN MYM.MuscleGroup = 'calves' THEN 6 * 4
              WHEN MYM.MuscleGroup = 'shoulders' THEN 6 * 4
              WHEN MYM.MuscleGroup = 'back' THEN 9 * 4
              WHEN MYM.MuscleGroup = 'legs' THEN 9 * 4
              WHEN MYM.MuscleGroup = 'chest' THEN 9 * 4
              WHEN MYM.MuscleGroup = 'forearms' THEN 3 * 4
              WHEN MYM.MuscleGroup = 'glutes' THEN 3 * 4
              ELSE 3 * 4
            END
          ELSE G.TargetValue * 4
          END
      AS INT) AS TargetValue
    FROM MuscleGroupsPerYearAndMonth MYM
    LEFT JOIN Goals G ON MYM.MuscleGroup = G.MuscleGroup 
      AND G.UserId = @UserId
      AND G.CreatedAtUtc = (SELECT MAX(G2.CreatedAtUtc)
                            FROM Goals G2
                            WHERE G2.CreatedAtUtc <= MYM.FirstDateInPeriod
                            AND G2.MuscleGroup = MYM.MuscleGroup
                            AND G2.UserId = @UserId)
    ORDER BY MYM.Year DESC, MYM.Month DESC, MYM.MuscleGroup ASC;

    WITH MuscleGroups AS (
      SELECT DISTINCT MuscleGroup FROM Exercises
    ),
    MuscleGroupsPerYear AS (
      SELECT 
        MG.MuscleGroup,
        EXTRACT(YEAR FROM EL.Date) AS Year,
        COUNT(S.SerieId) AS TotalSeries,
        MIN(EL.Date) AS FirstDateInPeriod
      FROM MuscleGroups MG
      CROSS JOIN ExerciseLogs EL
      LEFT JOIN Exercises E ON EL.ExerciseId = E.ExerciseId
      LEFT JOIN Series S ON EL.ExerciseLogId = S.ExerciseLogId AND MG.MuscleGroup = E.MuscleGroup
      WHERE UserId = @UserId
      GROUP BY MG.MuscleGroup, EXTRACT(YEAR FROM EL.Date)
    )
    SELECT 
      MY.MuscleGroup,
      MY.Year,
      MY.TotalSeries,
      CAST(
      CASE 
        WHEN G.TargetValue IS NULL
        THEN 
        CASE
          WHEN MY.MuscleGroup = 'biceps' THEN 6 * 52
          WHEN MY.MuscleGroup = 'triceps' THEN 6 * 52
          WHEN MY.MuscleGroup = 'calves' THEN 6 * 52
          WHEN MY.MuscleGroup = 'shoulders' THEN 6 * 52
          WHEN MY.MuscleGroup = 'back' THEN 9 * 52
          WHEN MY.MuscleGroup = 'legs' THEN 9 * 52
          WHEN MY.MuscleGroup = 'chest' THEN 9 * 52
          WHEN MY.MuscleGroup = 'forearms' THEN 3 * 52
          WHEN MY.MuscleGroup = 'glutes' THEN 3 * 52
          ELSE 3 * 52
        END
        ELSE G.TargetValue * 52
        END
      AS INT) AS TargetValue
    FROM MuscleGroupsPerYear MY
    LEFT JOIN Goals G ON MY.MuscleGroup = G.MuscleGroup 
      AND G.UserId = @UserId
      AND G.CreatedAtUtc = (SELECT MAX(G2.CreatedAtUtc)
                            FROM Goals G2
                            WHERE G2.CreatedAtUtc <= MY.FirstDateInPeriod
                            AND G2.MuscleGroup = MY.MuscleGroup
                            AND G2.UserId = @UserId)
    ORDER BY MY.Year DESC, MY.MuscleGroup ASC;
    """;

    using var values = await connection.QueryMultipleAsync(_schema.AddSchemaToQuery(query), new { UserId = userId });

    return new Models.SeriesPerMuscle
    {
      SeriesPerMuscleWeekly = values.Read<SeriesPerMuscleRow>(),
      SeriesPerMuscleMonthly = values.Read<SeriesPerMuscleRow>(),
      SeriesPerMuscleYearly = values.Read<SeriesPerMuscleRow>(),
    };
  }

  public async Task<DateTime?> GetMostRecentButNotTodayDateByUserId(int userId)
  {
    using var connection = _connection.Create();

    var date = await connection.QueryFirstOrDefaultAsync<DateTime?>(
      _schema.AddSchemaToQuery($"SELECT MAX(Date) FROM ExerciseLogs WHERE UserId = @UserId AND Date <> '{DateTime.Now:yyyy-MM-dd}'"),
      new { UserId = userId });

    return date;
  }

  public async Task<Models.ExerciseLog?> GetExerciseLogByIdAsync(int exerciseLogId, bool includeExtraData = false)
  {
    var queryBuilder = new GetExerciseLogsQueryBuilder()
      .AndExerciseLogId(exerciseLogId);

    var (exerciseLogs, totalCount) = await GetExerciseLogsAsync(0, 1000, queryBuilder);
    var exerciseLog = exerciseLogs.FirstOrDefault();

    if (exerciseLog?.ExerciseLogExerciseId is null ||
        exerciseLog.User?.UserId is null ||
        exerciseLog.ExerciseLogDate is null)
    {
      return null;
    }

    if (includeExtraData)
    {
      var queryBuilderExtraData = new GetExerciseLogsQueryBuilder()
        .AndExerciseId(exerciseLog.ExerciseLogExerciseId.Value)
        .AndUserIds([exerciseLog.User.UserId.Value])
        .AndDate(exerciseLog.ExerciseLogDate.Value, "<");

      var (recentLogs, recentLogsTotalCount) = await GetExerciseLogsAsync(0, 5, queryBuilderExtraData);
      exerciseLog = exerciseLog with { RecentLogs = recentLogs };
    }

    return exerciseLog;
  }

  public async Task<IEnumerable<T>> GetFilterByUser<T>(int userId, FilterEnum filter, string? type = null, decimal? weightInKg = null, int? exerciseId = null)
  {
    using var connection = _connection.Create();

    var column = filter switch
    {
      FilterEnum.Weight => "S.WeightInKg",
      FilterEnum.Exercise => "E.ExerciseId",
      FilterEnum.Type => "E.Type",
      _ => throw new ArgumentException("Invalid filter")
    };

    var query =
      $"""
      SELECT DISTINCT {column}
      FROM ExerciseLogs EL
      INNER JOIN Series S ON EL.ExerciseLogId = S.ExerciseLogId
      INNER JOIN Exercises E ON EL.ExerciseId = E.ExerciseId
      WHERE EL.UserId = @UserId
      {(exerciseId is not null ? "AND E.ExerciseId = @ExerciseId" : "")}
      {(type is not null ? "AND E.Type = @Type" : "")}
      {(weightInKg is not null ? "AND S.WeightInKg = @WeightInKg" : "")}
      ORDER BY {column} ASC
      """;

    var values = await connection.QueryAsync<T>(
        _schema.AddSchemaToQuery(query),
        new { UserId = userId, Type = type, WeightInKg = weightInKg, ExerciseId = exerciseId });

    return values;
  }

  public async Task<(IEnumerable<Models.ExerciseLog> ExerciseLogs, int TotalCount)> GetExerciseLogsAsync(
      int page,
      int size,
      GetExerciseLogsQueryBuilder queryBuilder)
  {
    using var connection = _connection.Create();

    var (query, queryParams) = queryBuilder.Build(page, size);
    var (queryCount, queryCountParams) = queryBuilder.BuildCountQuery();

    var totalCount = await connection.ExecuteScalarAsync<int>(
      _schema.AddSchemaToQuery(queryCount),
      new DynamicParameters(queryParams));

    var exerciseLogs = await connection.QueryAsync<
        Models.ExerciseLog,
        Models.Exercise,
        Models.User,
        Models.ExerciseLog
    >(
        _schema.AddSchemaToQuery(query),
        (log, exercise, user) => (log with { Exercise = exercise, User = user }),
        param: new DynamicParameters(queryParams),
        splitOn: "ExerciseId,UserId"
    );

    var series = await connection.QueryAsync<Models.Serie>(
      _schema.AddSchemaToQuery($"""
      SELECT
         S.SerieId
        ,S.ExerciseLogId
        ,S.Reps
        ,S.WeightInKg
        ,(S.WeightInKg * (36.0 / (37.0 - s.Reps))) AS Brzycki
      FROM Series S
      WHERE ExerciseLogId = ANY(@ExerciseLogIds)
      """),
        new { ExerciseLogIds = exerciseLogs.Select(x => x.ExerciseLogId).ToList() }
    );

    exerciseLogs = exerciseLogs.Select(log =>
        log with
        {
          Series = series.Where(x => x.ExerciseLogId == log.ExerciseLogId)
        }
    );

    return (exerciseLogs, totalCount);
  }

  public async Task DeleteExerciseLogAsync(int exerciseLogId)
  {
    using var connection = _connection.Create();
    var seriesQuery = "DELETE FROM Series WHERE ExerciseLogId = @ExerciseLogId;";

    await connection.ExecuteAsync(_schema.AddSchemaToQuery(seriesQuery), new { ExerciseLogId = exerciseLogId });

    var exerciseLogQuery = "DELETE FROM ExerciseLogs WHERE ExerciseLogId = @ExerciseLogId;";

    await connection.ExecuteAsync(_schema.AddSchemaToQuery(exerciseLogQuery), new { ExerciseLogId = exerciseLogId });
  }
}
