import { NextRequest, NextResponse } from "next/server";
import { readAccounts, readKnowledge, readChatLogs } from "@/lib/storage";

function isSuperAdmin(req: NextRequest) {
  const token = req.cookies.get("sa_token")?.value;
  return token === process.env.SUPER_ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!isSuperAdmin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const accounts = readAccounts();
  const chatLogs = readChatLogs();

  const users = accounts.map((acc) => {
    const knowledge = readKnowledge(acc.id);
    const log = chatLogs[acc.id];
    return {
      id: acc.id,
      email: acc.email,
      plan: acc.plan,
      createdAt: acc.createdAt,
      crawlCount: acc.crawlCount || 0,
      siteUrl: knowledge.url || "",
      crawledAt: knowledge.crawledAt || "",
      contentLength: knowledge.content?.length || 0,
      apiKey: knowledge.apiKey
        ? knowledge.apiKey.slice(0, 8) + "••••••••"
        : "Not set",
      messageCount: log?.messageCount || 0,
      lastActive: log?.lastActive || "",
      hasBot: !!knowledge.content,
    };
  });

  const totalUsers = users.length;
  const paidUsers = users.filter((u) => u.plan === "paid").length;
  const trialUsers = users.filter((u) => u.plan === "trial").length;
  const activeUsers = users.filter((u) => u.messageCount > 0).length;
  const totalMessages = users.reduce((s, u) => s + u.messageCount, 0);
  const configuredBots = users.filter((u) => u.hasBot).length;

  // Growth: users per day (last 7 days)
  const growth: Record<string, number> = {};
  accounts.forEach((acc) => {
    const day = acc.createdAt?.slice(0, 10);
    if (day) growth[day] = (growth[day] || 0) + 1;
  });

  return NextResponse.json({
    stats: { totalUsers, paidUsers, trialUsers, activeUsers, totalMessages, configuredBots },
    users,
    growth,
  });
}