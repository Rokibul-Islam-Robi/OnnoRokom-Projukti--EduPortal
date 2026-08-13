using AssignmentSystem.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace AssignmentSystem.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<SchoolClass> Classes => Set<SchoolClass>();
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<TeacherAssignment> TeacherAssignments => Set<TeacherAssignment>();
    public DbSet<Assignment> Assignments => Set<Assignment>();
    public DbSet<Submission> Submissions => Set<Submission>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Role).HasConversion<string>();

            entity.HasOne(u => u.Class)
                .WithMany(c => c.Students)
                .HasForeignKey(u => u.ClassId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Subject>(entity =>
        {
            entity.HasOne(s => s.Class)
                .WithMany(c => c.Subjects)
                .HasForeignKey(s => s.ClassId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TeacherAssignment>(entity =>
        {
            entity.HasIndex(ta => new { ta.TeacherId, ta.SubjectId }).IsUnique();

            entity.HasOne(ta => ta.Teacher)
                .WithMany(u => u.TeacherAssignments)
                .HasForeignKey(ta => ta.TeacherId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ta => ta.Subject)
                .WithMany(s => s.TeacherAssignments)
                .HasForeignKey(ta => ta.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Assignment>(entity =>
        {
            entity.Property(a => a.Status).HasConversion<string>();

            entity.HasOne(a => a.Class)
                .WithMany(c => c.Assignments)
                .HasForeignKey(a => a.ClassId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.Subject)
                .WithMany(s => s.Assignments)
                .HasForeignKey(a => a.SubjectId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.Teacher)
                .WithMany(u => u.AssignmentsCreated)
                .HasForeignKey(a => a.TeacherId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Submission>(entity =>
        {
            entity.Property(s => s.Status).HasConversion<string>();

            // A student can only submit once per assignment - further
            // attempts go through the update endpoint instead of creating
            // duplicate rows.
            entity.HasIndex(s => new { s.AssignmentId, s.StudentId }).IsUnique();

            entity.HasOne(s => s.Assignment)
                .WithMany(a => a.Submissions)
                .HasForeignKey(s => s.AssignmentId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(s => s.Student)
                .WithMany(u => u.Submissions)
                .HasForeignKey(s => s.StudentId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
