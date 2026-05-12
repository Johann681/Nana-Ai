import { EmergencyDetector } from './emergencyDetector';
import { SpecialistRouter, SpecialistType } from './specialistRouter';
import { PromptBuilder } from './promptBuilder';
import { OllamaService } from './ollamaService';
import { IUser } from '../models/User';

export interface PipelineResult {
  aiResponse: string;
  isEmergency: boolean;
  specialist: SpecialistType;
  suggestedStageIncrease: boolean;
}

export class AIPipeline {
  /**
   * Orchestrates the entire AI flow for a clinical message
   */
  static async processMessage(
    content: string, 
    user: IUser, 
    history: { role: 'user' | 'assistant', content: string }[]
  ): Promise<PipelineResult> {
    
    console.log(`[AIPipeline] Processing message for user: ${user._id}`);

    // 1. Emergency Detection
    const isEmergency = await EmergencyDetector.isEmergency(content);
    if (isEmergency) {
      return {
        aiResponse: "🚨 EMERGENCY DETECTED: Your symptoms require immediate medical attention. Please call emergency services (911 or your local equivalent) or go to the nearest emergency room immediately. MedCore AI cannot provide emergency care.",
        isEmergency: true,
        specialist: 'general',
        suggestedStageIncrease: false
      };
    }

    // 2. Specialist Routing
    const specialist = await SpecialistRouter.route(content);

    // 3. Prepare Context & Prompt
    const patientContext = {
      name: user.name,
      allergies: user.healthInfo?.allergies || [],
      medications: user.healthInfo?.medications || [],
      chronicConditions: user.healthInfo?.chronicConditions || [],
      recentSymptoms: user.healthInfo?.recentSymptoms || [],
    };

    const fullPrompt = PromptBuilder.build(content, specialist, patientContext, history);

    // 4. Inference
    const aiResponse = await OllamaService.generate(fullPrompt);

    return {
      aiResponse,
      isEmergency: false,
      specialist,
      suggestedStageIncrease: true
    };
  }
}
