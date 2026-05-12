import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';

async function test() {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Hi' }],
    });
    console.log('Success:', response.content[0]);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error:', (err as { status?: number }).status, err.message);
    } else {
      console.error('An unknown error occurred');
    }
  }
}

test();
