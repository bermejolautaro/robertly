using System;
using System.Collections.Generic;
using System.Linq;

namespace robertly.Models;

public record User
{
  public int? UserId { get; init; }
  public required string? UserFirebaseUuid { get; init; }
  public required string? Email { get; init; }
  public required string? Name { get; init; }
  public IEnumerable<User> AssignedUsers { get; set; } = [];

  public IEnumerable<int> GetAllowedUserIds()
  {
    if (UserId is null)
    {
      throw new ArgumentNullException("UserId should never be null");
    }

    var assignedUsersIds = AssignedUsers
            .Select(x => x.UserId ?? throw new ArgumentException("Assigned UserIds should never be null"));

    return [UserId.Value, .. assignedUsersIds];
  }
}