using AssignmentSystem.Api.Entities;
using AssignmentSystem.Api.Services;

namespace AssignmentSystem.Api.Data;

// Runs once at startup (see Program.cs) so a fresh clone of the repo has
// something to log in with straight away. Safe to run repeatedly - it
// bails out early if the demo admin already exists.
public static class DbSeeder
{
    public static void Seed(AppDbContext db, IPasswordHasher hasher)
    {
        if (db.Users.Any(u => u.Email == "admin@school.edu"))
        {
            return;
        }

        var classTen = new SchoolClass { Name = "Class 10", Section = "A" };
        var classNine = new SchoolClass { Name = "Class 9", Section = "B" };
        db.Classes.AddRange(classTen, classNine);
        db.SaveChanges();

        var math = new Subject { Name = "Mathematics", Code = "MATH10", ClassId = classTen.Id };
        var english = new Subject { Name = "English", Code = "ENG10", ClassId = classTen.Id };
        var science = new Subject { Name = "Science", Code = "SCI9", ClassId = classNine.Id };
        db.Subjects.AddRange(math, english, science);
        db.SaveChanges();

        var admin = new User
        {
            FullName = "System Admin",
            Email = "admin@school.edu",
            PasswordHash = hasher.Hash("Admin@123"),
            Role = UserRole.Admin
        };

        var teacher = new User
        {
            FullName = "Rokibul Islam",
            Email = "teacher@school.edu",
            PasswordHash = hasher.Hash("Teacher@123"),
            Role = UserRole.Teacher
        };

        var student = new User
        {
            FullName = "Tanvir Ahmed",
            Email = "student@school.edu",
            PasswordHash = hasher.Hash("Student@123"),
            Role = UserRole.Student,
            ClassId = classTen.Id
        };

        var secondStudent = new User
        {
            FullName = "Farhana Islam",
            Email = "farhana@school.edu",
            PasswordHash = hasher.Hash("Student@123"),
            Role = UserRole.Student,
            ClassId = classTen.Id
        };

        db.Users.AddRange(admin, teacher, student, secondStudent);
        db.SaveChanges();

        db.TeacherAssignments.AddRange(
            new TeacherAssignment { TeacherId = teacher.Id, SubjectId = math.Id },
            new TeacherAssignment { TeacherId = teacher.Id, SubjectId = english.Id }
        );
        db.SaveChanges();

        var assignment = new Assignment
        {
            Title = "Algebra Worksheet 1",
            Description = "Solve questions 1 to 10 from chapter 3 and show your working.",
            ClassId = classTen.Id,
            SubjectId = math.Id,
            TeacherId = teacher.Id,
            Deadline = DateTime.UtcNow.AddDays(7),
            MaxMarks = 50,
            Status = AssignmentStatus.Published
        };

        var pastAssignment = new Assignment
        {
            Title = "Essay: My Summer Vacation",
            Description = "Write a 400 word essay about how you spent your last summer vacation.",
            ClassId = classTen.Id,
            SubjectId = english.Id,
            TeacherId = teacher.Id,
            Deadline = DateTime.UtcNow.AddDays(-2),
            MaxMarks = 20,
            Status = AssignmentStatus.Published
        };

        db.Assignments.AddRange(assignment, pastAssignment);
        db.SaveChanges();

        db.Submissions.Add(new Submission
        {
            AssignmentId = pastAssignment.Id,
            StudentId = student.Id,
            Content = "This summer I visited my grandparents in Sylhet and helped with the tea garden...",
            Status = SubmissionStatus.Graded,
            Marks = 17,
            Feedback = "Good structure, watch your paragraph transitions next time.",
            GradedAt = DateTime.UtcNow.AddDays(-1),
            SubmittedAt = DateTime.UtcNow.AddDays(-3)
        });
        db.SaveChanges();
    }
}
