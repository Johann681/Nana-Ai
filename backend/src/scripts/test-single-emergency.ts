import { EmergencyDetector } from '../ai/emergencyDetector';

async function test() {
  const msg = "MY CHEST HURTS SO MUCH I CAN HARDLY BREATHE PLEASE HELP";
  console.log(`Testing message: "${msg}"`);
  const result = await EmergencyDetector.isEmergency(msg);
  console.log('Final Result (isEmergency):', result);
}

test();
