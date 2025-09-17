using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using robertly.DataQueries;
using robertly.Helpers;
using robertly.Models;
using robertly.Repositories;

namespace robertly.Controllers;

[ApiController]
[Route("api/food-logs")]
public class FoodLogController : ControllerBase
{
  private readonly AppLogsRepository _appLogsRepository;
  private readonly GenericRepository _genericRepository;
  private readonly ConnectionHelper _connection;
  private readonly SchemaHelper _schema;
  private readonly UserHelper _userHelper;

  public FoodLogController(
      AppLogsRepository appLogsRepository,
      GenericRepository genericRepository,
      ConnectionHelper connection,
      SchemaHelper schema,
      UserHelper userHelper) =>
      (_appLogsRepository, _genericRepository, _connection, _schema, _userHelper) =
      (appLogsRepository, genericRepository, connection, schema, userHelper);

  [HttpGet]
  public async Task<PaginatedList<Models.FoodLog>> GetFoodLogs(int page, int count)
  {
    return await GetFoodLogs(new GetFoodLogsQueryBuilder(), page, count);
  }

  [HttpGet("{foodLogId}")]
  public async Task<Models.FoodLog?> GetFoodLogById(int foodLogId)
  {
    var queryBuilder = new GetFoodLogsQueryBuilder()
        .AndFoodLogId(foodLogId);

    var foodLogs = await GetFoodLogs(queryBuilder, 0, 1);
    return foodLogs.Data.FirstOrDefault();
  }

