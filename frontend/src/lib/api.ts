import { Message } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function createConsultation(doctorId: string, doctorName: string) {
  const res = await fetch(`${API_URL}/api/consultations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ doctorId, doctorName }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create consultation');
  }
  return res.json();
}

export async function sendChatMessage({ userMessage, consultationId }: { userMessage: string, messages?: Message[], consultationId: string }) {
  const res = await fetch(`${API_URL}/api/consultations/${consultationId}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ content: userMessage }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    return { error: error.error || 'Failed to send message' };
  }
  return res.json();
}

export async function extractReport(consultationId: string) {
  const res = await fetch(`${API_URL}/api/report/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ consultationId }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to generate report');
  }
  return res.json();
}

export async function generateReportPdf(report: { _id: string }) {
  const res = await fetch(`${API_URL}/api/report/${report._id}/download`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to download PDF');
  return res.blob();
}

export async function getConsultation(id: string) {
  const res = await fetch(`${API_URL}/api/consultations/${id}`, { credentials: 'include' });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch consultation');
  }
  return res.json();
}

export async function getConsultations() {
  const res = await fetch(`${API_URL}/api/consultations`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch consultations');
  return res.json();
}

export async function sendConsultationMessage(consultationId: string, content: string) {
  const res = await fetch(`${API_URL}/api/consultations/${consultationId}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to send message');
  }
  return res.json();
}

export async function getReports() {
  const res = await fetch(`${API_URL}/api/report`, { credentials: 'include' });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch reports');
  }
  return res.json();
}
