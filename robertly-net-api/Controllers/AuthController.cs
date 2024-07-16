using Firebase.Auth;
using Firebase.Auth.Providers;
using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
using System.Threading.Tasks;

namespace robertly.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : Controller
{
    private readonly FirebaseAuthClient _authClient;
    private readonly ChildQuery _usersDb;

    private readonly JsonSerializerOptions _jsonSerializerOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public AuthController(FirebaseAuthClient authClient, FirebaseClient client, IConfiguration config)
    {
        _authClient = authClient;
        _usersDb = client.ChildUsers(config);
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
        var  cred = await _authClient.SignInWithCredentialAsync(authCred);

        await GetOrCreateUser(cred);

        return await cred.User.GetIdTokenAsync();
    }

    private async Task GetOrCreateUser(UserCredential cred)
    {
        await Task.FromResult("");
        return;
        //var existingUserDb = (await _usersDb.OrderBy("uid").EqualTo(cred.User.Uid).OnceAsync<UserDb>()).FirstOrDefault();

        //if (existingUserDb is null)
        //{
        //    var result = await _usersDb.PostAsync(JsonSerializer.Serialize(new UserDb(cred.User.Uid, cred.User.Info.Email, cred.User.Info.DisplayName), _jsonSerializerOptions));
        //}

    }
}
