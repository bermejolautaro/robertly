using Dapper;
using Google.Api;
using Microsoft.Extensions.Configuration;
using Npgsql;
using robertly.Models;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace robertly.Repositories
{
    public class ExerciseLogsRepository
    {
        private readonly IConfiguration _config;

        public ExerciseLogsRepository(IConfiguration config) 
        {
            _config = config;
        }

        public async Task<IEnumerable<ExerciseLog>> GetExerciseLogsAsync(int page, int size) 
        {
            using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);

            var exerciseLogs = await connection.QueryAsync<ExerciseLog, Exercise, User2, ExerciseLog>($@"
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
                FROM ExerciseLogs EL
                INNER JOIN Exercises E ON EL.ExerciseId = E.ExerciseId
                LEFT JOIN Users U ON EL.UserId = U.UserId
                ORDER BY EL.Date DESC
                OFFSET {page * size} LIMIT {size};
            ",
            (log, exercise, user) => log with { Exercise = exercise, User = user },
            splitOn: "ExerciseId,UserId");

            var series = await connection.QueryAsync<Models.Serie>($@"
                SELECT
                     S.SerieId
                    ,S.ExerciseLogId
                    ,S.Reps
                    ,s.WeightInKg
                FROM Series S
                WHERE ExerciseLogId = ANY(@ExerciseLogIds)
            ", new { ExerciseLogIds = exerciseLogs.Select(x => x.ExerciseLogId).ToList() });

            exerciseLogs = exerciseLogs.Select(log => log with { Series = series.Where(x => x.ExerciseLogId == log.ExerciseLogId) });

            return exerciseLogs;
        }

        public async Task<int> CreateExerciseLogAsync(ExerciseLog exerciseLog)
        {
            using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);

            var exerciseLogQuery = $@"
                INSERT INTO ExerciseLogs (ExerciseLogFirebaseId, Username, UserId, ExerciseId, ExerciseFirebaseId, Date)
                VALUES (NULL, @Username, @UserId, @ExerciseId, NULL, @Date)
                RETURNING ExerciseLogs.ExerciseLogId
            ";

            var seriesQuery = new StringBuilder("INSERT INTO Series (ExerciseLogId, Reps, WeightInKg) VALUES\n")
                .AppendJoin(",\n", (exerciseLog.Series ?? []).Select(x => $"(@ExerciseLogId, {x.Reps}, {x.WeightInKg})"))
                .Append(";\n")
                .ToString();

            var exerciseLogId = await connection.QuerySingleAsync<int>(exerciseLogQuery, new
            {
                Username = exerciseLog.ExerciseLogUsername,
                UserId = exerciseLog.ExerciseLogUserId,
                ExerciseId = exerciseLog.ExerciseLogExerciseId,
                Date = exerciseLog.ExerciseLogDate,
            });

            await connection.ExecuteAsync(seriesQuery, new { ExerciseLogId = exerciseLogId });

            return exerciseLogId;
        }
    }
}
