using Firebase.Auth;
using Firebase.Auth.Providers;
using Firebase.Database;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using robertly.Repositories;
using System;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<GoogleCredentialOptions>(builder.Configuration.GetSection(GoogleCredentialOptions.GoogleCredential));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var getGoogleCredential = (GoogleCredentialOptions googleCredentialOptions) =>
    GoogleCredential.FromJsonParameters(new JsonCredentialParameters()
    {
        ClientEmail = googleCredentialOptions.ClientEmail,
        PrivateKey = googleCredentialOptions.PrivateKey,
        ProjectId = googleCredentialOptions.ProjectId,
        Type = JsonCredentialParameters.ServiceAccountCredentialType,
    }).CreateScoped([
        "https://www.googleapis.com/auth/firebase.database",
        "https://www.googleapis.com/auth/userinfo.email",
    ]);

builder.Services.AddSingleton(serviceProvider =>
{
    var googleCredentialOptions = serviceProvider.GetService<IOptions<GoogleCredentialOptions>>()?.Value;

    return googleCredentialOptions is null
        ? throw new Exception("Missing google credentials")
        : FirebaseApp.Create(new AppOptions()
        {
            Credential = getGoogleCredential(googleCredentialOptions)
        });
});

builder.Services.AddSingleton(serviceProvider =>
{
    var googleCredentialOptions = serviceProvider.GetService<IOptions<GoogleCredentialOptions>>()?.Value;

    return googleCredentialOptions is null
        ? throw new Exception("Missing google credentials")
        : new FirebaseClient(
                googleCredentialOptions.DatabaseUrl, new()
                {
                    AuthTokenAsyncFactory = async () =>
                    {
                        var credential = getGoogleCredential(googleCredentialOptions);

                        var c = credential as ITokenAccess;
                        return await c.GetAccessTokenForRequestAsync();
                    },
                    AsAccessToken = true
                });
});

builder.Services.AddScoped(serviceProvider =>
{
    var googleCredentialOptions = serviceProvider.GetService<IOptions<GoogleCredentialOptions>>()?.Value;

    if (googleCredentialOptions is null)
    {
        throw new Exception("Missing google credentials");
    }

    var authConfig = new FirebaseAuthConfig()
    {
        ApiKey = googleCredentialOptions.ApiKey,
        AuthDomain = googleCredentialOptions.AuthDomain,
        Providers = new[]
        {
            new GoogleProvider().AddScopes("email"),
            new EmailProvider()
        },
    };

    return new FirebaseAuthClient(authConfig);
});

builder.Services.AddScoped<ExerciseLogsRepository>();

builder.Services.AddApplicationInsightsTelemetry();
builder.Services.AddLogging(logBuilder => logBuilder.AddApplicationInsights());

builder.Services.AddCors();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();


app.UseHttpsRedirection();

app.UseCors(options => options.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

app.UseAuthorization();

app.MapControllers();

app.Run();

public class GoogleCredentialOptions
{
    public const string GoogleCredential = "GoogleCredential";

    public string ClientEmail { get; set; } = "";
    public string PrivateKey { get; set; } = "";
    public string ProjectId { get; set; } = "";
    public string DatabaseUrl { get; set; } = "";
    public string ApiKey { get; set; } = "";
    public string AuthDomain { get; set; } = "";
}