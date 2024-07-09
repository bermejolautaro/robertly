using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Mvc;
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
            var userFirebaseUuid = Helpers.ParseToken(Request.Headers.Authorization)?.GetUserId() ?? "";
            var date = await _exerciseLogRepository.GetMostRecentButNotTodayDateByUserFirebaseUuid(userFirebaseUuid);
            var exerciseLogs = await _exerciseLogRepository.GetExerciseLogsAsync(
                0,
                1000,
                userFirebaseUuid: userFirebaseUuid,
                dates: [date.Value, DateTime.Now]);
            var exerciseLogsDto = MapToExerciseLogDto(exerciseLogs);

            return Ok(new ExerciseLogsDto() { Data = exerciseLogsDto });
        }

        [HttpGet]
        public async Task<ActionResult<ExerciseLogsDto>> Get(
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

            var userFirebaseUuid = Helpers.ParseToken(Request.Headers.Authorization)?.GetUserId() ?? "";

            var exerciseLogs = await _exerciseLogRepository.GetExerciseLogsAsync(
                pagination.Page ?? 0,
                pagination.Count ?? 1000,
                userFirebaseUuid: userFirebaseUuid
            );

            var exerciseLogsDtos = MapToExerciseLogDto(exerciseLogs);

            return Ok(new ExerciseLogsDto() { Data = exerciseLogsDtos });
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ExerciseLogRequest request)
        {
            var userFirebaseUuid = Helpers.ParseToken(Request.Headers.Authorization)?.GetUserId() ?? "";
            await _exerciseLogRepository.CreateExerciseLogAsync(request.ExerciseLog!, userFirebaseUuid);

            return Ok();
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
                Series = request.ExerciseLog!.Series?.Select(x => x with { ExerciseLogId = id })
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
            static int? getTotal(ExerciseLog log)
            {
                return log.Series!.All(x =>
                    x.WeightInKg == log.Series!.FirstOrDefault()?.WeightInKg
                )
                    ? log.Series!.Sum(x => x.Reps)
                    : null;
            }

            return exerciseLogs.Select(log =>
            {
                if (log.ExerciseLogId is null)
                {
                    throw new ArgumentException("Impossible state");
                }

                return new ExerciseLogDto(
                    log.ExerciseLogId!.Value,
                    log.User!,
                    log.Exercise!,
                    log.ExerciseLogDate,
                    log.Series!,
                    log.Series!.All(x => x.WeightInKg == log.Series!.FirstOrDefault()?.WeightInKg)
                        ? log.Series!.All(x => x.Reps >= 12)
                            ? "green"
                            : log.Series!.All(x => x.Reps >= 8)
                                ? "yellow"
                                : null
                        : null,
                    getTotal(log),
                    log.Series!.Aggregate(0, (acc, curr) => acc + curr.Reps * (int)curr.WeightInKg),
                    getTotal(log) is not null ? getTotal(log) / log.Series!.Count() : null
                );
            });
        }
    }
}
