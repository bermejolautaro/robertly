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

namespace robertly.Controllers;

[ApiController]
[Route("api/foods")]
public class FoodController : ControllerBase
{
  private readonly GenericRepository _genericRepository;
  private readonly UserHelper _userHelper;

  public FoodController(
    ExerciseLogRepository exerciseLogsRepository,
    GenericRepository genericRepository,
    UserHelper userHelper) => (_genericRepository, _userHelper) = (genericRepository, userHelper);

  [HttpGet]
  public async Task<Ok<IEnumerable<Models.Food>>> Get()
  {
    var foods = await _genericRepository.GetAll<DataModels.Food>();
    return TypedResults.Ok(foods.Select(x => x.Map<Models.Food>()));
  }

  [HttpPost]
  public async Task<Results<UnauthorizedHttpResult, Ok>> Post([FromBody] Models.Food food)
  {
    var user = await _userHelper.GetUser(Request);

    if (user?.UserId is null)
    {
      return TypedResults.Unauthorized();
    }

    var foodDataModel = food.Map<DataModels.Food>() with
    {
      CreatedByUserId = user.UserId.Value,
      CreatedAtUtc = DateTime.UtcNow,
      LastUpdatedByUserId = user.UserId.Value,
      LastUpdatedAtUtc = DateTime.UtcNow
    };

    await _genericRepository.CreateAsync<DataModels.Food>(foodDataModel);

    return TypedResults.Ok();
  }

  [HttpPut("{foodId}")]
  public async Task<Results<UnauthorizedHttpResult, BadRequest, BadRequest<string>, Ok>> Put([FromRoute] int foodId, [FromBody] Models.Food food)
  {
    var user = await _userHelper.GetUser(Request);

    if (user?.UserId is null)
    {
      return TypedResults.Unauthorized();
    }

    if (food.FoodId is null)
    {
      return TypedResults.BadRequest();
    }

    var foodDb = await _genericRepository.GetByIdAsync<DataModels.Food>(food.FoodId.Value);

    if (foodDb is null)
    {
      return TypedResults.BadRequest($"Food with id '{foodId}' does not exist.");
    }

    var foodDataModel = food.Map<DataModels.Food>() with
    {
      FoodId = foodDb.FoodId,
      CreatedAtUtc = foodDb.CreatedAtUtc,
      CreatedByUserId = foodDb.CreatedByUserId,
      LastUpdatedAtUtc = DateTime.UtcNow,
      LastUpdatedByUserId = user.UserId.Value
    };

    await _genericRepository.UpdateAsync<DataModels.Food>(foodDataModel);

    return TypedResults.Ok();
  }

  [HttpDelete("{foodId}")]
  public async Task<Results<UnauthorizedHttpResult, BadRequest<string>, Ok>> Delete([FromRoute] int foodId)
  {
    var user = await _userHelper.GetUser(Request);

    if (user?.UserId is null)
    {
      return TypedResults.Unauthorized();
    }

    var foodDb = await _genericRepository.GetByIdAsync<DataModels.Food>(foodId);

    if (foodDb is null)
    {
      return TypedResults.BadRequest($"Food with id '{foodId}' does not exist.");
    }

    await _genericRepository.DeleteAsync<DataModels.Food>(foodId);

    return TypedResults.Ok();
  }
}
