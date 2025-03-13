namespace robertly.Models;

public record ConfigurationOptions
{
  public string? DatabaseEnvironment { get; set; }
  public string? PostgresConnectionString { get; set; }
  public string? TestUserFirebaseUuid { get; set; }
}