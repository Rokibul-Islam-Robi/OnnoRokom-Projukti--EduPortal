using AssignmentSystem.Api.Common;
using AssignmentSystem.Api.Controllers;
using AssignmentSystem.Api.Data;
using AssignmentSystem.Api.Dtos;
using AssignmentSystem.Api.Entities;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace AssignmentSystem.Tests;

public class AssignmentAuthorizationTests
{
    private static (AppDbContext db, SchoolClass cls, Subject subject, User teacher) SeedClassSubjectTeacher(AppDbContext db)
    {
        var cls = new SchoolClass { Name = "Class 10", Section = "A" };
        db.Classes.Add(cls);
        db.SaveChanges();

        var subject = new Subject { Name = "Mathematics", ClassId = cls.Id };
        db.Subjects.Add(subject);
        db.SaveChanges();

        var teacher = new User { FullName = "Nusrat Jahan", Email = "teacher@school.edu", Role = UserRole.Teacher, PasswordHash = "x" };
        db.Users.Add(teacher);
        db.SaveChanges();

        return (db, cls, subject, teacher);
    }

    [Fact]
    public async Task Create_ThrowsForbidden_WhenTeacherIsNotAssignedToTheSubject()
    {
        using var db = TestHelpers.CreateDb();
        var (_, cls, subject, teacher) = SeedClassSubjectTeacher(db);
        // Note: no TeacherAssignment row is created - the teacher exists
        // but has not been given this subject by the admin.

        var controller = new AssignmentsController(db, TestHelpers.CreateCurrentUser(teacher.Id, "Teacher"));

        var request = new CreateAssignmentRequest
        {
            Title = "Algebra Worksheet",
            Description = "Chapter 3",
            ClassId = cls.Id,
            SubjectId = subject.Id,
            Deadline = DateTime.UtcNow.AddDays(3),
            MaxMarks = 50
        };

        await Assert.ThrowsAsync<ForbiddenException>(() => controller.Create(request));
    }

    [Fact]
    public async Task Create_Succeeds_WhenTeacherIsAssignedToTheSubject()
    {
        using var db = TestHelpers.CreateDb();
        var (_, cls, subject, teacher) = SeedClassSubjectTeacher(db);
        db.TeacherAssignments.Add(new TeacherAssignment { TeacherId = teacher.Id, SubjectId = subject.Id });
        db.SaveChanges();

        var controller = new AssignmentsController(db, TestHelpers.CreateCurrentUser(teacher.Id, "Teacher"));

        var request = new CreateAssignmentRequest
        {
            Title = "Algebra Worksheet",
            Description = "Chapter 3",
            ClassId = cls.Id,
            SubjectId = subject.Id,
            Deadline = DateTime.UtcNow.AddDays(3),
            MaxMarks = 50,
            Publish = true
        };

        var result = await controller.Create(request);
        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var response = Assert.IsType<AssignmentResponse>(created.Value);

        Assert.Equal(AssignmentStatus.Published, response.Status);
    }

    [Fact]
    public async Task Create_ThrowsBadRequest_WhenDeadlineIsInThePast()
    {
        using var db = TestHelpers.CreateDb();
        var (_, cls, subject, teacher) = SeedClassSubjectTeacher(db);
        db.TeacherAssignments.Add(new TeacherAssignment { TeacherId = teacher.Id, SubjectId = subject.Id });
        db.SaveChanges();

        var controller = new AssignmentsController(db, TestHelpers.CreateCurrentUser(teacher.Id, "Teacher"));

        var request = new CreateAssignmentRequest
        {
            Title = "Late Notice",
            Description = "Should fail",
            ClassId = cls.Id,
            SubjectId = subject.Id,
            Deadline = DateTime.UtcNow.AddDays(-1),
            MaxMarks = 50
        };

        await Assert.ThrowsAsync<BadRequestException>(() => controller.Create(request));
    }

    [Fact]
    public async Task GetAll_HidesDraftAssignments_FromStudents()
    {
        using var db = TestHelpers.CreateDb();
        var (_, cls, subject, teacher) = SeedClassSubjectTeacher(db);

        db.Assignments.AddRange(
            new Assignment { Title = "Published Homework", ClassId = cls.Id, SubjectId = subject.Id, TeacherId = teacher.Id, Deadline = DateTime.UtcNow.AddDays(2), MaxMarks = 10, Status = AssignmentStatus.Published },
            new Assignment { Title = "Draft Homework", ClassId = cls.Id, SubjectId = subject.Id, TeacherId = teacher.Id, Deadline = DateTime.UtcNow.AddDays(2), MaxMarks = 10, Status = AssignmentStatus.Draft }
        );
        db.SaveChanges();

        var studentController = new AssignmentsController(db, TestHelpers.CreateCurrentUser(999, "Student", cls.Id));

        var result = await studentController.GetAll(null, null);
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var assignments = Assert.IsAssignableFrom<List<AssignmentResponse>>(okResult.Value);

        Assert.Single(assignments);
        Assert.Equal("Published Homework", assignments[0].Title);
    }

    [Fact]
    public async Task GetAll_OnlyReturnsAssignmentsForTheStudentsOwnClass()
    {
        using var db = TestHelpers.CreateDb();
        var (_, cls, subject, teacher) = SeedClassSubjectTeacher(db);

        var otherClass = new SchoolClass { Name = "Class 9", Section = "B" };
        db.Classes.Add(otherClass);
        db.SaveChanges();

        db.Assignments.AddRange(
            new Assignment { Title = "For Class 10", ClassId = cls.Id, SubjectId = subject.Id, TeacherId = teacher.Id, Deadline = DateTime.UtcNow.AddDays(2), MaxMarks = 10, Status = AssignmentStatus.Published },
            new Assignment { Title = "For Class 9", ClassId = otherClass.Id, SubjectId = subject.Id, TeacherId = teacher.Id, Deadline = DateTime.UtcNow.AddDays(2), MaxMarks = 10, Status = AssignmentStatus.Published }
        );
        db.SaveChanges();

        var studentController = new AssignmentsController(db, TestHelpers.CreateCurrentUser(999, "Student", cls.Id));

        var result = await studentController.GetAll(null, null);
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var assignments = Assert.IsAssignableFrom<List<AssignmentResponse>>(okResult.Value);

        Assert.Single(assignments);
        Assert.Equal("For Class 10", assignments[0].Title);
    }

    [Fact]
    public async Task Update_ThrowsForbidden_WhenAnotherTeacherOwnsTheAssignment()
    {
        using var db = TestHelpers.CreateDb();
        var (_, cls, subject, teacher) = SeedClassSubjectTeacher(db);

        var assignment = new Assignment { Title = "Original", ClassId = cls.Id, SubjectId = subject.Id, TeacherId = teacher.Id, Deadline = DateTime.UtcNow.AddDays(2), MaxMarks = 10 };
        db.Assignments.Add(assignment);
        db.SaveChanges();

        var otherTeacher = new User { FullName = "Another Teacher", Email = "other@school.edu", Role = UserRole.Teacher, PasswordHash = "x" };
        db.Users.Add(otherTeacher);
        db.SaveChanges();

        var controller = new AssignmentsController(db, TestHelpers.CreateCurrentUser(otherTeacher.Id, "Teacher"));

        var request = new UpdateAssignmentRequest { Title = "Hijacked", Description = "x", Deadline = DateTime.UtcNow.AddDays(5), MaxMarks = 10 };

        await Assert.ThrowsAsync<ForbiddenException>(() => controller.Update(assignment.Id, request));
    }
}
