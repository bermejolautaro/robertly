using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Linq;
using System.Threading.Tasks;

namespace robertly.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExercisesController(FirebaseClient client, IConfiguration config) : ControllerBase
    {
        private readonly ChildQuery _exercisesDb = client.Child($"{config["DatabaseEnvironment"]}/exercises");

        [HttpGet]
        public async Task<ActionResult<GetExercisesResponse>> Get()
        {
            var logs = (await _exercisesDb.OnceAsync<ExerciseDb>())
                .Select(x => x.Object.ToExercise(x.Key));

            return Ok(new GetExercisesResponse(logs));
        }
    }
}
