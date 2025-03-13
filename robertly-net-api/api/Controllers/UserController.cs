using Microsoft.AspNetCore.Mvc;
using robertly.Models;
using robertly.Repositories;
using System.Threading.Tasks;

namespace robertly.Controllers;

[ApiController]
[Route("api/users")]
public class UserController
{
    private readonly UserRepository _userRepository;

    public UserController(UserRepository userRepository) => (_userRepository) = (userRepository);

    [HttpGet("firebase-uuid/{firebaseUuid}")]
    public async Task<User?> GetUserByFirebaseUuidAsync(string firebaseUuid)
    {
        return await _userRepository.GetUserByFirebaseUuidAsync(firebaseUuid);
    }
}
