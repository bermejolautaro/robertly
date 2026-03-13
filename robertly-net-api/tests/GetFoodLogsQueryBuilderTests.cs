using System.Threading.Tasks;
using Dapper;
using DiffEngine;
using robertly.Helpers;

namespace tests;

public class GetFoodLogsQueryBuilderTests
{
  [Fact]
  public async Task Check_Query_Is_Generated_Correctly_Happy_Path()
  {
    var queryBuilder = new GetFoodLogsQueryBuilder();
    var (query, parameters) = queryBuilder.Build();
    var dynamicParams = new DynamicParameters(parameters);

    var paramsWithValues = dynamicParams.ParameterNames.Select(x => $"{x} = {dynamicParams.Get<object>(x)}");

    var result =
    $"""
    Query:

    {query}

    Parameters:

    {paramsWithValues.StringJoin("\n")}
    """;

    await Verify(result);
  }

  [Fact]
  public async Task Check_Query_Is_Generated_Correctly_With_Filters()
  {
    var queryBuilder = new GetFoodLogsQueryBuilder()
      .AndDate([new DateTime(2025, 8, 26), new DateTime(1997, 10, 20)])
      .AndFoodLogId(5)
      .AndLastUpdatedByUserId([])
      .AndUserIds([1, 2, 3]);

    var (query, parameters) = queryBuilder.Build();
    var dynamicParams = new DynamicParameters(parameters);


    var paramsWithValues = dynamicParams.ParameterNames.Select(x => $"{x} = {dynamicParams.Get<object>(x)}");

    var result =
    $"""
    Query:

    {query}

    Parameters:

    {paramsWithValues.StringJoin("\n")}
    """;

    await Verify(result);
  }

  [Fact]
  public async Task Check_Count_Query_Is_Generated_Correctly_Happy_Path()
  {
    var queryBuilder = new GetFoodLogsQueryBuilder();
    var (query, parameters) = queryBuilder.BuildCountQuery();
    var dynamicParams = new DynamicParameters(parameters);

    var paramsWithValues = dynamicParams.ParameterNames.Select(x => $"{x} = {dynamicParams.Get<object>(x)}");

    var result =
    $"""
    Query:

    {query}

    Parameters:

    {paramsWithValues.StringJoin("\n")}
    """;

    await Verify(result);
  }

  [Fact]
  public async Task Check_Count_Query_Is_Generated_Correctly_With_Filters()
  {
    var queryBuilder = new GetFoodLogsQueryBuilder()
      .AndDate([new DateTime(2025, 8, 26), new DateTime(1997, 10, 20)])
      .AndFoodLogId(5)
      .AndLastUpdatedByUserId([])
      .AndUserIds([1, 2, 3]);
    ;
    var (query, parameters) = queryBuilder.BuildCountQuery();
    var dynamicParams = new DynamicParameters(parameters);

    var paramsWithValues = dynamicParams.ParameterNames.Select(x => $"{x} = {dynamicParams.Get<object>(x)}");

    var result =
    $"""
    Query:

    {query}

    Parameters:

    {paramsWithValues.StringJoin("\n")}
    """;

    await Verify(result);
  }
}