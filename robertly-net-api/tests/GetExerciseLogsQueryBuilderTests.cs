

using Dapper;
using robertly.Helpers;

namespace tests;

public class GetExerciseLogsQueryBuilderTests
{
  [Fact]
  public async Task Check_Query_Is_Generated_Correctly_Happy_Path()
  {
    var queryBuilder = new GetExerciseLogsQueryBuilder();
    var (query, parameters) = queryBuilder.Build(0, 10);
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
    var queryBuilder = new GetExerciseLogsQueryBuilder()
      .AndDate([new DateTime(2025, 8, 26), new DateTime(1997, 10, 20)])
      .AndLastUpdatedByUserId([])
      .AndUserIds([1, 2, 3])
      .AndExerciseId(null)
      .AndWeightInKg(45);

    var (query, parameters) = queryBuilder.Build(0, 10);
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
    var queryBuilder = new GetExerciseLogsQueryBuilder();
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
    var queryBuilder = new GetExerciseLogsQueryBuilder()
      .AndDate([new DateTime(2025, 8, 26), new DateTime(1997, 10, 20)])
      .AndLastUpdatedByUserId([])
      .AndUserIds([1, 2, 3])
      .AndExerciseId(null)
      .AndWeightInKg(45);
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