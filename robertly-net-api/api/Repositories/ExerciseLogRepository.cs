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

  public ExerciseLogRepository(ConnectionHelper connection, SchemaHelper schema) => (_connection, _schema) = (connection, schema);

  public async Task<Models.SeriesPerMuscle> GetSeriesPerMuscle(int userId)
  {
    using var connection = _connection.Create();

    var query = $"""
    WITH WeeklyCounts AS (
        SELECT
            E.MuscleGroup,
            EXTRACT(ISOYEAR FROM EL.date) AS Year,
            EXTRACT(WEEK FROM EL.date) AS Week,
            COUNT(s.SerieId) AS TotalSeries,
            MIN(EL.date) AS FirstDateInPeriod
        FROM ExerciseLogs EL
        INNER JOIN Series S ON EL.ExerciseLogId = S.ExerciseLogId
        INNER JOIN Exercises E ON EL.ExerciseId = E.ExerciseId
        WHERE EL.UserId = @UserId
        GROUP BY E.MuscleGroup, EXTRACT(ISOYEAR FROM el.date), EXTRACT(WEEK FROM el.date)
    )
    SELECT
        MuscleGroup,
        Year,
        Week,
        TotalSeries,
        FirstDateInPeriod
    FROM WeeklyCounts
    ORDER BY MuscleGroup ASC;

    WITH MonthlyCounts AS (
    SELECT
        E.MuscleGroup,
        EXTRACT(YEAR FROM EL.date) AS Year,
        EXTRACT(MONTH FROM EL.date) AS Month,
        COUNT(S.SerieId) AS TotalSeries,
        MIN(EL.date) AS FirstDateInPeriod
    FROM ExerciseLogs EL
    INNER JOIN Series S ON EL.ExerciseLogId = s.ExerciseLogId
    INNER JOIN Exercises E ON EL.ExerciseId = e.ExerciseId
    WHERE EL.UserId = @UserId
    GROUP BY E.MuscleGroup, EXTRACT(YEAR FROM EL.date), EXTRACT(MONTH FROM EL.date)
    )
    SELECT
        MuscleGroup,
        Year,
        Month,
        TotalSeries,
        FirstDateInPeriod
    FROM
        MonthlyCounts
    ORDER BY MuscleGroup ASC;

    WITH YearlyCounts AS (
    SELECT
        E.MuscleGroup,
        EXTRACT(YEAR FROM el.date) AS Year,
        COUNT(S.SerieId) AS TotalSeries,
        MIN(EL.Date) AS FirstDateInPeriod
    FROM ExerciseLogs EL
    INNER JOIN Series S ON EL.ExerciseLogId = S.ExerciseLogId
    INNER JOIN Exercises E ON EL.ExerciseId = E.ExerciseId
    WHERE EL.UserId = @UserId
    GROUP BY E.MuscleGroup, EXTRACT(YEAR FROM EL.Date)
    )
    SELECT
        MuscleGroup,
        Year,
        TotalSeries,
        FirstDateInPeriod
    FROM YearlyCounts
    ORDER BY MuscleGroup ASC;
    """;

    using var values = await connection.QueryMultipleAsync(_schema.AddSchemaToQuery(query), new { UserId = userId });

    return new Models.SeriesPerMuscle
    {
      SeriesPerMuscleWeekly = values.Read<SeriesPerMuscleRow>(),
      SeriesPerMuscleMonthly = values.Read<SeriesPerMuscleRow>(),
      SeriesPerMuscleYearly = values.Read<SeriesPerMuscleRow>(),
    };
  }

  public async Task<Models.DaysTrained> GetDaysTrained(int userId)
  {
    using var connection = _connection.Create();

    var now = DateTime.UtcNow;
    var currentYear = now.Year;
    var currentMonth = now.Month;
    var endOfMonth = DateTime.DaysInMonth(currentYear, currentMonth);

    var dayOfWeek = DateTime.Today.DayOfWeek;
    var daysUntilStartOfWeek = dayOfWeek switch
    {
      DayOfWeek.Sunday => 6,
      _ => (int)dayOfWeek - 1
    };

    var startOfWeek = DateTime.Today.AddDays(daysUntilStartOfWeek * -1);
    var endOfWeek = startOfWeek.AddDays(6);

    var query = $"""
    -- DaysTrainedThisWeek
    SELECT COUNT(DISTINCT Date)
    FROM ExerciseLogs
    WHERE Date >= '{startOfWeek.Year}-{startOfWeek.Month}-{startOfWeek.Day}'
    AND Date <= '{endOfWeek.Year}-{endOfWeek.Month}-{endOfWeek.Day}'
    AND UserId = @UserId;

    -- DaysTrainedThisMonth
    SELECT COUNT(DISTINCT Date)
    FROM ExerciseLogs
    WHERE Date >= '{currentYear}-{currentMonth}-1'
    AND Date <= '{currentYear}-{currentMonth}-{endOfMonth}'
    AND UserId = @UserId;

    -- DaysTrainedThisYear
    SELECT COUNT(DISTINCT Date)
    FROM ExerciseLogs
    WHERE Date >= '{currentYear}-1-1'
    AND Date <= '{currentYear}-12-31'
    AND UserId = @UserId;
    """;

    using var values = await connection.QueryMultipleAsync(_schema.AddSchemaToQuery(query), new { UserId = userId });

    return new Models.DaysTrained
    {
      DaysTrainedThisWeek = values.ReadFirst<int>(),
      DaysTrainedThisMonth = values.ReadFirst<int>(),
      DaysTrainedThisYear = values.ReadFirst<int>()
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
    var (exerciseLogs, totalCount) = await GetExerciseLogsAsync(0, 1000, qb => qb.AndExerciseLogId(exerciseLogId));
    var exerciseLog = exerciseLogs.FirstOrDefault();

    if (exerciseLog is null)
    {
      return null;
    }

    if (includeExtraData)
    {
      GetExerciseLogsQueryBuilder queryBuilderFunc(GetExerciseLogsQueryBuilder queryBuilder)
      {
        return queryBuilder
          .AndExerciseId(exerciseLog!.ExerciseLogExerciseId!.Value)
          .AndUserIds([exerciseLog.User!.UserId!.Value])
          .AndDate(exerciseLog.ExerciseLogDate, "<");
      }
      ;

      var (recentLogs, recentLogsTotalCount) = await GetExerciseLogsAsync(0, 5, queryBuilderFunc);
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
      Func<GetExerciseLogsQueryBuilder, GetExerciseLogsQueryBuilder> queryBuilderFunc)
  {
    using var connection = _connection.Create();
    var queryBuilder = new GetExerciseLogsQueryBuilder("EL", "U", "E", "S");
    queryBuilder = queryBuilderFunc(queryBuilder);

    var (filters, queryParams) = queryBuilder.BuildFilters();
    var orderBy = queryBuilder.BuildOrderBy();

    var query =
      $"""
      SELECT DISTINCT
         EL.ExerciseLogId
        ,EL.UserId AS ExerciseLogUserId
        ,EL.ExerciseId AS ExerciseLogExerciseId
        ,EL.Date AS ExerciseLogDate
        ,EL.CreatedByUserId
        ,EL.CreatedAtUtc
        ,EL.LastUpdatedByUserId
        ,EL.LastUpdatedAtUtc
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
      WHERE 1 = 1
      {filters}
      {orderBy}
      OFFSET {page * size} LIMIT {size};
      """;

    var queryCount =
      $"""
      SELECT COUNT(DISTINCT EL.ExerciseLogId)
      FROM ExerciseLogs EL
      INNER JOIN Exercises E ON EL.ExerciseId = E.ExerciseId
      INNER JOIN Users U ON EL.UserId = U.UserId
      LEFT JOIN Series S ON EL.ExerciseLogId = S.ExerciseLogId
      WHERE 1 = 1
      {filters}
      """;

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
    var seriesQuery = $"""
            DELETE FROM {_connection.Schema}.Series WHERE ExerciseLogId = @ExerciseLogId;
            """;

    await connection.ExecuteAsync(seriesQuery, new { ExerciseLogId = exerciseLogId });

    var exerciseLogQuery = $"""
            DELETE FROM {_connection.Schema}.ExerciseLogs WHERE ExerciseLogId = @ExerciseLogId;
            """;

    await connection.ExecuteAsync(exerciseLogQuery, new { ExerciseLogId = exerciseLogId });
  }
}
