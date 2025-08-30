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
[Route("api/exercise-logs")]
public class ExerciseLogController : ControllerBase
{
  private readonly ExerciseLogRepository _exerciseLogRepository;
  private readonly GenericRepository _genericRepository;
  private readonly UserHelper _userHelper;

  public ExerciseLogController(
      ExerciseLogRepository exerciseLogsRepository,
      GenericRepository genericRepository,
      UserHelper userHelper) => (_exerciseLogRepository, _genericRepository, _userHelper) = (exerciseLogsRepository, genericRepository, userHelper);

  [HttpGet("filters")]
  public async Task<Results<Ok<Filter>, BadRequest, UnauthorizedHttpResult>> GetFiltersByUser(
    [FromQuery] int? userId = null,
    [FromQuery] int? exerciseId = null,
    [FromQuery] string? type = null,
    [FromQuery] decimal? weightInKg = null)
  {
    var user = await _userHelper.GetUser(Request);

    if (user?.UserId is null)
    {
      return TypedResults.Unauthorized();
    }

    var userFilter = user.AssignedUsers.FirstOrDefault(x => x.UserId == userId);

    var userIdFilter = userFilter?.UserId ?? user.UserId.Value;

    var types = await _exerciseLogRepository.GetFilterByUser<string>(userIdFilter, FilterEnum.Type, type, weightInKg, exerciseId);
    var weights = await _exerciseLogRepository.GetFilterByUser<decimal>(userIdFilter, FilterEnum.Weight, type, weightInKg, exerciseId);
    var exercisesIds = await _exerciseLogRepository.GetFilterByUser<int>(userIdFilter, FilterEnum.Exercise, type, weightInKg, exerciseId);

    return TypedResults.Ok(new Filter
    {
      Types = types,
      Weights = weights,
      ExercisesIds = exercisesIds
    });
  }

  [HttpGet("latest-workout")]
  public async Task<Results<Ok<PaginatedList<ExerciseLog>>, UnauthorizedHttpResult>> GetCurrentAndPreviousWorkoutByUser()
  {
    var user = await _userHelper.GetUser(Request);

    if (user?.UserId is null)
    {
      return TypedResults.Unauthorized();
    }

    var date = await _exerciseLogRepository.GetMostRecentButNotTodayDateByUserId(user.UserId.Value);

    List<DateTime> dates = date.HasValue
      ? [DateTime.Now.Date, date.Value.Date]
      : [DateTime.Now.Date];

    var queryBuilder = new GetExerciseLogsQueryBuilder()
      .AndUserIds([user.UserId.Value])
      .AndDate(dates);

    var (exerciseLogs, totalCount) = await _exerciseLogRepository.GetExerciseLogsAsync(
        0,
        1000,
        queryBuilder);

    return TypedResults.Ok(new PaginatedList<ExerciseLog>() { Data = exerciseLogs });
  }

  [HttpGet("series-per-muscle")]
  public async Task<Results<Ok<Models.SeriesPerMuscle>, UnauthorizedHttpResult>> GetSeriesPerMuscle()
  {
    var user = await _userHelper.GetUser(Request);

    if (user?.UserId is null)
    {
      return TypedResults.Unauthorized();
    }

    var stats = await _exerciseLogRepository.GetSeriesPerMuscle(user.UserId.Value);

    return TypedResults.Ok(stats);
  }

  [HttpGet("days-trained")]
  public async Task<Results<Ok<Models.DaysTrained>, UnauthorizedHttpResult>> GetStats()
  {
    var user = await _userHelper.GetUser(Request);

    if (user?.UserId is null)
    {
      return TypedResults.Unauthorized();
    }

    var stats = await _exerciseLogRepository.GetDaysTrained(user.UserId.Value);

    return TypedResults.Ok(stats);
  }

  [HttpGet("recently-updated")]
  public async Task<Results<Ok<PaginatedList<ExerciseLog>>, UnauthorizedHttpResult>> GetRecentlyUpdated()
  {
    var user = await _userHelper.GetUser(Request);

    if (user?.UserId is null)
    {
      return TypedResults.Unauthorized();
    }

    var date = await _exerciseLogRepository.GetMostRecentButNotTodayDateByUserId(user.UserId.Value);

    var queryBuilder = new GetExerciseLogsQueryBuilder()
      .AndLastUpdatedByUserId([user!.UserId!.Value])
      .OrderByLastUpdatedAtUtc(Direction.Desc);

    var (exerciseLogs, totalCount) = await _exerciseLogRepository.GetExerciseLogsAsync(
        0,
        10,
        queryBuilder);

    return TypedResults.Ok(new PaginatedList<ExerciseLog>() { Data = exerciseLogs });
  }

