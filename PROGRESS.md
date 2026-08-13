# Build Progress — Assignment & Submission Management System

Status: COMPLETE — Backend complete, Database schema & seeds complete, Frontend fully implemented & verified.

## Assignment brief
OnnoRokom Projukti Limited recruitment task: a role-based (Admin / Teacher / Student) Assignment & Submission Management System.
Stack: Next.js + React + TypeScript frontend, ASP.NET Core Web API (C#) backend, PostgreSQL, JWT auth, xUnit tests.

## Completed Components Summary

### 1. Backend (`backend/`) — COMPLETE
- ASP.NET Core 8 Web API with C# entities: User, SchoolClass, Subject, TeacherAssignment, Assignment, Submission.
- Central ExceptionHandlingMiddleware mapping custom ApiExceptions (NotFound, Forbidden, BadRequest, Conflict) to HTTP status codes.
- Controllers with role-based `[Authorize(Roles = "...")]` and ownership checks (`AuthController`, `UsersController`, `ClassesController`, `AssignmentsController`, `SubmissionsController`).
- Unit test suite (`tests/AssignmentSystem.Tests`) covering password hashing, JWT claims, role authorization, assignment creation rules, submission deadlines, and grading boundaries.

### 2. Database (`database/`) — COMPLETE
- `schema.sql` (Raw PostgreSQL DDL matching EF model).
- `seed.sql` (Pre-seeded demo accounts with BCrypt hashes, classes, subjects, sample assignments and submission).

### 3. Frontend (`frontend/`) — COMPLETE
- Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Inter Font.
- Responsive, high-end corporate design system (`AppShell`, `Card`, `Badge`, `StatCard`, `RoleGuard`, `AuthProvider`).
- **Admin Portal**: Overview dashboard, User directory with role filters & account provisioning, Classes management, Subjects management & teacher assignments.
- **Teacher Portal**: Faculty dashboard, Assignment creation form with subject validation & draft/publish control, Assignment management & submission grading modal.
- **Student Portal**: Student dashboard with deadline & submission status indicators, Assignment details & text answer submission form, Graded results & teacher feedback view.
- **Auth**: Corporate `/login` screen with quick-fill demo account buttons.
