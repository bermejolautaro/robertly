using Firebase.Auth;
using Firebase.Auth.Providers;
using Firebase.Database;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using robertly;
using robertly.DataModels;
using robertly.Helpers;
using robertly.Models;
using robertly.Repositories;
using System;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<GoogleCredentialOptions>(builder.Configuration.GetSection(GoogleCredentialOptions.GoogleCredential));
builder.Services.Configure<ConfigurationOptions>(builder.Configuration);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

static GoogleCredential GetGoogleCredential(GoogleCredentialOptions googleCredentialOptions)
{
  return GoogleCredential.FromJsonParameters(new JsonCredentialParameters()
  {
    ClientEmail = googleCredentialOptions.ClientEmail,
    PrivateKey = googleCredentialOptions.PrivateKey,
    ProjectId = googleCredentialOptions.ProjectId,
    Type = JsonCredentialParameters.ServiceAccountCredentialType,
  }).CreateScoped([
    "https://www.googleapis.com/auth/firebase.database",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/identitytoolkit"]);
}

builder.Services.AddSingleton(serviceProvider =>
{
  var googleCredentialOptions = (serviceProvider.GetService<IOptions<GoogleCredentialOptions>>()?.Value) ?? throw new Exception("Missing google credentials");

  return FirebaseApp.Create(new AppOptions()
  {
    Credential = GetGoogleCredential(googleCredentialOptions)
  });
});

builder.Services.AddScoped(serviceProvider =>
{
  var googleCredentialOptions = (serviceProvider.GetService<IOptions<GoogleCredentialOptions>>()?.Value) ?? throw new Exception("Missing google credentials");

  var authConfig = new FirebaseAuthConfig()
  {
    ApiKey = googleCredentialOptions.ApiKey,
    AuthDomain = googleCredentialOptions.AuthDomain,
    Providers = [new GoogleProvider().AddScopes("email"), new EmailProvider()],
  };

  return new FirebaseAuthClient(authConfig);
});

builder.Services.AddSingleton<ConnectionHelper>();
builder.Services.AddSingleton<SchemaHelper>();
builder.Services.AddSingleton<AppLogsRepository>();
builder.Services.AddSingleton<MigrationHelper>();
builder.Services.AddSingleton<GenericRepository>();
builder.Services.AddScoped<ExerciseLogRepository>();
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<UserHelper>();

builder.Services.AddApplicationInsightsTelemetry();
builder.Services.AddLogging(logBuilder => logBuilder.AddApplicationInsights());


builder.Services.AddCors();
builder.Services.AddExceptionHandler<LoggerExceptionHandler>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer();

var app = builder.Build();

var schema = app.Services.GetRequiredService<SchemaHelper>();
await schema.LoadTableNamesAsync();

var migrations = app.Services.GetRequiredService<MigrationHelper>();
await migrations.ApplyMigrations();


// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();


app.UseHttpsRedirection();

app.UseCors(options => options.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

app.UseAuthorization();

app.MapControllers();
app.UseExceptionHandler(new ExceptionHandlerOptions()
{
  AllowStatusCode404Response = true,
  ExceptionHandlingPath = "/Error"
});
app.Run();
