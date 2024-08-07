namespace robertly.Models;

public record User()
{
  public int? UserId { get; init; }
  public required string? UserFirebaseUuid { get; init; }
  public required string? Email { get; init; }
  public required string? Name { get; init; }
}