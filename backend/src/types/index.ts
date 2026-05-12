import { Request } from 'express';
import { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser | null;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  userMessage: string;
  messages: Message[];
}

export interface ChatResponse {
  chunks: string[];
  stage?: number;
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

export interface ErrorResponse {
  error: string;
}
