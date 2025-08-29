using System.Collections.Generic;
using System.Linq;

namespace robertly.Helpers;

public static class EnumerableExtensions
{
  public static bool IsNullOrEmpty<T>(this IEnumerable<T> source)
  {
    return source is null || !source.Any();
  }
}