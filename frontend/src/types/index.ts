export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  stage?: number;
  isEmergency?: boolean;
  specialist?: string;
}

export interface ChatApiRequest {
  userMessage: string;
  messages: Message[];
}

export interface ChatApiResponse {
  chunks?: string[];
  stage?: number;
  error?: string;
  isEmergency?: boolean;
  specialist?: string;
}

export interface Consultation {
  _id: string;
  userId: string;
  doctorId: string;
  doctorName: string;
  title: string;
  status: 'active' | 'completed';
  stage: number;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationReport {
  symptoms: string;
  duration: string;
  triggers: string;
  currentMedications: string;
  possibleConditions: string[];
  medications: string;
  homeCare: string;
  adviceDuration: string;
  redFlags: string[];
}
