"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminPanel from "@/components/AdminPanel";

export default function DashboardPage() {
    const [user, setUser] = useState<{ id: string; email: string; plan: string } | null>(null);
    const [adminOpen, setAdminOpen] = useState(false);
    const [copied, setCopied] = useState<"script" | "iframe" | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/auth/me").then(r => {
            if (!r.ok) { router.push("/login"); return; }
            return r.json();
        }).then(d => d && setUser(d));
    }, []);

    async function logout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    }

    function copy(text: string, type: "script" | "iframe") {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    }

    if (!user) return (
        <main className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
            <div className="text-gray-500 text-sm">Loading...</div>
        </main>
    );



    // const botUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/bot?userId=${user.id}`;
    // const scriptSnippet = `<script src="${typeof window !== "undefined" ? window.location.origin : ""}/embed.js" data-user-id="${user.id}"defer></script>`;
    // const iframeSnippet = `<iframe src="${botUrl}" width="400" height="600" style="border:none;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.15)"></iframe>`;

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const botUrl = `${origin}/bot?userId=${user.id}`;
    const scriptSnippet = `<script src="${origin}/embed.js" data-user-id="${user.id}" defer></script>`;
    const iframeSnippet = `<iframe src="${botUrl}" width="400" height="600" style="border:none;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.15)"></iframe>`;
    return (
        <>
            <AdminPanel isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
            <main className="min-h-screen bg-[#0f0f1a] text-white">
                {/* Header */}
                <header className="border-b border-[#1e1e3a] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#6366f1" />
                        </svg>
                        <span className="font-bold text-white">ChatBot SaaS</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ml-2 ${user.plan === "paid" ? "bg-green-900 text-green-300" : "bg-amber-900 text-amber-300"}`}>
                            {user.plan === "paid" ? "Pro" : "Free Trial"}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-500 text-sm">{user.email}</span>
                        <button onClick={logout} className="text-sm text-gray-500 hover:text-white transition">Logout</button>
                    </div>
                </header>

                <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
                    {/* Setup card */}
                    <div className="bg-[#16213e] border border-[#1e1e3a] rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white font-semibold">Your Chatbot</h2>
                            <button onClick={() => setAdminOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl transition">
                                ⚙️ Configure Bot
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <a
                                href={botUrl}
                                target="_blank"
                                onClick={() => {
                                    // Clear theme cache so preview always shows latest
                                    sessionStorage.removeItem(`cb_theme_${user.id}`);
                                }}
                                className="flex-1 text-center bg-[#0f0f1a] border border-[#2a2a4a] hover:border-blue-500 text-gray-300 text-sm py-3 rounded-xl transition"
                            >
                                Preview Chatbot
                            </a>
                            <a href="/bot-demo" target="_blank"
                                className="flex-1 text-center bg-[#0f0f1a] border border-[#2a2a4a] hover:border-blue-500 text-gray-300 text-sm py-3 rounded-xl transition">
                                See Demo
                            </a>
                        </div>
                    </div>

                    {/* Embed codes */}
                    <div className="bg-[#16213e] border border-[#1e1e3a] rounded-2xl p-6 space-y-5">
                        <h2 className="text-white font-semibold">Embed on your website</h2>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs text-gray-400 font-medium">Script Tag (recommended)</label>
                                <button onClick={() => copy(scriptSnippet, "script")}
                                    className="text-xs text-blue-400 hover:text-blue-300">
                                    {copied === "script" ? "✅ Copied!" : "Copy"}
                                </button>
                            </div>
                            <pre className="bg-[#0a0a14] border border-[#1e1e3a] rounded-xl p-3 text-xs text-green-400 overflow-x-auto whitespace-pre-wrap">
                                {scriptSnippet}
                            </pre>
                            <p className="text-xs text-gray-600 mt-1">Paste before closing &lt;/body&gt; tag. Shows a chat bubble.</p>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs text-gray-400 font-medium">iFrame Embed</label>
                                <button onClick={() => copy(iframeSnippet, "iframe")}
                                    className="text-xs text-blue-400 hover:text-blue-300">
                                    {copied === "iframe" ? "✅ Copied!" : "Copy"}
                                </button>
                            </div>
                            <pre className="bg-[#0a0a14] border border-[#1e1e3a] rounded-xl p-3 text-xs text-green-400 overflow-x-auto whitespace-pre-wrap">
                                {iframeSnippet}
                            </pre>
                            <p className="text-xs text-gray-600 mt-1">Embed inline anywhere on your page.</p>
                        </div>
                    </div>

                    {/* Bot ID */}
                    <div className="bg-[#16213e] border border-[#1e1e3a] rounded-2xl p-5">
                        <h2 className="text-white font-semibold mb-2">Your Bot ID</h2>
                        <code className="text-blue-400 text-sm bg-[#0a0a14] px-3 py-2 rounded-lg block">{user.id}</code>
                        <p className="text-xs text-gray-600 mt-2">This ID uniquely identifies your bot. Keep it safe.</p>
                    </div>
                </div>
            </main>
        </>
    );
}