import { ChatApiResponse, Consultation, ConsultationReport, Message } from '@/types';

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const TOKEN_KEY = 'nana_access_token';

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  onboardingComplete: boolean;
  accessToken?: string;
  healthInfo?: {
    allergies?: string[];
    medications?: string[];
    chronicConditions?: string[];
    recentSymptoms?: string[];
  };
  profile?: {
    age?: string;
    gender?: string;
    height?: string;
    weight?: string;
    bloodType?: string;
    country?: string;
  };
};

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = LoginPayload & {
  name: string;
};

type ProfilePayload = {
  profile?: Record<string, unknown>;
  healthInfo?: Record<string, unknown>;
  onboardingComplete?: boolean;
};

export type ReportSummary = {
  _id: string;
  title?: string;
  doctorName: string;
  createdAt: string;
  content?: {
    symptoms?: string;
  };
};

type RequestOptions = RequestInit & {
  auth?: boolean;
  retryOnUnauthorized?: boolean;
};

export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

const saveAuthToken = (token?: string) => {
  if (typeof window === 'undefined' || !token) return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
};

const parseJson = async <T>(res: Response): Promise<T> => {
  const text = await res.text();
  return (text ? JSON.parse(text) : {}) as T;
};

const apiFetch = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { auth = true, retryOnUnauthorized = true, headers, ...rest } = options;
  const requestHeaders = new Headers(headers);

  if (rest.body && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  const token = auth ? getAuthToken() : null;
  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    ...rest,
    headers: requestHeaders,
  });

  const data = await parseJson<T & { error?: string }>(res);

  if (res.status === 401 && auth && retryOnUnauthorized) {
    try {
      await refreshSession();
      return apiFetch<T>(path, { ...options, retryOnUnauthorized: false });
    } catch {
      clearAuthToken();
    }
  }

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
};

const saveTokenFromAuthResponse = <T extends AuthUser>(data: T) => {
  saveAuthToken(data.accessToken);
  const user = { ...data };
  delete user.accessToken;
  return user as Omit<T, 'accessToken'>;
};

export async function loginUser(payload: LoginPayload) {
  const data = await apiFetch<AuthUser>('/api/auth/login', {
    method: 'POST',
    auth: false,
    body: JSON.stringify(payload),
  });

  return saveTokenFromAuthResponse(data);
}

export async function registerUser(payload: RegisterPayload) {
  const data = await apiFetch<AuthUser>('/api/auth/register', {
    method: 'POST',
    auth: false,
    body: JSON.stringify(payload),
  });

  return saveTokenFromAuthResponse(data);
}

export async function refreshSession() {
  const data = await apiFetch<{ accessToken?: string }>('/api/auth/refresh', {
    method: 'POST',
    auth: false,
    retryOnUnauthorized: false,
  });
  saveAuthToken(data.accessToken);
  return data;
}

export async function getCurrentUser() {
  return apiFetch<AuthUser>('/api/auth/me');
}

export async function logoutUser() {
  try {
    await apiFetch<{ message: string }>('/api/auth/logout', { method: 'POST' });
  } finally {
    clearAuthToken();
  }
}

export async function updateProfile(payload: ProfilePayload) {
  return apiFetch<{ user: AuthUser }>('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function createConsultation(doctorId: string, doctorName: string) {
  return apiFetch<Consultation>('/api/consultations', {
    method: 'POST',
    body: JSON.stringify({ doctorId, doctorName }),
  });
}

export async function sendChatMessage({ userMessage, consultationId }: { userMessage: string, messages?: Message[], consultationId: string }) {
  try {
    return await apiFetch<ChatApiResponse>(`/api/consultations/${consultationId}/message`, {
      method: 'POST',
      body: JSON.stringify({ content: userMessage }),
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to send message' };
  }
}

export async function extractReport(consultationId: string) {
  return apiFetch<ConsultationReport>('/api/report/generate', {
    method: 'POST',
    body: JSON.stringify({ consultationId }),
  });
}

export async function generateReportPdf(report: { _id: string }) {
  const token = getAuthToken();
  const headers = new Headers();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}/api/report/${report._id}/download`, {
    credentials: 'include',
    headers,
  });

  if (!res.ok) throw new Error('Failed to download PDF');
  return res.blob();
}

export async function getConsultation(id: string) {
  return apiFetch<Consultation>(`/api/consultations/${id}`);
}

export async function getConsultations() {
  return apiFetch<Consultation[]>('/api/consultations');
}

export async function sendConsultationMessage(consultationId: string, content: string) {
  return apiFetch<ChatApiResponse>(`/api/consultations/${consultationId}/message`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function getReports() {
  return apiFetch<ReportSummary[]>('/api/report');
}
