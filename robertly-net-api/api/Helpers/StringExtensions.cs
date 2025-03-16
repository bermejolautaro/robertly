using System.Collections.Generic;

namespace robertly.Helpers;

public static class StringExtensions
{
  public static string StringJoin(this IEnumerable<string> source, string separator)
  {
    return string.Join(separator, source);
  }

  public static string ReplaceSchema(this string source, SchemaHelper schema)
  {
    return schema.AddSchemaToQuery(source);
  }
}