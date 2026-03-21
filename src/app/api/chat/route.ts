import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { readKnowledge, incrementMessageCount } from "@/lib/storage";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { messages, userId } = await req.json();

    if (!userId)
      return NextResponse.json(
        { error: "No bot ID provided." },
        { status: 400, headers: corsHeaders }
      );

    const knowledge = await readKnowledge(userId);

    if (!knowledge.apiKey)
      return NextResponse.json(
        { error: "Bot not configured yet." },
        { status: 500, headers: corsHeaders }
      );

    const groq = new Groq({ apiKey: knowledge.apiKey });

    const SYSTEM_PROMPT = knowledge.systemPrompt ||
      `You are a friendly, conversational AI assistant for this website: ${knowledge.url}

Here is the website content you know about:
${knowledge.content}

Your personality and rules:
- Talk like a helpful human, not a robot or a report generator
- Never use bullet points, numbered lists, or bold text with **asterisks**
- Keep responses short — 2 to 4 sentences maximum unless the user asks for more detail
- Be warm, natural and direct — like a knowledgeable friend, not a Wikipedia article
- Never say "Here are some key points" or "I can share the following"
- Just answer the question conversationally
- If you don't know something, say "I'm not sure about that — you can reach the team directly at kalamic.shop/contact"
- Never make up information that isn't in the content above`;

    // Create streaming response from Groq
    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 500,
      stream: true, // ← KEY CHANGE
    });

    // Stream tokens back to client as SSE
    const encoder = new TextEncoder();
    let fullReply = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const token = chunk.choices[0]?.delta?.content || "";
            if (token) {
              fullReply += token;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ token })}\n\n`)
              );
            }
          }
          // Signal stream is done
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
          );
          // Track message after full response
          await incrementMessageCount(userId);
        } catch (err) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`)
          );
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Something went wrong." },
      { status: 500, headers: corsHeaders }
    );
  }
}