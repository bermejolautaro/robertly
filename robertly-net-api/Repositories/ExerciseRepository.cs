
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using robertly.Helpers;
using robertly.Models;

namespace robertly.Repositories;

public class ExerciseRepository
{
  private readonly ConnectionHelper _connection;

  public ExerciseRepository(ConnectionHelper connection) => (_connection) = (connection);

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
    using var connection = _connection.Create();

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
      FROM {_connection.Schema}.Exercises E
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
    using var connection = _connection.Create();

    var query =
        $"""
        INSERT INTO {_connection.Schema}.Exercises (Name, MuscleGroup, Type)
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
    using var connection = _connection.Create();

    var query =
      $"""
      UPDATE {_connection.Schema}.Exercises SET
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
    using var connection = _connection.Create();
    var seriesQuery =
      $"""
      DELETE FROM {_connection.Schema}.Exercises WHERE ExerciseId = @ExerciseId;
      """;

    await connection.ExecuteAsync(seriesQuery, new { ExerciseId = exerciseId });
  }
}