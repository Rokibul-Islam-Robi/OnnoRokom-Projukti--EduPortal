-- Assignment & Submission Management System
-- Raw schema for PostgreSQL, kept in sync with the EF Core model in
-- backend/src/AssignmentSystem.Api/Entities.
--
-- The API creates this schema for you automatically on first run
-- (see Program.cs -> db.Database.EnsureCreated()), so running this
-- file by hand is optional. It's provided so the database can also be
-- inspected or set up without starting the API first.

CREATE TABLE IF NOT EXISTS "Classes" (
    "Id"        SERIAL PRIMARY KEY,
    "Name"      VARCHAR(100) NOT NULL,
    "Section"   VARCHAR(50),
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Subjects" (
    "Id"      SERIAL PRIMARY KEY,
    "Name"    VARCHAR(100) NOT NULL,
    "Code"    VARCHAR(20),
    "ClassId" INT NOT NULL REFERENCES "Classes"("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Users" (
    "Id"           SERIAL PRIMARY KEY,
    "FullName"     VARCHAR(150) NOT NULL,
    "Email"        VARCHAR(256) NOT NULL UNIQUE,
    "PasswordHash" TEXT NOT NULL,
    "Role"         VARCHAR(20) NOT NULL CHECK ("Role" IN ('Admin', 'Teacher', 'Student')),
    "IsActive"     BOOLEAN NOT NULL DEFAULT TRUE,
    "ClassId"      INT REFERENCES "Classes"("Id") ON DELETE SET NULL,
    "CreatedAt"    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "TeacherAssignments" (
    "Id"        SERIAL PRIMARY KEY,
    "TeacherId" INT NOT NULL REFERENCES "Users"("Id") ON DELETE CASCADE,
    "SubjectId" INT NOT NULL REFERENCES "Subjects"("Id") ON DELETE CASCADE,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE ("TeacherId", "SubjectId")
);

CREATE TABLE IF NOT EXISTS "Assignments" (
    "Id"                SERIAL PRIMARY KEY,
    "Title"             VARCHAR(200) NOT NULL,
    "Description"       TEXT NOT NULL,
    "Deadline"          TIMESTAMP NOT NULL,
    "MaxMarks"          INT NOT NULL,
    "Status"            VARCHAR(20) NOT NULL DEFAULT 'Draft' CHECK ("Status" IN ('Draft', 'Published')),
    "AllowResubmission" BOOLEAN NOT NULL DEFAULT TRUE,
    "ClassId"           INT NOT NULL REFERENCES "Classes"("Id"),
    "SubjectId"         INT NOT NULL REFERENCES "Subjects"("Id"),
    "TeacherId"         INT NOT NULL REFERENCES "Users"("Id"),
    "CreatedAt"         TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt"         TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Submissions" (
    "Id"           SERIAL PRIMARY KEY,
    "AssignmentId" INT NOT NULL REFERENCES "Assignments"("Id") ON DELETE CASCADE,
    "StudentId"    INT NOT NULL REFERENCES "Users"("Id"),
    "Content"      TEXT NOT NULL,
    "Status"       VARCHAR(20) NOT NULL DEFAULT 'Submitted' CHECK ("Status" IN ('Submitted', 'Late', 'Graded', 'Resubmitted')),
    "Marks"        INT,
    "Feedback"     TEXT,
    "GradedAt"     TIMESTAMP,
    "SubmittedAt"  TIMESTAMP NOT NULL DEFAULT NOW(),
    "UpdatedAt"    TIMESTAMP,
    UNIQUE ("AssignmentId", "StudentId")
);

CREATE INDEX IF NOT EXISTS "IX_Users_Email" ON "Users" ("Email");
CREATE INDEX IF NOT EXISTS "IX_Assignments_ClassId" ON "Assignments" ("ClassId");
CREATE INDEX IF NOT EXISTS "IX_Submissions_AssignmentId" ON "Submissions" ("AssignmentId");
