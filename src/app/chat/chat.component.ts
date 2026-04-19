import { Component, ElementRef, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, Message } from '../services/chat.service';
import { marked } from 'marked';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  messages: Message[] = [];
  userInput = '';
  isLoading = false;

  constructor(private chatService: ChatService, private cdr: ChangeDetectorRef) { }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (e) { }
  }

  async sendMessage() {
    const input = this.userInput.trim();
    if (!input || this.isLoading) return;

    this.messages.push({ role: 'user', content: input });
    this.userInput = '';
    this.isLoading = true;

    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      isStreaming: true
    };
    this.messages.push(assistantMessage);

    try {
      await this.chatService.streamMessage(this.messages.slice(0, -1), (chunk: string) => {
        assistantMessage.content += chunk;
        this.cdr.detectChanges();
      });
    } catch (error) {
      assistantMessage.content = 'Something went wrong. Please try again.';
    } finally {
      assistantMessage.isStreaming = false;
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  renderMarkdown(content: string): string {
    return marked(content) as string;
  }
}