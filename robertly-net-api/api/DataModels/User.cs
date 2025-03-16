namespace robertly.DataModels;

public record User : IDataModel
{
  public int? UserId { get; init; }
  public string? UserFirebaseUuid { get; init; }
  public string? Email { get; init; }
  public string? Name { get; init; }
}