  [HttpGet("macros")]
  public async Task<Results<Ok<Macros>, UnauthorizedHttpResult>> GetMacros(string timezoneId)
  {
    var user = await _userHelper.GetUser(Request);

    if (user?.UserId is null)
    {
      return TypedResults.Unauthorized();
    }

    using var connection = _connection.Create();

    var today = DateTime.UtcNow;
    var timezone = TimeZoneInfo.FindSystemTimeZoneById(timezoneId);
    var todayInTimezone = TimeZoneInfo.ConvertTimeFromUtc(today, timezone);

    var day = todayInTimezone.Day;

    var currentYear = todayInTimezone.Year;
    var currentMonth = todayInTimezone.Month;
    var currentDay = todayInTimezone.Day;
    var endOfMonth = DateTime.DaysInMonth(currentYear, currentMonth);

    var dayOfWeek = DateTime.Today.DayOfWeek;
    var daysUntilStartOfWeek = dayOfWeek switch
    {
      DayOfWeek.Sunday => 6,
      _ => (int)dayOfWeek - 1
    };

    var startOfWeek = DateTime.Today.AddDays(daysUntilStartOfWeek * -1);
    var endOfWeek = startOfWeek.AddDays(6);

    var query = $"""
    -- MacrosInDate
    SELECT
      SUM((COALESCE(FL.Calories, 0) + COALESCE(F.Calories, 0) * COALESCE(FL.Amount, 0)) / COALESCE(F.Amount, 1)) AS Calories,
      SUM((COALESCE(FL.Protein, 0) + COALESCE(F.Protein, 0) * COALESCE(FL.Amount, 0)) / COALESCE(F.Amount, 1)) AS Protein
    FROM FoodLogs FL
    LEFT JOIN Foods F ON FL.FoodId = F.FoodId
    WHERE FL.Date = '{currentYear}-{currentMonth}-{currentDay}'
    AND UserId = @UserId;

    -- MacrosInWeek
    SELECT
      SUM((COALESCE(FL.Calories, 0) + COALESCE(F.Calories, 0) * COALESCE(FL.Amount, 0)) / COALESCE(F.Amount, 1)) AS Calories,
      SUM((COALESCE(FL.Protein, 0) + COALESCE(F.Protein, 0) * COALESCE(FL.Amount, 0)) / COALESCE(F.Amount, 1)) AS Protein
    FROM FoodLogs FL
    LEFT JOIN Foods F ON FL.FoodId = F.FoodId
    WHERE Date >= '{startOfWeek.Year}-{startOfWeek.Month}-{startOfWeek.Day}'
    AND Date <= '{endOfWeek.Year}-{endOfWeek.Month}-{endOfWeek.Day}'
    AND UserId = @UserId;

    -- MacrosInMonth
    SELECT
      SUM((COALESCE(FL.Calories, 0) + COALESCE(F.Calories, 0) * COALESCE(FL.Amount, 0)) / COALESCE(F.Amount, 1)) AS Calories,
      SUM((COALESCE(FL.Protein, 0) + COALESCE(F.Protein, 0) * COALESCE(FL.Amount, 0)) / COALESCE(F.Amount, 1)) AS Protein
    FROM FoodLogs FL
    LEFT JOIN Foods F ON FL.FoodId = F.FoodId
    WHERE Date >= '{currentYear}-{currentMonth}-1'
    AND Date <= '{currentYear}-{currentMonth}-{endOfMonth}'
    AND UserId = @UserId;

    -- MacrosInYear
    SELECT
      SUM((COALESCE(FL.Calories, 0) + COALESCE(F.Calories, 0) * COALESCE(FL.Amount, 0)) / COALESCE(F.Amount, 1)) AS Calories,
      SUM((COALESCE(FL.Protein, 0) + COALESCE(F.Protein, 0) * COALESCE(FL.Amount, 0)) / COALESCE(F.Amount, 1)) AS Protein
    FROM FoodLogs FL
    LEFT JOIN Foods F ON FL.FoodId = F.FoodId
    WHERE Date >= '{currentYear}-1-1'
    AND Date <= '{currentYear}-12-31'
    AND UserId = @UserId;
    """;

    using var values = await connection.QueryMultipleAsync(
        _schema.AddSchemaToQuery(query),
        new { UserId = user.UserId });

    var inDate = values.ReadFirst<DataQueries.Macro>();
    var inWeek = values.ReadFirst<DataQueries.Macro>();
    var inMonth = values.ReadFirst<DataQueries.Macro>();
    var inYear = values.ReadFirst<DataQueries.Macro>();

    return TypedResults.Ok(new Models.Macros
    {
      CaloriesInDate = inDate.Calories ?? 0,
      ProteinInDate = inDate.Protein ?? 0,
      CaloriesInWeek = inWeek.Calories ?? 0,
      ProteinInWeek = inWeek.Protein ?? 0,
      CaloriesInMonth = inMonth.Calories ?? 0,
      ProteinInMonth = inMonth.Protein ?? 0,
      CaloriesInYear = inYear.Calories ?? 0,
      ProteinInYear = inYear.Protein ?? 0
    });
  }

  [HttpGet("macros-daily")]
  public async Task<Results<Ok<PaginatedList<Models.Macro>>, UnauthorizedHttpResult>> GetMacrosDaily(
    [FromQuery] PaginationRequest pagination
  )
  {
    var user = await _userHelper.GetUser(Request);

    if (user?.UserId is null)
    {
      return TypedResults.Unauthorized();
    }

    using var connection = _connection.Create();

    var (page, count) = pagination;

    var query =
      $"""
      SELECT
        FL.Date,
        SUM((COALESCE(FL.Calories, 0) + COALESCE(F.Calories, 0) * COALESCE(FL.Amount, 0)) / COALESCE(F.Amount, 1)) AS Calories,
        SUM((COALESCE(FL.Protein, 0) + COALESCE(F.Protein, 0) * COALESCE(FL.Amount, 0)) / COALESCE(F.Amount, 1)) AS Protein,
        (
          SELECT MAX(G.TargetValue)
          FROM Goals G
          WHERE G.UserId = FL.UserId
          AND G.GoalType = 'calories'
          AND CAST(G.CreatedAtUtc AS DATE) <= FL.Date
        ) AS CaloriesGoal,
        (
          SELECT MAX(G.TargetValue)
          FROM Goals G
          WHERE G.UserId = FL.UserId
          AND G.GoalType = 'protein'
          AND CAST(G.CreatedAtUtc AS DATE) <= FL.Date
        ) AS ProteinGoal
      FROM FoodLogs FL
      LEFT JOIN Foods F ON FL.FoodId = F.FoodId
      WHERE UserId = @UserId
      GROUP BY FL.Date, FL.UserId
      ORDER BY Date DESC
      OFFSET {(page * count) ?? 0} LIMIT {count ?? 10};

      SELECT COUNT(DISTINCT FL.Date)
      FROM FoodLogs FL
      LEFT JOIN Foods F ON FL.FoodId = F.FoodId
      WHERE UserId = @UserId;
      """;

    query = _schema.AddSchemaToQuery(query);

    var values = await connection.QueryMultipleAsync(query, new { UserId = user.UserId });

    var macros = values.Read<DataQueries.Macro>().ToList();
    var totalCount = values.ReadFirst<int>();

    return TypedResults.Ok(new PaginatedList<Models.Macro>
    {
      Data = macros.Select(x => x.Map<Models.Macro>()),
      PageCount = totalCount / (count ?? 1)
    });
  }

