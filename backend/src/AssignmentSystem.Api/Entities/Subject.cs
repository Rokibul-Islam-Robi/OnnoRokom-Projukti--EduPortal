namespace AssignmentSystem.Api.Entities;

public class Subject
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }

    public int ClassId { get; set; }
    public SchoolClass? Class { get; set; }

    public ICollection<TeacherAssignment> TeacherAssignments { get; set; } = new List<TeacherAssignment>();
    public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
}
