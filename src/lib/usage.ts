import { getDb } from "./db";
import { findAccountById, PLAN_LIMITS } from "./storage";

export async function checkUsageLimit(userId: string): Promise<boolean> {
  const account = await findAccountById(userId);
  if (!account) return false;

  const limit = PLAN_LIMITS[account.plan]?.messagesPerMonth ?? 100;

  const db = await getDb();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Count messages this month
  const log = await db.collection("chatlogs").findOne({ userId });
  const monthlyCount = log?.monthlyCount?.[`${now.getFullYear()}-${now.getMonth()}`] || 0;

  return monthlyCount < limit;
}

export async function incrementMonthlyCount(userId: string): Promise<void> {
  const db = await getDb();
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${now.getMonth()}`;

  await db.collection("chatlogs").updateOne(
    { userId },
    {
      $inc: {
        messageCount: 1,
        [`monthlyCount.${monthKey}`]: 1,
      },
      $set: { lastActive: now.toISOString() },
      $setOnInsert: { userId },
    },
    { upsert: true }
  );
}