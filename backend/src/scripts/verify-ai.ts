import { OllamaService } from '../ai/ollamaService';
import { EmergencyDetector } from '../ai/emergencyDetector';
import { SpecialistRouter } from '../ai/specialistRouter';
import { PromptBuilder } from '../ai/promptBuilder';

async function verifyAI() {
  console.log('--- Verification Started ---');

  try {
    // 1. Test Ollama Connection
    console.log('[1/4] Testing Ollama connection...');
    const testResponse = await OllamaService.generate('Say "OK" if you are ready.');
    console.log('Ollama Response:', testResponse);

    // 2. Test Emergency Detection
    console.log('[2/4] Testing Emergency Detection...');
    const emergencyMsg = 'I have severe chest pain and can\'t breathe.';
    const isEmergency = await EmergencyDetector.isEmergency(emergencyMsg);
    console.log(`Message: "${emergencyMsg}" -> Emergency: ${isEmergency}`);

    // 3. Test Specialist Routing
    console.log('[3/4] Testing Specialist Routing...');
    const cardioMsg = 'My heart is beating very fast and I feel dizzy.';
    const specialist = await SpecialistRouter.route(cardioMsg);
    console.log(`Message: "${cardioMsg}" -> Specialist: ${specialist}`);

    // 4. Test Prompt Building
    console.log('[4/4] Testing Prompt Building...');
    const fullPrompt = PromptBuilder.build(
      'What should I eat?',
      'nutrition',
      { allergies: ['nuts'], medications: ['Metformin'] },
      []
    );
    console.log('Prompt Sample:', fullPrompt.substring(0, 100) + '...');

    console.log('--- Verification Completed Successfully ---');
  } catch (error) {
    console.error('--- Verification Failed ---');
    console.error(error);
  }
}

verifyAI();
