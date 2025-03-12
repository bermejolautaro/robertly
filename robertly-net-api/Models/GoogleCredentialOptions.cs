namespace robertly.Models;

public record GoogleCredentialOptions
{
  public const string GoogleCredential = "GoogleCredential";

  public string? ClientEmail { get; set; }
  public string? PrivateKey { get; set; }
  public string? ProjectId { get; set; }
  public string? ApiKey { get; set; }
  public string? AuthDomain { get; set; }
}