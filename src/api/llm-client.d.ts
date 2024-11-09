export class LLMClient {
  streamResponse(prompt: string, systemMessage: string): AsyncIterableIterator<string>;
} 