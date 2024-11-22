﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
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
  private readonly IConfiguration _config;
  private readonly string _schema;

  public ExerciseLogRepository(IConfiguration config) => (_config, _schema) =
    (config, config["DatabaseEnvironment"] ?? throw new ArgumentException("DatabaseEnvironment is null"));


  public async Task<SeriesPerMuscle> GetSeriesPerMuscle(int userId)
  {
    using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);

    var query = $"""
    WITH WeeklyCounts AS (
        SELECT
            e.MuscleGroup,
            EXTRACT(YEAR FROM el.date) AS Year,
            EXTRACT(WEEK FROM el.date) AS Week,
            COUNT(s.SerieId) AS TotalSeries,
            MIN(el.date) AS FirstDateInPeriod
        FROM  prod.exerciselogs el
        INNER JOIN  prod.series s ON el.exerciselogid = s.exerciselogid
        INNER JOIN  prod.exercises e ON el.exerciseId = e.exerciseId
        WHERE  el.UserId = @UserId
        GROUP BY e.MuscleGroup, EXTRACT(YEAR FROM el.date), EXTRACT(WEEK FROM el.date)
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
        e.MuscleGroup,
        EXTRACT(YEAR FROM el.date) AS Year,
        EXTRACT(MONTH FROM el.date) AS Month,
        COUNT(s.SerieId) AS TotalSeries,
        MIN(el.date) AS FirstDateInPeriod
    FROM prod.exerciselogs el
    INNER JOIN prod.series s ON el.exerciselogid = s.exerciselogid
    INNER JOIN prod.exercises e ON el.exerciseId = e.exerciseId
    WHERE el.UserId = @UserId
    GROUP BY e.MuscleGroup, EXTRACT(YEAR FROM el.date), EXTRACT(MONTH FROM el.date)
    )
    SELECT
        MuscleGroup,
        year,
        month,
        TotalSeries,
        FirstDateInPeriod
    FROM
        MonthlyCounts
    ORDER BY MuscleGroup ASC;

    WITH YearlyCounts AS (
    SELECT
        e.MuscleGroup,
        EXTRACT(YEAR FROM el.date) AS Year,
        COUNT(s.SerieId) AS TotalSeries,
        MIN(el.date) AS FirstDateInPeriod
    FROM prod.exerciselogs el
    INNER JOIN prod.series s ON el.exerciselogid = s.exerciselogid
    INNER JOIN prod.exercises e ON el.exerciseId = e.exerciseId
    WHERE el.UserId = @UserId
    GROUP BY e.MuscleGroup, EXTRACT(YEAR FROM el.date)
    )
    SELECT
        MuscleGroup,
        Year,
        TotalSeries,
        FirstDateInPeriod
    FROM YearlyCounts
    ORDER BY MuscleGroup ASC;
    """;

    using var values = await connection.QueryMultipleAsync(query, new { UserId = userId });

    return new SeriesPerMuscle
    {
      SeriesPerMuscleWeekly = values.Read<SeriesPerMuscleRow>(),
      SeriesPerMuscleMonthly = values.Read<SeriesPerMuscleRow>(),
      SeriesPerMuscleYearly = values.Read<SeriesPerMuscleRow>(),
    };
  }

  public async Task<DaysTrained> GetStatsAsync(int userId)
  {
    using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);

    var now = DateTime.UtcNow;
    var currentYear = now.Year;
    var currentMonth = now.Month;
    var endOfMonth = DateTime.DaysInMonth(currentYear, currentMonth);

    var startOfWeek = DateTime.Today.AddDays(-1 * (int)DateTime.Today.DayOfWeek);
    var endOfWeek = startOfWeek.AddDays(7);

    var query = $"""
    -- DaysTrainedThisWeek
    SELECT COUNT(DISTINCT Date)
    FROM {_schema}.ExerciseLogs
    WHERE Date >= '{startOfWeek.Year}-{startOfWeek.Month}-{startOfWeek.Day}'
    AND Date <= '{endOfWeek.Year}-{endOfWeek.Month}-{endOfWeek.Day}'
    AND UserId = @UserId;

    -- DaysTrainedThisMonth
    SELECT COUNT(DISTINCT Date)
    FROM {_schema}.ExerciseLogs
    WHERE Date >= '{currentYear}-{currentMonth}-1'
    AND Date <= '{currentYear}-{currentMonth}-{endOfMonth}'
    AND UserId = @UserId;

    -- DaysTrainedThisYear
    SELECT COUNT(DISTINCT Date)
    FROM {_schema}.ExerciseLogs
    WHERE Date >= '{currentYear}-1-1'
    AND Date <='{currentYear}-12-31'
    AND UserId = @UserId;
    """;

    using var values = await connection.QueryMultipleAsync(query, new { UserId = userId });

    return new DaysTrained
    {
      DaysTrainedThisWeek = values.ReadFirst<int>(),
      DaysTrainedThisMonth = values.ReadFirst<int>(),
      DaysTrainedThisYear = values.ReadFirst<int>()
    };
  }

  public async Task<DateTime?> GetMostRecentButNotTodayDateByUserId(int userId)
  {
    using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);

    var date = await connection.QueryFirstOrDefaultAsync<DateTime?>(
      $"SELECT MAX(Date) FROM {_schema}.ExerciseLogs WHERE UserId = @UserId AND Date <> '{DateTime.Now:yyyy-MM-dd}'",
      new { UserId = userId });

    return date;
  }

  public async Task<ExerciseLog?> GetExerciseLogByIdAsync(int exerciseLogId, bool includeExtraData = false)
  {
    var exerciseLog = (await GetExerciseLogsAsync(0, 1000, qb => qb.AndExerciseLogId(exerciseLogId))).FirstOrDefault();

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
      };

      var recentLogs = await GetExerciseLogsAsync(0, 5, queryBuilderFunc);
      exerciseLog = exerciseLog with { RecentLogs = recentLogs };
    }

    return exerciseLog;
  }

  public async Task<IEnumerable<T>> GetFilterByUser<T>(int userId, FilterEnum filter, string? type = null, decimal? weightInKg = null, int? exerciseId = null)
  {
    using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);

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
      FROM {_schema}.ExerciseLogs EL
      INNER JOIN {_schema}.Series S ON EL.ExerciseLogId = S.ExerciseLogId
      INNER JOIN {_schema}.Exercises E ON EL.ExerciseId = E.ExerciseId
      WHERE EL.UserId = @UserId
      {(exerciseId is not null ? "AND E.ExerciseId = @ExerciseId" : "")}
      {(type is not null ? "AND E.Type = @Type" : "")}
      {(weightInKg is not null ? "AND S.WeightInKg = @WeightInKg" : "")}
      ORDER BY {column} ASC
      """;

    var values = await connection.QueryAsync<T>(
        query,
        new { UserId = userId, Type = type, WeightInKg = weightInKg, ExerciseId = exerciseId });

    return values;
  }

  public async Task<IEnumerable<ExerciseLog>> GetExerciseLogsAsync(
      int page,
      int size,
      Func<GetExerciseLogsQueryBuilder, GetExerciseLogsQueryBuilder> queryBuilderFunc)
  {
    using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);
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
      FROM {_schema}.ExerciseLogs EL
      INNER JOIN  {_schema}.Exercises E ON EL.ExerciseId = E.ExerciseId
      INNER JOIN  {_schema}.Users U ON EL.UserId = U.UserId
      LEFT JOIN {_schema}.Series S ON EL.ExerciseLogId = S.ExerciseLogId
      WHERE 1 = 1
      {filters}
      {orderBy}
      OFFSET {page * size} LIMIT {size};
      """;

    var exerciseLogs = await connection.QueryAsync<
        ExerciseLog,
        Exercise,
        User,
        ExerciseLog
    >(
        query,
        (log, exercise, user) => (log with { Exercise = exercise, User = user }),
        param: new DynamicParameters(queryParams),
        splitOn: "ExerciseId,UserId"
    );

    var series = await connection.QueryAsync<Serie>(
      $"""
      SELECT
         S.SerieId
        ,S.ExerciseLogId
        ,S.Reps
        ,S.WeightInKg
        ,(S.WeightInKg * (36.0 / (37.0 - s.Reps))) AS Brzycki
      FROM  {_schema}.Series S
      WHERE ExerciseLogId = ANY(@ExerciseLogIds)
      """,
        new { ExerciseLogIds = exerciseLogs.Select(x => x.ExerciseLogId).ToList() }
    );

    exerciseLogs = exerciseLogs.Select(log =>
        log with
        {
          Series = series.Where(x => x.ExerciseLogId == log.ExerciseLogId)
        }
    );

    return exerciseLogs;
  }

  public async Task<int> CreateExerciseLogAsync(ExerciseLog exerciseLog, int triggeringUserId)
  {
    using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);

    var exerciseLogQuery =
      $"""
        INSERT INTO {_schema}.ExerciseLogs (UserId, ExerciseId, Date, CreatedByUserId, CreatedAtUtc, LastUpdatedByUserId, LastUpdatedAtUtc)
        VALUES (@UserId, @ExerciseId, @Date, @CreatedByUserId, @CreatedAtUtc, @LastUpdatedByUserId, @LastUpdatedAtUtc)
        RETURNING ExerciseLogs.ExerciseLogId
      """;

    var seriesValues = (exerciseLog.Series ?? [])
      .Select(x => $"(@ExerciseLogId, {x.Reps}, {x.WeightInKg.ToString(CultureInfo.InvariantCulture)})");

    var seriesQuery = new StringBuilder($"INSERT INTO  {_schema}.Series (ExerciseLogId, Reps, WeightInKg) VALUES\n")
      .AppendJoin(",\n", seriesValues)
      .Append(";\n")
      .ToString();

    var nowUtc = DateTime.UtcNow;

    var exerciseLogId = await connection.QuerySingleAsync<int>(
        exerciseLogQuery,
        new
        {
          UserId = exerciseLog.ExerciseLogUserId,
          ExerciseId = exerciseLog.ExerciseLogExerciseId,
          Date = exerciseLog.ExerciseLogDate,
          CreatedByUserId = triggeringUserId,
          CreatedAtUtc = nowUtc,
          LastUpdatedByUserId = triggeringUserId,
          LastUpdatedAtUtc = nowUtc
        }
    );

    if (seriesValues.Any())
    {
      await connection.ExecuteAsync(seriesQuery, new { ExerciseLogId = exerciseLogId });
    }

    return exerciseLogId;
  }

  public async Task UpdateExerciseLogAsync(ExerciseLog exerciseLog, int triggeringUserId)
  {
    using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);

    var utcNow = DateTime.UtcNow;

    var query =
      $"""
      UPDATE {_schema}.ExerciseLogs SET
         UserId = @UserId
        ,ExerciseId = @ExerciseId
        ,Date = @Date
        ,LastUpdatedByUserId = @LastUpdatedByUserId
        ,LastUpdatedAtUtc = @LastUpdatedAtUtc
      WHERE ExerciseLogId = @ExerciseLogId
      """;

    await connection.ExecuteAsync(
        query,
        param: new
        {
          exerciseLog.ExerciseLogId,
          UserId = exerciseLog.ExerciseLogUserId,
          ExerciseId = exerciseLog.ExerciseLogExerciseId,
          Date = exerciseLog.ExerciseLogDate,
          LastUpdatedByUserId = triggeringUserId,
          LastUpdatedAtUtc = utcNow
        }
    );

    var seriesValues = string.Join(
        ",\n",
        exerciseLog.Series?.Select(x =>
            $"({x.SerieId?.ToString() ?? "DEFAULT"}, {x.ExerciseLogId}, {x.Reps}, {x.WeightInKg.ToString(CultureInfo.InvariantCulture)})"
        ) ?? []);

    var seriesIds = exerciseLog.Series?
      .Where(x => x.SerieId is not null)
      .Select(x => x.SerieId) ?? [];

    var seriesIdsString = string.Join(",", seriesIds);

    if (string.IsNullOrEmpty(seriesValues))
    {
      return;
    }

    var seriesQuery = new StringBuilder();

    if (!string.IsNullOrEmpty(seriesIdsString))
    {
      seriesQuery.AppendLine(
      $"""
      DELETE FROM {_schema}.Series
      WHERE ExerciseLogId = {exerciseLog.ExerciseLogId} AND SerieId NOT IN ({seriesIdsString});
      """);
    }

    seriesQuery.AppendLine(
      $"""
      INSERT INTO {_schema}.Series (SerieId, ExerciseLogId, Reps, WeightInKg)
      VALUES
          {seriesValues}
      ON CONFLICT (SerieId) DO UPDATE
          SET ExerciseLogId = EXCLUDED.ExerciseLogId,
              Reps = EXCLUDED.Reps,
              WeightInKg = EXCLUDED.WeightInKg;
      """);

    await connection.ExecuteAsync(seriesQuery.ToString());
  }

  public async Task DeleteExerciseLogAsync(int exerciseLogId)
  {
    using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);
    var seriesQuery = $"""
            DELETE FROM {_schema}.Series WHERE ExerciseLogId = @ExerciseLogId;
            """;

    await connection.ExecuteAsync(seriesQuery, new { ExerciseLogId = exerciseLogId });

    var exerciseLogQuery = $"""
            DELETE FROM {_schema}.ExerciseLogs WHERE ExerciseLogId = @ExerciseLogId;
            """;

    await connection.ExecuteAsync(exerciseLogQuery, new { ExerciseLogId = exerciseLogId });
  }
}
