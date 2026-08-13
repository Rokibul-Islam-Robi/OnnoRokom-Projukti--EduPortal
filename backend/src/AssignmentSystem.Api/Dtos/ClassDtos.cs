using System.ComponentModel.DataAnnotations;

namespace AssignmentSystem.Api.Dtos;

public class CreateClassRequest
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Section { get; set; }
}

public class ClassResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Section { get; set; }
    public int StudentCount { get; set; }
    public int SubjectCount { get; set; }
}

public class CreateSubjectRequest
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? Code { get; set; }

    [Required]
    public int ClassId { get; set; }
}

public class TeacherInfoDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
}

public class SubjectResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public int ClassId { get; set; }
    public string ClassName { get; set; } = string.Empty;
    public List<string> Teachers { get; set; } = new();
    public List<TeacherInfoDto> AssignedTeachers { get; set; } = new();
}

public class AssignTeacherRequest
{
    [Required]
    public int TeacherId { get; set; }

    [Required]
    public int SubjectId { get; set; }
}
