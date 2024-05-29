using Dapper;
using Firebase.Auth;
using Firebase.Auth.Providers;
using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Text.Json;
using System.Threading.Tasks;

namespace robertly.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExercisesController : ControllerBase
    {

        private readonly FirebaseClient _client;
        private readonly FirebaseAuthClient _authClient;
        private readonly IConfiguration _config;
        private readonly ChildQuery _exercisesDb;
        private readonly ChildQuery _usersDb;
        private readonly JsonSerializerOptions _jsonSerializerOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        public ExercisesController(FirebaseClient client, FirebaseAuthClient authClient, IConfiguration config)
        {
            _client = client;
            _authClient = authClient;
            _config = config;
            _exercisesDb = _client.ChildExercises(config);
            _usersDb = _client.ChildUsers(config);
        }

        [HttpGet]
        public async Task<ActionResult<GetExercisesResponse>> Get()
        {
            using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);

            var exercises = await connection.QueryAsync<Exercise>(
                """
                SELECT
                     E.ExerciseId
                    ,E.Name
                    ,E.MuscleGroup
                    ,E.Type
                FROM Exercises E
                """);

            return Ok(new GetExercisesResponse(exercises));
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] PostPutExerciseRequest request)
        {
            var exerciseDb = new ExerciseDb(request.Name, request.MuscleGroup, request.Type);
            var result = await _exercisesDb.PostAsync(JsonSerializer.Serialize(exerciseDb, _jsonSerializerOptions));

            return Ok(exerciseDb.ToExercise(result.Key));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put([FromRoute] string id, [FromBody] PostPutExerciseRequest request)
        {
            var exerciseDbToUpdate = new ExerciseDb(request.Name, request.MuscleGroup, request.Type);

            var exerciseDb = await _exercisesDb.Child(id).OnceSingleAsync<ExerciseDb>();

            if (exerciseDb is null)
            {
                return BadRequest($"Exercise with id '{id}' does not exist.");
            }

            await _exercisesDb.Child(id).PutAsync(JsonSerializer.Serialize(exerciseDbToUpdate, _jsonSerializerOptions));

            return Ok(exerciseDbToUpdate.ToExercise(id));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete([FromRoute] string id)
        {
            var exerciseDb = await _exercisesDb.Child(id).OnceSingleAsync<ExerciseDb>();

            if (exerciseDb is null)
            {
                return BadRequest($"Exercise with id '{id}' does not exist.");
            }

            await _exercisesDb.Child(id).DeleteAsync();

            return Ok();
        }
    }
}
