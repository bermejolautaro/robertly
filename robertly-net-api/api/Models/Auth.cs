namespace robertly.Models;

public record SignInRequest(string Email, string Password);

public record SignUpRequest()
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string DisplayName { get; set; }
}

public record SignUpGoogleRequest()
{
    public required string AccessToken { get; set; }
}