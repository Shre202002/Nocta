import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ reply: 'Server missing GROQ_API_KEY.' }, { status: 500 });
    }

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 150,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content:
            'You are Nocta AI in the homepage hero. Reply in 1-3 short sentences, direct and smart, focused on product, AI, automation, and developer workflows.',
        },
        ...(messages ?? []).map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? '';
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: 'Something went wrong. Try again.' }, { status: 500 });
  }
}
