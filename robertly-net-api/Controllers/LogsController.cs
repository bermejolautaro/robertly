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
        private readonly ChildQuery _logsDb = client.Child($"{config["DatabaseEnvironment"]}/logs");
        private readonly ChildQuery _exercisesDb = client.Child($"{config["DatabaseEnvironment"]}/exercises");

        private readonly JsonSerializerOptions _jsonSerializerOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        [HttpGet]
        public async Task<ActionResult<GetLogsResponse>> Get()
        {
            var logs = (await _logsDb.OnceAsync<LogDb>()).Select(x => x.Object.ToLog(x.Key));
            var exercisesDb = (await _exercisesDb.OnceAsync<ExerciseDb>()).Select(x => x.Object.ToExercise(x.Key));

            var logsDtos = logs.Select(log => new LogDto(log.Id, log.User, exercisesDb.FirstOrDefault(x => x.Id == log.ExerciseId), log.Date, log.Series));

            return Ok(new GetLogsResponse(logsDtos));
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] PostPutLogRequest request)
        {
            var logDb = new LogDb(request.User, request.ExerciseId, request.Date, request.Series);
            var result = await _logsDb.PostAsync(JsonSerializer.Serialize(logDb, _jsonSerializerOptions));

            return Ok(logDb.ToLog(result.Key));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put([FromRoute] string id, [FromBody] PostPutLogRequest request)
        {
            var logDbToUpdate = new LogDb(request.User, request.ExerciseId, request.Date, request.Series);

            var logDb = await _logsDb.Child(id).OnceSingleAsync<LogDb>();

            if (logDb is null)
            {
                return BadRequest($"Log with id '{id}' does not exists.");
            }

            await _logsDb.Child(id).PutAsync(JsonSerializer.Serialize(logDbToUpdate, _jsonSerializerOptions));

            return Ok(logDbToUpdate.ToLog(id));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete([FromRoute] string id)
        {
            var logDb = await _logsDb.Child(id).OnceSingleAsync<LogDb>();

            if (logDb is null)
            {
                return BadRequest($"Log with id '{id}' does not exists.");
            }

            await _logsDb.Child(id).DeleteAsync();

            return Ok();
        }
    }
}
