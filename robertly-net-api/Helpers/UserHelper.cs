using System;
using System.Threading.Tasks;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Http;
using robertly.Models;
using robertly.Repositories;

namespace robertly.Helpers;

public class UserHelper
{
  private readonly UserRepository _userRepository;
  private readonly FirebaseApp _firebaseApp;

  public UserHelper(UserRepository userRepository, FirebaseApp firebaseApp) => (_userRepository, _firebaseApp) = (userRepository, firebaseApp);

  public async Task<User?> GetUser(HttpRequest request)
  {
    var idToken = request.Headers.GetIdToken();

    FirebaseToken token;
    try
    {
      token = await FirebaseAuth
        .GetAuth(_firebaseApp)
        .VerifyIdTokenAsync(idToken);
    }
    catch (ArgumentException)
    {
      return null;
    }
    catch (FirebaseAuthException)
    {
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