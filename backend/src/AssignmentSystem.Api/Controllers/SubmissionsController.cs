using AssignmentSystem.Api.Common;
using AssignmentSystem.Api.Data;
using AssignmentSystem.Api.Dtos;
using AssignmentSystem.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Api.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class SubmissionsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly CurrentUser _currentUser;

    public SubmissionsController(AppDbContext db, CurrentUser currentUser)
    {
        _db = db;
        _currentUser = currentUser;
    }

    // Student submits an answer for an assignment.
    [HttpPost("assignments/{assignmentId:int}/submissions")]
    [Authorize(Roles = "Student")]
    public async Task<ActionResult<SubmissionResponse>> Submit(int assignmentId, CreateSubmissionRequest request)
    {
        var assignment = await _db.Assignments.FirstOrDefaultAsync(a => a.Id == assignmentId);
        if (assignment is null)
        {
            throw new NotFoundException($"Assignment {assignmentId} was not found.");
        }

        if (assignment.Status != AssignmentStatus.Published || assignment.ClassId != _currentUser.ClassId)
        {
            throw new ForbiddenException("This assignment is not available to you.");
        }

        var existing = await _db.Submissions
            .FirstOrDefaultAsync(s => s.AssignmentId == assignmentId && s.StudentId == _currentUser.Id);

        if (existing is not null)
        {
            throw new ConflictException("You have already submitted this assignment. Use update instead.");
        }

        var isLate = DateTime.UtcNow > assignment.Deadline;

        var submission = new Submission
        {
            AssignmentId = assignmentId,
            StudentId = _currentUser.Id,
            Content = request.Content,
            Status = isLate ? SubmissionStatus.Late : SubmissionStatus.Submitted,
            SubmittedAt = DateTime.UtcNow
        };

        _db.Submissions.Add(submission);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSubmission), new { id = submission.Id }, ToResponse(submission, assignment.Title, _currentUser.Id.ToString()));
    }

    // Student edits their own answer before the deadline (if the teacher
    // allowed resubmission on this assignment).
    [HttpPut("submissions/{id:int}")]
    [Authorize(Roles = "Student")]
    public async Task<ActionResult<SubmissionResponse>> UpdateSubmission(int id, CreateSubmissionRequest request)
    {
        var submission = await _db.Submissions
            .Include(s => s.Assignment)
            .Include(s => s.Student)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (submission is null)
        {
            throw new NotFoundException($"Submission {id} was not found.");
        }

        if (submission.StudentId != _currentUser.Id)
        {
            throw new ForbiddenException("You can only update your own submission.");
        }

        if (submission.Assignment is null)
        {
            throw new NotFoundException("The related assignment no longer exists.");
        }

        if (!submission.Assignment.AllowResubmission)
        {
            throw new ForbiddenException("The teacher has disabled resubmissions for this assignment.");
        }

        if (DateTime.UtcNow > submission.Assignment.Deadline)
        {
            throw new ForbiddenException("The deadline has passed - this submission can no longer be edited.");
        }

        if (submission.Status == SubmissionStatus.Graded)
        {
            throw new ForbiddenException("This submission has already been graded and can no longer be edited.");
        }

        submission.Content = request.Content;
        submission.Status = SubmissionStatus.Resubmitted;
        submission.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(ToResponse(submission, submission.Assignment.Title, submission.Student?.FullName ?? string.Empty));
    }

    [HttpGet("submissions/{id:int}")]
    public async Task<ActionResult<SubmissionResponse>> GetSubmission(int id)
    {
        var submission = await _db.Submissions
            .Include(s => s.Assignment)
            .Include(s => s.Student)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (submission is null)
        {
            throw new NotFoundException($"Submission {id} was not found.");
        }

        if (_currentUser.IsStudent && submission.StudentId != _currentUser.Id)
        {
            throw new ForbiddenException("You do not have access to this submission.");
        }

        if (_currentUser.IsTeacher && submission.Assignment?.TeacherId != _currentUser.Id)
        {
            throw new ForbiddenException("You do not have access to this submission.");
        }

        return Ok(ToResponse(submission, submission.Assignment?.Title ?? string.Empty, submission.Student?.FullName ?? string.Empty));
    }

    // Teacher views every submission for one of their assignments.
    [HttpGet("assignments/{assignmentId:int}/submissions")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<List<SubmissionResponse>>> GetForAssignment(int assignmentId)
    {
        var assignment = await _db.Assignments.FirstOrDefaultAsync(a => a.Id == assignmentId);
        if (assignment is null)
        {
            throw new NotFoundException($"Assignment {assignmentId} was not found.");
        }

        if (_currentUser.IsTeacher && assignment.TeacherId != _currentUser.Id)
        {
            throw new ForbiddenException("You can only view submissions for your own assignments.");
        }

        var submissions = await _db.Submissions
            .Include(s => s.Student)
            .Where(s => s.AssignmentId == assignmentId)
            .OrderBy(s => s.Student!.FullName)
            .ToListAsync();

        return Ok(submissions.Select(s => ToResponse(s, assignment.Title, s.Student?.FullName ?? string.Empty)));
    }

    // Teacher grades a submission.
    [HttpPost("submissions/{id:int}/grade")]
    [Authorize(Roles = "Teacher")]
    public async Task<ActionResult<SubmissionResponse>> Grade(int id, GradeSubmissionRequest request)
    {
        var submission = await _db.Submissions
            .Include(s => s.Assignment)
            .Include(s => s.Student)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (submission is null)
        {
            throw new NotFoundException($"Submission {id} was not found.");
        }

        if (submission.Assignment is null || submission.Assignment.TeacherId != _currentUser.Id)
        {
            throw new ForbiddenException("You can only grade submissions for your own assignments.");
        }

        if (request.Marks < 0 || request.Marks > submission.Assignment.MaxMarks)
        {
            throw new BadRequestException($"Marks must be between 0 and {submission.Assignment.MaxMarks}.");
        }

        submission.Marks = request.Marks;
        submission.Feedback = request.Feedback;
        submission.Status = SubmissionStatus.Graded;
        submission.GradedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(ToResponse(submission, submission.Assignment.Title, submission.Student?.FullName ?? string.Empty));
    }

    // Teacher can move a submission back out of "Graded" (e.g. to allow a
    // resubmission after a mistake) without deleting the record.
    [HttpPost("submissions/{id:int}/status")]
    [Authorize(Roles = "Teacher")]
    public async Task<ActionResult<SubmissionResponse>> UpdateStatus(int id, UpdateSubmissionStatusRequest request)
    {
        var submission = await _db.Submissions
            .Include(s => s.Assignment)
            .Include(s => s.Student)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (submission is null)
        {
            throw new NotFoundException($"Submission {id} was not found.");
        }

        if (submission.Assignment is null || submission.Assignment.TeacherId != _currentUser.Id)
        {
            throw new ForbiddenException("You can only update submissions for your own assignments.");
        }

        submission.Status = request.Status;
        await _db.SaveChangesAsync();

        return Ok(ToResponse(submission, submission.Assignment.Title, submission.Student?.FullName ?? string.Empty));
    }

    private static SubmissionResponse ToResponse(Submission s, string assignmentTitle, string studentName) => new()
    {
        Id = s.Id,
        AssignmentId = s.AssignmentId,
        AssignmentTitle = assignmentTitle,
        StudentId = s.StudentId,
        StudentName = studentName,
        Content = s.Content,
        Status = s.Status,
        Marks = s.Marks,
        Feedback = s.Feedback,
        GradedAt = s.GradedAt,
        SubmittedAt = s.SubmittedAt,
        UpdatedAt = s.UpdatedAt
    };
}
