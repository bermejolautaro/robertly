using Firebase.Auth;
using Firebase.Auth.Providers;
using Microsoft.AspNetCore.Mvc;
using robertly.Repositories;
using System.Threading.Tasks;

namespace robertly.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : Controller
{
    private readonly FirebaseAuthClient _authClient;
    private readonly UserRepository _userRepository;

    public AuthController(FirebaseAuthClient authClient, UserRepository userRepository)
    {
        _authClient = authClient;
        _userRepository = userRepository;
    }

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
