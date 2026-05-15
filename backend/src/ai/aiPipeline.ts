import { callNanaModel } from './nanaModelService';
import { IUser } from '../models/User';

export type SpecialistType = 'general';

export interface PipelineResult {
  aiResponse: string;
  isEmergency: boolean;
  specialist: SpecialistType;
  suggestedStageIncrease: boolean;
}

export class AIPipeline {
  /**
   * Orchestrates the Nana model flow for a clinical message
   */
  static async processMessage(
    content: string, 
    user: IUser, 
    history: { role: 'user' | 'assistant', content: string }[]
  ): Promise<PipelineResult> {
    
    console.log(`[AIPipeline] Processing message for user: ${user._id}`);

    const aiResponse = await callNanaModel(content);

    return {
      aiResponse,
      isEmergency: false,
      specialist: 'general',
      suggestedStageIncrease: true
    };
  }
}
