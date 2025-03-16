using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using robertly.DataModels;
using robertly.Models;
using robertly.Repositories;
using System;
using System.Threading.Tasks;

namespace robertly.Controllers;

[ApiController]
[Route("api/users")]
public class UserController
{
    private readonly UserRepository _userRepository;

    public UserController(UserRepository userRepository) => (_userRepository) = (userRepository);

    [HttpGet("firebase-uuid/{firebaseUuid}")]
    public async Task<Results<Ok<Models.User>, BadRequest>> GetUserByFirebaseUuidAsync(string firebaseUuid)
    {
        var user = await _userRepository.GetUserByFirebaseUuidAsync(firebaseUuid);

        if (user is null) {
            return TypedResults.BadRequest();
        }

        return TypedResults.Ok(user);
    }
}
