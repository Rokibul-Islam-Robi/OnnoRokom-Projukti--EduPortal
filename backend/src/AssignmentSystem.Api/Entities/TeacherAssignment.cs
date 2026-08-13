namespace AssignmentSystem.Api.Entities;

// Links a teacher to a subject (which already belongs to a class).
// This is how the admin decides who is allowed to create assignments for what.
public class TeacherAssignment
{
    public int Id { get; set; }

    public int TeacherId { get; set; }
    public User? Teacher { get; set; }

    public int SubjectId { get; set; }
    public Subject? Subject { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
