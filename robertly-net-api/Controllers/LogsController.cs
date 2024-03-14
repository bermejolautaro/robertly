using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace robertly.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogsController(FirebaseClient client, IConfiguration config) : ControllerBase
    {
        private readonly ChildQuery _logsDb = client.ChildLogs(config);
        private readonly ChildQuery _exercisesDb = client.ChildExercises(config);
        private readonly ChildQuery _usersDb = client.ChildUsers(config);

        private readonly JsonSerializerOptions _jsonSerializerOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        [HttpGet]
        public async Task<ActionResult<GetLogsResponseV2>> Get()
        {
            var userId = Helpers.ParseToken(Request.Headers.Authorization)?.GetUserId() ?? "";

            var logs = (await _logsDb.OnceAsync<LogDbV2>()).Select(x => x.Object.ToLogV2(x.Key));
            var exercises = (await _exercisesDb.OnceAsync<ExerciseDb>()).Select(x => x.Object.ToExercise(x.Key));
            var users = (await _usersDb.OnceAsync<UserDb>()).Select(x => x.Object.ToUser(x.Key));

            var logsDtos = logs.Select(
                log => new LogDtoV2(
                    log.Id, 
                    users.FirstOrDefault(x => x.Uid == log.UserId)?.DisplayName ?? log.User, 
                    log.UserId, 
                    exercises.FirstOrDefault(x => x.Id == log.ExerciseId), 
                    log.Date, 
                    log.Series))
                .Where(x => string.IsNullOrEmpty(userId) || x.UserId == userId);

            return Ok(new GetLogsResponseV2(logsDtos));
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] PostPutLogRequest request)
        {
            var logDb = new LogDbV2(request.UserId, request.UserId is null ? request.User : null, request.ExerciseId, request.Date, request.Series);
            var result = await _logsDb.PostAsync(JsonSerializer.Serialize(logDb, _jsonSerializerOptions));

            return Ok(logDb.ToLogV2(result.Key));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put([FromRoute] string id, [FromBody] PostPutLogRequest request)
        {
            var logDbToUpdate = new LogDbV2(request.UserId, request.UserId is null ? request.User : null, request.ExerciseId, request.Date, request.Series);

            var logDb = await _logsDb.Child(id).OnceSingleAsync<LogDb>();

            if (logDb is null)
            {
                return BadRequest($"Log with id '{id}' does not exist.");
            }

            await _logsDb.Child(id).PutAsync(JsonSerializer.Serialize(logDbToUpdate, _jsonSerializerOptions));

            return Ok(logDbToUpdate.ToLogV2(id));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete([FromRoute] string id)
        {
            var logDb = await _logsDb.Child(id).OnceSingleAsync<LogDb>();

            if (logDb is null)
            {
                return BadRequest($"Log with id '{id}' does not exist.");
            }

            await _logsDb.Child(id).DeleteAsync();

            return Ok();
        }
    }
}
