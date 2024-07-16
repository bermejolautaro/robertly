using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;

namespace robertly;

public static class HelpersFunctions
{
  public static readonly string DB_ENVIROMENT_KEY = "DatabaseEnvironment";

  public static JwtSecurityToken? ParseToken(StringValues bearerToken)
  {
    var idToken = bearerToken.FirstOrDefault()?.Replace("Bearer ", "") ?? "";

    try
    {
      return new JwtSecurityToken(idToken);

    }
    catch (ArgumentNullException)
    {
      return null;
    }
    catch (SecurityTokenMalformedException)
    {
      return null;
    }
    catch (Exception)
    {
      return null;
    }
  }

  public static string? GetUserId(this JwtSecurityToken token)
  {
    return token.Claims.First(x => x.Type == "user_id")?.Value ?? null;
  }

  public static ChildQuery ChildLogs(this FirebaseClient client, IConfiguration config)
  {
    return client.Child($"{config[DB_ENVIROMENT_KEY]}/logs");
  }

  public static ChildQuery ChildExercises(this FirebaseClient client, IConfiguration config)
  {
    return client.Child($"{config[DB_ENVIROMENT_KEY]}/exercises");
  }

  public static ChildQuery ChildUsers(this FirebaseClient client, IConfiguration config)
  {
    return client.Child($"{config[DB_ENVIROMENT_KEY]}/users");
  }
}
