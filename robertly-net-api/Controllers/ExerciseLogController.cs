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
    private readonly FirebaseApp _app;

    public ExerciseLogController(
        ExerciseLogRepository exerciseLogsRepository,
        FirebaseApp app)
    {
      _exerciseLogRepository = exerciseLogsRepository;
      _app = app;
    }

    [HttpGet("latest-workout")]
    public async Task<ActionResult<ExerciseLogsDto>> GetCurrentAndPreviousWorkoutByUser()
    {
      var userFirebaseUuid = HelpersFunctions.ParseToken(Request.Headers.Authorization)?.GetUserId() ?? "";
      var date = await _exerciseLogRepository.GetMostRecentButNotTodayDateByUserFirebaseUuid(userFirebaseUuid);

      var queryBuilder = new GetExerciseLogsQueryBuilder()
        .AndUserFirebaseUuid(userFirebaseUuid)
        .AndBeginParen()
        .WhereDate(DateTime.Now.Date)
        .OrDate(date?.Date ?? DateTime.Now.Date)
        .CloseParen();

      var exerciseLogs = await _exerciseLogRepository.GetExerciseLogsAsync(
          0,
          1000,
          queryBuilder);

      var exerciseLogsDto = MapToExerciseLogDto(exerciseLogs);

      return Ok(new ExerciseLogsDto() { Data = exerciseLogsDto });
    }

    [HttpGet]
    public async Task<ActionResult<ExerciseLogsDto>> GetExerciseLogs(
        [FromQuery] PaginationRequest pagination
    )
    {
      try
      {
        var token = await FirebaseAuth
            .GetAuth(_app)
            .VerifyIdTokenAsync(
                Request.Headers.Authorization.FirstOrDefault()?.Replace("Bearer ", "") ?? "");
      }
      catch (ArgumentException ex)
      {
        return Unauthorized(ex.Message);
      }
      catch (FirebaseAuthException ex)
      {
        return Unauthorized(ex.Message);
      }
      catch (Exception ex)
      {
        return Unauthorized(ex.Message);
      }

      var userFirebaseUuid = HelpersFunctions.ParseToken(Request.Headers.Authorization)?.GetUserId() ?? "";

      var queryBuilder = new GetExerciseLogsQueryBuilder().AndUserFirebaseUuid(userFirebaseUuid);

      var exerciseLogs = await _exerciseLogRepository.GetExerciseLogsAsync(
          pagination.Page ?? 0,
          pagination.Count ?? 1000,
          queryBuilder
      );

      var exerciseLogsDtos = MapToExerciseLogDto(exerciseLogs);

      return Ok(new ExerciseLogsDto() { Data = exerciseLogsDtos });
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
      var userFirebaseUuid = HelpersFunctions.ParseToken(Request.Headers.Authorization)?.GetUserId() ?? "";
      var exerciseLogId = await _exerciseLogRepository.CreateExerciseLogAsync(request.ExerciseLog!, userFirebaseUuid);

      return TypedResults.Ok(exerciseLogId);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Put(
        [FromRoute] int id,
        [FromBody] ExerciseLogRequest request
    )
    {
      var logDb = await _exerciseLogRepository.GetExerciseLogByIdAsync(id);

      if (logDb is null)
      {
        return BadRequest($"Log with id '{id}' does not exist.");
      }

      logDb = logDb with
      {
        ExerciseLogDate = request.ExerciseLog!.ExerciseLogDate,
        ExerciseLogExerciseId = request.ExerciseLog.ExerciseLogExerciseId,
        Series = request.ExerciseLog!.Series?.Select(x => x with { ExerciseLogId = id }),
      };

      await _exerciseLogRepository.UpdateExerciseLogAsync(logDb);

      return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete([FromRoute] int id)
    {
      var logDb = await _exerciseLogRepository.GetExerciseLogByIdAsync(id);

      if (logDb is null)
      {
        return BadRequest($"Log with id '{id}' does not exist.");
      }

      await _exerciseLogRepository.DeleteExerciseLogAsync(id);

      return Ok();
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
