using System.Net;
using System.Text.Json;
using AssignmentSystem.Api.Common;

namespace AssignmentSystem.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleAsync(context, ex);
        }
    }

    private async Task HandleAsync(HttpContext context, Exception ex)
    {
        var (status, message) = ex switch
        {
            NotFoundException => (HttpStatusCode.NotFound, ex.Message),
            ForbiddenException => (HttpStatusCode.Forbidden, ex.Message),
            BadRequestException => (HttpStatusCode.BadRequest, ex.Message),
            ConflictException => (HttpStatusCode.Conflict, ex.Message),
            _ => (HttpStatusCode.InternalServerError, "Something went wrong while processing the request.")
        };

        if (status == HttpStatusCode.InternalServerError)
        {
            _logger.LogError(ex, "Unhandled exception on {Path}", context.Request.Path);
        }
        else
        {
            _logger.LogWarning("{StatusCode} on {Path}: {Message}", (int)status, context.Request.Path, ex.Message);
        }

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)status;

        var body = new ErrorResponse { Message = message };
        await context.Response.WriteAsync(JsonSerializer.Serialize(body));
    }
}
