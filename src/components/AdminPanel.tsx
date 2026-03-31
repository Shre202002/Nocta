"use client";

import { useState, useRef, useEffect } from "react";

const ADMIN_PASSWORD = "admin123"; // Change this!

type LogEntry = {
  type: string;
  message?: string;
  page?: string;
  count?: number;
  chars?: number;
  pagesCrawled?: number;
  characters?: number;
  chunks?: number;  // ← ADD THIS
};

type AdminPanelProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {


    const [url, setUrl] = useState("");
    // const [apiKey, setApiKey] = useState("");
    const [extraUrls, setExtraUrls] = useState<string[]>([""]);
    const [crawling, setCrawling] = useState(false);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [crawlDone, setCrawlDone] = useState(false);

    const [activeTab, setActiveTab] = useState<"crawl" | "preview" | "prompt" | "theme">("crawl");
    const [previewContent, setPreviewContent] = useState("");
    const [systemPrompt, setSystemPrompt] = useState("");
    const [promptSaved, setPromptSaved] = useState(false);


    const [theme, setTheme] = useState({
        bubbleColor: "#6366f1",
        headerColor: "#6366f1",
        userMsgColor: "#6366f1",
        sendBtnColor: "#6366f1",
        accentColor: "#818cf8",
    });
    const [palette, setPalette] = useState<string[]>([]);
    const [extracting, setExtracting] = useState(false);
    const [themeSaved, setThemeSaved] = useState(false);
    const [themeSaving, setThemeSaving] = useState(false);
    const logsEndRef = useRef<HTMLDivElement>(null);



    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    // Load existing data when panel opens


    function addExtraUrl() {
        setExtraUrls([...extraUrls, ""]);
    }

    function updateExtraUrl(index: number, value: string) {
        const updated = [...extraUrls];
        updated[index] = value;
        setExtraUrls(updated);
    }

    function removeExtraUrl(index: number) {
        setExtraUrls(extraUrls.filter((_, i) => i !== index));
    }

    async function handleCrawl() {
        if (!url ) return;
        setCrawling(true);
        setCrawlDone(false);
        setLogs([]);

        const validExtras = extraUrls.filter((u) => u.trim() !== "");

        const res = await fetch("/api/crawl", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, extraUrls: validExtras }),
        });

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n").filter((l) => l.startsWith("data:"));

            for (const line of lines) {
                try {
                    const data: LogEntry = JSON.parse(line.replace("data: ", ""));
                    setLogs((prev) => [...prev, data]);

                    if (data.type === "done") {
                        setCrawlDone(true);
                        setCrawling(false);
                        // Reload preview
                        fetch("/api/knowledge")
                            .then((r) => r.json())
                            .then((d) => {
                                setPreviewContent(d.content || "");
                                setSystemPrompt(d.content || "");
                            });
                    }
                    if (data.type === "error") {
                        setCrawling(false);
                    }
                } catch { }
            }
        }
    }

    async function savePrompt() {
        await fetch("/api/save-prompt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: systemPrompt }),
        });
        setPromptSaved(true);
        setTimeout(() => setPromptSaved(false), 2000);
    }

    async function extractTheme() {
        if (!url) return;
        setExtracting(true);
        try {
            const res = await fetch("/api/extract-theme", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });
            const data = await res.json();
            if (data.theme) setTheme(data.theme);
            if (data.palette) setPalette(data.palette);
        } catch { }
        setExtracting(false);
    }

    async function saveTheme() {
        setThemeSaving(true);
        await fetch("/api/theme", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ theme }),
        });
        setThemeSaving(false);
        setThemeSaved(true);
        setTimeout(() => setThemeSaved(false), 2000);
    }

    // Panel overlay
    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sliding Panel */}
            <div
                className={`fixed top-0 left-0 h-full w-full max-w-md bg-[#0f0f1a] z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Panel Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e3a] bg-[#13131f]">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">⚙️</span>
                        <h2 className="text-white font-bold text-base">Admin Panel</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">
                        ✕
                    </button>
                </div>

                {(
                    <>
                        {/* Tabs */}
                        <div className="flex border-b border-[#1e1e3a]">
                            {(["crawl", "preview", "prompt", "theme"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-3 text-xs font-semibold capitalize transition ${activeTab === tab
                                        ? "text-blue-400 border-b-2 border-blue-400 bg-[#13131f]"
                                        : "text-gray-500 hover:text-gray-300"
                                        }`}
                                >
                                    {tab === "crawl" ? " Crawl" : tab === "preview" ? "Preview" : tab === "prompt" ? "Prompt" : "Theme"}                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto">

                            {/* CRAWL TAB */}
                            {activeTab === "crawl" && (
                                <div className="p-5 space-y-4">
                                    {/* Main URL */}
                                    <div>
                                        <label className="text-xs font-medium text-gray-400 mb-1 block">🌐 Website URL</label>
                                        <input
                                            type="url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="https://example.com"
                                            className="w-full bg-[#1a1a2e] border border-[#2a2a4a] text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        />
                                    </div>

                                    {/* API Key */}
                                    {/* <div>
                                        <label className="text-xs font-medium text-gray-400 mb-1 block">🔑 Groq API Key</label>
                                        <input
                                            type="password"
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            placeholder="gsk_xxxxxxxxxxxx"
                                            className="w-full bg-[#1a1a2e] border border-[#2a2a4a] text-white placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        />
                                    </div> */}

                                    {/* Extra URLs */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-xs font-medium text-gray-400">➕ Extra URLs (optional)</label>
                                            <button
                                                onClick={addExtraUrl}
                                                className="text-xs text-blue-400 hover:text-blue-300"
                                            >
                                                + Add URL
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {extraUrls.map((eu, i) => (
                                                <div key={i} className="flex gap-2">
                                                    <input
                                                        type="url"
                                                        value={eu}
                                                        onChange={(e) => updateExtraUrl(i, e.target.value)}
                                                        placeholder={`https://example.com/page-${i + 1}`}
                                                        className="flex-1 bg-[#1a1a2e] border border-[#2a2a4a] text-white placeholder-gray-600 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                    />
                                                    <button
                                                        onClick={() => removeExtraUrl(i)}
                                                        className="text-gray-600 hover:text-red-400 text-sm px-1"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1">These pages will be crawled and added to the knowledge base</p>
                                    </div>

                                    {/* Crawl Button */}
                                    <button
                                        onClick={handleCrawl}
                                        disabled={!url || crawling}
                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition"
                                    >
                                        {crawling ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                </svg>
                                                Crawling...
                                            </span>
                                        ) : "🕷️ Start Crawl"}
                                    </button>

                                    {/* Live Logs */}
                                    {logs.length > 0 && (
                                        <div className="bg-[#0a0a14] border border-[#1e1e3a] rounded-xl p-3 max-h-56 overflow-y-auto font-mono text-xs space-y-1">
                                            {logs.map((log, i) => (
                                                <div key={i} className={
                                                    log.type === "done" ? "text-green-400" :
                                                        log.type === "error" ? "text-red-400" :
                                                            log.type === "page_error" ? "text-yellow-500" :
                                                                log.type === "crawling" ? "text-blue-300" :
                                                                    log.type === "embedding" ? "text-cyan-400" :  // ← ADD THIS
                                                                        "text-gray-400"
                                                }>
                                                    {log.type === "start" && `🚀 ${log.message}`}
                                                    {log.type === "crawling" && `🔍 [${log.count}] ${log.page}`}
                                                    {log.type === "page_done" && `✅ Extracted ${log.chars?.toLocaleString()} chars`}
                                                    {log.type === "page_error" && `⚠️ Failed: ${log.page}`}
                                                    {log.type === "embedding" && `⚡ ${log.message}`}  {/* ← ADD THIS */}
                                                    {log.type === "done" && `🎉 Done! ${log.pagesCrawled} pages, ${log.chunks || 0} chunks embedded`}
                                                    {log.type === "error" && `❌ ${log.message}`}
                                                </div>
                                            ))}
                                            <div ref={logsEndRef} />
                                        </div>
                                    )}

                                    {crawlDone && (
                                        <button
                                            onClick={() => setActiveTab("preview")}
                                            className="w-full bg-green-700 hover:bg-green-600 text-white text-sm py-2.5 rounded-xl transition"
                                        >
                                            👁️ Preview Crawled Content →
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* PREVIEW TAB */}
                            {activeTab === "preview" && (
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-white text-sm font-semibold">Crawled Content</h3>
                                        <span className="text-xs text-gray-500">{previewContent.length.toLocaleString()} chars</span>
                                    </div>
                                    {previewContent ? (
                                        <pre className="bg-[#0a0a14] border border-[#1e1e3a] rounded-xl p-3 text-xs text-gray-300 whitespace-pre-wrap overflow-y-auto max-h-[60vh] leading-relaxed">
                                            {previewContent}
                                        </pre>
                                    ) : (
                                        <div className="text-center text-gray-600 py-10 text-sm">
                                            No content yet. Run a crawl first.
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* PROMPT EDITOR TAB */}
                            {activeTab === "prompt" && (
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-white text-sm font-semibold">Edit System Prompt</h3>
                                        <span className="text-xs text-gray-500">{systemPrompt.length.toLocaleString()} chars</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3">
                                        This is the knowledge base the chatbot uses. You can manually edit or add to it.
                                    </p>
                                    <textarea
                                        value={systemPrompt}
                                        onChange={(e) => setSystemPrompt(e.target.value)}
                                        className="w-full bg-[#0a0a14] border border-[#1e1e3a] text-gray-200 text-xs rounded-xl p-3 h-64 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono leading-relaxed"
                                        placeholder="Paste or edit your system prompt / knowledge base here..."
                                    />
                                    <button
                                        onClick={savePrompt}
                                        className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition"
                                    >
                                        {promptSaved ? "✅ Saved!" : "💾 Save Prompt"}
                                    </button>
                                </div>
                            )}

                            {/* THEME TAB */}
                            {activeTab === "theme" && (
                                <div className="p-5 space-y-5">

                                    {/* Auto-detect */}
                                    <div>
                                        <p className="text-xs text-gray-400 mb-2">
                                            Auto-detect colors from your website
                                        </p>
                                        <button
                                            onClick={extractTheme}
                                            disabled={!url || extracting}
                                            className="w-full bg-[#1a1a2e] border border-[#2a2a4a] hover:border-blue-500 disabled:opacity-40 text-gray-300 text-sm py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                                        >
                                            {extracting ? (
                                                <>
                                                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                    </svg>
                                                    Detecting colors...
                                                </>
                                            ) : "✨ Auto-detect from website"}
                                        </button>

                                        {/* Detected palette swatches */}
                                        {palette.length > 0 && (
                                            <div className="mt-3">
                                                <p className="text-xs text-gray-600 mb-2">Detected palette — click to apply:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {palette.map((color) => (
                                                        <button
                                                            key={color}
                                                            onClick={() => setTheme({
                                                                bubbleColor: color,
                                                                headerColor: color,
                                                                userMsgColor: color,
                                                                sendBtnColor: color,
                                                                accentColor: color,
                                                            })}
                                                            className="w-8 h-8 rounded-lg border-2 border-transparent hover:border-white transition"
                                                            style={{ background: color }}
                                                            title={color}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-[#1e1e3a]" />

                                    {/* Color pickers */}
                                    <div className="space-y-3">
                                        {([
                                            { key: "bubbleColor", label: "Bubble button" },
                                            { key: "headerColor", label: "Chat header" },
                                            { key: "userMsgColor", label: "User message" },
                                            { key: "sendBtnColor", label: "Send button" },
                                            { key: "accentColor", label: "Accent / links" },
                                        ] as const).map(({ key, label }) => (
                                            <div key={key} className="flex items-center justify-between">
                                                <label className="text-xs text-gray-400">{label}</label>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-600 font-mono">{theme[key]}</span>
                                                    <input
                                                        type="color"
                                                        value={theme[key]}
                                                        onChange={(e) => setTheme((prev) => ({ ...prev, [key]: e.target.value }))}
                                                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                                                        style={{ padding: "1px" }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-[#1e1e3a]" />

                                    {/* Live Preview */}
                                    <div>
                                        <p className="text-xs text-gray-400 mb-3">Live preview</p>
                                        <div className="rounded-2xl overflow-hidden border border-[#1e1e3a]"
                                            style={{ background: "#f7f8fc" }}>
                                            {/* Header preview */}
                                            <div className="flex items-center gap-2 px-3 py-3"
                                                style={{ background: theme.headerColor }}>
                                                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                                                    style={{ background: "rgba(255,255,255,0.2)" }}>
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-white text-xs font-medium">AI Assistant</p>
                                                    <div className="flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                                        <span className="text-white/70 text-[10px]">Online</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Messages preview */}
                                            <div className="px-3 py-3 space-y-2" style={{ background: "#f7f8fc" }}>
                                                {/* Bot message */}
                                                <div className="flex gap-2 items-end">
                                                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                                                        style={{ background: theme.userMsgColor }}>
                                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                                            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white" />
                                                        </svg>
                                                    </div>
                                                    <div className="text-xs px-3 py-2 rounded-2xl rounded-bl-sm max-w-[70%]"
                                                        style={{ background: "#fff", color: "#222", border: "1px solid #eee" }}>
                                                        Hi! Ask me anything 👋
                                                    </div>
                                                </div>
                                                {/* User message */}
                                                <div className="flex justify-end">
                                                    <div className="text-xs px-3 py-2 rounded-2xl rounded-br-sm text-white"
                                                        style={{ background: theme.userMsgColor }}>
                                                        How can I get started?
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Input preview */}
                                            <div className="px-3 py-2.5 border-t" style={{ background: "#fff", borderColor: "#eee" }}>
                                                <div className="flex gap-2 items-center bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                                                    <span className="text-xs text-gray-400 flex-1">Ask a question...</span>
                                                    <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                                                        style={{ background: theme.sendBtnColor }}>
                                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                                                            <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <p className="text-center text-[10px] mt-1.5" style={{ color: "#ccc" }}>
                                                    Powered by{" "}
                                                    <span style={{ color: theme.accentColor }}>BotBase</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bubble preview */}
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-gray-400">Bubble button preview</p>
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                                            style={{ background: theme.bubbleColor }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Save */}
                                    <button
                                        onClick={saveTheme}
                                        disabled={themeSaving}
                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl text-sm transition"
                                    >
                                        {themeSaved ? "✅ Theme Saved!" : themeSaving ? "Saving..." : "💾 Save Theme"}
                                    </button>
                                </div>
                            )}

                        </div>
                    </>
                )}
            </div>
        </>
    );
}