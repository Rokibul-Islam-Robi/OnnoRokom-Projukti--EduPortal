using AssignmentSystem.Api.Common;
using AssignmentSystem.Api.Controllers;
using AssignmentSystem.Api.Data;
using AssignmentSystem.Api.Dtos;
using AssignmentSystem.Api.Entities;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace AssignmentSystem.Tests;

public class SubmissionWorkflowTests
{
    private static (AppDbContext db, Assignment assignment, User student) SeedPublishedAssignment(
        DateTime deadline, bool allowResubmission = true)
    {
        var db = TestHelpers.CreateDb();

        var cls = new SchoolClass { Name = "Class 10", Section = "A" };
        db.Classes.Add(cls);
        db.SaveChanges();

        var subject = new Subject { Name = "Mathematics", ClassId = cls.Id };
        db.Subjects.Add(subject);
        db.SaveChanges();

        var teacher = new User { FullName = "Rokibul Islam", Email = "teacher@school.edu", Role = UserRole.Teacher, PasswordHash = "x" };
        var student = new User { FullName = "Tanvir Ahmed", Email = "student@school.edu", Role = UserRole.Student, PasswordHash = "x", ClassId = cls.Id };
        db.Users.AddRange(teacher, student);
        db.SaveChanges();

        var assignment = new Assignment
        {
            Title = "Algebra Worksheet",
            Description = "Chapter 3",
            ClassId = cls.Id,
            SubjectId = subject.Id,
            TeacherId = teacher.Id,
            Deadline = deadline,
            MaxMarks = 50,
            Status = AssignmentStatus.Published,
            AllowResubmission = allowResubmission
        };
        db.Assignments.Add(assignment);
        db.SaveChanges();

        return (db, assignment, student);
    }

    [Fact]
    public async Task Submit_MarksAsSubmitted_WhenBeforeDeadline()
    {
        var (db, assignment, student) = SeedPublishedAssignment(DateTime.UtcNow.AddDays(2));
        var controller = new SubmissionsController(db, TestHelpers.CreateCurrentUser(student.Id, "Student", student.ClassId));

        var result = await controller.Submit(assignment.Id, new CreateSubmissionRequest { Content = "My answer" });

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var response = Assert.IsType<SubmissionResponse>(created.Value);
        Assert.Equal(SubmissionStatus.Submitted, response.Status);
    }

    [Fact]
    public async Task Submit_MarksAsLate_WhenDeadlineHasPassed()
    {
        // Deadline one hour ago - assignment is still published (a teacher
        // would not usually unpublish a running assignment), so a late
        // submission should still be accepted but flagged.
        var (db, assignment, student) = SeedPublishedAssignment(DateTime.UtcNow.AddHours(-1));
        var controller = new SubmissionsController(db, TestHelpers.CreateCurrentUser(student.Id, "Student", student.ClassId));

        var result = await controller.Submit(assignment.Id, new CreateSubmissionRequest { Content = "My late answer" });

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var response = Assert.IsType<SubmissionResponse>(created.Value);
        Assert.Equal(SubmissionStatus.Late, response.Status);
    }

    [Fact]
    public async Task Submit_ThrowsConflict_OnASecondSubmissionForTheSameAssignment()
    {
        var (db, assignment, student) = SeedPublishedAssignment(DateTime.UtcNow.AddDays(2));
        var controller = new SubmissionsController(db, TestHelpers.CreateCurrentUser(student.Id, "Student", student.ClassId));

        await controller.Submit(assignment.Id, new CreateSubmissionRequest { Content = "First attempt" });

        await Assert.ThrowsAsync<ConflictException>(() =>
            controller.Submit(assignment.Id, new CreateSubmissionRequest { Content = "Second attempt" }));
    }

    [Fact]
    public async Task UpdateSubmission_Succeeds_BeforeDeadline_WhenResubmissionIsAllowed()
    {
        var (db, assignment, student) = SeedPublishedAssignment(DateTime.UtcNow.AddDays(2), allowResubmission: true);
        var controller = new SubmissionsController(db, TestHelpers.CreateCurrentUser(student.Id, "Student", student.ClassId));

        var submitResult = await controller.Submit(assignment.Id, new CreateSubmissionRequest { Content = "First draft" });
        var created = Assert.IsType<CreatedAtActionResult>(submitResult.Result);
        var submission = Assert.IsType<SubmissionResponse>(created.Value);

        var updateResult = await controller.UpdateSubmission(submission.Id, new CreateSubmissionRequest { Content = "Improved answer" });
        var ok = Assert.IsType<OkObjectResult>(updateResult.Result);
        var updated = Assert.IsType<SubmissionResponse>(ok.Value);

        Assert.Equal("Improved answer", updated.Content);
        Assert.Equal(SubmissionStatus.Resubmitted, updated.Status);
    }

    [Fact]
    public async Task UpdateSubmission_ThrowsForbidden_WhenResubmissionIsDisabled()
    {
        var (db, assignment, student) = SeedPublishedAssignment(DateTime.UtcNow.AddDays(2), allowResubmission: false);
        var controller = new SubmissionsController(db, TestHelpers.CreateCurrentUser(student.Id, "Student", student.ClassId));

        var submitResult = await controller.Submit(assignment.Id, new CreateSubmissionRequest { Content = "Only attempt" });
        var created = Assert.IsType<CreatedAtActionResult>(submitResult.Result);
        var submission = Assert.IsType<SubmissionResponse>(created.Value);

        await Assert.ThrowsAsync<ForbiddenException>(() =>
            controller.UpdateSubmission(submission.Id, new CreateSubmissionRequest { Content = "Trying to sneak an edit in" }));
    }

