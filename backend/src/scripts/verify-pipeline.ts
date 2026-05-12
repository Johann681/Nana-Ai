import { AIPipeline } from '../ai/aiPipeline';
import { IUser } from '../models/User';

async function verifyPipeline() {
  console.log('--- AIPipeline Verification Started ---');

  const mockUser = {
    _id: 'mock_user_id',
    name: 'Test Patient',
    healthInfo: {
      allergies: ['Peanuts'],
      medications: ['Aspirin'],
      chronicConditions: [],
      recentSymptoms: []
    }
  } as unknown as IUser;

  const history: { role: 'user' | 'assistant', content: string }[] = [
    { role: 'user', content: 'Hello, I have a question about my allergies.' },
    { role: 'assistant', content: 'Hello! I see you are allergic to peanuts. How can I help?' }
  ];

  try {
    // 1. Test Normal Message
    console.log('[1/2] Testing normal clinical message...');
    const result = await AIPipeline.processMessage('What happens if I eat a peanut?', mockUser, history);
    console.log('Specialist:', result.specialist);
    console.log('Emergency:', result.isEmergency);
    console.log('Response Snippet:', result.aiResponse.substring(0, 100) + '...');

    // 2. Test Emergency Message
    console.log('[2/2] Testing emergency message...');
    const emergencyResult = await AIPipeline.processMessage('I am having a heart attack!', mockUser, []);
    console.log('Emergency:', emergencyResult.isEmergency);
    console.log('Emergency Response:', emergencyResult.aiResponse);

    console.log('--- AIPipeline Verification Completed Successfully ---');
  } catch (error) {
    console.error('--- AIPipeline Verification Failed ---');
    console.error(error);
  }
}

verifyPipeline();
