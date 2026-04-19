import { Injectable } from '@angular/core';
import Groq from 'groq-sdk';
import { environment } from '../../environments/environment';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private groq = new Groq({
    apiKey: environment.groqApiKey,
    dangerouslyAllowBrowser: true
  });

  async streamMessage(messages: Message[], onChunk: (chunk: string) => void): Promise<void> {
    const stream = await this.groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      stream: true,
      max_tokens: 1024
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  }
}