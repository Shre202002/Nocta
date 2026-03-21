import { getDb } from "./db";

export type Theme = {
  bubbleColor: string;
  headerColor: string;
  userMsgColor: string;
  sendBtnColor: string;
  accentColor: string;
};

export type KnowledgeData = {
  url: string;
  apiKey: string;
  content: string;
  crawledAt: string;
  systemPrompt?: string;
  theme?: Theme;
};

export type Account = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  plan: "trial" | "paid";
  crawlCount: number;
};

export type ChatLog = {
  userId: string;
  messageCount: number;
  lastActive: string;
};

// ── Accounts ─────────────────────────────────────────────

export async function readAccounts(): Promise<Account[]> {
  const db = await getDb();
  return db.collection<Account>("accounts").find({}).toArray();
}

export async function findAccount(email: string): Promise<Account | undefined> {
  const db = await getDb();
  const account = await db.collection<Account>("accounts").findOne({ email });
  return account ?? undefined;
}

export async function findAccountById(id: string): Promise<Account | undefined> {
  const db = await getDb();
  const account = await db.collection<Account>("accounts").findOne({ id });
  return account ?? undefined;
}

export async function writeAccount(account: Account): Promise<void> {
  const db = await getDb();
  await db.collection<Account>("accounts").updateOne(
    { id: account.id },
    { $set: account },
    { upsert: true }
  );
}

export async function writeAccounts(accounts: Account[]): Promise<void> {
  const db = await getDb();
  const ops = accounts.map((acc) => ({
    updateOne: {
      filter: { id: acc.id },
      update: { $set: acc },
      upsert: true,
    },
  }));
  if (ops.length > 0) await db.collection<Account>("accounts").bulkWrite(ops);
}

export async function deleteAccount(id: string): Promise<void> {
  const db = await getDb();
  await db.collection<Account>("accounts").deleteOne({ id });
}

// ── Knowledge ─────────────────────────────────────────────

export async function readKnowledge(userId: string): Promise<KnowledgeData> {
  const db = await getDb();
  const doc = await db.collection<KnowledgeData & { userId: string }>("knowledge").findOne({ userId });
  if (!doc) return { url: "", apiKey: "", content: "", crawledAt: "" };
  const { _id, userId: _uid, ...rest } = doc as any;
  return rest;
}

export async function writeKnowledge(userId: string, data: KnowledgeData): Promise<void> {
  const db = await getDb();
  await db.collection("knowledge").updateOne(
    { userId },
    { $set: { userId, ...data } },
    { upsert: true }
  );
}

export async function deleteKnowledge(userId: string): Promise<void> {
  const db = await getDb();
  await db.collection("knowledge").deleteOne({ userId });
}

// ── Chat Logs ─────────────────────────────────────────────

export async function readChatLogs(): Promise<Record<string, ChatLog>> {
  const db = await getDb();
  const logs = await db.collection<ChatLog>("chatlogs").find({}).toArray();
  const result: Record<string, ChatLog> = {};
  logs.forEach((log) => { result[log.userId] = log; });
  return result;
}

export async function incrementMessageCount(userId: string): Promise<void> {
  const db = await getDb();
  await db.collection("chatlogs").updateOne(
    { userId },
    {
      $inc: { messageCount: 1 },
      $set: { lastActive: new Date().toISOString() },
      $setOnInsert: { userId },
    },
    { upsert: true }
  );
}