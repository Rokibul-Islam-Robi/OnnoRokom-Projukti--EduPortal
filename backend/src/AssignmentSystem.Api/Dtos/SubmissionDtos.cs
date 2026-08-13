using System.ComponentModel.DataAnnotations;
using AssignmentSystem.Api.Entities;

namespace AssignmentSystem.Api.Dtos;

public class CreateSubmissionRequest
{
    [Required]
    public string Content { get; set; } = string.Empty;
}

public class GradeSubmissionRequest
{
    [Required]
    public int Marks { get; set; }

    public string? Feedback { get; set; }
}

public class UpdateSubmissionStatusRequest
{
    [Required]
    public SubmissionStatus Status { get; set; }
}

public class SubmissionResponse
{
    public int Id { get; set; }
    public int AssignmentId { get; set; }
    public string AssignmentTitle { get; set; } = string.Empty;

    public int StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;
    public SubmissionStatus Status { get; set; }
    public int? Marks { get; set; }
    public string? Feedback { get; set; }
    public DateTime? GradedAt { get; set; }

    public DateTime SubmittedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
