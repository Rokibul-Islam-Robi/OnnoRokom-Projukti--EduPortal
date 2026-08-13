using AssignmentSystem.Api.Common;
using AssignmentSystem.Api.Data;
using AssignmentSystem.Api.Dtos;
using AssignmentSystem.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IPasswordHasher _hasher;
    private readonly IJwtTokenService _tokenService;

    public AuthController(AppDbContext db, IPasswordHasher hasher, IJwtTokenService tokenService)
    {
        _db = db;
        _hasher = hasher;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user is null || !_hasher.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(new ErrorResponse { Message = "Email or password is incorrect." });
        }

        if (!user.IsActive)
        {
            return Unauthorized(new ErrorResponse { Message = "This account has been deactivated. Contact your administrator." });
        }

        var (token, expiresAt) = _tokenService.GenerateToken(user);

        return Ok(new LoginResponse
        {
            Token = token,
            ExpiresAt = expiresAt,
            User = new UserSummaryDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                ClassId = user.ClassId
            }
        });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserSummaryDto>> Me([FromServices] CurrentUser currentUser)
    {
        var user = await _db.Users.FindAsync(currentUser.Id);
        if (user is null)
        {
            return Unauthorized();
        }

        return Ok(new UserSummaryDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            ClassId = user.ClassId
        });
    }
}
