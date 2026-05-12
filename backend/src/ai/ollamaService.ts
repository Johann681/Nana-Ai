import fetch from 'node-fetch';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
const MODEL = process.env.OLLAMA_MODEL || 'llama3.2:1b';

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
  eval_duration?: number;
}

export class OllamaService {
  /**
   * Generates a response from the local Ollama model
   * @param prompt The full prompt to send to the model
   * @param context Optional context from previous turns
   * @returns The generated response string
   */
  static async generate(prompt: string, context?: number[]): Promise<string> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60000); // 60s timeout

        const response = await fetch(OLLAMA_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: MODEL,
            prompt: prompt,
            stream: false,
            context: context,
            options: {
              temperature: 0.7,
              top_p: 0.9,
              stop: ["<|end_of_text|>", "<|eot_id|>"]
            }
          }),
          signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Ollama API error: ${response.status} - ${errorBody}`);
        }

        const data = (await response.json()) as OllamaResponse;
        return data.response.trim();
      } catch (error) {
        console.error(`[OllamaService] Attempt ${i + 1} failed:`, error);
        lastError = error as Error;
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
        }
      }
    }

    throw new Error(`Ollama failed after ${maxRetries} attempts. Last error: ${lastError?.message}`);
  }
}
