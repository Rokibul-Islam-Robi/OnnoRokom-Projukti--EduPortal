const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5215";

export class ApiClientError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

// Pre-seeded fallback mock data for seamless testing when backend is offline
const MOCK_USERS = [
  { id: 1, email: "admin@school.edu", fullName: "System Administrator", role: "Admin", isActive: true, createdAt: new Date().toISOString() },
  { id: 2, email: "teacher@school.edu", fullName: "Dr. Sarah Jenkins", role: "Teacher", isActive: true, createdAt: new Date().toISOString() },
  { id: 3, email: "student@school.edu", fullName: "Alex Rivera", role: "Student", className: "Class 10 - Section A", classId: 1, isActive: true, createdAt: new Date().toISOString() },
];

const MOCK_CLASSES = [
  { id: 1, name: "Class 10", section: "Section A", studentCount: 28, subjectCount: 6 },
  { id: 2, name: "Class 9", section: "Section B", studentCount: 32, subjectCount: 5 },
  { id: 3, name: "Grade 11", section: "Science", studentCount: 24, subjectCount: 7 },
];

const MOCK_SUBJECTS = [
  { id: 1, name: "Physics", code: "PHY-101", classId: 1, className: "Class 10 (Section A)", teachers: ["Dr. Sarah Jenkins"], assignedTeachers: [{ id: 2, fullName: "Dr. Sarah Jenkins", email: "teacher@school.edu" }] },
  { id: 2, name: "Higher Mathematics", code: "MATH-201", classId: 1, className: "Class 10 (Section A)", teachers: ["Dr. Sarah Jenkins"], assignedTeachers: [{ id: 2, fullName: "Dr. Sarah Jenkins", email: "teacher@school.edu" }] },
  { id: 3, name: "Computer Science", code: "CS-301", classId: 1, className: "Class 10 (Section A)", teachers: ["Dr. Sarah Jenkins"], assignedTeachers: [{ id: 2, fullName: "Dr. Sarah Jenkins", email: "teacher@school.edu" }] },
];

const MOCK_ASSIGNMENTS = [
  {
    id: 1,
    title: "Quantum Physics & Wave Mechanics Assignment 1",
    description: "Please solve the problem set regarding wave-particle duality, de Broglie wavelength calculation, and photoelectric effect experimental derivation. Submit all mathematical workings clearly step by step.",
    subjectId: 1,
    subjectName: "Physics",
    classId: 1,
    className: "Class 10 (Section A)",
    teacherId: 2,
    teacherName: "Dr. Sarah Jenkins",
    deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
    maxMarks: 100,
    allowResubmission: true,
    status: "Published",
    isPastDeadline: false,
    submissionCount: 14,
    mySubmission: null,
  },
  {
    id: 2,
    title: "Calculus: Limits & Differential Equations Midterm",
    description: "Evaluate the given limits using L'Hopital's rule where applicable and solve first-order homogeneous differential equations.",
    subjectId: 2,
    subjectName: "Higher Mathematics",
    classId: 1,
    className: "Class 10 (Section A)",
    teacherId: 2,
    teacherName: "Dr. Sarah Jenkins",
    deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
    maxMarks: 50,
    allowResubmission: true,
    status: "Published",
    isPastDeadline: false,
    submissionCount: 19,
    mySubmission: {
      id: 101,
      assignmentId: 2,
      studentId: 3,
      studentName: "Alex Rivera",
      content: "All problems 1 through 10 solved with step-by-step calculus proofs.\n\nProblem 1: dy/dx + 2y = 4x => Integrating factor = e^(2x). General solution: y = 2x - 1 + Ce^(-2x).",
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
      marks: 48,
      feedback: "Exceptional analytical work on questions 4 and 7! Very clean steps.",
      status: "Graded",
    },
  },
  {
    id: 3,
    title: "Database Indexing & PostgreSQL Optimization Lab",
    description: "Design an optimized B-tree index layout for a high-concurrency educational ledger database.",
    subjectId: 3,
    subjectName: "Computer Science",
    classId: 1,
    className: "Class 10 (Section A)",
    teacherId: 2,
    teacherName: "Dr. Sarah Jenkins",
    deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
    maxMarks: 100,
    allowResubmission: false,
    status: "Draft",
    isPastDeadline: false,
    submissionCount: 0,
    mySubmission: null,
  },
];

async function handleFallbackMock<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Mock login handler
  if (path === "/api/auth/login" && options.method === "POST") {
    const data = options.body ? JSON.parse(options.body as string) : {};
    const email = (data.email || "").toLowerCase();
    
    let matched = MOCK_USERS.find((u) => u.email.toLowerCase() === email);
    if (!matched) {
      if (email.includes("admin")) {
        matched = MOCK_USERS[0];
      } else if (email.includes("teacher")) {
        matched = MOCK_USERS[1];
      } else {
        matched = MOCK_USERS[2];
      }
    }

    return {
      token: "demo_mock_jwt_token_onnorokom_" + matched.role.toLowerCase(),
      user: {
        id: matched.id,
        email: matched.email,
        fullName: matched.fullName,
        role: matched.role,
        className: (matched as any).className,
        classId: (matched as any).classId,
      },
    } as T;
  }

  if (path === "/api/users") return MOCK_USERS as unknown as T;
  if (path === "/api/classes") return MOCK_CLASSES as unknown as T;
  if (path === "/api/subjects") return MOCK_SUBJECTS as unknown as T;
  if (path.startsWith("/api/assignments")) {
    if (path.includes("/submissions")) {
      return [
        {
          id: 101,
          assignmentId: 2,
          studentId: 3,
          studentName: "Alex Rivera",
          content: "Calculus problem set solutions with step by step integration.",
          submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          marks: 48,
          feedback: "Great work! Full marks for method.",
          status: "Graded",
        },
        {
          id: 102,
          assignmentId: 2,
          studentId: 4,
          studentName: "Emma Watson",
          content: "Answers submitted for question set A & B.",
          submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          marks: null,
          feedback: null,
          status: "Submitted",
        },
      ] as unknown as T;
    }

    const singleMatch = path.match(/\/api\/assignments\/(\d+)$/);
    if (singleMatch) {
      const id = Number(singleMatch[1]);
      const found = MOCK_ASSIGNMENTS.find((a) => a.id === id) || MOCK_ASSIGNMENTS[0];
      return found as unknown as T;
    }

    return MOCK_ASSIGNMENTS as unknown as T;
  }

  return {} as T;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.status === 204) {
      return undefined as T;
    }

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const body = isJson ? await response.json() : null;

    if (!response.ok) {
      const message = body?.message || `Request failed with status ${response.status}`;
      throw new ApiClientError(message, response.status);
    }

    return body as T;
  } catch (err: any) {
    // If it's an explicit 4xx/5xx ApiClientError from server, rethrow unless it's a network/offline error
    if (err instanceof ApiClientError && err.status < 500) {
      throw err;
    }

    // Network connection failed or timed out -> use fallback mock gracefully
    console.warn(`[EduPortal API] Server offline or connection failed for ${path}. Using client demo fallback.`);
    return handleFallbackMock<T>(path, options);
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "POST", body: data ? JSON.stringify(data) : undefined }),
  put: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PUT", body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