    [Fact]
    public async Task UpdateSubmission_ThrowsForbidden_AfterTheDeadlineHasPassed()
    {
        var (db, assignment, student) = SeedPublishedAssignment(DateTime.UtcNow.AddSeconds(1));
        var controller = new SubmissionsController(db, TestHelpers.CreateCurrentUser(student.Id, "Student", student.ClassId));

        var submitResult = await controller.Submit(assignment.Id, new CreateSubmissionRequest { Content = "Original" });
        var created = Assert.IsType<CreatedAtActionResult>(submitResult.Result);
        var submission = Assert.IsType<SubmissionResponse>(created.Value);

        // Let the deadline elapse.
        await Task.Delay(1200);

        await Assert.ThrowsAsync<ForbiddenException>(() =>
            controller.UpdateSubmission(submission.Id, new CreateSubmissionRequest { Content = "Too late" }));
    }

    [Fact]
    public async Task Grade_ThrowsBadRequest_WhenMarksExceedMaxMarks()
    {
        var (db, assignment, student) = SeedPublishedAssignment(DateTime.UtcNow.AddDays(2));

        var studentController = new SubmissionsController(db, TestHelpers.CreateCurrentUser(student.Id, "Student", student.ClassId));
        var submitResult = await studentController.Submit(assignment.Id, new CreateSubmissionRequest { Content = "Answer" });
        var created = Assert.IsType<CreatedAtActionResult>(submitResult.Result);
        var submission = Assert.IsType<SubmissionResponse>(created.Value);

        var teacherController = new SubmissionsController(db, TestHelpers.CreateCurrentUser(assignment.TeacherId, "Teacher"));

        await Assert.ThrowsAsync<BadRequestException>(() =>
            teacherController.Grade(submission.Id, new GradeSubmissionRequest { Marks = assignment.MaxMarks + 10 }));
    }

    [Fact]
    public async Task Grade_Succeeds_AndMarksTheSubmissionAsGraded()
    {
        var (db, assignment, student) = SeedPublishedAssignment(DateTime.UtcNow.AddDays(2));

        var studentController = new SubmissionsController(db, TestHelpers.CreateCurrentUser(student.Id, "Student", student.ClassId));
        var submitResult = await studentController.Submit(assignment.Id, new CreateSubmissionRequest { Content = "Answer" });
        var created = Assert.IsType<CreatedAtActionResult>(submitResult.Result);
        var submission = Assert.IsType<SubmissionResponse>(created.Value);

        var teacherController = new SubmissionsController(db, TestHelpers.CreateCurrentUser(assignment.TeacherId, "Teacher"));
        var gradeResult = await teacherController.Grade(submission.Id, new GradeSubmissionRequest { Marks = 42, Feedback = "Well done" });

        var ok = Assert.IsType<OkObjectResult>(gradeResult.Result);
        var graded = Assert.IsType<SubmissionResponse>(ok.Value);

        Assert.Equal(SubmissionStatus.Graded, graded.Status);
        Assert.Equal(42, graded.Marks);
        Assert.Equal("Well done", graded.Feedback);
    }

    [Fact]
    public async Task Grade_ThrowsForbidden_WhenTeacherDoesNotOwnTheAssignment()
    {
        var (db, assignment, student) = SeedPublishedAssignment(DateTime.UtcNow.AddDays(2));

        var studentController = new SubmissionsController(db, TestHelpers.CreateCurrentUser(student.Id, "Student", student.ClassId));
        var submitResult = await studentController.Submit(assignment.Id, new CreateSubmissionRequest { Content = "Answer" });
        var created = Assert.IsType<CreatedAtActionResult>(submitResult.Result);
        var submission = Assert.IsType<SubmissionResponse>(created.Value);

        var intruder = new User { FullName = "Someone Else", Email = "intruder@school.edu", Role = UserRole.Teacher, PasswordHash = "x" };
        db.Users.Add(intruder);
        db.SaveChanges();

        var intruderController = new SubmissionsController(db, TestHelpers.CreateCurrentUser(intruder.Id, "Teacher"));

        await Assert.ThrowsAsync<ForbiddenException>(() =>
            intruderController.Grade(submission.Id, new GradeSubmissionRequest { Marks = 10 }));
    }

    [Fact]
    public async Task Submit_ThrowsForbidden_WhenAssignmentBelongsToADifferentClass()
    {
        var (db, assignment, _) = SeedPublishedAssignment(DateTime.UtcNow.AddDays(2));

        var otherClass = new SchoolClass { Name = "Class 8", Section = "C" };
        db.Classes.Add(otherClass);
        db.SaveChanges();

        var outsider = new User { FullName = "Outsider Student", Email = "outsider@school.edu", Role = UserRole.Student, PasswordHash = "x", ClassId = otherClass.Id };
        db.Users.Add(outsider);
        db.SaveChanges();

        var controller = new SubmissionsController(db, TestHelpers.CreateCurrentUser(outsider.Id, "Student", otherClass.Id));

        await Assert.ThrowsAsync<ForbiddenException>(() =>
            controller.Submit(assignment.Id, new CreateSubmissionRequest { Content = "Should not be allowed" }));
    }
}
