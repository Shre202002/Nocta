import { QdrantClient } from "@qdrant/js-client-rest";

export const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY,
});

export const COLLECTION = "nocta_chunks";
// const VECTOR_SIZE = 1536; // text-embedding-3-small
// const VECTOR_SIZE = 1024; // was 1536 for OpenAI
const VECTOR_SIZE = 768; // Gemini text-embedding-004


export async function ensureCollection() {
  try {
    const collections = await qdrant.getCollections();
    const exists = collections.collections.some(
      (c) => c.name === COLLECTION
    );

    if (!exists) {
      await qdrant.createCollection(COLLECTION, {
        vectors: {
          size: VECTOR_SIZE,
          distance: "Cosine",
        },
      });

      // Index userId for fast filtering
      await qdrant.createPayloadIndex(COLLECTION, {
        field_name: "userId",
        field_schema: "keyword",
      });

      console.log("✅ Qdrant collection created");
    }
  } catch (err) {
    console.error("❌ Qdrant connection failed:", err);
    throw err;
  }
}