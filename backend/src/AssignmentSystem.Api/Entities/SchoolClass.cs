namespace AssignmentSystem.Api.Entities;

// Named SchoolClass instead of Class because Class is a reserved word in C#.
// Represents a class/grade/course, e.g. "Class 9" or "Section A".
public class SchoolClass
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Section { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Subject> Subjects { get; set; } = new List<Subject>();
    public ICollection<User> Students { get; set; } = new List<User>();
    public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
}
