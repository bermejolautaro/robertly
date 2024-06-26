using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Firebase.Database;
using Firebase.Database.Query;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using robertly.Models;
using robertly.Repositories;

namespace robertly.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogsController : ControllerBase
    {
        private readonly JsonSerializerOptions _jsonSerializerOptions =
            new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        private readonly ExerciseLogsRepository _exerciseLogsRepository;
        private readonly FirebaseApp _app;
        private readonly FirebaseClient _client;
        private readonly IConfiguration _config;
        private readonly ChildQuery _logsDb;
        private readonly ChildQuery _exercisesDb;
        private readonly ChildQuery _usersDb;

        public LogsController(
            ExerciseLogsRepository exerciseLogsRepository,
            FirebaseApp app,
            FirebaseClient client,
            IConfiguration config)
        {
            _exerciseLogsRepository = exerciseLogsRepository;
            _app = app;
            _client = client;
            _config = config;
            _logsDb = _client.ChildLogs(_config);
            _exercisesDb = _client.ChildExercises(_config);
            _usersDb = _client.ChildUsers(_config);
        }

        [HttpGet]
        public async Task<ActionResult<GetLogsResponseV3>> Get(
            [FromQuery] PaginationRequest pagination
        )
        {
            try
            {
                var token = await FirebaseAuth
                    .GetAuth(_app)
                    .VerifyIdTokenAsync(
                        Request.Headers.Authorization.FirstOrDefault()?.Replace("Bearer ", "") ?? ""
                    );
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

            var userFirebaseUuid =
                Helpers.ParseToken(Request.Headers.Authorization)?.GetUserId() ?? "";

            var exerciseLogs = await _exerciseLogsRepository.GetExerciseLogsAsync(
                pagination.Page ?? 0,
                pagination.Count ?? 1000,
                userFirebaseUuid: userFirebaseUuid
            );

            static int? getTotal(ExerciseLog log)
            {
                return log.Series!.All(x =>
                    x.WeightInKg == log.Series!.FirstOrDefault()?.WeightInKg
                )
                    ? log.Series!.Sum(x => x.Reps)
                    : null;
            }

            var logsDtos = exerciseLogs.Select(log =>
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

            return Ok(new GetLogsResponseV3(logsDtos));
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ExerciseLogRequest request)
        {
            await _exerciseLogsRepository.CreateExerciseLogAsync(request.ExerciseLog!);

            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(
            [FromRoute] int id,
            [FromBody] ExerciseLogRequest request
        )
        {
            var logDb = await _exerciseLogsRepository.GetExerciseLogByIdAsync(id);

            if (logDb is null)
            {
                return BadRequest($"Log with id '{id}' does not exist.");
            }

            logDb = logDb with
            {
                Series = request.ExerciseLog!.Series?.Select(x => x with { ExerciseLogId = id })
            };

            await _exerciseLogsRepository.UpdateExerciseLogAsync(logDb);

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete([FromRoute] int id)
        {
            var logDb = await _exerciseLogsRepository.GetExerciseLogByIdAsync(id);

            if (logDb is null)
            {
                return BadRequest($"Log with id '{id}' does not exist.");
            }

            await _exerciseLogsRepository.DeleteExerciseLogAsync(id);

            return Ok();
        }
    }
}
