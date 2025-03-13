using System;
using System.Threading.Tasks;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using robertly.Models;
using robertly.Repositories;

namespace robertly.Helpers;

public class UserHelper
{
  private readonly UserRepository _userRepository;
  private readonly AppLogsRepository _appLogs;
  private readonly FirebaseApp _firebaseApp;
  private readonly string? _testUserFirebaseUuid;

  public UserHelper(UserRepository userRepository, AppLogsRepository appLogs, FirebaseApp firebaseApp, IOptions<ConfigurationOptions> config) =>
    (_userRepository, _appLogs, _firebaseApp, _testUserFirebaseUuid) = (userRepository, appLogs, firebaseApp, config.Value.TestUserFirebaseUuid);

  public async Task<User?> GetUser(HttpRequest request)
  {
    if (!string.IsNullOrEmpty(_testUserFirebaseUuid)) {
      return await _userRepository.GetUserByFirebaseUuidAsync(_testUserFirebaseUuid);
    }

    var idToken = request.Headers.GetIdToken();

    FirebaseToken token;
    try
    {
      token = await FirebaseAuth
        .GetAuth(_firebaseApp)
        .VerifyIdTokenAsync(idToken, true);
    }
    catch (ArgumentException)
    {
      return null;
    }
    catch (FirebaseAuthException)
    {
      return null;
    }
    catch (JsonReaderException)
    {
      return null;
    }
    catch (Exception e)
    {
      await _appLogs.LogError($"{e.GetType().Name} on {nameof(UserHelper)}.{nameof(UserHelper.GetUser)}", e);
      return null;
    }

    if (token is null)
    {
      return null;
    }

    var userFirebaseUuid = token.GetUserFirebaseUuid();

    if (userFirebaseUuid is null)
    {
      return null;
    }

    return await _userRepository.GetUserByFirebaseUuidAsync(userFirebaseUuid);
  }
}