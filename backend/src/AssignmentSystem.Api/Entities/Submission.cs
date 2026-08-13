namespace AssignmentSystem.Api.Entities;

public class Submission
{
    public int Id { get; set; }

    public int AssignmentId { get; set; }
    public Assignment? Assignment { get; set; }

    public int StudentId { get; set; }
    public User? Student { get; set; }

    // Text answer. A real deployment would likely also store an attachment
    // url here, but the brief only asks for "submit an answer" so plain
    // text keeps the scope honest.
    public string Content { get; set; } = string.Empty;

    public SubmissionStatus Status { get; set; } = SubmissionStatus.Submitted;

    public int? Marks { get; set; }
    public string? Feedback { get; set; }
    public DateTime? GradedAt { get; set; }

    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
