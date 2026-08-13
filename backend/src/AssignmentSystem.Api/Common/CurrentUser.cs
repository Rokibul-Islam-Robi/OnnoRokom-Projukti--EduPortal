using System.Security.Claims;

namespace AssignmentSystem.Api.Common;

// Thin wrapper so controllers don't repeat ClaimTypes lookups everywhere.
public class CurrentUser
{
    private readonly IHttpContextAccessor _accessor;

    public CurrentUser(IHttpContextAccessor accessor)
    {
        _accessor = accessor;
    }

    private ClaimsPrincipal? Principal => _accessor.HttpContext?.User;

    public int Id
    {
        get
        {
            var value = Principal?.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.TryParse(value, out var id) ? id : 0;
        }
    }

    public string Role => Principal?.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

    public int? ClassId
    {
        get
        {
            var value = Principal?.FindFirstValue("classId");
            return int.TryParse(value, out var classId) ? classId : null;
        }
    }

    public bool IsAdmin => Role == "Admin";
    public bool IsTeacher => Role == "Teacher";
    public bool IsStudent => Role == "Student";
}
