using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<GoogleCredentialOptions>(builder.Configuration.GetSection(GoogleCredentialOptions.GoogleCredential));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddApplicationInsightsTelemetry();
builder.Services.AddLogging(logBuilder => logBuilder.AddApplicationInsights());

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();


app.UseHttpsRedirection();

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
}