  [HttpPost]
  public async Task<Results<UnauthorizedHttpResult, Ok, BadRequest>> Post([FromBody] Models.FoodLog foodLog)
  {
    var user = await _userHelper.GetUser(Request);

    if (user?.UserId is null)
    {
      return TypedResults.Unauthorized();
    }

    if (foodLog.User?.UserId is null)
    {
      return TypedResults.BadRequest();
    }

    DataModels.FoodLog foodLogDataModel;

    if (foodLog.QuickAdd ?? false)
    {
      if (string.IsNullOrWhiteSpace(foodLog.Description) || foodLog.Description.Length > 255)
      {
        return TypedResults.BadRequest();
      }

      foodLogDataModel = new DataModels.FoodLog
      {
        FoodLogId = null,
        Date = foodLog.Date,
        UserId = foodLog.User.UserId,
        CreatedByUserId = user.UserId,
        CreatedAtUtc = DateTime.UtcNow,
        LastUpdatedByUserId = user.UserId,
        LastUpdatedAtUtc = DateTime.UtcNow,
        QuickAdd = true,
        FoodId = null,
        Amount = null,
        Description = foodLog.Description,
        Calories = foodLog.Calories,
        Protein = foodLog.Protein,
        Fat = foodLog.Fat,
      };
    }
    else
    {
      if (foodLog.Food is null)
      {
        return TypedResults.BadRequest();
      }

      foodLogDataModel = new DataModels.FoodLog()
      {
        FoodLogId = null,
        Date = foodLog.Date,
        UserId = foodLog.User.UserId,
        CreatedByUserId = user.UserId,
        CreatedAtUtc = DateTime.UtcNow,
        LastUpdatedByUserId = user.UserId,
        LastUpdatedAtUtc = DateTime.UtcNow,
        QuickAdd = false,
        FoodId = foodLog.Food.FoodId,
        Amount = foodLog.Amount,
        Description = null,
        Protein = null,
        Calories = null,
        Fat = null,
      };
    }

    await _genericRepository.CreateAsync<DataModels.FoodLog>(foodLogDataModel);

    return TypedResults.Ok();
  }

