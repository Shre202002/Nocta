"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What can you help me with?",
  "Tell me about this website",
  "How do I get started?",
  "What are your main features?",
];

function BotChat() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);
  // Add this useEffect after the existing one
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/theme?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.theme) return;
        const t = data.theme;
        // Apply CSS variables dynamically
        const style = document.getElementById("cb-bot-theme") || document.createElement("style");
        style.id = "cb-bot-theme";
        style.textContent = `
        .bot-avatar, .msg-avatar, .bot-empty-icon { background: ${t.headerColor} !important; }
        .bot-header { background: ${t.headerColor} !important; }
        .msg-bubble.user { background: ${t.userMsgColor} !important; }
        .bot-send { background: ${t.sendBtnColor} !important; box-shadow: 0 2px 8px ${t.sendBtnColor}55 !important; }
        .bot-footer a { color: ${t.accentColor} !important; }
        .bot-input-row:focus-within { border-color: ${t.accentColor}88 !important; }
        .bot-suggestion:hover { color: ${t.accentColor} !important; border-color: ${t.accentColor}44 !important; background: ${t.accentColor}11 !important; }
      `;
        document.head.appendChild(style);
      })
      .catch(() => { });
  }, [userId]);

  async function send(text?: string) {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, userId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }

      // Add empty assistant message to stream into
      const streamMessages: Message[] = [...newMessages, { role: "assistant", content: "" }];
      setMessages(streamMessages);

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let streamedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(l => l.startsWith("data:"));

        for (const line of lines) {
          try {
            const data = JSON.parse(line.replace("data: ", ""));

            if (data.token) {
              streamedText += data.token;
              setMessages([
                ...newMessages,
                { role: "assistant", content: streamedText }
              ]);
              // ← Add this delay
              await new Promise(resolve => setTimeout(resolve, 18));
            }

            if (data.error) throw new Error(data.error);
          } catch { }
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        
        .bot-root {
          height: 100dvh;
          background: #f7f8fc;
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', sans-serif;
        }
        
        /* Header */
        .bot-header {
          background: #fff;
          border-bottom: 1px solid #eeeef2;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .bot-avatar {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .bot-header-info { flex: 1; }
        .bot-header-name {
          font-size: 14px;
          font-weight: 500;
          color: #111;
          letter-spacing: -0.01em;
        }
        .bot-status {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: #888;
          margin-top: 1px;
        }
        .bot-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
        }
        .bot-status-dot.loading {
          background: #f59e0b;
          animation: pulse 1s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        
        /* Messages area */
        .bot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          scroll-behavior: smooth;
        }
        .bot-messages::-webkit-scrollbar { width: 4px; }
        .bot-messages::-webkit-scrollbar-track { background: transparent; }
        .bot-messages::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }
        
        /* Empty state */
        .bot-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          text-align: center;
          padding: 24px 16px;
          gap: 16px;
        }
        .bot-empty-icon {
          width: 56px;
          height: 56px;
          border-radius: 18px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
        }
        .bot-empty-title {
          font-size: 15px;
          font-weight: 500;
          color: #111;
        }
        .bot-empty-sub {
          font-size: 13px;
          color: #999;
          max-width: 220px;
          line-height: 1.5;
        }
        .bot-suggestions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
          max-width: 280px;
        }
        .bot-suggestion {
          background: #fff;
          border: 1px solid #eeeef2;
          color: #444;
          font-size: 12px;
          padding: 10px 14px;
          border-radius: 12px;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }
        .bot-suggestion:hover {
          background: #f0f0ff;
          border-color: #c7d2fe;
          color: #4f46e5;
        }
        
        /* Message rows */
        .msg-row {
          display: flex;
          gap: 8px;
          align-items: flex-end;
          animation: msgIn 0.2s ease;
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .msg-row.user { justify-content: flex-end; }
        .msg-avatar {
          width: 28px;
          height: 28px;
          border-radius: 9px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          flex-shrink: 0;
          margin-bottom: 2px;
        }
        .msg-bubble {
          max-width: 78%;
          padding: 10px 14px;
          border-radius: 18px;
          font-size: 13px;
          line-height: 1.55;
          word-break: break-word;
        }
        .msg-bubble.assistant {
          background: #fff;
          color: #222;
          border: 1px solid #eeeef2;
          border-bottom-left-radius: 4px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .msg-bubble.user {
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          color: #fff;
          border-bottom-right-radius: 4px;
          box-shadow: 0 2px 8px rgba(99,102,241,0.3);
        }
        
        /* Typing indicator */
        .typing-bubble {
          background: #fff;
          border: 1px solid #eeeef2;
          border-bottom-left-radius: 4px;
          padding: 12px 16px;
          border-radius: 18px;
          display: flex;
          gap: 4px;
          align-items: center;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #bbb;
          animation: typingBounce 1.2s infinite ease;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typingBounce {
          0%,60%,100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        
        /* Error */
        .bot-error {
          background: #fff5f5;
          border: 1px solid #fecaca;
          color: #dc2626;
          font-size: 12px;
          padding: 10px 14px;
          border-radius: 12px;
          text-align: center;
          margin: 0 8px;
        }
        
        /* Input area */
        .bot-input-area {
          background: #fff;
          border-top: 1px solid #eeeef2;
          padding: 12px 14px;
          flex-shrink: 0;
        }
        .bot-input-row {
          display: flex;
          gap: 8px;
          align-items: center;
          background: #f7f8fc;
          border: 1.5px solid #eeeef2;
          border-radius: 16px;
          padding: 8px 8px 8px 14px;
          transition: border-color 0.15s;
        }
        .bot-input-row:focus-within {
          border-color: #a5b4fc;
          background: #fff;
        }
        .bot-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: 13px;
          color: #222;
          font-family: 'DM Sans', sans-serif;
          line-height: 1.4;
        }
        .bot-input::placeholder { color: #bbb; }
        .bot-send {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s;
          box-shadow: 0 2px 8px rgba(99,102,241,0.3);
        }
        .bot-send:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(99,102,241,0.4);
        }
        .bot-send:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          box-shadow: none;
        }
        .bot-send svg {
          width: 14px;
          height: 14px;
          fill: white;
        }
        .bot-footer {
          text-align: center;
          margin-top: 8px;
          font-size: 10px;
          color: #ccc;
          letter-spacing: 0.01em;
        }
        .bot-footer a { color: #a5b4fc; text-decoration: none; }
      `}</style>

      <div className="bot-root">
        {/* Header */}
        <div className="bot-header">
          <div className="bot-avatar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white" />
            </svg>
          </div>
          <div className="bot-header-info">
            <div className="bot-header-name">AI Assistant</div>
            <div className="bot-status">
              <div className={`bot-status-dot ${loading ? "loading" : ""}`} />
              <span>{loading ? "Typing..." : "Online"}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="bot-messages">
          {messages.length === 0 ? (
            <div className="bot-empty">
              <div className="bot-empty-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white" />
                </svg>
              </div>
              <div>
                <div className="bot-empty-title">Hi there! 👋</div>
                <div className="bot-empty-sub">I'm trained on this website's content. Ask me anything!</div>
              </div>
              <div className="bot-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="bot-suggestion" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div key={i} className={`msg-row ${msg.role}`}>
                  {msg.role === "assistant" && (
                    <div className="msg-avatar">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white" />
                      </svg>
                    </div>
                  )}
                  <div className={`msg-bubble ${msg.role}`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="msg-row">
                  <div className="msg-avatar">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white" />
                    </svg>
                  </div>
                  <div className="typing-bubble">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              )}

              {error && (
                <div className="bot-error">⚠️ {error}</div>
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="bot-input-area">
          <div className="bot-input-row">
            <input
              ref={inputRef}
              className="bot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask a question..."
              disabled={loading}
            />
            <button
              className="bot-send"
              onClick={() => send()}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" />
              </svg>
            </button>
          </div>
          <div className="bot-footer">
            Powered by <a href="/" target="_blank">BotBase</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default function BotPage() {
  return (
    <Suspense>
      <BotChat />
    </Suspense>
  );
}