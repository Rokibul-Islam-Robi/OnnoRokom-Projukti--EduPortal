namespace AssignmentSystem.Api.Entities;

// A user can be an Admin, a Teacher or a Student. Students are linked to
// a single class through ClassId - keeps things simple since most schools
// only enroll a student in one class/section at a time.
public class User
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public bool IsActive { get; set; } = true;

    // Only relevant when Role == Student
    public int? ClassId { get; set; }
    public SchoolClass? Class { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<TeacherAssignment> TeacherAssignments { get; set; } = new List<TeacherAssignment>();
    public ICollection<Assignment> AssignmentsCreated { get; set; } = new List<Assignment>();
    public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
}
