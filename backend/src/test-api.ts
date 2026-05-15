import 'dotenv/config';
import { callNanaModel } from './ai/nanaModelService';

async function test() {
  try {
    const response = await callNanaModel('Hi');
    console.log('Success:', response);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error:', (err as { status?: number }).status, err.message);
    } else {
      console.error('An unknown error occurred');
    }
  }
}

test();
