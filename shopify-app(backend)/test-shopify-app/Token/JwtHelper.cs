using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using test_shopify_app.Entities;


namespace test_shopify_app.Token;

public class JwtHelper
{
    private readonly IConfiguration _config;

    public JwtHelper(IConfiguration config)
    {
        _config = config;
    }


    public string GenerateToken(Customers user)
    {
        var claims = new[]
        {
        new Claim(ClaimTypes.Name, user.CustomerUsername),
        new Claim(ClaimTypes.Role, user.Role)
        
        };

        Console.WriteLine("JWT KEY LENGTH: " + _config["Jwt:Key"].Length);

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(900),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateToken(Admin user)
    {
        var claims = new[]
        {
        new Claim(ClaimTypes.Name, user.AdminUsername),
        new Claim(ClaimTypes.Role, user.Role)

        };

        Console.WriteLine("JWT KEY LENGTH: " + _config["Jwt:Key"].Length);

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(900),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateToken(DeliveryAgent user)
    {
        var claims = new[]
        {
        new Claim(ClaimTypes.Name, user.AgentUsername),
        new Claim(ClaimTypes.Role, user.Role)

        };

        Console.WriteLine("JWT KEY LENGTH: " + _config["Jwt:Key"].Length);

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(900),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
