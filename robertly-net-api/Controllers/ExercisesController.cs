using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace robertly.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExercisesController(FirebaseClient client, IConfiguration config) : ControllerBase
    {
        private readonly ChildQuery _exercisesDb = client.Child($"{config["DatabaseEnvironment"]}/exercises");

        private readonly JsonSerializerOptions _jsonSerializerOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };


        [HttpGet]
        public async Task<ActionResult<GetExercisesResponse>> Get()
        {
            var logs = (await _exercisesDb.OnceAsync<ExerciseDb>())
                .Select(x => x.Object.ToExercise(x.Key));

            return Ok(new GetExercisesResponse(logs));
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
