using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using robertly.Repositories;

namespace robertly;

public class LoggerExceptionHandler : IExceptionHandler
{
  private readonly AppLogsRepository _appLogsRepository;

  public LoggerExceptionHandler(AppLogsRepository appLogsRepository)
  {
    _appLogsRepository = appLogsRepository;
  }

  public async ValueTask<bool> TryHandleAsync(
      HttpContext httpContext,
      Exception exception,
      CancellationToken cancellationToken)
  {
    await _appLogsRepository.LogError($"{exception.GetType().Name} on Global Error Handler", exception);

    return false;
  }
}
