using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<GoogleCredentialOptions>(builder.Configuration.GetSection(GoogleCredentialOptions.GoogleCredential));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
***REMOVED***
    app.UseSwagger();
    app.UseSwaggerUI();
***REMOVED***

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.MapControllerRoute("default", "Api/***REMOVED***controller***REMOVED***/***REMOVED***action***REMOVED***");

app.Run();

public class GoogleCredentialOptions
***REMOVED***
    public const string GoogleCredential = "GoogleCredential";

    public string ClientEmail ***REMOVED*** get; set; ***REMOVED*** = "";
    public string PrivateKey ***REMOVED*** get; set; ***REMOVED*** = "";
    public string ProjectId ***REMOVED*** get; set; ***REMOVED*** = "";
    public string DatabaseUrl ***REMOVED*** get; set; ***REMOVED*** = "";
***REMOVED***