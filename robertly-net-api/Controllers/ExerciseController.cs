using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Npgsql;
using robertly.Helpers;
using robertly.Models;
using robertly.Repositories;
using System.Linq;
using System.Threading.Tasks;

namespace robertly.Controllers
{
  [ApiController]
  [Route("api/exercises")]
  public class ExercisesController : ControllerBase
  {
    private readonly GenericRepository _genericRepository;
    private readonly UserHelper _userHelper;

    public ExercisesController(GenericRepository genericRepository, UserHelper userHelper) =>
      (_genericRepository, _userHelper) = (genericRepository, userHelper);

    [HttpGet]
    public async Task<Ok<GetExercisesResponse>> Get()
    {
      var exercises = await _genericRepository.GetAll<DataModels.Exercise>();
      return TypedResults.Ok(new GetExercisesResponse() { Data = exercises.Select(x => x.Map<Models.Exercise>()) });
    }

    [HttpPost]
    public async Task<Results<UnauthorizedHttpResult, Ok>> Post([FromBody] Exercise exercise)
    {
      var user = await _userHelper.GetUser(Request);

      if (user?.UserId is null)
      {
        return TypedResults.Unauthorized();
      }

      await _genericRepository.CreateAsync<DataModels.Exercise>(exercise.Map<DataModels.Exercise>());

      return TypedResults.Ok();
    }

    [HttpPut("{id}")]
    public async Task<Results<UnauthorizedHttpResult, BadRequest, BadRequest<string>, Ok>> Put([FromRoute] int id, [FromBody] Exercise request)
    {
      var user = await _userHelper.GetUser(Request);

      if (user?.UserId is null)
      {
        return TypedResults.Unauthorized();
      }

      if (request.ExerciseId is null)
      {
        return TypedResults.BadRequest();
      }

      var exerciseDb = await _genericRepository.GetByIdAsync<DataModels.Exercise>(request.ExerciseId.Value);

      if (exerciseDb is null)
      {
        return TypedResults.BadRequest($"Exercise with id '{id}' does not exist.");
      }

      request = request with { ExerciseId = exerciseDb.ExerciseId };

      await _genericRepository.UpdateAsync<DataModels.Exercise>(request.Map<DataModels.Exercise>());

      return TypedResults.Ok();
    }

    [HttpDelete("{id}")]
    public async Task<Results<UnauthorizedHttpResult, BadRequest<string>, Ok>> Delete([FromRoute] int id)
    {
      var user = await _userHelper.GetUser(Request);

      if (user?.UserId is null)
      {
        return TypedResults.Unauthorized();
      }

      var exerciseDb = await _genericRepository.GetByIdAsync<DataModels.Exercise>(id);

      if (exerciseDb is null)
      {
        return TypedResults.BadRequest($"Log with id '{id}' does not exist.");
      }

      await _genericRepository.DeleteAsync<DataModels.Exercise>(id);

      return TypedResults.Ok();
    }
  }
}
