using System;
using System.Collections.Generic;
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
  [Route("api/logs")]
  public class ExerciseLogController : ControllerBase
  {
    private readonly ExerciseLogRepository _exerciseLogRepository;
    private readonly UserHelper _userHelper;

    public ExerciseLogController(
        ExerciseLogRepository exerciseLogsRepository,
        UserHelper userHelper) => (_exerciseLogRepository, _userHelper) = (exerciseLogsRepository, userHelper);

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
    public async Task<Results<Ok<ExerciseLogsDto>, UnauthorizedHttpResult>> GetCurrentAndPreviousWorkoutByUser()
    {
      var user = await _userHelper.GetUser(Request);

      if (user?.UserId is null)
      {
        return TypedResults.Unauthorized();
      }

      var date = await _exerciseLogRepository.GetMostRecentButNotTodayDateByUserId(user.UserId.Value);

      GetExerciseLogsQueryBuilder queryBuilderFunc(GetExerciseLogsQueryBuilder queryBuilder)
      {
        return queryBuilder
          .AndUserIds([user.UserId.Value])
          .AndDate(date.HasValue ? [DateTime.Now.Date, date.Value.Date] : [DateTime.Now.Date]);
      };

      var exerciseLogs = await _exerciseLogRepository.GetExerciseLogsAsync(
          0,
          1000,
          queryBuilderFunc);

      var exerciseLogsDto = MapToExerciseLogDto(exerciseLogs);

      return TypedResults.Ok(new ExerciseLogsDto() { Data = exerciseLogsDto });
    }

    [HttpGet("series-per-muscle")]
    public async Task<Results<Ok<SeriesPerMuscle>, UnauthorizedHttpResult>> GetSeriesPerMuscle()
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
    public async Task<Results<Ok<DaysTrained>, UnauthorizedHttpResult>> GetStats()
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
    public async Task<Results<Ok<ExerciseLogsDto>, UnauthorizedHttpResult>> GetRecentlyUpdated()
    {
      var user = await _userHelper.GetUser(Request);

      if (user?.UserId is null)
      {
        return TypedResults.Unauthorized();
      }

      var date = await _exerciseLogRepository.GetMostRecentButNotTodayDateByUserId(user.UserId.Value);

      GetExerciseLogsQueryBuilder queryBuilderFunc(GetExerciseLogsQueryBuilder queryBuilder)
      {
        return queryBuilder
          .AndLastUpdatedByUserId([user.UserId.Value])
          .OrderByLastUpdatedAtUtc(Direction.Desc);
      };

      var exerciseLogs = await _exerciseLogRepository.GetExerciseLogsAsync(
          0,
          10,
          queryBuilderFunc);

      var exerciseLogsDto = MapToExerciseLogDto(exerciseLogs);

      return TypedResults.Ok(new ExerciseLogsDto() { Data = exerciseLogsDto });
    }

    [HttpGet]
    public async Task<Results<Ok<ExerciseLogsDto>, UnauthorizedHttpResult>> GetExerciseLogs(
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

      GetExerciseLogsQueryBuilder queryBuilderFunc(GetExerciseLogsQueryBuilder queryBuilder)
      {
        if (userId is null)
        {
          var assignedUsersIds = user.AssignedUsers
            .Select(x => x.UserId ?? throw new ArgumentException("Assigned UserIds should never be null"));

          queryBuilder = queryBuilder.AndUserIds(user.GetAllowedUserIds().ToList());
        }
        else
        {
          queryBuilder = queryBuilder.AndUserIds([userId.Value]);
        }

        if (exerciseId is not null)
        {
          queryBuilder = queryBuilder.AndExerciseId(exerciseId.Value);
        }

        if (exerciseType is not null)
        {
          queryBuilder = queryBuilder.AndExerciseType(exerciseType);
        }

        if (weightInKg is not null)
        {
          queryBuilder = queryBuilder.AndWeightInKg(weightInKg.Value);
        }

        return queryBuilder;
      };

      var exerciseLogs = await _exerciseLogRepository.GetExerciseLogsAsync(
          pagination.Page ?? 0,
          pagination.Count ?? 1000,
          queryBuilderFunc
      );

      var exerciseLogsDtos = MapToExerciseLogDto(exerciseLogs);

      return TypedResults.Ok(new ExerciseLogsDto() { Data = exerciseLogsDtos });
    }

    [HttpGet("{id}")]
    public async Task<Results<Ok<ExerciseLogDto>, BadRequest<string>, UnauthorizedHttpResult, ForbidHttpResult>> GetExerciseLogById([FromRoute] int id)
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

      return TypedResults.Ok(MapToExerciseLogDto(logDb));
    }

    [HttpPost]
    public async Task<Results<Ok<int>, UnauthorizedHttpResult, BadRequest, ForbidHttpResult>> Post([FromBody] ExerciseLogRequest request)
    {
      var user = await _userHelper.GetUser(Request);

      if (user?.UserId is null)
      {
        return TypedResults.Unauthorized();
      }

      if (request.ExerciseLog is null)
      {
        return TypedResults.BadRequest();
      }

      var canAccess = user.GetAllowedUserIds().Any(userId => userId == request.ExerciseLog.ExerciseLogUserId);

      if (!canAccess)
      {
        return TypedResults.Forbid();
      }

      var exerciseLogId = await _exerciseLogRepository.CreateExerciseLogAsync(request.ExerciseLog, user.UserId.Value);

      return TypedResults.Ok(exerciseLogId);
    }

    [HttpPut("{id}")]
    public async Task<Results<Ok, BadRequest<string>, UnauthorizedHttpResult, ForbidHttpResult>> Put(
        [FromRoute] int id,
        [FromBody] ExerciseLogRequest request
    )
    {
      var user = await _userHelper.GetUser(Request);

      if (user?.UserId is null)
      {
        return TypedResults.Unauthorized();
      }

      if (request.ExerciseLog?.Series is null)
      {
        return TypedResults.BadRequest("Series cannot be null");
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

      logDb = logDb with
      {
        ExerciseLogDate = request.ExerciseLog.ExerciseLogDate,
        ExerciseLogExerciseId = request.ExerciseLog.ExerciseLogExerciseId,
        Series = request.ExerciseLog.Series.Select(x => x with { ExerciseLogId = id }),
      };

      await _exerciseLogRepository.UpdateExerciseLogAsync(logDb, user.UserId.Value);

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

    private static IEnumerable<ExerciseLogDto> MapToExerciseLogDto(IEnumerable<ExerciseLog> exerciseLogs)
    {
      return exerciseLogs.Select(MapToExerciseLogDto);
    }

    private static ExerciseLogDto MapToExerciseLogDto(ExerciseLog log)
    {
      static int? getTotalReps(ExerciseLog log)
      {
        return log.Series!.All(x => x.WeightInKg == log.Series!.FirstOrDefault()?.WeightInKg)
          ? log.Series!.Sum(x => x.Reps)
          : null;
      }

      if (log.ExerciseLogId is null)
      {
        throw new ArgumentException("Impossible state");
      }

      var seriesCount = log.Series!.Count();

      return new ExerciseLogDto()
      {
        Id = log.ExerciseLogId!.Value,
        User = log.User!,
        Exercise = log.Exercise!,
        Date = log.ExerciseLogDate,
        Series = log.Series!,
        Highlighted = log.Series!.All(x => x.WeightInKg == log.Series!.FirstOrDefault()?.WeightInKg)
          ? log.Series!.All(x => x.Reps >= 12)
            ? "green"
            : log.Series!.All(x => x.Reps >= 8)
              ? "yellow"
              : null
          : null,
        TotalReps = getTotalReps(log),
        Tonnage = log.Series!.Aggregate(0, (acc, curr) => acc + curr.Reps * (int)curr.WeightInKg),
        Average = getTotalReps(log) is not null && seriesCount != 0 ? getTotalReps(log) / seriesCount : null,
        BrzyckiAverage = seriesCount != 0 ? log.Series!.Sum(x => x.Brzycki) / seriesCount : 0,
        RecentLogs = MapToExerciseLogDto(log.RecentLogs ?? [])
      };
    }
  }
}
