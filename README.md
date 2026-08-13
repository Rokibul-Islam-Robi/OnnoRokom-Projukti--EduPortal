# OnnoRokom Projukti - EduPortal

A production-grade, role-based **Assignment & Submission Management System** built for OnnoRokom Projukti Limited. The system enables administrators to govern academic classes and subjects, allows teachers to create coursework and evaluate student submissions with marks and feedback, and gives students a dedicated portal to view and submit their work.

---

## 🌟 Key Features

### 🛡️ 1. Administrator Portal (`/admin`)
- **System Overview**: Live stats on active faculty, enrolled students, academic classes, and subjects.
- **Class & Section Management**: Create and manage academic classes (e.g. *Class 10 - Section A*).
- **Subject Management**: Create subjects linked to specific classes (e.g. *Physics*, *Higher Math*).
- **Faculty Assignment**: Assign authorized teachers to specific subjects/classes, granting them exclusive assignment creation rights for those courses.
- **User Governance**: Provision Admin, Teacher, and Student accounts with soft-deactivation capabilities to preserve historical grading records.

### 👩‍🏫 2. Teacher Portal (`/teacher`)
- **Faculty Dashboard**: Overview of created assignments, draft vs. published statuses, and submission metrics.
- **Assignment Creation**: Formulate coursework with rich instructions, set submission deadlines (with date/time pickers), declare max marks, and enable/disable resubmissions.
- **Subject Verification**: Automatic enforcement ensuring teachers can only create assignments for subjects assigned to them by an Administrator.
- **Publishing Control**: Save assignments as drafts before making them visible to enrolled students.
- **Submission Grading**: Interactive submission review drawer to inspect text answers, award marks (0 to MaxMarks validated), provide constructive feedback, and track submission timeliness (`Submitted`, `Late`, `Resubmitted`).

### 🎓 3. Student Portal (`/student`)
- **Student Dashboard**: Filterable coursework view showing upcoming deadlines, score metrics, and submission statuses (`Not Submitted`, `Submitted`, `Late`, `Graded`).
- **Targeted Class Filtering**: Enrolled students automatically see published assignments targeted specifically to their assigned class section.
- **Text Answer Submission**: Direct text solution entry with deadline status validation.
- **Resubmission Workflows**: Edit and resubmit answers before the deadline if resubmissions are enabled by the teacher.
- **Grade & Feedback Inspection**: Detailed view of awarded marks, percentage achievements, and teacher comments once graded.

---

## 🏗️ Technology Stack & Architecture

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Inter Font typography.
- **Backend API**: ASP.NET Core 8 Web API (C#), Entity Framework Core 8, Serilog logging.
- **Authentication**: JWT Bearer Token Authentication with custom role & class claim enforcement, BCrypt password hashing.
- **Database**: PostgreSQL (Entity mappings in `AppDbContext.cs`, raw SQL DDL in `database/schema.sql`).
- **Testing**: xUnit + EF Core In-Memory database test suite (`tests/AssignmentSystem.Tests`).

---

## 🔑 Demo Credentials

For reviewer convenience, the `/login` screen includes quick-fill buttons for these pre-seeded accounts:

| Role | Email | Password | Assigned Class / Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@school.edu` | `Admin@123` | Full system governance |
| **Teacher** | `teacher@school.edu` | `Teacher@123` | Assigned to Physics (Class 10 A) |
| **Student** | `student@school.edu` | `Student@123` | Enrolled in Class 10 A |
| **Student (Alt)** | `farhana@school.edu` | `Student@123` | Enrolled in Class 10 A |

---

## 🚀 Setup & Execution Guide

### Prerequisites
- Node.js 18+ & npm
- .NET 8 SDK
- PostgreSQL database instance (or Docker container)

### 1. Database Setup
Raw SQL schema and initial seed data are provided under `database/`:
- Execute `database/schema.sql` to initialize tables and indexes.
- Execute `database/seed.sql` to populate sample classes, subjects, accounts, and demo assignments.

*(Note: The API automatically invokes `DbContext.Database.EnsureCreated()` and `DbSeeder.SeedAsync()` on startup if running against a fresh database).*

### 2. Backend Setup (`/backend`)
```bash
cd backend/src/AssignmentSystem.Api

# Update appsettings.json connection string if needed, then run:
dotnet restore
dotnet run
```
The API server will listen at `http://localhost:5215`. Swagger documentation is available at `http://localhost:5215/swagger`.

To execute unit tests:
```bash
cd backend/tests/AssignmentSystem.Tests
dotnet test
```

### 3. Frontend Setup (`/frontend`)
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Or build for production
npm run build
npm start
```
The application frontend will run at `http://localhost:3000`.

---

## 📐 Assumptions & Known Limitations

1. **Class Membership**: Students belong to exactly one academic class (`ClassId` foreign key on `User`), representing traditional school section enrollment.
2. **Text-Based Submissions**: Submission answers are plain text / formatted text, avoiding complex external cloud file storage requirements while meeting assignment specifications.
3. **Teacher-Subject Assignment Requirement**: Teachers must be explicitly assigned to a subject by an Admin before creating assignments for that course, reinforcing proper authorization boundaries.
4. **Soft Deactivation**: User accounts are soft-deleted (`IsActive = false`) rather than hard-purged to preserve historical grading records and audit integrity.
5. **EF Database Initialization**: `EnsureCreated()` is utilized for automatic dev database seeding. In enterprise production, Entity Framework migrations (`dotnet ef database update`) would be substituted.
