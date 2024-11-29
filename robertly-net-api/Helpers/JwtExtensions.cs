using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;

namespace robertly.Helpers;

public static class JwtExtensions
{
    public static readonly string DB_ENVIROMENT_KEY = "DatabaseEnvironment";

    public static string GetIdToken(this IHeaderDictionary headerDictionary)
    {
        return headerDictionary.Authorization.FirstOrDefault()?.Replace("Bearer ", "") ?? "";
    }

    public static JwtSecurityToken? ParseToken(this IHeaderDictionary headerDictionary)
    {
        var idToken = headerDictionary.GetIdToken();
        return CreateToken(idToken);
    }

    public static JwtSecurityToken? CreateToken(this string idToken)
    {
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

    public static string? GetUserFirebaseUuid(this FirebaseToken token)
    {
        return (string)token.Claims.First(x => x.Key == "user_id").Value;
    }

    public static string? GetUserFirebaseUuid(this JwtSecurityToken token)
    {
        return token.Claims.First(x => x.Type == "user_id")?.Value ?? null;
    }
}
