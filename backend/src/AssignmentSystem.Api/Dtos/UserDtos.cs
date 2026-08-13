using System.ComponentModel.DataAnnotations;
using AssignmentSystem.Api.Entities;

namespace AssignmentSystem.Api.Dtos;

public class CreateUserRequest
{
    [Required, MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public UserRole Role { get; set; }

    // Required only when Role == Student
    public int? ClassId { get; set; }
}

public class UpdateUserRequest
{
    [Required, MaxLength(150)]
    public string FullName { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public int? ClassId { get; set; }
}

public class UserResponse
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public bool IsActive { get; set; }
    public int? ClassId { get; set; }
    public string? ClassName { get; set; }
    public DateTime CreatedAt { get; set; }
}