  [HttpPut("{foodLogId}")]
  public async Task<Results<UnauthorizedHttpResult, BadRequest, BadRequest<string>, Ok>> Put([FromRoute] int foodLogId, [FromBody] Models.FoodLog foodLog)
  {
    var user = await _userHelper.GetUser(Request);

    if (user?.UserId is null)
    {
      return TypedResults.Unauthorized();
    }

    if (foodLog.FoodLogId is null)
    {
      return TypedResults.BadRequest();
    }

    if (foodLog.User?.UserId is null)
    {
      return TypedResults.BadRequest();
    }

    var foodLogDb = await _genericRepository.GetByIdAsync<DataModels.FoodLog>(foodLog.FoodLogId.Value);

    if (foodLogDb is null)
    {
      return TypedResults.BadRequest($"FoodLog with id '{foodLogId}' does not exist.");
    }

    DataModels.FoodLog foodLogDataModel;

    if (foodLog.QuickAdd ?? false)
    {
      if (string.IsNullOrWhiteSpace(foodLog.Description) || foodLog.Description.Length > 255)
      {
        return TypedResults.BadRequest();
      }

      foodLogDataModel = new DataModels.FoodLog()
      {
        FoodLogId = foodLogDb.FoodLogId,
        UserId = foodLog.User.UserId,
        Date = foodLog.Date,
        CreatedByUserId = user.UserId,
        CreatedAtUtc = DateTime.UtcNow,
        LastUpdatedByUserId = user.UserId,
        LastUpdatedAtUtc = DateTime.UtcNow,
        QuickAdd = true,
        FoodId = null,
        Amount = null,
        Calories = foodLog.Calories,
        Protein = foodLog.Protein,
        Fat = foodLog.Fat,
        Description = foodLog.Description,
      };
    }
    else
    {
      if (foodLog.Food?.FoodId is null)
      {
        return TypedResults.BadRequest();
      }

      foodLogDataModel = new DataModels.FoodLog()
      {
        FoodLogId = foodLogDb.FoodLogId,
        Date = foodLog.Date,
        UserId = foodLog.User.UserId,
        CreatedByUserId = user.UserId,
        CreatedAtUtc = DateTime.UtcNow,
        LastUpdatedByUserId = user.UserId,
        LastUpdatedAtUtc = DateTime.UtcNow,
        FoodId = foodLog.Food.FoodId,
        Amount = foodLog.Amount,
        QuickAdd = false,
        Description = null,
        Protein = null,
        Calories = null,
        Fat = null,
      };
    }

    await _genericRepository.UpdateAsync<DataModels.FoodLog>(foodLogDataModel);

    return TypedResults.Ok();
  }

  [HttpDelete("{foodLogId}")]
  public async Task<Results<UnauthorizedHttpResult, BadRequest<string>, Ok>> Delete([FromRoute] int foodLogId)
  {
    var user = await _userHelper.GetUser(Request);

    if (user?.UserId is null)
    {
      return TypedResults.Unauthorized();
    }

    var foodDb = await _genericRepository.GetByIdAsync<DataModels.FoodLog>(foodLogId);

    if (foodDb is null)
    {
      return TypedResults.BadRequest($"FoodLog with id '{foodLogId}' does not exist.");
    }

    await _genericRepository.DeleteAsync<DataModels.FoodLog>(foodLogId);

    return TypedResults.Ok();
  }

  private async Task<PaginatedList<Models.FoodLog>> GetFoodLogs(GetFoodLogsQueryBuilder queryBuilder, int page, int count)
  {
    using var connection = _connection.Create();

    var (query, parameters) = queryBuilder.Build(page, count);
    query = query.ReplaceSchema(_schema);

    var (queryCount, parametersCount) = queryBuilder.BuildCountQuery();
    queryCount = queryCount.ReplaceSchema(_schema);

    IEnumerable<FoodLog> foodLogs = [];
    int totalCount = 0;

    try
    {
      foodLogs = await connection.QueryAsync<
         DataModels.FoodLog,
         DataModels.Food?,
         DataModels.User,
         Models.FoodLog
     >(
         query,
         (log, food, user) =>
         {
           return log.Map<Models.FoodLog>() with
           {
             Food = food?.Map<Models.Food>(),
             User = user.Map<Models.User>()
           };
         },
         param: parameters,
         splitOn: "FoodId,UserId"
     );
    }
    catch (Exception e)
    {
      await _appLogsRepository.LogError(query, e);
    }

    try
    {
      totalCount = await connection.QuerySingleAsync<int>(
        queryCount,
        parametersCount);
    }
    catch (Exception e)
    {
      await _appLogsRepository.LogError(queryCount, e);
    }

    return new PaginatedList<Models.FoodLog>() { Data = foodLogs, PageCount = totalCount / Math.Max(count, 1) };
  }
}