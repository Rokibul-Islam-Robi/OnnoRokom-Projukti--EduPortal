using AssignmentSystem.Api.Common;
using AssignmentSystem.Api.Data;
using AssignmentSystem.Api.Dtos;
using AssignmentSystem.Api.Entities;
using AssignmentSystem.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IPasswordHasher _hasher;

    public UsersController(AppDbContext db, IPasswordHasher hasher)
    {
        _db = db;
        _hasher = hasher;
    }

    [HttpGet]
    public async Task<ActionResult<List<UserResponse>>> GetAll([FromQuery] UserRole? role)
    {
        var query = _db.Users.Include(u => u.Class).AsQueryable();

        if (role.HasValue)
        {
            query = query.Where(u => u.Role == role.Value);
        }

        var users = await query.OrderBy(u => u.FullName).ToListAsync();
        return Ok(users.Select(ToResponse));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserResponse>> GetById(int id)
    {
        var user = await _db.Users.Include(u => u.Class).FirstOrDefaultAsync(u => u.Id == id);
        if (user is null)
        {
            throw new NotFoundException($"User {id} was not found.");
        }

        return Ok(ToResponse(user));
    }

    [HttpPost]
    public async Task<ActionResult<UserResponse>> Create(CreateUserRequest request)
    {
        var emailTaken = await _db.Users.AnyAsync(u => u.Email == request.Email);
        if (emailTaken)
        {
            throw new ConflictException("A user with this email already exists.");
        }

        if (request.Role == UserRole.Student && request.ClassId is null)
        {
            throw new BadRequestException("A class must be selected for a student account.");
        }

        if (request.ClassId.HasValue)
        {
            var classExists = await _db.Classes.AnyAsync(c => c.Id == request.ClassId);
            if (!classExists)
            {
                throw new BadRequestException("The selected class does not exist.");
            }
        }

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = _hasher.Hash(request.Password),
            Role = request.Role,
            ClassId = request.Role == UserRole.Student ? request.ClassId : null
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        await _db.Entry(user).Reference(u => u.Class).LoadAsync();

        return CreatedAtAction(nameof(GetById), new { id = user.Id }, ToResponse(user));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<UserResponse>> Update(int id, UpdateUserRequest request)
    {
        var user = await _db.Users.Include(u => u.Class).FirstOrDefaultAsync(u => u.Id == id);
        if (user is null)
        {
            throw new NotFoundException($"User {id} was not found.");
        }

        user.FullName = request.FullName;
        user.IsActive = request.IsActive;

        if (user.Role == UserRole.Student)
        {
            user.ClassId = request.ClassId;
        }

        await _db.SaveChangesAsync();

        return Ok(ToResponse(user));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user is null)
        {
            throw new NotFoundException($"User {id} was not found.");
        }

        // Soft delete keeps assignment/submission history intact - a hard
        // delete would orphan grading records for a teacher's past work.
        user.IsActive = false;
        await _db.SaveChangesAsync();

        return NoContent();
    }

    private static UserResponse ToResponse(User user) => new()
    {
        Id = user.Id,
        FullName = user.FullName,
        Email = user.Email,
        Role = user.Role,
        IsActive = user.IsActive,
        ClassId = user.ClassId,
        ClassName = user.Class is null ? null : $"{user.Class.Name} {user.Class.Section}".Trim(),
        CreatedAt = user.CreatedAt
    };
}
