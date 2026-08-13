using AssignmentSystem.Api.Common;
using AssignmentSystem.Api.Data;
using AssignmentSystem.Api.Dtos;
using AssignmentSystem.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Api.Controllers;

[ApiController]
[Route("api/classes")]
[Authorize]
public class ClassesController : ControllerBase
{
    private readonly AppDbContext _db;

    public ClassesController(AppDbContext db)
    {
        _db = db;
    }

    // Any authenticated role can list classes - students need it to see
    // their own class name, teachers need it when creating assignments.
    [HttpGet]
    public async Task<ActionResult<List<ClassResponse>>> GetAll()
    {
        var classes = await _db.Classes
            .Select(c => new ClassResponse
            {
                Id = c.Id,
                Name = c.Name,
                Section = c.Section,
                StudentCount = c.Students.Count,
                SubjectCount = c.Subjects.Count
            })
            .OrderBy(c => c.Name)
            .ToListAsync();

        return Ok(classes);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ClassResponse>> Create(CreateClassRequest request)
    {
        var schoolClass = new SchoolClass { Name = request.Name, Section = request.Section };
        _db.Classes.Add(schoolClass);
        await _db.SaveChangesAsync();

        return Ok(new ClassResponse { Id = schoolClass.Id, Name = schoolClass.Name, Section = schoolClass.Section });
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var schoolClass = await _db.Classes.FindAsync(id);
        if (schoolClass is null)
        {
            throw new NotFoundException($"Class {id} was not found.");
        }

        var hasStudents = await _db.Users.AnyAsync(u => u.ClassId == id);
        if (hasStudents)
        {
            throw new ConflictException("Cannot delete a class that still has students enrolled.");
        }

        _db.Classes.Remove(schoolClass);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // --- Subjects ---

    [HttpGet("/api/subjects")]
    public async Task<ActionResult<List<SubjectResponse>>> GetSubjects([FromQuery] int? classId)
    {
        var query = _db.Subjects
            .Include(s => s.Class)
            .Include(s => s.TeacherAssignments).ThenInclude(ta => ta.Teacher)
            .AsQueryable();

        if (classId.HasValue)
        {
            query = query.Where(s => s.ClassId == classId);
        }

        var subjects = await query.ToListAsync();

        return Ok(subjects.Select(s => new SubjectResponse
        {
            Id = s.Id,
            Name = s.Name,
            Code = s.Code,
            ClassId = s.ClassId,
            ClassName = s.Class is null ? string.Empty : $"{s.Class.Name} {s.Class.Section}".Trim(),
            Teachers = s.TeacherAssignments.Where(ta => ta.Teacher != null).Select(ta => ta.Teacher!.FullName).ToList(),
            AssignedTeachers = s.TeacherAssignments.Where(ta => ta.Teacher != null).Select(ta => new TeacherInfoDto { Id = ta.TeacherId, FullName = ta.Teacher!.FullName }).ToList()
        }));
    }

    [HttpPost("/api/subjects")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SubjectResponse>> CreateSubject(CreateSubjectRequest request)
    {
        var classExists = await _db.Classes.AnyAsync(c => c.Id == request.ClassId);
        if (!classExists)
        {
            throw new BadRequestException("The selected class does not exist.");
        }

        var subject = new Subject { Name = request.Name, Code = request.Code, ClassId = request.ClassId };
        _db.Subjects.Add(subject);
        await _db.SaveChangesAsync();

        return Ok(new SubjectResponse { Id = subject.Id, Name = subject.Name, Code = subject.Code, ClassId = subject.ClassId });
    }

    [HttpPost("/api/subjects/assign-teacher")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AssignTeacher(AssignTeacherRequest request)
    {
        var teacher = await _db.Users.FindAsync(request.TeacherId);
        if (teacher is null || teacher.Role != UserRole.Teacher)
        {
            throw new BadRequestException("The selected user is not a valid teacher.");
        }

        var subject = await _db.Subjects.FindAsync(request.SubjectId);
        if (subject is null)
        {
            throw new BadRequestException("The selected subject does not exist.");
        }

        var alreadyAssigned = await _db.TeacherAssignments
            .AnyAsync(ta => ta.TeacherId == request.TeacherId && ta.SubjectId == request.SubjectId);

        if (alreadyAssigned)
        {
            throw new ConflictException("This teacher is already assigned to this subject.");
        }

        _db.TeacherAssignments.Add(new TeacherAssignment { TeacherId = request.TeacherId, SubjectId = request.SubjectId });
        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("/api/subjects/{subjectId:int}/teachers/{teacherId:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UnassignTeacher(int subjectId, int teacherId)
    {
        var link = await _db.TeacherAssignments
            .FirstOrDefaultAsync(ta => ta.SubjectId == subjectId && ta.TeacherId == teacherId);

        if (link is null)
        {
            throw new NotFoundException("This teacher is not assigned to this subject.");
        }

        _db.TeacherAssignments.Remove(link);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
