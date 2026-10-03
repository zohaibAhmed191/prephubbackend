// Always same-origin and relative. Next.js proxies this to the real
// backend server-side (see next.config.ts) so the backend's actual
// address is never sent to the browser or visible in dev tools.
export const API_URL = '/api';

const TOKEN_KEY = 'sp_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export interface Province {
  value: string;
  label: string;
}

export const PROVINCES: Province[] = [
  { value: 'sindh', label: 'Sindh' },
  { value: 'punjab', label: 'Punjab' },
  { value: 'balochistan', label: 'Balochistan' },
  { value: 'kpk', label: 'Khyber Pakhtunkhwa' },
  { value: 'gilgit_baltistan', label: 'Gilgit Baltistan' },
];

export interface User {
  id: number;
  first_name: string | null;
  last_name: string | null;
  name: string;
  email: string;
  phone: string | null;
  province: string | null;
  role: string;
  provider: string;
  email_verified_at: string | null;
  profile_complete: boolean;
}

export interface Mcq {
  id: number;
  question: string;
  options: string[];
  correct: number;
  subject: string | null;
  difficulty: string;
  explanation: string | null;
}

export interface QuotaRow {
  quota: string;
  general: string;
  women: string;
  minorities: string;
}

export interface Material {
  id: number;
  subject: string;
  type: 'topic_notes' | 'key_points' | 'past_questions';
  typeLabel: string;
  title: string | null;
  content: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
}

export interface Job {
  id: number;
  slug: string;
  title: string;
  department: string;
  commission: string;
  grade: string;
  seats: number;
  lastDate: string;
  publishDate: string | null;
  location: string;
  subjects: string[];
  description: string;
  requirements: string;
  quota: QuotaRow[];
  age: string | null;
  source: string;
  sourceUrl: string | null;
  featured: boolean;
  mcqCount: number;
  prepReady: boolean;
  mcqs?: Mcq[];
  materials?: Material[];
  // Optional per-job SEO overrides set in the admin. When empty, the job
  // page falls back to a default title/description (see jobs/[slug]/layout.tsx).
  metaTitle?: string | null;
  metaDescription?: string | null;
}

// SEO-friendly job URL: /jobs/{slug}. The slug is a real, unique, admin-
// editable database column (see Job model), the backend looks jobs up by
// it directly, so this is the canonical, permanent link, no numeric id.
export function jobHref(job: Pick<Job, 'slug'>): string {
  return `/jobs/${job.slug}`;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  subject: string | null;
}

export interface QuizStart {
  jobId: number;
  jobTitle: string;
  questions: QuizQuestion[];
}

export interface QuizAnswerReview {
  id: number;
  question: string;
  options: string[];
  subject: string | null;
  correct: number;
  selected: number | null;
  isCorrect: boolean;
}

// A "job" attempt was taken from one specific job's MCQ bank. A "subject"
// attempt was taken across every published job that has that subject, not
// tied to any single job, jobId/jobTitle/commission are null in that case.
export interface QuizAttemptDetail {
  id: number;
  type: 'job' | 'subject';
  jobId: number | null;
  jobTitle: string | null;
  jobSlug: string | null;
  commission: string | null;
  subject: string | null;
  score: number;
  total: number;
  percentage: number;
  takenAt: string;
  answers: QuizAnswerReview[];
}

export interface QuizAttemptSummary {
  id: number;
  type: 'job' | 'subject';
  jobId: number | null;
  jobTitle: string | null;
  jobSlug: string | null;
  commission: string | null;
  subject: string | null;
  score: number;
  total: number;
  percentage: number;
  takenAt: string;
}

export interface Subject {
  subject: string;
  mcqCount: number;
}

export interface SubjectQuizStart {
  subject: string;
  questions: QuizQuestion[];
}

// One row in the homepage's public "recent activity" feed. Name is already
// anonymized server-side (first name + last initial), never the full name.
export interface RecentResult {
  name: string;
  exam: string;
  score: number;
  takenAt: string;
}

// Real platform-wide counts for the homepage stats bar (used to be
// hardcoded marketing numbers).
export interface PlatformStats {
  totalMcqs: number;
  totalStudents: number;
  passRate: number;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;
  unverified?: boolean;
  retryAfter?: number;

  constructor(message: string, status: number, errors?: Record<string, string[]>, unverified?: boolean, retryAfter?: number) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.unverified = unverified;
    this.retryAfter = retryAfter;
  }
}

