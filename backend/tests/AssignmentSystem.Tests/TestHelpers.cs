using System.Security.Claims;
using AssignmentSystem.Api.Common;
using AssignmentSystem.Api.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Tests;

public static class TestHelpers
{
    // A fresh, isolated in-memory database per test so tests never bleed
    // into each other.
    public static AppDbContext CreateDb(string? name = null)
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(name ?? Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    public static CurrentUser CreateCurrentUser(int id, string role, int? classId = null)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, id.ToString()),
            new(ClaimTypes.Role, role)
        };

        if (classId.HasValue)
        {
            claims.Add(new Claim("classId", classId.Value.ToString()));
        }

        var identity = new ClaimsIdentity(claims, "TestAuth");
        var principal = new ClaimsPrincipal(identity);

        var accessor = new FakeHttpContextAccessor(new DefaultHttpContext { User = principal });
        return new CurrentUser(accessor);
    }

    private class FakeHttpContextAccessor : IHttpContextAccessor
    {
        public FakeHttpContextAccessor(HttpContext context)
        {
            HttpContext = context;
        }

        public HttpContext? HttpContext { get; set; }
    }
}
