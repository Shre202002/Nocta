// import { NextRequest, NextResponse } from "next/server";
// import Groq from "groq-sdk";
// import { readKnowledge, incrementMessageCount } from "@/lib/storage";

// export async function POST(req: NextRequest) {
//   try {
//     const { messages, userId } = await req.json();

//     if (!userId)
//       return NextResponse.json({ error: "No bot ID provided." }, { status: 400 });

//     const knowledge = readKnowledge(userId);

//     if (!knowledge.apiKey)
//       return NextResponse.json({ error: "Bot not configured yet." }, { status: 500 });

//     const groq = new Groq({ apiKey: knowledge.apiKey });

//     const SYSTEM_PROMPT = knowledge.systemPrompt ||
//       `You are a helpful assistant with deep knowledge about this website: ${knowledge.url}
// Here is the content from that website:
// ${knowledge.content}
// Only answer based on the above content. If not found, say "I don't have that information."`;

//     const response = await groq.chat.completions.create({
//       model: "llama-3.3-70b-versatile",
//       messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
//       max_tokens: 500,
//     });

//     const reply = response.choices[0].message.content;

//     // Track message count
//     incrementMessageCount(userId);

//     return NextResponse.json({ reply });
//   } catch (error: any) {
//     return NextResponse.json({ error: error?.message || "Something went wrong." }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { readKnowledge, incrementMessageCount } from "@/lib/storage";

// Allow requests from ANY website
function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

// Handle preflight request (browser sends this before POST)
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin") || "*";
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") || "*";

  try {
    const { messages, userId } = await req.json();

    if (!userId)
      return NextResponse.json(
        { error: "No bot ID provided." },
        { status: 400, headers: corsHeaders(origin) }
      );

    const knowledge = readKnowledge(userId);

    if (!knowledge.apiKey)
      return NextResponse.json(
        { error: "Bot not configured yet." },
        { status: 500, headers: corsHeaders(origin) }
      );

    const groq = new Groq({ apiKey: knowledge.apiKey });

    const SYSTEM_PROMPT = knowledge.systemPrompt ||
      `You are a helpful assistant with deep knowledge about this website: ${knowledge.url}

Here is the content from that website:
${knowledge.content}

Only answer based on the above content. If not found, say "I don't have that information."`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 500,
    });

    const reply = response.choices[0].message.content;
    incrementMessageCount(userId);

    return NextResponse.json(
      { reply },
      { headers: corsHeaders(origin) }
    );

  } catch (error: any) {
    console.error("❌ Error:", error?.message);
    return NextResponse.json(
      { error: error?.message || "Something went wrong." },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}