  [HttpGet]
  public async Task<Results<Ok<PaginatedList<ExerciseLog>>, UnauthorizedHttpResult>> GetExerciseLogs(
      [FromQuery] PaginationRequest pagination,
      [FromQuery] int? userId,
      [FromQuery] string? exerciseType = null,
      [FromQuery] int? exerciseId = null,
      [FromQuery] decimal? weightInKg = null
  )
  {
    var user = await _userHelper.GetUser(Request);

    if (user?.UserId is null)
    {
      return TypedResults.Unauthorized();
    }

    var queryBuilder = new GetExerciseLogsQueryBuilder();

    queryBuilder = userId is null
      ? queryBuilder.AndUserIds(user.GetAllowedUserIds().ToList()) 
      : queryBuilder.AndUserIds([userId.Value]);

    queryBuilder = queryBuilder
      .AndExerciseId(exerciseId)
      .AndExerciseType(exerciseType)
      .AndWeightInKg(weightInKg);

    var (exerciseLogs, totalCount) = await _exerciseLogRepository.GetExerciseLogsAsync(
        pagination.Page ?? 0,
        pagination.Count ?? 1000,
        queryBuilder
    );

    return TypedResults.Ok(new PaginatedList<ExerciseLog>()
    {
      Data = exerciseLogs,
      PageCount = totalCount / (pagination.Count ?? 1)
    });
  }

  [HttpGet("{id}")]
  public async Task<Results<Ok<ExerciseLog>, BadRequest<string>, UnauthorizedHttpResult, ForbidHttpResult>> GetExerciseLogById([FromRoute] int id)
  {
    var user = await _userHelper.GetUser(Request);

    if (user?.UserId is null)
    {
      return TypedResults.Unauthorized();
    }

    var logDb = await _exerciseLogRepository.GetExerciseLogByIdAsync(id, true);

    if (logDb is null)
    {
      return TypedResults.BadRequest($"Log with id '{id}' does not exist.");
    }

    var canAccess = user.GetAllowedUserIds().Any(userId => userId == logDb.ExerciseLogUserId);

    if (!canAccess)
    {
      return TypedResults.Forbid();
    }

    return TypedResults.Ok(logDb);
  }

  [HttpPost]
  public async Task<Results<Ok<int>, UnauthorizedHttpResult, BadRequest, ForbidHttpResult>> Post([FromBody] ExerciseLogRequest request)
  {
    var user = await _userHelper.GetUser(Request);

    if (user?.UserId is null)
    {
      return TypedResults.Unauthorized();
    }

    var triggerByUserId = user.UserId.Value;

    if (request.ExerciseLog?.ExerciseLogId is not null ||
        request.ExerciseLog?.ExerciseLogUserId is null ||
        request.ExerciseLog?.ExerciseLogExerciseId is null ||
        request.ExerciseLog?.Series is null)
    {
      return TypedResults.BadRequest();
    }

    var exerciseDoneByUserId = request.ExerciseLog.ExerciseLogUserId.Value;
    var exerciseId = request.ExerciseLog.ExerciseLogExerciseId.Value;

    var canAccess = user.GetAllowedUserIds().Any(userId => userId == request.ExerciseLog.ExerciseLogUserId);

    if (!canAccess)
    {
      return TypedResults.Forbid();
    }
    var nowUtc = DateTime.UtcNow;

    var exerciseLogToCreate = new DataModels.ExerciseLog
    {
      UserId = exerciseDoneByUserId,
      ExerciseId = exerciseId,
      Date = request.ExerciseLog.ExerciseLogDate!.Value,
      CreatedByUserId = triggerByUserId,
      CreatedAtUtc = nowUtc,
      LastUpdatedByUserId = triggerByUserId,
      LastUpdatedAtUtc = nowUtc
    };

    var exerciseLogIdCreated = await _genericRepository.CreateAsync(exerciseLogToCreate);

    foreach (var serie in request.ExerciseLog.Series)
    {
      if (serie.Reps is null || serie.WeightInKg is null)
      {
        continue;
      }

      var serieToCreate = new DataModels.Serie
      {
        ExerciseLogId = exerciseLogIdCreated,
        Reps = serie.Reps.Value,
        WeightInKg = serie.WeightInKg.Value,
      };

      await _genericRepository.CreateAsync(serieToCreate);
    }

    return TypedResults.Ok(exerciseLogIdCreated);
  }

