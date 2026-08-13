-- Sample data matching backend/src/AssignmentSystem.Api/Data/DbSeeder.cs
-- Run this only if you set up the schema manually via schema.sql instead
-- of letting the API seed itself on first run.
--
-- Demo credentials (also listed in README.md):
--   Admin:   admin@school.edu   / Admin@123
--   Teacher: teacher@school.edu / Teacher@123
--   Student: student@school.edu / Student@123

INSERT INTO "Classes" ("Name", "Section") VALUES
    ('Class 10', 'A'),
    ('Class 9', 'B');

INSERT INTO "Subjects" ("Name", "Code", "ClassId") VALUES
    ('Mathematics', 'MATH10', 1),
    ('English', 'ENG10', 1),
    ('Science', 'SCI9', 2);

-- Password hashes below are bcrypt (work factor 11) of the plaintext
-- passwords listed above.
INSERT INTO "Users" ("FullName", "Email", "PasswordHash", "Role", "IsActive", "ClassId") VALUES
    ('System Admin', 'admin@school.edu', '$2b$11$tH0AIl5oznYkdil0h3ucXOe1ejk3Ds9WMdOfLG4rr1qDvcpzWE9yC', 'Admin', TRUE, NULL),
    ('Nusrat Jahan', 'teacher@school.edu', '$2b$11$HtcL1eHwX5s5cse/Dz0sSO/JBilBdeu5IhrGDPC093wgUnIIfp3.e', 'Teacher', TRUE, NULL),
    ('Tanvir Ahmed', 'student@school.edu', '$2b$11$e/EJLoyVCkGa2xPxO4QHpOcBvFqximb.3XrhnYsyrJcsfIXsOiy6i', 'Student', TRUE, 1),
    ('Farhana Islam', 'farhana@school.edu', '$2b$11$s.0aXqpSue7Ab6LJcR8SHupteSVTWTRvhZhpHtjmI3G9nyXkspbbm', 'Student', TRUE, 1);

INSERT INTO "TeacherAssignments" ("TeacherId", "SubjectId") VALUES
    (2, 1),
    (2, 2);

INSERT INTO "Assignments" ("Title", "Description", "Deadline", "MaxMarks", "Status", "AllowResubmission", "ClassId", "SubjectId", "TeacherId") VALUES
    ('Algebra Worksheet 1', 'Solve questions 1 to 10 from chapter 3 and show your working.', NOW() + INTERVAL '7 days', 50, 'Published', TRUE, 1, 1, 2),
    ('Essay: My Summer Vacation', 'Write a 400 word essay about how you spent your last summer vacation.', NOW() - INTERVAL '2 days', 20, 'Published', TRUE, 1, 2, 2);

INSERT INTO "Submissions" ("AssignmentId", "StudentId", "Content", "Status", "Marks", "Feedback", "GradedAt", "SubmittedAt") VALUES
    (2, 3, 'This summer I visited my grandparents in Sylhet and helped with the tea garden...', 'Graded', 17, 'Good structure, watch your paragraph transitions next time.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '3 days');
