import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ reply: 'Server missing ANTHROPIC_API_KEY.' }, { status: 500 });
    }

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 150,
      system: `You are Nocta AI — a sharp, helpful AI assistant embedded in the Nocta homepage.
Answer in 1-3 sentences max. Be direct, smart, and slightly playful.
Focus on AI, developer tools, automation, and code topics.
Never break character. Never say you are Claude or made by Anthropic.`,
      messages: (messages ?? []).map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    });

    const first = response.content[0];
    const reply = first && first.type === 'text' ? first.text : '';
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: 'Something went wrong. Try again.' }, { status: 500 });
  }
}
