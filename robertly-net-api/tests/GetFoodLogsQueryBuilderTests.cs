using System.Threading.Tasks;
using DiffEngine;
using robertly.Helpers;

namespace tests;

public class GetFoodLogsQueryBuilderTests
{
    [Fact]
    public async Task Check_Query_Is_Generated_Correctly_Happy_Path()
    {
        var queryBuilder = new GetFoodLogsQueryBuilder();
        var (query, parameters) = queryBuilder.Build(0, 10);

        var paramsWithValues = parameters.ParameterNames.Select(x => $"{x} = {parameters.Get<object>(x)}");

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