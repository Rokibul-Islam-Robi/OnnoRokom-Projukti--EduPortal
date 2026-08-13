export type UserRole = "Admin" | "Teacher" | "Student";

export type AssignmentStatus = "Draft" | "Published";

export type SubmissionStatus = "Submitted" | "Late" | "Graded" | "Resubmitted";

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  classId: number | null;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: AuthUser;
}

export interface SchoolClass {
  id: number;
  name: string;
  section: string | null;
  studentCount: number;
  subjectCount: number;
}

export interface TeacherInfo {
  id: number;
  fullName: string;
}

export interface Subject {
  id: number;
  name: string;
  code: string | null;
  classId: number;
  className: string;
  teachers: string[];
  assignedTeachers?: TeacherInfo[];
}

export interface UserRecord {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  classId: number | null;
  className: string | null;
  createdAt: string;
}

export interface SubmissionRecord {
  id: number;
  assignmentId: number;
  assignmentTitle: string;
  studentId: number;
  studentName: string;
  content: string;
  status: SubmissionStatus;
  marks: number | null;
  feedback: string | null;
  gradedAt: string | null;
  submittedAt: string;
  updatedAt: string | null;
}

export interface AssignmentRecord {
  id: number;
  title: string;
  description: string;
  deadline: string;
  maxMarks: number;
  status: AssignmentStatus;
  allowResubmission: boolean;
  classId: number;
  className: string;
  subjectId: number;
  subjectName: string;
  teacherId: number;
  teacherName: string;
  createdAt: string;
  mySubmission: SubmissionRecord | null;
  submissionCount: number;
  isPastDeadline: boolean;
}

export interface ApiError {
  message: string;
  details?: string;
}
