namespace AssignmentSystem.Api.Entities;

public class Assignment
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Deadline { get; set; }
    public int MaxMarks { get; set; }
    public AssignmentStatus Status { get; set; } = AssignmentStatus.Draft;

    // Students are allowed to edit their submission until the deadline.
    // Teacher can turn this off for assignments that should be one-shot.
    public bool AllowResubmission { get; set; } = true;

    public int ClassId { get; set; }
    public SchoolClass? Class { get; set; }

    public int SubjectId { get; set; }
    public Subject? Subject { get; set; }

    public int TeacherId { get; set; }
    public User? Teacher { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
}
