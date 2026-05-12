import { OllamaService } from './ollamaService';
import { ROUTER_PROMPT } from '../prompts/systemPrompts';

export type SpecialistType = 'general' | 'cardiology' | 'dermatology' | 'mental-health' | 'nutrition';

export class SpecialistRouter {
  /**
   * Routes the user message to the most appropriate specialist
   * @param message User's message content
   * @returns SpecialistType
   */
  static async route(message: string): Promise<SpecialistType> {
    try {
      const prompt = ROUTER_PROMPT.replace('{message}', message);
      const response = await OllamaService.generate(prompt);
      
      const cleanedResponse = response.toLowerCase().trim();
      const validSpecialists: SpecialistType[] = ['general', 'cardiology', 'dermatology', 'mental-health', 'nutrition'];
      
      for (const specialist of validSpecialists) {
        if (cleanedResponse.includes(specialist)) {
          return specialist;
        }
      }
      
      return 'general';
    } catch (error) {
      console.error('[SpecialistRouter] Error:', error);
      return 'general'; // Fallback
    }
  }
}
