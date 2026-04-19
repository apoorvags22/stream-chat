# Stream Chat

A real-time AI chat interface built with Angular 21 and Groq API, featuring token-by-token streaming responses and markdown rendering.

## Tech Stack

- Angular 21
- Groq API (llama-3.1-8b-instant)
- TypeScript
- SCSS

## What I learned building this

Streaming AI responses chunk by chunk required bypassing Angular's default change detection. The fix was ChangeDetectorRef — something I've used in enterprise apps before, but never in the context of AI output.

## Setup

1. Clone the repo
2. Run `npm install`
3. Add your Groq API key to `src/environments/environment.ts`
4. Run `ng serve`

Get a free Groq API key at https://console.groq.com