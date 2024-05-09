using Firebase.Database;
using Firebase.Database.Query;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace robertly.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogsController : ControllerBase
    {
        private readonly JsonSerializerOptions _jsonSerializerOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        private readonly FirebaseApp _app;
        private readonly FirebaseClient _client;
        private readonly IConfiguration _config;
        private readonly IOptions<GoogleCredentialOptions> _googleCredentialOptions1;
        private readonly GoogleCredentialOptions _googleCredentialOptions;
        private readonly ChildQuery _logsDb;
        private readonly ChildQuery _exercisesDb;
        private readonly ChildQuery _usersDb;

        public LogsController(FirebaseApp app, FirebaseClient client, IConfiguration config, IOptions<GoogleCredentialOptions> googleCredentialOptions)
        {
            _app = app;
            _client = client;
            _config = config;
            _googleCredentialOptions1 = googleCredentialOptions;
            _googleCredentialOptions = googleCredentialOptions.Value;
            _logsDb = _client.ChildLogs(_config);
            _exercisesDb = _client.ChildExercises(_config);
            _usersDb = _client.ChildUsers(_config);
        }

        [HttpGet]
        public async Task<ActionResult<GetLogsResponseV2>> Get()
        {
            try
            {
                var token = await FirebaseAuth.GetAuth(_app).VerifyIdTokenAsync(Request.Headers.Authorization.FirstOrDefault()?.Replace("Bearer ", "") ?? "");
            }
            catch (ArgumentException ex)
            {

            }
            catch (FirebaseAuthException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {

            }

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
