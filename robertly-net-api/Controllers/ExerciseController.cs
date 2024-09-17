using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Npgsql;
using robertly.Models;
using robertly.Repositories;
using System.Threading.Tasks;

namespace robertly.Controllers
{
  [ApiController]
  [Route("api/exercises")]
  public class ExercisesController : ControllerBase
  {

    private readonly IConfiguration _config;
    private readonly ExerciseRepository _exerciseRepository;

    public ExercisesController(IConfiguration config,
                               ExerciseRepository exerciseRepository)
    {
      _config = config;
      _exerciseRepository = exerciseRepository;
    }

    [HttpGet]
    public async Task<ActionResult<GetExercisesResponse>> Get()
    {
      using var connection = new NpgsqlConnection(_config["PostgresConnectionString"]);

      var exercises = await _exerciseRepository.GetExercisesAsync(0, 1000);
      return Ok(new GetExercisesResponse() { Data = exercises });
    }

    [HttpPost]
    public async Task<ActionResult<int>> Post([FromBody] Exercise exercise)
    {
      await _exerciseRepository.CreateExerciseAsync(exercise);

      return Ok();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Put([FromRoute] int id, [FromBody] Exercise request)
    {

      var exerciseDb = await _exerciseRepository.GetExerciseByIdAsync(id);

      if (exerciseDb is null)
      {
        return BadRequest($"Exercise with id '{id}' does not exist.");
      }

      await _exerciseRepository.UpdateExerciseAsync(request);

      return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete([FromRoute] int id)
    {
      var exerciseDb = await _exerciseRepository.GetExerciseByIdAsync(id);

      if (exerciseDb is null)
      {
        return BadRequest($"Log with id '{id}' does not exist.");
      }

      await _exerciseRepository.DeleteExerciseLogAsync(id);

      return Ok();
    }
  }
}
