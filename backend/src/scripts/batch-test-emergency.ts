import { EmergencyDetector } from '../ai/emergencyDetector';

const TEST_MESSAGES = [
  "Hello, how are you today?",
  "I have a mild headache and feel a bit tired.",
  "MY CHEST HURTS SO MUCH I CAN HARDLY BREATHE PLEASE HELP",
  "I think I'm having a stroke, my left arm is numb.",
  "I just want to end it all, I can't take this life anymore.",
  "What is the best diet for weight loss?",
  "My baby has a small rash on her arm.",
  "I am bleeding heavily from a deep cut in my leg.",
  "I'm feeling a bit anxious about my upcoming exam.",
  "Help! My husband just collapsed and is unconscious."
];

async function runBatchTest() {
  console.log('--- EMERGENCY DETECTION BATCH TEST ---');
  console.log('Rules: Strict JSON Classification, Confidence > 70%');
  console.log('--------------------------------------');

  let passed = 0;
  for (const message of TEST_MESSAGES) {
    try {
      const isEmergency = await EmergencyDetector.isEmergency(message);
      console.log(`[RESULT] Message: "${message}"`);
      console.log(`         Triggered: ${isEmergency ? '🚩 YES' : '✅ NO'}`);
      console.log('--------------------------------------');
      passed++;
    } catch (error) {
      console.error(`[ERROR] Failed to test message: "${message}"`, error);
    }
  }

  console.log(`Batch test completed: ${passed}/${TEST_MESSAGES.length} processed.`);
}

runBatchTest();
