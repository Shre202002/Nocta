'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Reveal, usePrefersReducedMotion } from './motion';

type Msg = { role: 'user' | 'assistant'; content: string };
const SUGGESTIONS = ['Automate my workflow', 'Explain this code', 'Write an API'];
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
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply ?? 'Ready for the next one.' }]);
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

  const orbsClass = useMemo(() => (reduced ? '' : 'animate-orb-pulse'), [reduced]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[var(--color-bg)] px-6 pb-20 pt-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_0%,rgba(37,99,235,0.08),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className={`pointer-events-none absolute -left-24 -top-24 h-[400px] w-[400px] rounded-full bg-[var(--color-accent)] opacity-4 blur-[160px] ${orbsClass}`} />
      <div className={`pointer-events-none absolute -bottom-16 -right-20 h-[300px] w-[300px] rounded-full bg-[var(--color-accent-blue)] opacity-6 blur-[120px] ${orbsClass}`} />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        <Reveal><Badge className="mb-10 border-[rgba(37,99,235,0.25)] bg-[rgba(37,99,235,0.12)] text-[16px] leading-6 tracking-normal text-[var(--color-text-secondary)]">Nocta AI · Now in Beta</Badge></Reveal>
        <Reveal delay={70}><h1 className="mb-6 text-[48px] leading-[48px] tracking-[-1.2px] text-white md:text-[80px] md:leading-[80px] md:tracking-[-2px]">Ask anything.<br />Ship faster.</h1></Reveal>
        <Reveal delay={140}><p className="mb-20 max-w-[520px] text-[20px] leading-7 text-[var(--color-text-secondary)]">Nocta understands your product. Ask it to write, build, analyze, or automate — and get back to shipping.</p></Reveal>

        <div ref={listRef} className="no-scrollbar mb-6 flex max-h-[280px] w-full max-w-[640px] flex-col gap-6 overflow-y-auto text-left">
          {messages.map((m, i) => (
            <div key={`${m.role}-${i}`} className={m.role === 'user' ? 'ml-auto max-w-[80%]' : 'max-w-[80%]'}>
              {m.role === 'assistant' && <p className="mb-1 text-[12px] leading-4 tracking-[1.2px] text-[var(--color-accent)]">Nocta</p>}
              <div className={`${m.role === 'user' ? 'bg-[var(--color-accent-blue)]' : 'bg-[var(--color-surface)]'} rounded-[var(--radius-large)] px-6 py-4 text-[16px] leading-6 text-white`}>{m.content}</div>
            </div>
          ))}
          {loading && (
            <div className="max-w-[80%] rounded-[var(--radius-large)] bg-[var(--color-surface)] px-6 py-4">
              <div className="flex gap-1">
                <span className="loading-dot" />
                <span className="loading-dot [animation-delay:120ms]" />
                <span className="loading-dot [animation-delay:240ms]" />
              </div>
            </div>
          )}
        </div>

        <div className="w-full max-w-[640px] rounded-[var(--radius-large)] border border-[var(--color-border-mid)] bg-[var(--color-deep-black)] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown} placeholder="Ask Nocta anything..." className="min-h-14 max-h-40 w-full resize-none border-none bg-transparent text-[16px] leading-6 text-white outline-none placeholder:text-[var(--color-text-muted)]" />
          <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => setInput(s)} className="rounded-[var(--radius-pill)] border border-[var(--color-border-mid)] bg-white/5 px-3 py-1.5 text-[12px] leading-4 tracking-[1.2px] text-[var(--color-text-secondary)] transition duration-150 hover:border-[var(--color-accent)] hover:text-white">{s}</button>
              ))}
            </div>
            <Button onClick={() => void sendMessage()} disabled={!input.trim() || loading || limitReached} className="px-8">Send</Button>
          </div>
        </div>

        {limitReached && (
          <a href="#pricing" className="mt-6 rounded-[var(--radius-pill)] border border-[var(--color-accent)] px-6 py-2 text-[16px] leading-6 text-[var(--color-accent)]">Chat limit reached — Sign up to continue →</a>
        )}
      </div>
    </section>
  );
}
