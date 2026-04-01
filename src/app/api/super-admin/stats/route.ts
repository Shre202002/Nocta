import { NextRequest, NextResponse } from "next/server";
import { readAccounts, readKnowledge, readChatLogs } from "@/lib/storage";

function isSuperAdmin(req: NextRequest) {
  const token = req.cookies.get("sa_token")?.value;
  return token === process.env.SUPER_ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!isSuperAdmin(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const accounts = await readAccounts();
  const chatLogs = await readChatLogs();

  const users = await Promise.all(
    accounts.map(async (acc) => {
      const knowledge = await readKnowledge(acc.id);
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
        messageCount: log?.messageCount || 0,
        lastActive: log?.lastActive || "",
        hasBot: !!knowledge.url, // ← use url instead of content
      };
    })
  );

  const totalUsers = users.length;
  const freeUsers = users.filter((u) => u.plan === "free").length;
  const starterUsers = users.filter((u) => u.plan === "starter").length;
  const proUsers = users.filter((u) => u.plan === "pro").length;
  const activeUsers = users.filter((u) => u.messageCount > 0).length;
  const totalMessages = users.reduce((s, u) => s + u.messageCount, 0);
  const configuredBots = users.filter((u) => u.hasBot).length;

  const growth: Record<string, number> = {};
  accounts.forEach((acc) => {
    const day = acc.createdAt?.slice(0, 10);
    if (day) growth[day] = (growth[day] || 0) + 1;
  });

  return NextResponse.json({
    stats: {
      totalUsers,
      freeUsers,
      starterUsers,
      proUsers,
      activeUsers,
      totalMessages,
      configuredBots,
    },
    users,
    growth,
  });
}