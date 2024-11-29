namespace robertly.Models;

public class GoogleCredentialOptions
{
  public const string GoogleCredential = "GoogleCredential";

  public string? ClientEmail { get; set; }
  public string? PrivateKey { get; set; }
  public string? ProjectId { get; set; }
  public string? DatabaseUrl { get; set; }
  public string? ApiKey { get; set; }
  public string? AuthDomain { get; set; }
}