'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { usePrefersReducedMotion } from './motion';

type Msg = { role: 'user' | 'assistant'; content: string };
const QUICK_PROMPTS = ['Summarize this feature', 'Write an API spec', 'Automate onboarding'];
const MAX_MESSAGES = 5;

export function Hero() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const reduced = usePrefersReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);

  const limitReached = msgCount >= MAX_MESSAGES;

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
  }, [messages, loading, reduced]);

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

  const orbClass = useMemo(() => (reduced ? '' : 'animate-orb-pulse'), [reduced]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[var(--color-bg)] px-6 pb-20 pt-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_900px_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className={`pointer-events-none absolute left-[-140px] top-[-80px] h-[360px] w-[360px] rounded-full bg-[var(--color-accent-blue)] opacity-10 blur-[130px] ${orbClass}`} />
      <div className={`pointer-events-none absolute bottom-[-110px] right-[-80px] h-[280px] w-[280px] rounded-full bg-[var(--color-accent)] opacity-10 blur-[120px] ${orbClass}`} />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <p className="mb-10 rounded-[var(--radius-pill)] border border-white/10 bg-white/5 px-6 py-2 text-[12px] leading-4 tracking-[1.2px] text-[var(--color-text-secondary)]">
          NOCTA · PRODUCT INTELLIGENCE
        </p>

        <h1 className="mb-6 text-[52px] leading-[54px] tracking-[-1.4px] text-white md:text-[84px] md:leading-[84px] md:tracking-[-2px]">
          Ask like a founder.
          <br />
          Build like a team of ten.
        </h1>

        <p className="mb-12 max-w-[620px] text-[20px] leading-7 text-[var(--color-text-secondary)]">
          An xAI-inspired Nocta hero experience: minimal, fast, and focused. Ask a question, get a sharp answer, and keep shipping.
        </p>

        <div ref={listRef} className="no-scrollbar mb-6 flex max-h-[280px] w-full max-w-[760px] flex-col gap-5 overflow-y-auto text-left">
          {messages.map((m, i) => (
            <div key={`${m.role}-${i}`} className={m.role === 'user' ? 'ml-auto max-w-[82%]' : 'max-w-[82%]'}>
              {m.role === 'assistant' && <p className="mb-1 text-[12px] leading-4 tracking-[1.2px] text-[var(--color-accent)]">Nocta</p>}
              <div className={`${m.role === 'user' ? 'bg-[var(--color-accent-blue)]' : 'bg-[var(--color-surface)]'} rounded-[20px] px-5 py-3 text-[16px] leading-6 text-white`}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="max-w-[82%] rounded-[20px] bg-[var(--color-surface)] px-5 py-3">
              <div className="flex gap-1">
                <span className="loading-dot" />
                <span className="loading-dot [animation-delay:120ms]" />
                <span className="loading-dot [animation-delay:240ms]" />
              </div>
            </div>
          )}
        </div>

        <div className="w-full max-w-[760px] rounded-[28px] border border-[var(--color-border-mid)] bg-[rgba(10,10,10,0.88)] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-sm">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask Nocta anything..."
            className="min-h-[58px] max-h-40 w-full resize-none border-none bg-transparent text-[16px] leading-6 text-white outline-none placeholder:text-[var(--color-text-muted)]"
          />

          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="rounded-[var(--radius-pill)] border border-[var(--color-border-mid)] bg-white/5 px-3 py-1.5 text-[12px] leading-4 tracking-[1.2px] text-[var(--color-text-secondary)] transition duration-150 hover:border-white/50 hover:text-white"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <Button onClick={() => void sendMessage()} disabled={!input.trim() || loading || limitReached} className="px-8">
              Send
            </Button>
          </div>
        </div>

        {limitReached && (
          <a href="#pricing" className="mt-5 rounded-[var(--radius-pill)] border border-[var(--color-accent)] px-6 py-2 text-[16px] leading-6 text-[var(--color-accent)]">
            Chat limit reached — Sign up to continue →
          </a>
        )}
      </div>
    </section>
  );
}
