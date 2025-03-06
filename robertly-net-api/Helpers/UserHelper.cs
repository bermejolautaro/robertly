using System;
using System.Threading.Tasks;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using robertly.Models;
using robertly.Repositories;

namespace robertly.Helpers;

public class UserHelper
{
  private readonly UserRepository _userRepository;
  private readonly AppLogsRepository _appLogs;
  private readonly FirebaseApp _firebaseApp;

  public UserHelper(UserRepository userRepository, AppLogsRepository appLogs, FirebaseApp firebaseApp) =>
    (_userRepository, _appLogs, _firebaseApp) = (userRepository, appLogs, firebaseApp);

  public async Task<User?> GetUser(HttpRequest request)
  {
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