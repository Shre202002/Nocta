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
  // apiKey: string; --> FOr V2 Where We would Be adding the Our API key and Intigrate the CB
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
  plan: "free" | "starter" | "pro";
  crawlCount: number;
  googleId?: string;        // ← ADD
  name?: string;            // ← ADD
  avatar?: string;          // ← ADD
  resetToken?: string;      // ← ADD
  resetTokenExpiry?: string; // ← ADD
  subscription?: {
    provider: "razorpay" | "stripe";
    subscriptionId: string;
    status: "active" | "cancelled" | "expired";
    currentPeriodEnd: string;
  };
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

export const PLAN_LIMITS = {
  free: { messagesPerMonth: 100, websites: 1, removeBranding: false },
  starter: { messagesPerMonth: 1000, websites: 1, removeBranding: true },
  pro: { messagesPerMonth: 10000, websites: 5, removeBranding: true },
};

// ── Knowledge ─────────────────────────────────────────────

export async function readKnowledge(userId: string): Promise<KnowledgeData> {
  const db = await getDb();
  const doc = await db.collection<KnowledgeData & { userId: string }>("knowledge").findOne({ userId });
  if (!doc) return { url: "", content: "", crawledAt: "" };
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