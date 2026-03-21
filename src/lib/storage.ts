import fs from "fs";
import path from "path";

const usersDir = path.join(process.cwd(), "data", "users");
const accountsFile = path.join(process.cwd(), "data", "accounts.json");

// Ensure directories exist
if (!fs.existsSync(usersDir)) fs.mkdirSync(usersDir, { recursive: true });
if (!fs.existsSync(accountsFile)) fs.writeFileSync(accountsFile, "[]");

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

const logsFile = path.join(process.cwd(), "data", "chatlogs.json");
if (!fs.existsSync(logsFile)) fs.writeFileSync(logsFile, "{}");

export function readChatLogs(): Record<string, ChatLog> {
    try {
        return JSON.parse(fs.readFileSync(logsFile, "utf-8"));
    } catch {
        return {};
    }
}

export function incrementMessageCount(userId: string): void {
    const logs = readChatLogs();
    if (!logs[userId]) {
        logs[userId] = { userId, messageCount: 0, lastActive: "" };
    }
    logs[userId].messageCount += 1;
    logs[userId].lastActive = new Date().toISOString();
    fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2));
}


// Knowledge (per user)
export function readKnowledge(userId: string): KnowledgeData {
    const file = path.join(usersDir, `${userId}.json`);
    try {
        return JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch {
        return { url: "", apiKey: "", content: "", crawledAt: "" };
    }
}

export function writeKnowledge(userId: string, data: KnowledgeData): void {
    const file = path.join(usersDir, `${userId}.json`);
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Accounts
export function readAccounts(): Account[] {
    try {
        return JSON.parse(fs.readFileSync(accountsFile, "utf-8"));
    } catch {
        return [];
    }
}

export function writeAccounts(accounts: Account[]): void {
    fs.writeFileSync(accountsFile, JSON.stringify(accounts, null, 2));
}

export function findAccount(email: string): Account | undefined {
    return readAccounts().find((a) => a.email === email);
}

export function findAccountById(id: string): Account | undefined {
    return readAccounts().find((a) => a.id === id);
}