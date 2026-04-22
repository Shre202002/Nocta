'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';

type Msg = { role: 'user' | 'assistant'; content: string };
const MAX_MESSAGES = 5;

export function Hero() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const limitReached = msgCount >= MAX_MESSAGES;

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading || limitReached) return;

    const userMsg: Msg = { role: 'user', content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setMsgCount((prev) => prev + 1);
    setLoading(true);

    try {
      const res = await fetch('/api/landing-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply ?? 'Ready when you are.' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Something went wrong. Try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const canSend = useMemo(() => Boolean(input.trim()) && !loading && !limitReached, [input, loading, limitReached]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black px-6 pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_45%,rgba(159,192,255,0.55),transparent_42%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_62%,rgba(37,99,235,0.42),transparent_40%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.94),rgba(0,0,0,0.86)_38%,rgba(0,0,0,0.95))]" />

      <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col">
        <div className="mt-auto pb-10 text-center">
          <p className="text-[clamp(84px,18vw,220px)] leading-[0.9] tracking-[-0.05em] text-white/85">Nocta</p>
        </div>

        <div className="absolute inset-0 top-20 flex grow items-end justify-center pb-28">
          <div className="w-full max-w-3xl">
            <form
              className="relative w-full items-center gap-3 overflow-hidden rounded-3xl bg-gradient-to-tr from-[rgba(54,244,164,0.06)] to-[rgba(54,244,164,0.2)] p-px"
              onSubmit={(e) => {
                e.preventDefault();
                void sendMessage();
              }}
            >
              <textarea
                name="query"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="What do you want to know?"
                className="block h-[120px] w-full resize-none rounded-3xl border-none bg-black py-5 pl-4 pr-16 text-[20px] leading-7 text-white placeholder:text-white/45 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              />
              <div className="absolute bottom-2.5 right-2.5 flex items-center">
                <button
                  aria-label="Submit a query to Nocta"
                  type="submit"
                  disabled={!canSend}
                  className="inline-flex aspect-square items-center justify-center rounded-full border border-zinc-600 bg-zinc-200 p-3 text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                    <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </form>

            <div ref={listRef} className="no-scrollbar mt-4 max-h-[210px] space-y-3 overflow-y-auto">
              {messages.map((m, idx) => (
                <div key={`${m.role}-${idx}`} className={`rounded-2xl border px-4 py-3 text-left text-[15px] leading-6 ${m.role === 'assistant' ? 'border-zinc-800 bg-zinc-950/85 text-zinc-100' : 'ml-auto border-zinc-700 bg-zinc-900/80 text-white'}`}>
                  {m.content}
                </div>
              ))}
              {loading && <div className="rounded-2xl border border-zinc-800 bg-zinc-950/85 px-4 py-3 text-zinc-400">Thinking…</div>}
            </div>

            {limitReached && <p className="mt-3 text-center text-[14px] text-[var(--color-accent)]">Chat limit reached — Sign up to continue.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
