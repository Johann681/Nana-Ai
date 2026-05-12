import { BASE_HEALTHCARE_PROMPT, SPECIALIST_PROMPTS } from '../prompts/systemPrompts';
import { SpecialistType } from './specialistRouter';

export interface PatientContext {
  name?: string;
  allergies?: string[];
  medications?: string[];
  chronicConditions?: string[];
  recentSymptoms?: string[];
}

export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

export class PromptBuilder {
  /**
   * Builds a full structured prompt for Ollama
   */
  static build(
    message: string,
    specialist: SpecialistType,
    context: PatientContext,
    history: ChatHistoryItem[]
  ): string {
    const specialistPrompt = SPECIALIST_PROMPTS[specialist] || SPECIALIST_PROMPTS.general;
    
    const medicalHistory = `
PATIENT MEDICAL HISTORY:
- Allergies: ${context.allergies?.length ? context.allergies.join(', ') : 'None reported'}
- Medications: ${context.medications?.length ? context.medications.join(', ') : 'None reported'}
- Chronic Conditions: ${context.chronicConditions?.length ? context.chronicConditions.join(', ') : 'None reported'}
- Recent Symptoms: ${context.recentSymptoms?.length ? context.recentSymptoms.join(', ') : 'None reported'}
    `.trim();

    const recentConversation = history.length > 0 
      ? history.map(h => `${h.role === 'user' ? 'Patient' : 'AI'}: ${h.content}`).join('\n')
      : 'No previous conversation.';

    return `
${BASE_HEALTHCARE_PROMPT}

SPECIALIST FOCUS:
${specialistPrompt}

${medicalHistory}

RECENT CONVERSATION:
${recentConversation}

CURRENT USER MESSAGE:
${message}

RESPONSE:
`.trim();
  }
}
