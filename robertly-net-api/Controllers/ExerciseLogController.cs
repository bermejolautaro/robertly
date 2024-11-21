using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
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
    private readonly UserRepository _userRepository;
    private readonly FirebaseApp _app;

    public ExerciseLogController(
        ExerciseLogRepository exerciseLogsRepository,
        UserRepository userRepository,
        FirebaseApp app) => (_exerciseLogRepository, _userRepository, _app) = (exerciseLogsRepository, userRepository, app);

    [HttpGet("filters")]
    public async Task<Ok<Filter>> GetFiltersByUser(
      [FromQuery] string? userFirebaseUuid = null,
      [FromQuery] int? exerciseId = null,
      [FromQuery] string? type = null,
      [FromQuery] decimal? weightInKg = null)
    {
      userFirebaseUuid ??= HelpersFunctions.ParseToken(Request.Headers.Authorization)?.GetUserFirebaseUuid() ?? "";
      var user = await _userRepository.GetUserByFirebaseUuidAsync(userFirebaseUuid) ?? throw new ArgumentException("Impossible state");


      var types = await _exerciseLogRepository.GetFilterByUser<string>(user.UserId!.Value, FilterEnum.Type, type, weightInKg, exerciseId);
      var weights = await _exerciseLogRepository.GetFilterByUser<decimal>(user.UserId!.Value, FilterEnum.Weight, type, weightInKg, exerciseId);
      var exercisesIds = await _exerciseLogRepository.GetFilterByUser<int>(user.UserId!.Value, FilterEnum.Exercise, type, weightInKg, exerciseId);

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
      var userFirebaseUuid = HelpersFunctions.ParseToken(Request.Headers.Authorization)?.GetUserFirebaseUuid();

      if (userFirebaseUuid is null)
      {
        return TypedResults.Unauthorized();
      }
      var user = await _userRepository.GetUserByFirebaseUuidAsync(userFirebaseUuid);

      if (user is null)
      {
        return TypedResults.Unauthorized();
      }

      var date = await _exerciseLogRepository.GetMostRecentButNotTodayDateByUserId(user.UserId!.Value);

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

    [HttpGet("stats")]
    public async Task<Ok<Stats>> GetStats()
    {
      var userFirebaseUuid = HelpersFunctions.ParseToken(Request.Headers.Authorization)?.GetUserFirebaseUuid() ?? throw new ArgumentException("User is not logged in");
      var user = await _userRepository.GetUserByFirebaseUuidAsync(userFirebaseUuid) ?? throw new ArgumentException("Impossible state");

      var stats = await _exerciseLogRepository.GetStatsAsync(user.UserId!.Value);

      return TypedResults.Ok(stats);
    }

    [HttpGet("recently-updated")]
    public async Task<Ok<ExerciseLogsDto>> GetRecentlyUpdated()
    {
      var userFirebaseUuid = HelpersFunctions.ParseToken(Request.Headers.Authorization)?.GetUserFirebaseUuid() ?? throw new ArgumentException("User is not logged in");
      var user = await _userRepository.GetUserByFirebaseUuidAsync(userFirebaseUuid) ?? throw new ArgumentException("Impossible state");
      var date = await _exerciseLogRepository.GetMostRecentButNotTodayDateByUserId(user.UserId!.Value);

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
      try
      {
        var token = await FirebaseAuth
            .GetAuth(_app)
            .VerifyIdTokenAsync(
                Request.Headers.Authorization.FirstOrDefault()?.Replace("Bearer ", "") ?? "");
      }
      catch (ArgumentException)
      {
        return TypedResults.Unauthorized();
      }
      catch (FirebaseAuthException)
      {
        return TypedResults.Unauthorized();
      }
      catch (Exception)
      {
        return TypedResults.Unauthorized();
      }

      var userFirebaseUuid = HelpersFunctions.ParseToken(Request.Headers.Authorization)?.GetUserFirebaseUuid() ?? "";
      var user = await _userRepository.GetUserByFirebaseUuidAsync(userFirebaseUuid);

      GetExerciseLogsQueryBuilder queryBuilderFunc(GetExerciseLogsQueryBuilder queryBuilder)
      {
        if (userId is null)
        {
          queryBuilder = queryBuilder.AndUserIds([user!.UserId!.Value, .. user!.AssignedUsers.Select(x => x.UserId!.Value)]);
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
    public async Task<Results<Ok<ExerciseLogDto>, BadRequest<string>>> GetExerciseLogById([FromRoute] int id)
    {
      var logDb = await _exerciseLogRepository.GetExerciseLogByIdAsync(id, true);

      if (logDb is null)
      {
        return TypedResults.BadRequest($"Log with id '{id}' does not exist.");
      }

      return TypedResults.Ok(MapToExerciseLogDto(logDb));
    }

    [HttpPost]
    public async Task<Ok<int>> Post([FromBody] ExerciseLogRequest request)
    {
      var userFirebaseUuid = HelpersFunctions.ParseToken(Request.Headers.Authorization)?.GetUserFirebaseUuid() ?? "";
      var user = await _userRepository.GetUserByFirebaseUuidAsync(userFirebaseUuid);

      var exerciseLogId = await _exerciseLogRepository.CreateExerciseLogAsync(request.ExerciseLog!, user!.UserId!.Value);

      return TypedResults.Ok(exerciseLogId);
    }

    [HttpPut("{id}")]
    public async Task<Results<Ok, BadRequest<string>>> Put(
        [FromRoute] int id,
        [FromBody] ExerciseLogRequest request
    )
    {
      var userFirebaseUuid = HelpersFunctions.ParseToken(Request.Headers.Authorization)?.GetUserFirebaseUuid() ?? "";
      var user = await _userRepository.GetUserByFirebaseUuidAsync(userFirebaseUuid);

      var logDb = await _exerciseLogRepository.GetExerciseLogByIdAsync(id);

      if (logDb is null)
      {
        return TypedResults.BadRequest($"Log with id '{id}' does not exist.");
      }

      logDb = logDb with
      {
        ExerciseLogDate = request.ExerciseLog!.ExerciseLogDate,
        ExerciseLogExerciseId = request.ExerciseLog.ExerciseLogExerciseId,
        Series = request.ExerciseLog!.Series?.Select(x => x with { ExerciseLogId = id }),
      };

      await _exerciseLogRepository.UpdateExerciseLogAsync(logDb, user!.UserId!.Value);

      return TypedResults.Ok();
    }

    [HttpDelete("{id}")]
    public async Task<Results<Ok, BadRequest<string>>> Delete([FromRoute] int id)
    {
      var logDb = await _exerciseLogRepository.GetExerciseLogByIdAsync(id);

      if (logDb is null)
      {
        return TypedResults.BadRequest($"Log with id '{id}' does not exist.");
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
