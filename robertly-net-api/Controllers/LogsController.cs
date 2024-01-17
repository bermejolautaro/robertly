using Firebase.Database;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace gym_app_net_api.Controllers
***REMOVED***
    record Serie(int Reps, float WeightInKg);
    record LogPayload(List<Serie> Series);
    record Log(string User, string Exercise, string Date, LogPayload Payload);

    [ApiController]
    [Route("api/[controller]")]
    public class LogsController : ControllerBase
    ***REMOVED***
        private readonly GoogleCredentialOptions _googleCredentialOptions;

        public LogsController(IOptions<GoogleCredentialOptions> googleCredentialOptions)
        ***REMOVED***
            _googleCredentialOptions = googleCredentialOptions.Value;
    ***REMOVED***

        [HttpGet]
        public async Task<IEnumerable<object>> Get()
        ***REMOVED***
            var client = new FirebaseClient(
                _googleCredentialOptions.DatabaseUrl, new()
                ***REMOVED***
                    AuthTokenAsyncFactory = () => GetAccessToken(),
                    AsAccessToken = true
            ***REMOVED***);

            var logs = await client.Child("logs").OnceAsync<Log>();

            return logs;
    ***REMOVED***

        private async Task<string> GetAccessToken()
        ***REMOVED***
            var credential = GoogleCredential.FromJsonParameters(new JsonCredentialParameters()
            ***REMOVED***
                ClientEmail = _googleCredentialOptions.ClientEmail,
                PrivateKey = _googleCredentialOptions.PrivateKey,
                ProjectId = _googleCredentialOptions.ProjectId,
                Type = JsonCredentialParameters.ServiceAccountCredentialType,
        ***REMOVED***).CreateScoped(new string[] ***REMOVED***
                "https://www.googleapis.com/auth/firebase.database",
                "https://www.googleapis.com/auth/userinfo.email",
        ***REMOVED***);

            var c = credential as ITokenAccess;
            return await c.GetAccessTokenForRequestAsync();
    ***REMOVED***
***REMOVED***
***REMOVED***
