"use client";

import { useState, useEffect } from "react";

type UserRow = {
  id: string;
  email: string;
  plan: string;
  createdAt: string;
  siteUrl: string;
  crawledAt: string;
  contentLength: number;
  apiKey: string;
  messageCount: number;
  lastActive: string;
  hasBot: boolean;
  crawlCount: number;
};

type Stats = {
  totalUsers: number;
  paidUsers: number;
  trialUsers: number;
  activeUsers: number;
  totalMessages: number;
  configuredBots: number;
};

export default function SuperAdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "users">("overview");
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [userContent, setUserContent] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [promptSaving, setPromptSaving] = useState(false);
  const [promptSaved, setPromptSaved] = useState(false);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState<"all" | "trial" | "paid">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [upgradingId, setUpgradingId] = useState<string | null>(null);
  const [contentLoading, setContentLoading] = useState(false);

  async function handleLogin() {
    const res = await fetch("/api/super-admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) { setAuthError("Wrong password."); return; }
    setAuthed(true);
    loadData();
  }

  async function loadData() {
    setLoading(true);
    const res = await fetch("/api/super-admin/stats");
    if (res.ok) {
      const data = await res.json();
      setStats(data.stats);
      setUsers(data.users);
    }
    setLoading(false);
  }

  async function openUser(user: UserRow) {
    setSelectedUser(user);
    setUserContent("");
    setUserPrompt("");
    setContentLoading(true);
    const res = await fetch(`/api/super-admin/user/${user.id}/content`);
    if (res.ok) {
      const data = await res.json();
      setUserContent(data.content);
      setUserPrompt(data.systemPrompt || data.content);
    }
    setContentLoading(false);
  }

  async function savePrompt() {
    if (!selectedUser) return;
    setPromptSaving(true);
    await fetch(`/api/super-admin/user/${selectedUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ systemPrompt: userPrompt }),
    });
    setPromptSaving(false);
    setPromptSaved(true);
    setTimeout(() => setPromptSaved(false), 2000);
  }

  async function upgradeToPaid(userId: string) {
    setUpgradingId(userId);
    await fetch(`/api/super-admin/user/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: "paid" }),
    });
    await loadData();
    setUpgradingId(null);
    if (selectedUser?.id === userId) {
      setSelectedUser((prev) => prev ? { ...prev, plan: "paid" } : null);
    }
  }

  async function deleteUser(userId: string) {
    if (!confirm("Delete this user and all their data? This cannot be undone.")) return;
    setDeletingId(userId);
    await fetch(`/api/super-admin/user/${userId}`, { method: "DELETE" });
    await loadData();
    setDeletingId(null);
    if (selectedUser?.id === userId) setSelectedUser(null);
  }

  const filteredUsers = users
    .filter((u) => filterPlan === "all" || u.plan === filterPlan)
    .filter((u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.siteUrl.toLowerCase().includes(search.toLowerCase())
    );

  function timeAgo(iso: string) {
    if (!iso) return "Never";
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-[#060612] flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🛡️</div>
            <h1 className="text-2xl font-bold text-white">Super Admin</h1>
            <p className="text-gray-600 text-sm mt-1">Restricted access only</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter super admin password"
            className="w-full bg-[#0f0f1a] border border-[#1e1e3a] text-white placeholder-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 mb-3"
          />
          {authError && <p className="text-red-400 text-xs mb-3">{authError}</p>}
          <button onClick={handleLogin}
            className="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl text-sm transition">
            Access Dashboard →
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#060612] text-white">
      {/* Header */}
      <header className="border-b border-[#1a1a2e] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">🛡️</span>
          <span className="font-bold text-white text-lg">Super Admin</span>
          <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full">Internal Only</span>
        </div>
        <button onClick={loadData}
          className="text-xs text-gray-500 hover:text-white border border-[#1e1e3a] px-3 py-1.5 rounded-lg transition">
          🔄 Refresh
        </button>
      </header>

      <div className="flex h-[calc(100vh-57px)]">
        {/* Sidebar */}
        <aside className="w-48 border-r border-[#1a1a2e] p-4 flex flex-col gap-1">
          {(["overview", "users"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`text-left px-3 py-2.5 rounded-xl text-sm capitalize transition ${
                activeTab === tab
                  ? "bg-purple-900/50 text-purple-300 font-medium"
                  : "text-gray-500 hover:text-white hover:bg-[#0f0f1a]"
              }`}>
              {tab === "overview" ? "📊 Overview" : "👥 Users"}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white">Platform Overview</h2>

              {loading ? (
                <div className="text-gray-600 text-sm">Loading stats...</div>
              ) : stats ? (
                <>
                  {/* Stat cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "blue" },
                      { label: "Paid Users", value: stats.paidUsers, icon: "💳", color: "green" },
                      { label: "Trial Users", value: stats.trialUsers, icon: "⏳", color: "amber" },
                      { label: "Active Users", value: stats.activeUsers, icon: "⚡", color: "purple" },
                      { label: "Total Messages", value: stats.totalMessages, icon: "💬", color: "teal" },
                      { label: "Configured Bots", value: stats.configuredBots, icon: "🤖", color: "pink" },
                    ].map((card) => (
                      <div key={card.label}
                        className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-2xl p-5">
                        <div className="text-2xl mb-2">{card.icon}</div>
                        <div className="text-2xl font-bold text-white">{card.value}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{card.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Plan breakdown bar */}
                  <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-2xl p-5">
                    <h3 className="text-sm font-medium text-white mb-4">Plan Distribution</h3>
                    <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
                      {stats.totalUsers > 0 && (
                        <>
                          <div
                            className="bg-green-600 transition-all"
                            style={{ width: `${(stats.paidUsers / stats.totalUsers) * 100}%` }}
                            title={`Paid: ${stats.paidUsers}`}
                          />
                          <div
                            className="bg-amber-600 transition-all"
                            style={{ width: `${(stats.trialUsers / stats.totalUsers) * 100}%` }}
                            title={`Trial: ${stats.trialUsers}`}
                          />
                        </>
                      )}
                    </div>
                    <div className="flex gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block" />
                        Paid ({stats.paidUsers})
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
                        Trial ({stats.trialUsers})
                      </span>
                    </div>
                  </div>

                  {/* Top users by messages */}
                  <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-2xl p-5">
                    <h3 className="text-sm font-medium text-white mb-4">Most Active Users</h3>
                    <div className="space-y-2">
                      {[...users]
                        .sort((a, b) => b.messageCount - a.messageCount)
                        .slice(0, 5)
                        .map((u) => (
                          <div key={u.id}
                            className="flex items-center justify-between py-2 border-b border-[#1a1a2e] last:border-0">
                            <div>
                              <p className="text-sm text-white">{u.email}</p>
                              <p className="text-xs text-gray-600">{u.siteUrl || "No site configured"}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-purple-400">{u.messageCount} msgs</p>
                              <p className="text-xs text-gray-600">{timeAgo(u.lastActive)}</p>
                            </div>
                          </div>
                        ))}
                      {users.length === 0 && (
                        <p className="text-gray-600 text-sm">No users yet.</p>
                      )}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === "users" && (
            <div className="flex h-full">
              {/* User list */}
              <div className="w-80 border-r border-[#1a1a2e] flex flex-col">
                {/* Filters */}
                <div className="p-3 border-b border-[#1a1a2e] space-y-2">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full bg-[#0f0f1a] border border-[#1e1e3a] text-white placeholder-gray-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                  <div className="flex gap-1">
                    {(["all", "trial", "paid"] as const).map((f) => (
                      <button key={f} onClick={() => setFilterPlan(f)}
                        className={`flex-1 text-xs py-1.5 rounded-lg capitalize transition ${
                          filterPlan === f
                            ? "bg-purple-900 text-purple-300"
                            : "text-gray-600 hover:text-white"
                        }`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                  {filteredUsers.map((u) => (
                    <div key={u.id}
                      onClick={() => openUser(u)}
                      className={`p-3 border-b border-[#1a1a2e] cursor-pointer transition ${
                        selectedUser?.id === u.id
                          ? "bg-purple-900/20 border-l-2 border-l-purple-500"
                          : "hover:bg-[#0f0f1a]"
                      }`}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-white truncate flex-1">{u.email}</p>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ml-2 flex-shrink-0 ${
                          u.plan === "paid"
                            ? "bg-green-900/50 text-green-400"
                            : "bg-amber-900/50 text-amber-400"
                        }`}>
                          {u.plan}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        {u.siteUrl || "No site configured"}
                      </p>
                      <div className="flex gap-3 mt-1">
                        <span className="text-xs text-gray-700">💬 {u.messageCount}</span>
                        <span className="text-xs text-gray-700">🕐 {timeAgo(u.lastActive)}</span>
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <p className="text-gray-700 text-xs text-center py-8">No users found</p>
                  )}
                </div>
              </div>

              {/* User detail panel */}
              <div className="flex-1 overflow-y-auto">
                {!selectedUser ? (
                  <div className="flex items-center justify-center h-full text-gray-700 text-sm">
                    Select a user to view details
                  </div>
                ) : (
                  <div className="p-5 space-y-5">
                    {/* User header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold text-base">{selectedUser.email}</h3>
                        <p className="text-xs text-gray-600 mt-0.5">
                          ID: <code className="text-gray-500">{selectedUser.id}</code>
                        </p>
                        <p className="text-xs text-gray-600">
                          Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {selectedUser.plan !== "paid" && (
                          <button
                            onClick={() => upgradeToPaid(selectedUser.id)}
                            disabled={upgradingId === selectedUser.id}
                            className="text-xs bg-green-800 hover:bg-green-700 disabled:opacity-40 text-green-200 px-3 py-1.5 rounded-lg transition">
                            {upgradingId === selectedUser.id ? "Upgrading..." : "⬆️ Upgrade to Paid"}
                          </button>
                        )}
                        <button
                          onClick={() => deleteUser(selectedUser.id)}
                          disabled={deletingId === selectedUser.id}
                          className="text-xs bg-red-900/50 hover:bg-red-800 disabled:opacity-40 text-red-300 px-3 py-1.5 rounded-lg transition">
                          {deletingId === selectedUser.id ? "Deleting..." : "🗑️ Delete"}
                        </button>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Messages", value: selectedUser.messageCount, icon: "💬" },
                        { label: "Content", value: `${(selectedUser.contentLength / 1000).toFixed(1)}k chars`, icon: "📄" },
                        { label: "Last Active", value: timeAgo(selectedUser.lastActive), icon: "🕐" },
                      ].map((s) => (
                        <div key={s.label} className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-xl p-3 text-center">
                          <div className="text-lg">{s.icon}</div>
                          <div className="text-sm font-semibold text-white mt-1">{s.value}</div>
                          <div className="text-xs text-gray-600">{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Site info */}
                    <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-xl p-4 space-y-2">
                      <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Bot Configuration</h4>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Site URL</span>
                          <a href={selectedUser.siteUrl} target="_blank"
                            className="text-blue-400 hover:underline text-xs truncate max-w-48">
                            {selectedUser.siteUrl || "Not set"}
                          </a>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">API Key</span>
                          <code className="text-gray-400 text-xs">{selectedUser.apiKey}</code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Crawled</span>
                          <span className="text-gray-400 text-xs">{timeAgo(selectedUser.crawledAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Plan</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            selectedUser.plan === "paid"
                              ? "bg-green-900/50 text-green-400"
                              : "bg-amber-900/50 text-amber-400"
                          }`}>{selectedUser.plan}</span>
                        </div>
                      </div>
                    </div>

                    {/* Crawled content preview */}
                    <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-xl p-4">
                      <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                        Crawled Content Preview
                      </h4>
                      {contentLoading ? (
                        <p className="text-gray-700 text-xs">Loading...</p>
                      ) : (
                        <pre className="text-xs text-gray-500 whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
                          {userContent
                            ? userContent.slice(0, 800) + (userContent.length > 800 ? "\n..." : "")
                            : "No content crawled yet."}
                        </pre>
                      )}
                    </div>

                    {/* System prompt editor */}
                    <div className="bg-[#0f0f1a] border border-[#1a1a2e] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                          Edit System Prompt
                        </h4>
                        <span className="text-xs text-gray-700">{userPrompt.length} chars</span>
                      </div>
                      <textarea
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        className="w-full bg-[#060612] border border-[#1e1e3a] text-gray-300 text-xs rounded-xl p-3 h-48 resize-none focus:outline-none focus:ring-1 focus:ring-purple-600 font-mono leading-relaxed"
                        placeholder="Edit the system prompt for this user's bot..."
                      />
                      <button
                        onClick={savePrompt}
                        disabled={promptSaving}
                        className="mt-2 w-full bg-purple-700 hover:bg-purple-600 disabled:opacity-40 text-white text-xs font-semibold py-2.5 rounded-xl transition">
                        {promptSaved ? "✅ Saved!" : promptSaving ? "Saving..." : "💾 Save Prompt"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}