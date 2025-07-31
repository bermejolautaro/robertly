using System;
using System.Collections.Generic;

namespace robertly.Models;

public record PaginationRequest(int? Page, int? Count);

public record PaginatedList<T>()
{
  public required IEnumerable<T> Data { get; init; }
  public int PageCount { get; set; }
}