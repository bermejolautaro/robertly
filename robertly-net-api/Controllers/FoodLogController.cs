using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using robertly.Helpers;
using robertly.Models;
using robertly.Repositories;

namespace robertly.Controllers
{
  [ApiController]
  [Route("api/food-logs")]
  public class FoodLogController : ControllerBase
  {
    private readonly GenericRepository _genericRepository;
    private readonly UserHelper _userHelper;

    public FoodLogController(
        GenericRepository genericRepository,
        UserHelper userHelper) => (_genericRepository, _userHelper) = (genericRepository, userHelper);

public async Task<IEnumerable<Models.ExerciseLog>> GetFoodLogs(
      int page,
      int size,
      GetFoodLogsQueryBuilder queryBuilderFunc)
  {
    // using var connection = _connection.Create();
    // var queryBuilder = new GetExerciseLogsQueryBuilder("EL", "U", "E", "S");
    // queryBuilder = queryBuilderFunc(queryBuilder);

    // var (filters, queryParams) = queryBuilder.BuildFilters();
    // var orderBy = queryBuilder.BuildOrderBy();

    // var query =
    //   $"""

    //   """;

    // var exerciseLogs = await connection.QueryAsync<
    //     Models.ExerciseLog,
    //     Models.Exercise,
    //     User,
    //     Models.ExerciseLog
    // >(
    //     _schema.AddSchemaToQuery(query),
    //     (log, exercise, user) => (log with { Exercise = exercise, User = user }),
    //     param: new DynamicParameters(queryParams),
    //     splitOn: "ExerciseId,UserId"
    // );

    // var series = await connection.QueryAsync<Models.Serie>(
    //   _schema.AddSchemaToQuery($"""
    //   SELECT
    //      S.SerieId
    //     ,S.ExerciseLogId
    //     ,S.Reps
    //     ,S.WeightInKg
    //     ,(S.WeightInKg * (36.0 / (37.0 - s.Reps))) AS Brzycki
    //   FROM Series S
    //   WHERE ExerciseLogId = ANY(@ExerciseLogIds)
    //   """),
    //     new { ExerciseLogIds = exerciseLogs.Select(x => x.ExerciseLogId).ToList() }
    // );

    // exerciseLogs = exerciseLogs.Select(log =>
    //     log with
    //     {
    //       Series = series.Where(x => x.ExerciseLogId == log.ExerciseLogId)
    //     }
    // );

    // return exerciseLogs;
    return [];
  }

    [HttpPost]
    public async Task<Results<UnauthorizedHttpResult, Ok>> Post([FromBody] Models.FoodLog foodLog)
    {
      var user = await _userHelper.GetUser(Request);

      if (user?.UserId is null)
      {
        return TypedResults.Unauthorized();
      }

      var foodLogDataModel = foodLog.Map<DataModels.FoodLog>() with
      {
        CreatedByUserId = user.UserId.Value,
        CreatedAtUtc = DateTime.UtcNow,
        LastUpdatedByUserId = user.UserId.Value,
        LastUpdatedAtUtc = DateTime.UtcNow
      };

      await _genericRepository.CreateAsync<DataModels.FoodLog>(foodLogDataModel);

      return TypedResults.Ok();
    }

    [HttpPut("{foodLogId}")]
    public async Task<Results<UnauthorizedHttpResult, BadRequest, BadRequest<string>, Ok>> Put([FromRoute] int foodLogId, [FromBody] Models.FoodLog foodLog)
    {
      var user = await _userHelper.GetUser(Request);

      if (user?.UserId is null)
      {
        return TypedResults.Unauthorized();
      }

      if (foodLog.FoodLogId is null)
      {
        return TypedResults.BadRequest();
      }

      var foodLogDb = await _genericRepository.GetByIdAsync<DataModels.FoodLog>(foodLog.FoodLogId.Value);

      if (foodLogDb is null)
      {
        return TypedResults.BadRequest($"FoodLog with id '{foodLogId}' does not exist.");
      }

      var foodLogDataModel = foodLog.Map<DataModels.FoodLog>() with
      {
        FoodLogId = foodLogDb.FoodLogId,
        CreatedAtUtc = foodLogDb.CreatedAtUtc,
        CreatedByUserId = foodLogDb.CreatedByUserId,
        LastUpdatedAtUtc = DateTime.UtcNow,
        LastUpdatedByUserId = user.UserId.Value
      };

      await _genericRepository.UpdateAsync<DataModels.FoodLog>(foodLogDataModel);

      return TypedResults.Ok();
    }

    [HttpDelete("{foodLogId}")]
    public async Task<Results<UnauthorizedHttpResult, BadRequest<string>, Ok>> Delete([FromRoute] int foodLogId)
    {
      var user = await _userHelper.GetUser(Request);

      if (user?.UserId is null)
      {
        return TypedResults.Unauthorized();
      }

      var foodDb = await _genericRepository.GetByIdAsync<DataModels.FoodLog>(foodLogId);

      if (foodDb is null)
      {
        return TypedResults.BadRequest($"FoodLog with id '{foodLogId}' does not exist.");
      }

      await _genericRepository.DeleteAsync<DataModels.FoodLog>(foodLogId);

      return TypedResults.Ok();
    }
  }
}