  [HttpPut("{id}")]
  public async Task<Results<Ok, BadRequest<string>, BadRequest, UnauthorizedHttpResult, ForbidHttpResult>> Put(
      [FromRoute] int id,
      [FromBody] ExerciseLogRequest request
  )
  {
    var user = await _userHelper.GetUser(Request);

    if (user?.UserId is null)
    {
      return TypedResults.Unauthorized();
    }

    var triggerByUserId = user.UserId.Value;

    if (request.ExerciseLog?.Series is null ||
        request.ExerciseLog?.ExerciseLogExerciseId is null ||
        request.ExerciseLog?.ExerciseLogUserId is null ||
        request.ExerciseLog?.ExerciseLogDate is null)
    {
      return TypedResults.BadRequest();
    }

    var exerciseLogFromDb = await _genericRepository.GetByIdAsync<DataModels.ExerciseLog>(id);

    if (exerciseLogFromDb?.ExerciseLogId is null)
    {
      return TypedResults.BadRequest($"Log with id '{id}' does not exist.");
    }

    var canAccess = user.GetAllowedUserIds().Any(userId => userId == exerciseLogFromDb.UserId);

    if (!canAccess)
    {
      return TypedResults.Forbid();
    }

    var exerciseId = request.ExerciseLog.ExerciseLogExerciseId.Value;
    var exerciseLogId = exerciseLogFromDb.ExerciseLogId.Value;
    var userId = request.ExerciseLog.ExerciseLogUserId.Value;

    exerciseLogFromDb = exerciseLogFromDb with
    {
      UserId = userId,
      ExerciseId = exerciseId,
      Date = request.ExerciseLog.ExerciseLogDate.Value,
      CreatedByUserId = triggerByUserId,
      LastUpdatedByUserId = triggerByUserId,
      LastUpdatedAtUtc = DateTime.UtcNow
    };

    await _genericRepository.UpdateAsync(exerciseLogFromDb);

    foreach (var serieId in request.SeriesIdsToDelete)
    {
      await _genericRepository.DeleteAsync<DataModels.Serie>(serieId);
    }

    foreach (var serie in request.ExerciseLog.Series)
    {
      if (serie.Reps is null || serie.WeightInKg is null)
      {
        continue;
      }

      if (serie.SerieId is null)
      {
        var serieToCreate = new DataModels.Serie
        {
          ExerciseLogId = exerciseLogId,
          Reps = serie.Reps.Value,
          WeightInKg = serie.WeightInKg.Value,
        };

        await _genericRepository.CreateAsync(serieToCreate);
      }
      else
      {
        var serieId = serie.SerieId.Value;
        var serieFromDb = await _genericRepository.GetByIdAsync<DataModels.Serie>(serieId);

        if (serieFromDb is not null)
        {
          serieFromDb = serieFromDb with
          {
            ExerciseLogId = exerciseLogId,
            Reps = serie.Reps.Value,
            WeightInKg = serie.WeightInKg.Value
          };

          await _genericRepository.UpdateAsync<DataModels.Serie>(serieFromDb);
        }
      }
    }

    return TypedResults.Ok();
  }

  [HttpDelete("{id}")]
  public async Task<Results<Ok, BadRequest<string>, UnauthorizedHttpResult, ForbidHttpResult>> Delete([FromRoute] int id)
  {
    var user = await _userHelper.GetUser(Request);

    if (user?.UserId is null)
    {
      return TypedResults.Unauthorized();
    }

    var logDb = await _exerciseLogRepository.GetExerciseLogByIdAsync(id);

    if (logDb is null)
    {
      return TypedResults.BadRequest($"Log with id '{id}' does not exist.");
    }

    var canAccess = user.GetAllowedUserIds().Any(userId => userId == logDb.ExerciseLogUserId);

    if (!canAccess)
    {
      return TypedResults.Forbid();
    }

    await _exerciseLogRepository.DeleteExerciseLogAsync(id);

    return TypedResults.Ok();
  }
}
