using AssignmentSystem.Api.Common;
using AssignmentSystem.Api.Data;
using AssignmentSystem.Api.Dtos;
using AssignmentSystem.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Api.Controllers;

[ApiController]
[Route("api/assignments")]
[Authorize]
public class AssignmentsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly CurrentUser _currentUser;

    public AssignmentsController(AppDbContext db, CurrentUser currentUser)
    {
        _db = db;
        _currentUser = currentUser;
    }

    [HttpGet]
    public async Task<ActionResult<List<AssignmentResponse>>> GetAll([FromQuery] int? classId, [FromQuery] int? subjectId)
    {
        var query = _db.Assignments
            .Include(a => a.Class)
            .Include(a => a.Subject)
            .Include(a => a.Teacher)
            .Include(a => a.Submissions)
            .AsQueryable();

        if (_currentUser.IsStudent)
        {
            // Students only ever see published work assigned to their own class.
            query = query.Where(a => a.ClassId == _currentUser.ClassId && a.Status == AssignmentStatus.Published);
        }
        else if (_currentUser.IsTeacher)
        {
            query = query.Where(a => a.TeacherId == _currentUser.Id);
        }
        // Admin sees everything - no extra filter.

        if (classId.HasValue)
        {
            query = query.Where(a => a.ClassId == classId);
        }

        if (subjectId.HasValue)
        {
            query = query.Where(a => a.SubjectId == subjectId);
        }

        var assignments = await query.OrderByDescending(a => a.CreatedAt).ToListAsync();

        Submission? mySubmission = null;
        var result = new List<AssignmentResponse>();

        foreach (var a in assignments)
        {
            if (_currentUser.IsStudent)
            {
                mySubmission = await _db.Submissions
                    .FirstOrDefaultAsync(s => s.AssignmentId == a.Id && s.StudentId == _currentUser.Id);
            }

            result.Add(ToResponse(a, mySubmission));
        }

        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AssignmentResponse>> GetById(int id)
    {
        var assignment = await LoadAssignmentAsync(id);
        await GuardCanView(assignment);

        Submission? mySubmission = null;
        if (_currentUser.IsStudent)
        {
            mySubmission = await _db.Submissions
                .FirstOrDefaultAsync(s => s.AssignmentId == id && s.StudentId == _currentUser.Id);
        }

        return Ok(ToResponse(assignment, mySubmission));
    }

    [HttpPost]
    [Authorize(Roles = "Teacher")]
    public async Task<ActionResult<AssignmentResponse>> Create(CreateAssignmentRequest request)
    {
        await GuardTeacherOwnsSubjectClass(request.SubjectId, request.ClassId);

        if (request.Deadline <= DateTime.UtcNow)
        {
            throw new BadRequestException("Deadline must be in the future.");
        }

        var assignment = new Assignment
        {
            Title = request.Title,
            Description = request.Description,
            ClassId = request.ClassId,
            SubjectId = request.SubjectId,
            TeacherId = _currentUser.Id,
            Deadline = request.Deadline,
            MaxMarks = request.MaxMarks,
            AllowResubmission = request.AllowResubmission,
            Status = request.Publish ? AssignmentStatus.Published : AssignmentStatus.Draft
        };

        _db.Assignments.Add(assignment);
        await _db.SaveChangesAsync();

        var saved = await LoadAssignmentAsync(assignment.Id);
        return CreatedAtAction(nameof(GetById), new { id = assignment.Id }, ToResponse(saved, null));
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Teacher")]
    public async Task<ActionResult<AssignmentResponse>> Update(int id, UpdateAssignmentRequest request)
    {
        var assignment = await LoadAssignmentAsync(id);
        GuardOwnsAssignment(assignment);

        assignment.Title = request.Title;
        assignment.Description = request.Description;
        assignment.Deadline = request.Deadline;
        assignment.MaxMarks = request.MaxMarks;
        assignment.AllowResubmission = request.AllowResubmission;
        assignment.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(ToResponse(assignment, null));
    }

    [HttpPost("{id:int}/publish")]
    [Authorize(Roles = "Teacher")]
    public async Task<ActionResult<AssignmentResponse>> Publish(int id)
    {
        var assignment = await LoadAssignmentAsync(id);
        GuardOwnsAssignment(assignment);

        assignment.Status = AssignmentStatus.Published;
        assignment.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(ToResponse(assignment, null));
    }

    [HttpPost("{id:int}/unpublish")]
    [Authorize(Roles = "Teacher")]
    public async Task<ActionResult<AssignmentResponse>> Unpublish(int id)
    {
        var assignment = await LoadAssignmentAsync(id);
        GuardOwnsAssignment(assignment);

        assignment.Status = AssignmentStatus.Draft;
        assignment.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(ToResponse(assignment, null));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> Delete(int id)
    {
        var assignment = await LoadAssignmentAsync(id);
        GuardOwnsAssignment(assignment);

        _db.Assignments.Remove(assignment);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // --- helpers ---

    private async Task<Assignment> LoadAssignmentAsync(int id)
    {
        var assignment = await _db.Assignments
            .Include(a => a.Class)
            .Include(a => a.Subject)
            .Include(a => a.Teacher)
            .Include(a => a.Submissions)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (assignment is null)
        {
            throw new NotFoundException($"Assignment {id} was not found.");
        }

        return assignment;
    }

    private Task GuardCanView(Assignment assignment)
    {
        if (_currentUser.IsAdmin)
        {
            return Task.CompletedTask;
        }

        if (_currentUser.IsTeacher && assignment.TeacherId == _currentUser.Id)
        {
            return Task.CompletedTask;
        }

        if (_currentUser.IsStudent
            && assignment.ClassId == _currentUser.ClassId
            && assignment.Status == AssignmentStatus.Published)
        {
            return Task.CompletedTask;
        }

        throw new ForbiddenException("You do not have access to this assignment.");
    }

    private void GuardOwnsAssignment(Assignment assignment)
    {
        if (assignment.TeacherId != _currentUser.Id)
        {
            throw new ForbiddenException("You can only manage assignments you created.");
        }
    }

    // A teacher may only create work for a subject/class pair they have
    // actually been assigned to by the admin - stops a teacher from
    // setting homework for a class they don't teach.
    private async Task GuardTeacherOwnsSubjectClass(int subjectId, int classId)
    {
        var subject = await _db.Subjects.FirstOrDefaultAsync(s => s.Id == subjectId);
        if (subject is null || subject.ClassId != classId)
        {
            throw new BadRequestException("The selected subject does not belong to the selected class.");
        }

        var isAssigned = await _db.TeacherAssignments
            .AnyAsync(ta => ta.TeacherId == _currentUser.Id && ta.SubjectId == subjectId);

        if (!isAssigned)
        {
            throw new ForbiddenException("You are not assigned to teach this subject.");
        }
    }

    private static AssignmentResponse ToResponse(Assignment a, Submission? mySubmission) => new()
    {
        Id = a.Id,
        Title = a.Title,
        Description = a.Description,
        Deadline = a.Deadline,
        MaxMarks = a.MaxMarks,
        Status = a.Status,
        AllowResubmission = a.AllowResubmission,
        ClassId = a.ClassId,
        ClassName = a.Class is null ? string.Empty : $"{a.Class.Name} {a.Class.Section}".Trim(),
        SubjectId = a.SubjectId,
        SubjectName = a.Subject?.Name ?? string.Empty,
        TeacherId = a.TeacherId,
        TeacherName = a.Teacher?.FullName ?? string.Empty,
        CreatedAt = a.CreatedAt,
        SubmissionCount = a.Submissions.Count,
        MySubmission = mySubmission is null ? null : new SubmissionResponse
        {
            Id = mySubmission.Id,
            AssignmentId = mySubmission.AssignmentId,
            StudentId = mySubmission.StudentId,
            Content = mySubmission.Content,
            Status = mySubmission.Status,
            Marks = mySubmission.Marks,
            Feedback = mySubmission.Feedback,
            GradedAt = mySubmission.GradedAt,
            SubmittedAt = mySubmission.SubmittedAt,
            UpdatedAt = mySubmission.UpdatedAt
        }
    };
}
