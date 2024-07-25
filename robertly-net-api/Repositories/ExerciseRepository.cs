
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

public class ExerciseRepository
{
  private readonly IConfiguration _config;
  private readonly string _schema;

  public ExerciseRepository(IConfiguration config)
  {
    _config = config;
    _schema = config["DatabaseEnvironment"] ?? throw new ArgumentException("DatabaseEnvironment is null");
  }

  public async Task<Exercise?> GetExerciseByIdAsync(int exerciseId)
  {
    var exercise = (await GetExercisesAsync(0, 1000, exerciseId: exerciseId)).FirstOrDefault();

    return exercise;
  }

  public async Task<IEnumerable<Exercise>> GetExercisesAsync(
      int page,
      int size,
      int? exerciseId = null)
  {
    using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);

    var filters = new StringBuilder();

    if (exerciseId is not null)
    {
      filters.AppendLine("AND E.ExerciseId = @ExerciseId");
    }

    string query =
      $"""
      SELECT
         E.ExerciseId
        ,E.Name
        ,E.MuscleGroup
        ,E.Type
      FROM {_schema}.Exercises E
      WHERE 1 = 1
      {filters}
      ORDER BY E.ExerciseID DESC
      OFFSET {page * size} LIMIT {size};
      """;

    var exercises = await connection.QueryAsync<Exercise>(query, param: new { ExerciseId = exerciseId });

    return exercises;
  }

  public async Task<int> CreateExerciseAsync(Exercise exercise)
  {
    using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);

    var query =
        $"""
        INSERT INTO {_schema}.Exercises (Name, MuscleGroup, Type)
        VALUES (@Name, @MuscleGroup, @Type)
        RETURNING Exercises.ExerciseId
        """;

    var exerciseId = await connection.QuerySingleAsync<int>(
        query,
        new
        {
          exercise.Name,
          exercise.MuscleGroup,
          exercise.Type,
        }
    );

    return exerciseId;
  }

  public async Task UpdateExerciseAsync(Exercise exercise)
  {
    using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);

    var query =
      $"""
      UPDATE {_schema}.Exercises SET
           Name = @Name
          ,MuscleGroup = @MuscleGroup
          ,Type = @Type
      WHERE ExerciseId = @ExerciseId
      """;

    await connection.ExecuteAsync(
        query,
        param: new
        {
          exercise.Name,
          exercise.MuscleGroup,
          exercise.Type,
          exercise.ExerciseId
        }
    );
  }

  public async Task DeleteExerciseLogAsync(int exerciseId)
  {
    using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);
    var seriesQuery =
      $"""
      DELETE FROM {_schema}.Exercises WHERE ExerciseId = @ExerciseId;
      """;

    await connection.ExecuteAsync(seriesQuery, new { ExerciseId = exerciseId });
  }
}