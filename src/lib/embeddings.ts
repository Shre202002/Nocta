// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function embedText(text: string): Promise<number[]> {
//   const response = await openai.embeddings.create({
//     model: "text-embedding-3-small",
//     input: text.slice(0, 8000),
//   });
//   return response.data[0].embedding;
// }

// export function chunkText(text: string, chunkSize = 500): string[] {
//   const words = text.split(/\s+/);
//   const chunks: string[] = [];

//   for (let i = 0; i < words.length; i += chunkSize) {
//     const chunk = words.slice(i, i + chunkSize).join(" ");
//     if (chunk.trim().length > 50) chunks.push(chunk);
//   }

//   return chunks;
// }

//------------------------------------------------------------------------------------------------------------------------------------------

// import { CohereClient } from "cohere-ai";

// const cohere = new CohereClient({
//   token: process.env.COHERE_API_KEY!,
// });

// export async function embedText(text: string): Promise<number[]> {
//   const response = await cohere.embed({
//     texts: [text.slice(0, 8000)],
//     model: "embed-english-v3.0",
//     inputType: "search_document",
//   });
//   return response.embeddings[0] as number[];
// }

// export function chunkText(text: string, chunkSize = 500): string[] {
//   const words = text.split(/\s+/);
//   const chunks: string[] = [];
//   for (let i = 0; i < words.length; i += chunkSize) {
//     const chunk = words.slice(i, i + chunkSize).join(" ");
//     if (chunk.trim().length > 50) chunks.push(chunk);
//   }
//   return chunks;
// }


// -------------------------------------------------------------------------------------------------------------------------------------

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function embedText(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({
    model: "text-embedding-004", // Google's best embedding model
  });

  const result = await model.embedContent(text.slice(0, 8000));
  return result.embedding.values;
}

export function chunkText(text: string, chunkSize = 500): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    if (chunk.trim().length > 50) chunks.push(chunk);
  }

  return chunks;
}