function formatWait(seconds: number): string {
  if (seconds >= 60) {
    const minutes = Math.ceil(seconds / 60);
    return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  }
  return `${seconds} second${seconds === 1 ? '' : 's'}`;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    const b = (body as { message?: string; errors?: Record<string, string[]>; unverified?: boolean }) || {};
    let message = b.message || 'Something went wrong. Please try again.';
    let retryAfter: number | undefined;

    if (res.status === 429) {
      const header = res.headers.get('Retry-After');
      retryAfter = header ? parseInt(header, 10) : undefined;
      message = retryAfter
        ? `Too many attempts. Please try again in ${formatWait(retryAfter)}.`
        : 'Too many attempts. Please wait a moment and try again.';
    } else if (b.errors && Object.keys(b.errors).length > 0) {
      // Surface the actual field problem (e.g. "email has already been taken")
      // instead of the generic "Validation failed." wrapper message.
      const firstFieldErrors = Object.values(b.errors)[0];
      if (firstFieldErrors && firstFieldErrors[0]) {
        message = firstFieldErrors[0];
      }
    }

    throw new ApiError(message, res.status, b.errors, b.unverified, retryAfter);
  }

  return body as T;
}

export const api = {
  register: (data: { first_name: string; last_name: string; email: string; phone: string; province: string; password: string }) =>
    request<{ message: string; email: string }>('/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request<{ message: string; token: string; user: User }>('/login', { method: 'POST', body: JSON.stringify(data) }),

  loginWithGoogle: (credential: string) =>
    request<{ message: string; token: string; user: User }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    }),

  resendVerification: (email: string) =>
    request<{ message: string }>('/email/resend', { method: 'POST', body: JSON.stringify({ email }) }),

  // Called by the /auth/verify page with the id/hash/expires/signature from
  // the emailed link. This hits the same signed backend route, just through
  // our own domain's /api proxy so the backend's real address is never
  // shown to the user.
  verifyEmail: (id: string, hash: string, expires: string, signature: string) =>
    request<{ status: 'success' | 'already'; message: string }>(
      `/email/verify/${id}/${hash}?expires=${encodeURIComponent(expires)}&signature=${encodeURIComponent(signature)}`
    ),

  forgotPassword: (email: string) =>
    request<{ message: string }>('/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (data: { token: string; email: string; password: string; password_confirmation: string }) =>
    request<{ message: string }>('/reset-password', { method: 'POST', body: JSON.stringify(data) }),

  me: () => request<{ user: User }>('/user'),

  logout: () => request<{ message: string }>('/logout', { method: 'POST' }),

  completeProfile: (data: { first_name?: string; last_name?: string; phone: string; province: string }) =>
    request<{ message: string; user: User }>('/profile/complete', { method: 'POST', body: JSON.stringify(data) }),

  getJobs: (params?: { q?: string; commission?: string; location?: string }) => {
    const query = new URLSearchParams();
    if (params?.q) query.set('q', params.q);
    if (params?.commission) query.set('commission', params.commission);
    if (params?.location) query.set('location', params.location);
    const qs = query.toString();
    return request<{ jobs: Job[] }>(`/jobs${qs ? `?${qs}` : ''}`);
  },

  getJob: (id: number | string) => request<{ job: Job }>(`/jobs/${id}`),

  startQuiz: (jobId: number | string) => request<QuizStart>(`/jobs/${jobId}/quiz/start`),

  submitQuiz: (jobId: number | string, answers: { id: number; selected: number | null }[]) =>
    request<{ attempt: QuizAttemptDetail }>(`/jobs/${jobId}/quiz/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),

  getQuizAttempts: () =>
    request<{ attempts: QuizAttemptSummary[]; currentPage: number; lastPage: number; total: number }>('/quiz-attempts'),

  getQuizAttempt: (id: number | string) => request<{ attempt: QuizAttemptDetail }>(`/quiz-attempts/${id}`),

  // Real subjects aggregated from the MCQ bank (not the old hardcoded list),
  // powers the homepage's "Practice by Subject" section and /mcqs.
  getSubjects: () => request<{ subjects: Subject[] }>('/subjects'),

  // Public feed of the latest quiz attempts across all users (anonymized),
  // powers the homepage's "Recent Mock Test Results" card.
  getRecentResults: () => request<{ results: RecentResult[] }>('/quiz-attempts/recent'),

  // Real platform counts (MCQs, students, pass rate), powers the homepage
  // stats bar instead of the old hardcoded marketing numbers.
  getStats: () => request<PlatformStats>('/stats'),

  // Contact Us form, emails the platform inbox directly, nothing stored.
  sendContactMessage: (data: { name: string; email: string; subject: string; message: string }) =>
    request<{ message: string }>('/contact', { method: 'POST', body: JSON.stringify(data) }),

  startSubjectQuiz: (subject: string) => request<SubjectQuizStart>(`/subjects/${encodeURIComponent(subject)}/quiz/start`),

  submitSubjectQuiz: (subject: string, answers: { id: number; selected: number | null }[]) =>
    request<{ attempt: QuizAttemptDetail }>(`/subjects/${encodeURIComponent(subject)}/quiz/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),
};
