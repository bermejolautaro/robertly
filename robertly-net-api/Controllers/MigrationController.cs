using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace robertly.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MigrationController : Controller
    {
        private readonly FirebaseClient _client;
        private readonly ChildQuery _exercisesDb;
        private readonly ChildQuery _usersDb;
        private readonly ChildQuery _logsDb;

        public MigrationController(FirebaseClient client, IConfiguration config)
        {
            _client = client;
            _logsDb = client.ChildLogs(config);
            _exercisesDb = client.ChildExercises(config);
            _usersDb = client.ChildUsers(config);
        }

        // [HttpGet("InsertScriptExercises")]
        // public async Task<string> CreateInsertScriptExercises()
        // {
        //     var exercisesDb = (await _exercisesDb.OnceAsync<ExerciseDb>()).Select(x =>
        //         x.Object.ToExercise(x.Key)
        //     );

        //     var sb = new StringBuilder();

        //     foreach (var exercise in exercisesDb)
        //     {
        //         sb.Append(
        //             $"INSERT INTO Exercises (ExerciseFirebaseId, Name, MuscleGroup, Type) VALUES "
        //         );
        //         sb.Append(
        //             $"('{exercise.ExerciseId}', '{exercise.Name}', '{exercise.MuscleGroup}', '{exercise.Type}');"
        //         );
        //         sb.AppendLine();
        //     }

        //     return sb.ToString();
        // }

        [HttpGet("InsertScriptUsers")]
        public async Task<string> CreateInsertScriptUsers()
        {
            var usersDb = (await _usersDb.OnceAsync<UserDb>()).Select(x => x.Object.ToUser(x.Key));

            var sb = new StringBuilder();

            foreach (var user in usersDb)
            {
                sb.Append($"INSERT INTO Users (UserFirebaseUuid, Email, Name) VALUES ");
                sb.Append($"('{user.UserFirebaseUuid}', '{user.Email}', '{user.Name}');");
                sb.AppendLine();
            }

            return sb.ToString();
        }

        [HttpGet("InsertScriptLogs")]
        public async Task<string> CreateInsertScriptLogs()
        {
            var logsDb = (await _logsDb.OnceAsync<LogDbV2>()).Select(x => x.Object.ToLogV2(x.Key));

            var sb = new StringBuilder();
            var sb2 = new StringBuilder();

            static string map(string? input)
            {
                return input is null ? "NULL" : $"'{input}'";
            }

            foreach (var log in logsDb)
            {
                sb.Append(
                    $"INSERT INTO ExerciseLogs (ExerciseLogFirebaseId, Username, UserId, UserFirebaseUuid, ExerciseId, ExerciseFirebaseId, Date) VALUES "
                );
                sb.Append(
                    $"('{log.Id}', {map(log.User)}, 0, {map(log.UserId)}, 0, '{log.ExerciseId}', '{log.Date.ToString("yyyy-MM-dd")}');"
                );
                sb.AppendLine();

                foreach (var serie in log.Series)
                {
                    sb2.Append(
                        $"INSERT INTO Series (ExerciseLogId, ExerciseLogFirebaseId, Reps, WeightInKg) VALUES "
                    );
                    sb2.Append(
                        $"(0, '{log.Id}', {serie.Reps}, {serie.WeightInKg.ToString(CultureInfo.InvariantCulture)});"
                    );
                    sb2.AppendLine();
                }
            }

            return sb.AppendLine(sb2.ToString()).ToString();
        }

        // [HttpGet]
        // public async Task Migrate()
        // {
        //     var exercisesDb = (await _exercisesDb.OnceAsync<ExerciseDb>()).Select(x =>
        //         x.Object.ToExercise(x.Key)
        //     );
        //     var logs =
        //         JsonSerializer.Deserialize<IEnumerable<ExcelLog>>(
        //             ReadAllText("logs.json"),
        //             new JsonSerializerOptions() { PropertyNameCaseInsensitive = true }
        //         ) ?? [];
        //     var grouped = logs.GroupBy(x => new { x.Date, x.User })
        //         .Select(x => x.GroupBy(y => y.Name));
        //     var mapped = grouped
        //         .Select(x =>
        //         {
        //             var filterEmptyLogs = x.Count() > 1 ? x.Where(x => x.Key is not null) : x;
        //             return filterEmptyLogs.Select(y =>
        //             {
        //                 var firstSerie = y.First();

        //                 var splitted = firstSerie.Date.Split(['-', '/']);
        //                 var (date, month, year) = (
        //                     int.Parse(splitted[0]),
        //                     int.Parse(splitted[1]),
        //                     int.Parse(splitted[2])
        //                 );

        //                 return new LogDb(
        //                     firstSerie.User,
        //                     $"{exercisesDb.FirstOrDefault(x => x.Name == firstSerie.Name!)?.ExerciseId}",
        //                     new DateTime(year, month, date),
        //                     firstSerie.Name is null
        //                         ? []
        //                         : y.Select(z => new Serie(z.Reps ?? -1, z.WeightKg ?? -1))
        //                 );
        //             });
        //         })
        //         .SelectMany(x => x)
        //         .Where(x => x is not null)
        //         .OrderBy(x => x!.Date);

        //     var logsDb = _client
        //         .Child("logs")
        //         .AsRealtimeDatabase<LogDb>(
        //             "",
        //             "",
        //             StreamingOptions.None,
        //             InitialPullStrategy.None,
        //             false
        //         );

        //     foreach (var log in mapped)
        //     {
        //         logsDb.Post(log);
        //     }

        //     var result = JsonSerializer.Serialize(
        //         logsDb.Database.ToDictionary(x => x.Key, x => x.Value.Deserialize<LogDb>()),
        //         new JsonSerializerOptions() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }
        //     );
        // }

        [HttpGet("{userName}/{userId}")]
        public async Task<string> MigrateUser(string userName, string userId)
        {
            var logs = (await _logsDb.OnceAsync<LogDb>()).ToDictionary(
                x => x.Key,
                x => x.Object.ToLog(x.Key)
            );
            var logsV2 = logs.ToDictionary(
                x => x.Key,
                x =>
                {
                    if (x.Value.User == userName)
                    {
                        return new LogDbV2(
                            userId,
                            null,
                            x.Value.ExerciseId,
                            x.Value.Date,
                            x.Value.Series
                        );
                    }
                    else
                    {
                        return new LogDbV2(
                            null,
                            x.Value.User,
                            x.Value.ExerciseId,
                            x.Value.Date,
                            x.Value.Series
                        );
                    }
                }
            );

            var result = JsonSerializer.Serialize(
                logsV2,
                new JsonSerializerOptions() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }
            );

            return result;
        }
    }
}
