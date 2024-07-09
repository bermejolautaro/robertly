using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using robertly.Models;

namespace robertly.Repositories;

public class ExerciseLogRepository
{
  private readonly IConfiguration _config;
  private readonly string _schema;

  public ExerciseLogRepository(IConfiguration config)
  {
    _config = config;
    _schema = config["DatabaseEnvironment"] ?? throw new ArgumentException("DatabaseEnvironment is null");
  }

  public async Task<DateTime?> GetMostRecentButNotTodayDateByUserFirebaseUuid(string userFirebaseUuid)
  {
    using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);

    var date = await connection.QueryFirstOrDefaultAsync<DateTime?>(
      $"SELECT MAX(Date) FROM ExerciseLogs where UserFirebaseUuid = @UserFirebaseUuid AND Date <> '{DateTime.Now:yyyy-MM-dd}'",
      new { UserFirebaseUuid = userFirebaseUuid });

    return date;
  }

  public async Task<ExerciseLog?> GetExerciseLogByIdAsync(int exerciseLogId)
  {
    var exerciseLog = (
        await GetExerciseLogsAsync(0, 1000, exerciseLogId: exerciseLogId)
    ).FirstOrDefault();

    return exerciseLog;
  }

  public async Task<IEnumerable<ExerciseLog>> GetExerciseLogsAsync(
      int page,
      int size,
      int? exerciseLogId = null,
      string? userFirebaseUuid = null,
      IEnumerable<DateTime>? dates = null
  )
  {
    using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);

    var filters = new StringBuilder();

    if (exerciseLogId is not null)
    {
      filters.AppendLine("AND EL.ExerciseLogId = @ExerciseLogId");
    }

    if (userFirebaseUuid is not null)
    {
      filters.AppendLine("AND U.UserFirebaseUuid = @UserFirebaseUuid");
    }

    if (dates is not null)
    {
      var datesFilters = string.Join("OR ", dates.Select(x => $"EL.Date = '{x:yyyy-MM-dd}'"));
      filters.AppendLine($"AND {datesFilters}");
    }

    string query = $"""
            SELECT
                 EL.ExerciseLogId
                ,EL.Username AS ExerciseLogUsername
                ,EL.UserId AS ExerciseLogUserId
                ,EL.ExerciseId AS ExerciseLogExerciseId
                ,EL.Date AS ExerciseLogDate
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
            LEFT JOIN  {_schema}.Users U ON EL.UserId = U.UserId
            WHERE 1 = 1
            {filters}
            ORDER BY EL.Date DESC, EL.ExerciseLogId DESC
            OFFSET {page * size} LIMIT {size};
            """;

    var exerciseLogs = await connection.QueryAsync<
        ExerciseLog,
        Exercise,
        User2,
        ExerciseLog
    >(
        query,
        (log, exercise, user) => (log with { Exercise = exercise, User = user }),
        param: new
        {
          UserFirebaseUuid = userFirebaseUuid,
          ExerciseLogId = exerciseLogId,
        },
        splitOn: "ExerciseId,UserId"
    );

    var series = await connection.QueryAsync<Models.Serie>(
        $@"
                SELECT
                     S.SerieId
                    ,S.ExerciseLogId
                    ,S.Reps
                    ,s.WeightInKg
                FROM  {_schema}.Series S
                WHERE ExerciseLogId = ANY(@ExerciseLogIds)
            ",
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

  public async Task<int> CreateExerciseLogAsync(ExerciseLog exerciseLog, string userFirebaseUuid)
  {
    using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);

    var exerciseLogQuery =
      $"""
        INSERT INTO {_schema}.ExerciseLogs (Username, UserFirebaseUuid, UserId, ExerciseId, Date)
        VALUES (@Username, @UserFirebaseUuid, @UserId, @ExerciseId, @Date)
        RETURNING ExerciseLogs.ExerciseLogId
      """;

    var seriesQuery = new StringBuilder($"INSERT INTO  {_schema}.Series (ExerciseLogId, Reps, WeightInKg) VALUES\n")
      .AppendJoin(",\n", (exerciseLog.Series ?? []).Select(x => $"(@ExerciseLogId, {x.Reps}, {x.WeightInKg})"))
      .Append(";\n")
      .ToString();

    var exerciseLogId = await connection.QuerySingleAsync<int>(
        exerciseLogQuery,
        new
        {
          Username = exerciseLog.ExerciseLogUsername,
          UserFirebaseUuid = userFirebaseUuid,
          UserId = exerciseLog.ExerciseLogUserId,
          ExerciseId = exerciseLog.ExerciseLogExerciseId,
          Date = exerciseLog.ExerciseLogDate,
        }
    );

    await connection.ExecuteAsync(seriesQuery, new { ExerciseLogId = exerciseLogId });

    return exerciseLogId;
  }

  public async Task UpdateExerciseLogAsync(ExerciseLog exerciseLog)
  {
    using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);

    var query = $"""
            UPDATE {_schema}.ExerciseLogs SET
                 Username = @Username
                ,UserId = @UserId
                ,ExerciseId = @ExerciseId
                ,Date = @Date
            WHERE ExerciseLogId = @ExerciseLogId
            """;

    await connection.ExecuteAsync(
        query,
        param: new
        {
          exerciseLog.ExerciseLogId,
          Username = exerciseLog.ExerciseLogUsername,
          UserId = exerciseLog.ExerciseLogUserId,
          ExerciseId = exerciseLog.ExerciseLogExerciseId,
          Date = exerciseLog.ExerciseLogDate
        }
    );

    var seriesValues = string.Join(
        ",\n",
        exerciseLog.Series?.Select(x =>
            $"({x.SerieId?.ToString() ?? "DEFAULT"}, {x.ExerciseLogId}, NULL, {x.Reps}, {x.WeightInKg})"
        ) ?? []
    );

    var seriesIds = string.Join(",", exerciseLog.Series?.Where(x => x.SerieId is not null).Select(x => x.SerieId) ?? []);

    if (seriesValues is not null && !seriesValues.Any())
    {
      return;
    }

    var seriesQuery =
      $"""
      DELETE FROM {_schema}.Series
      WHERE ExerciseLogId = {exerciseLog.ExerciseLogId} AND SerieId NOT IN ({seriesIds});

      INSERT INTO {_schema}.Series (SerieId, ExerciseLogId, ExerciseLogFirebaseId, Reps, WeightInKg)
      VALUES
          {seriesValues}
      ON CONFLICT (SerieId) DO UPDATE
          SET ExerciseLogId = EXCLUDED.ExerciseLogId,
              ExerciseLogFirebaseId = EXCLUDED.ExerciseLogFirebaseId,
              Reps = EXCLUDED.Reps,
              WeightInKg = EXCLUDED.WeightInKg;
      """;

    await connection.ExecuteAsync(seriesQuery);
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
