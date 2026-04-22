import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { readKnowledge, incrementMessageCount } from "@/lib/storage";
import { embedText } from "@/lib/embeddings";
import { qdrant, ensureCollection, COLLECTION } from "@/lib/qdrant";

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

    if (!process.env.GROQ_API_KEY)
      return NextResponse.json(
        { error: "Server not configured." },
        { status: 500, headers: corsHeaders }
      );

    // Get basic info from MongoDB (url, systemPrompt, theme)
    const knowledge = await readKnowledge(userId);

    if (!knowledge.url)
      return NextResponse.json(
        { error: "Bot not configured yet. Please crawl a website first." },
        { status: 500, headers: corsHeaders }
      );

    // ── RAG: find relevant chunks from Qdrant ──────────────
    let context = "";
    try {
      await ensureCollection();
      const lastMessage = messages[messages.length - 1]?.content || "";
      const questionVector = await embedText(lastMessage);

      const searchResult = await qdrant.search(COLLECTION, {
        vector: questionVector,
        limit: 5,
        filter: {
          must: [{ key: "userId", match: { value: userId } }],
        },
        with_payload: true,
      });

      context = searchResult
        .map((r) => r.payload?.text as string)
        .filter(Boolean)
        .join("\n\n");
    } catch (err) {
      // Qdrant unavailable — fall back to MongoDB content
      console.warn("Qdrant unavailable, using fallback content");
      context = knowledge.content || "";
    }

    // ── Build system prompt ────────────────────────────────
    const SYSTEM_PROMPT = knowledge.systemPrompt ||
      `You are a friendly, conversational AI assistant for this website: ${knowledge.url}

Here is the relevant content from the website to answer the user's question:
${context || knowledge.content || "No content available yet."}

Your personality and rules:
- Talk like a helpful human, not a robot or a report generator
- Never use bullet points, numbered lists, or bold text with **asterisks**
- Keep responses short — 2 to 4 sentences maximum unless the user asks for more detail
- Be warm, natural and direct — like a knowledgeable friend, not a Wikipedia article
- Never say "Here are some key points" or "I can share the following"
- Just answer the question conversationally
- If you don't know something, say "I'm not sure about that — you can reach the team directly via the website"
- Never make up information that isn't in the content above`;

    // ── Stream response from Groq ──────────────────────────
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 500,
      stream: true,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const token = chunk.choices[0]?.delta?.content || "";
            if (token) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ token })}\n\n`)
              );
            }
          }
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
          );
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