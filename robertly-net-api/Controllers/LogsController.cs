using Firebase.Database;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace gym_app_net_api.Controllers
{
    record Serie(int Reps, float WeightInKg);
    record LogPayload(List<Serie> Series);
    record Log(string User, string Exercise, string Date, LogPayload Payload);

    [ApiController]
    [Route("api/[controller]")]
    public class LogsController : ControllerBase
    {
        private readonly GoogleCredentialOptions _googleCredentialOptions;
        private readonly ILogger<LogsController> _logger;

        public LogsController(ILogger<LogsController> logger, IOptions<GoogleCredentialOptions> googleCredentialOptions)
        {
            _googleCredentialOptions = googleCredentialOptions.Value;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IEnumerable<object>> Get()
        {
            var client = new FirebaseClient(
                _googleCredentialOptions.DatabaseUrl, new()
                {
                    AuthTokenAsyncFactory = () => GetAccessToken(),
                    AsAccessToken = true
                });

            var logs = await client.Child("logs").OnceAsync<Log>();

            return logs;
        }

        private async Task<string> GetAccessToken()
        {
            _logger.LogCritical(_googleCredentialOptions.PrivateKey);

            var credential = GoogleCredential.FromJsonParameters(new JsonCredentialParameters()
            {
                ClientEmail = _googleCredentialOptions.ClientEmail,
                PrivateKey = _googleCredentialOptions.PrivateKey,
                ProjectId = _googleCredentialOptions.ProjectId,
                Type = JsonCredentialParameters.ServiceAccountCredentialType,
            }).CreateScoped(new string[] {
                "https://www.googleapis.com/auth/firebase.database",
                "https://www.googleapis.com/auth/userinfo.email",
            });

            var c = credential as ITokenAccess;
            return await c.GetAccessTokenForRequestAsync();
        }
    }
}
