using Firebase.Database;
using Firebase.Database.Offline;
using Firebase.Database.Query;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Threading.Tasks;
using static System.IO.File;

namespace robertly.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MigrationController : Controller
    {
        private readonly FirebaseClient _client;
        private readonly ChildQuery _exercisesDb;
        private readonly ChildQuery _logsDb;

        public MigrationController(FirebaseClient client, IConfiguration config)
        {
            _client = client;
            _logsDb = client.ChildLogs(config);
            _exercisesDb = client.ChildExercises(config);
        }


        [HttpGet]
        public async Task Migrate()
        {
            var exercisesDb = (await _exercisesDb.OnceAsync<ExerciseDb>()).Select(x => x.Object.ToExercise(x.Key));
            var logs = JsonSerializer.Deserialize<IEnumerable<ExcelLog>>(ReadAllText("logs.json"), new JsonSerializerOptions() { PropertyNameCaseInsensitive = true }) ?? [];
            var grouped = logs.GroupBy(x => new { x.Date, x.User }).Select(x => x.GroupBy(y => y.Name));
            var mapped = grouped.Select(x =>
                {
                    var filterEmptyLogs = x.Count() > 1 ? x.Where(x => x.Key is not null) : x;
                    return filterEmptyLogs.Select(y =>
                    {
                        var firstSerie = y.First();

                        var splitted = firstSerie.Date.Split(['-', '/']);
                        var (date, month, year) = (int.Parse(splitted[0]), int.Parse(splitted[1]), int.Parse(splitted[2]));

                        return new LogDb(
                            firstSerie.User,
                            exercisesDb.FirstOrDefault(x => x.Name == firstSerie.Name!)?.Id,
                            new DateTime(year, month, date),
                            firstSerie.Name is null ? [] : y.Select(z => new Serie(z.Reps ?? -1, z.WeightKg ?? -1))
                        );
                    });
                })
                .SelectMany(x => x)
                .Where(x => x is not null)
                .OrderBy(x => x!.Date);

            var logsDb = _client.Child("logs").AsRealtimeDatabase<LogDb>("", "", StreamingOptions.None, InitialPullStrategy.None, false);

            foreach (var log in mapped)
            {
                logsDb.Post(log);
            }

            var result = JsonSerializer.Serialize(
                logsDb.Database.ToDictionary(x => x.Key, x => x.Value.Deserialize<LogDb>()),
                new JsonSerializerOptions() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        }

        [HttpGet("{userName}/{userId}")]
        public async Task<string> MigrateUser(string userName, string userId)
        {
            var logs = (await _logsDb.OnceAsync<LogDb>()).ToDictionary(x => x.Key, x => x.Object.ToLog(x.Key));
            var logsV2 = logs.ToDictionary(x => x.Key, x =>
            {
                if (x.Value.User == userName)
                {
                    return new LogDbV2(userId, null, x.Value.ExerciseId, x.Value.Date, x.Value.Series);
                }
                else
                {
                    return new LogDbV2(null, x.Value.User, x.Value.ExerciseId, x.Value.Date, x.Value.Series);
                }
            });

            var result = JsonSerializer.Serialize(
                logsV2,
                new JsonSerializerOptions() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });

            return result;
        }
    }
}
