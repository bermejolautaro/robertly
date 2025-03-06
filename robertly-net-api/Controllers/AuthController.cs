using Firebase.Auth;
using Firebase.Auth.Providers;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using robertly.Repositories;
using System;
using System.Threading.Tasks;

namespace robertly.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : Controller
{
    private readonly FirebaseAuthClient _authClient;
    private readonly UserRepository _userRepository;
    private readonly FirebaseApp _firebaseApp;
    private readonly IHostEnvironment _environment;

    public AuthController(FirebaseAuthClient authClient, UserRepository userRepository, FirebaseApp firebaseApp, IHostEnvironment environment) =>
        (_authClient, _userRepository, _firebaseApp, _environment) = (authClient, userRepository, firebaseApp, environment);

    [HttpPost("signin")]
    public async Task<string> SignIn(SignInRequest request)
    {
        var cred = await _authClient.SignInWithEmailAndPasswordAsync(request.Email, request.Password);
        await GetOrCreateUser(cred);

        return await cred.User.GetIdTokenAsync();
    }

    [HttpPost("signup")]
    public async Task<string> SignUp(SignUpRequest request)
    {
        var cred = await _authClient.CreateUserWithEmailAndPasswordAsync(request.Email, request.Password, request.DisplayName);
        await GetOrCreateUser(cred);

        return await cred.User.GetIdTokenAsync();
    }

    [HttpPost("signup/google")]
    public async Task<string> SignInWithGoogle(SignUpGoogleRequest request)
    {
        var authCred = GoogleProvider.GetCredential(request.AccessToken);
        var cred = await _authClient.SignInWithCredentialAsync(authCred);

        await GetOrCreateUser(cred);

        return await cred.User.GetIdTokenAsync();
    }

    [HttpPost("revoke/{firebaseUuid}")]
    public async Task RevokeToken(string firebaseUuid)
    {
        if (_environment.IsDevelopment())
        {
            await FirebaseAuth.GetAuth(_firebaseApp).RevokeRefreshTokensAsync(firebaseUuid);
        }
    }

    private async Task GetOrCreateUser(UserCredential cred)
    {
        var user = await _userRepository.GetUserByFirebaseUuidAsync(cred.User.Info.Uid);

        if (user is null)
        {
            await _userRepository.CreateUserAsync(new Models.User()
            {
                Email = cred.User.Info.Email,
                Name = cred.User.Info.DisplayName,
                UserFirebaseUuid = cred.User.Info.Uid
            });
        }
    }
}
