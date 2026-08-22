using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AssignmentSystem.Api.Entities;
using AssignmentSystem.Api.Services;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace AssignmentSystem.Tests;

public class JwtTokenServiceTests
{
    private static IJwtTokenService BuildService()
    {
        var settings = new Dictionary<string, string?>
        {
            ["Jwt:Key"] = "unit-test-signing-key-that-is-long-enough-1234567890",
            ["Jwt:Issuer"] = "AssignmentSystem.Tests",
            ["Jwt:Audience"] = "AssignmentSystem.Tests.Client",
            ["Jwt:ExpiryMinutes"] = "60"
        };

        var config = new ConfigurationBuilder().AddInMemoryCollection(settings).Build();
        return new JwtTokenService(config);
    }

    [Fact]
    public void GenerateToken_IncludesRoleClaim_MatchingTheUsersRole()
    {
        var service = BuildService();
        var user = new User { Id = 5, FullName = "Rokibul Islam", Email = "teacher@school.edu", Role = UserRole.Teacher };

        var (token, _) = service.GenerateToken(user);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        var roleClaim = jwt.Claims.First(c => c.Type == ClaimTypes.Role);
        Assert.Equal("Teacher", roleClaim.Value);
    }

    [Fact]
    public void GenerateToken_IncludesClassIdClaim_OnlyForStudents()
    {
        var service = BuildService();
        var student = new User { Id = 9, FullName = "Tanvir Ahmed", Email = "student@school.edu", Role = UserRole.Student, ClassId = 3 };

        var (token, _) = service.GenerateToken(student);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);

        var classClaim = jwt.Claims.FirstOrDefault(c => c.Type == "classId");
        Assert.NotNull(classClaim);
        Assert.Equal("3", classClaim!.Value);
    }

    [Fact]
    public void GenerateToken_SetsExpiryInTheFuture()
    {
        var service = BuildService();
        var user = new User { Id = 1, FullName = "System Admin", Email = "admin@school.edu", Role = UserRole.Admin };

        var (_, expiresAt) = service.GenerateToken(user);

        Assert.True(expiresAt > DateTime.UtcNow);
        Assert.True(expiresAt <= DateTime.UtcNow.AddMinutes(61));
    }
}
