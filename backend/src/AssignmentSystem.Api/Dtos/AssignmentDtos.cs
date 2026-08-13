using System.ComponentModel.DataAnnotations;
using AssignmentSystem.Api.Entities;

namespace AssignmentSystem.Api.Dtos;

public class CreateAssignmentRequest
{
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public int ClassId { get; set; }

    [Required]
    public int SubjectId { get; set; }

    [Required]
    public DateTime Deadline { get; set; }

    [Range(1, 1000)]
    public int MaxMarks { get; set; } = 100;

    public bool AllowResubmission { get; set; } = true;

    // If false, saved as Draft. Defaults to draft so a half-written
    // assignment never accidentally goes live.
    public bool Publish { get; set; } = false;
}

public class UpdateAssignmentRequest
{
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public DateTime Deadline { get; set; }

    [Range(1, 1000)]
    public int MaxMarks { get; set; } = 100;

    public bool AllowResubmission { get; set; } = true;
}

public class AssignmentResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Deadline { get; set; }
    public int MaxMarks { get; set; }
    public AssignmentStatus Status { get; set; }
    public bool AllowResubmission { get; set; }

    public int ClassId { get; set; }
    public string ClassName { get; set; } = string.Empty;

    public int SubjectId { get; set; }
    public string SubjectName { get; set; } = string.Empty;

    public int TeacherId { get; set; }
    public string TeacherName { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    // Only populated when a student requests it - null for teacher/admin views.
    public SubmissionResponse? MySubmission { get; set; }

    public int SubmissionCount { get; set; }
    public bool IsPastDeadline => DateTime.UtcNow > Deadline;
}
