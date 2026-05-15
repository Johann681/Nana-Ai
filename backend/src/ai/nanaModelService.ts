import { Client } from '@gradio/client';

const NANA_SPACE = 'adekolaolaonipekun/nana-inference';
const NANA_RESPOND_ENDPOINT = '/respond';
const NANA_TIMEOUT_MS = 90000;
export const NANA_WAKEUP_MESSAGE = 'Nana is waking up, please try again in a moment.';

async function requestNanaModel(userMessage: string): Promise<string> {
  const client = await Client.connect(NANA_SPACE);
  const result = await client.predict(NANA_RESPOND_ENDPOINT, {
    message: userMessage,
  });

  const data = result.data as string[];
  const raw = Array.isArray(data) ? data[0] : String(data);
  return raw.replace(/<\/s>/g, '').replace(/<\|end\|>/g, '').trim();
}

export async function callNanaModel(userMessage: string): Promise<string> {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      requestNanaModel(userMessage),
      new Promise<string>((_, reject) => {
        timeout = setTimeout(() => reject(new Error('Nana model request timed out')), NANA_TIMEOUT_MS);
      }),
    ]);
  } catch (error) {
    console.error('[NanaModelService] Failed to get model response:', error);
    return NANA_WAKEUP_MESSAGE;
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
