using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
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
    private readonly AppLogsRepository _appLogsRepository;
    private readonly GenericRepository _genericRepository;
    private readonly ConnectionHelper _connection;
    private readonly SchemaHelper _schema;
    private readonly UserHelper _userHelper;

    public FoodLogController(
        AppLogsRepository appLogsRepository,
        GenericRepository genericRepository,
        ConnectionHelper connection,
        SchemaHelper schema,
        UserHelper userHelper) =>
        (_appLogsRepository, _genericRepository, _connection, _schema, _userHelper) =
        (appLogsRepository, genericRepository, connection, schema, userHelper);

    [HttpGet("{foodLogId}")]
    public async Task<Models.FoodLog?> GetFoodLogById(int foodLogId)
    {
      var queryBuilder = new GetFoodLogsQueryBuilder()
          .AndFoodLogId(foodLogId);

      var foodLogs = await GetFoodLogs(queryBuilder, 1, 1);
      return foodLogs.FirstOrDefault();
    }

    [HttpGet]
    public async Task<IEnumerable<Models.FoodLog>> GetFoodLogs(int page, int size)
    {
      return await GetFoodLogs(new GetFoodLogsQueryBuilder(), page, size);
    }

    private async Task<IEnumerable<Models.FoodLog>> GetFoodLogs(GetFoodLogsQueryBuilder queryBuilder, int page, int size)
    {
      using var connection = _connection.Create();

      var (query, parameters) = queryBuilder.Build();
      query = query.ReplaceSchema(_schema);

      try
      {
        var foodLogs = await connection.QueryAsync<
            DataModels.FoodLog,
            DataModels.Food,
            DataModels.User,
            Models.FoodLog
        >(
            query,
            (log, food, user) => (log.Map<Models.FoodLog>() with
            {
              Food = food.Map<Models.Food>(),
              User = user.Map<Models.User>()
            }),
            param: parameters,
            splitOn: "FoodId,UserId"
        );

        return foodLogs;
      }
      catch (Exception e)
      {
        await _appLogsRepository.LogError(query, e);
      }

      return [];
    }
    [HttpPost]
    public async Task<Results<UnauthorizedHttpResult, Ok, BadRequest>> Post([FromBody] Models.FoodLog foodLog)
    {
      var user = await _userHelper.GetUser(Request);

      if (user?.UserId is null)
      {
        return TypedResults.Unauthorized();
      }

      if (foodLog?.Food is null)
      {
        return TypedResults.BadRequest();
      }

      var foodLogDataModel = foodLog.Map<DataModels.FoodLog>() with
      {
        FoodId = foodLog.Food.FoodId,
        UserId = user.UserId.Value,
        CreatedByUserId = user.UserId,
        CreatedAtUtc = DateTime.UtcNow,
        LastUpdatedByUserId = user.UserId,
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