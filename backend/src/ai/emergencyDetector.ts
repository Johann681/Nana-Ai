import { OllamaService } from './ollamaService';
import { EMERGENCY_PROMPT } from '../prompts/systemPrompts';

export class EmergencyDetector {
  /**
   * Detects if a message contains emergency medical symptoms
   * @param message User's message content
   * @returns boolean indicating if it's an emergency
   */
  static async isEmergency(message: string): Promise<boolean> {
    try {
      const prompt = EMERGENCY_PROMPT.replace('{message}', message);
      const response = await OllamaService.generate(prompt);
      console.log(`[EmergencyDetector] Raw response: "${response}"`);
      
      // Find all JSON blocks (handle multiple blocks if AI repeats examples)
      const jsonBlocks = response.match(/\{[\s\S]*?\}/g);
      if (!jsonBlocks || jsonBlocks.length === 0) throw new Error('No JSON found in response');
      
      // Take the last block as it's most likely the final classification
      const lastBlock = jsonBlocks[jsonBlocks.length - 1];
      const parsed = JSON.parse(lastBlock);
      
      // Handle nested responses (sometimes AI wraps the object)
      const emergencyVal = parsed.emergency ?? parsed.response_message?.emergency ?? parsed.classification === 'emergency';
      const confidenceVal = parsed.confidence ?? parsed.response_message?.confidence ?? 100;
      
      console.log(`[EmergencyDetector] Message: "${message.substring(0, 30)}..." | Emergency: ${emergencyVal} | Confidence: ${confidenceVal}%`);
      
      return emergencyVal === true && (confidenceVal > 70);
    } catch (error) {
      console.error('[EmergencyDetector] Error parsing AI response, falling back to keywords:', error);
      
      const emergencyKeywords = [
        'chest pain', 'suicide', 'kill myself', 'stroke', 
        'can\'t breathe', 'difficulty breathing', 'seizure', 
        'unconscious', 'heavy bleeding', 'heart attack'
      ];
      return emergencyKeywords.some(keyword => message.toLowerCase().includes(keyword));
    }
  }
}
