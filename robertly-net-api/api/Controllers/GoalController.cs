using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using robertly.Helpers;
using robertly.Repositories;

namespace robertly.Controllers;

[ApiController]
[Route("api/goals")]
public class GoalController : ControllerBase
{
  private readonly GenericRepository _genericRepository;
  private readonly ConnectionHelper _connection;
  private readonly SchemaHelper _schema;
  private readonly UserHelper _userHelper;

  public GoalController(
    GenericRepository genericRepository,
    ConnectionHelper connection,
    SchemaHelper schema,
    UserHelper userHelper) =>
    (_genericRepository, _connection, _schema, _userHelper) = (genericRepository, connection, schema, userHelper);

  [HttpPost]
  public async Task<Results<UnauthorizedHttpResult, Ok, BadRequest>> Post([FromBody] Models.Goal goal)
  {
    var user = await _userHelper.GetUser(Request);

    if (user?.UserId is null)
    {
      return TypedResults.Unauthorized();
    }

    var goalDataModel = goal.Map<DataModels.Goal>() with
    {
      ExerciseId = goal.ExerciseId,
      GoalType = goal.GoalType,
      MuscleGroup = goal.MuscleGroup,
      TargetDate = goal.TargetDate,
      TargetValue = goal.TargetValue,
      UserId = user.UserId.Value,
      CreatedAtUtc = DateTime.UtcNow,
    };

    await _genericRepository.CreateAsync<DataModels.Goal>(goalDataModel);

    return TypedResults.Ok();
  }

  [HttpGet]
  public async Task<Results<UnauthorizedHttpResult, Ok<IEnumerable<Models.Goal>>>> GetLatestGoalsPerType()
  {
    var user = await _userHelper.GetUser(Request);

    if (user?.UserId is null)
    {
      return TypedResults.Unauthorized();
    }

    using var connection = _connection.Create();

    var query =
      """
      SELECT
         G.GoalId
        ,G.UserId
        ,G.GoalType
        ,G.TargetValue
        ,G.TargetDate
        ,G.ExerciseId
        ,G.MuscleGroup
        ,G.CreatedAtUtc
      FROM Goals G
      INNER JOIN (
        SELECT GoalType, MAX(CreatedAtUtc) AS LatestCreatedAtUtc
        FROM Goals
        GROUP BY GoalType, MuscleGroup, ExerciseId
      ) Latest
      ON G.GoalType = Latest.GoalType AND G.CreatedAtUtc = Latest.LatestCreatedAtUtc
      WHERE G.UserId = @UserId
      """;

    query = _schema.AddSchemaToQuery(query);

    var goalsDataModels = await connection.QueryAsync<DataModels.Goal>(query, new { UserId = user.UserId });

    return TypedResults.Ok(goalsDataModels.Select(x => x.Map<Models.Goal>()));
  }
}
