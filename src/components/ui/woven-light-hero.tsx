'use client';

import React, { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';

type Msg = { role: 'user' | 'assistant'; content: string };
const MAX_MESSAGES = 5;

const AnimatedWord = ({ word }: { word: string }) => {
  return (
    <span className="inline-flex flex-wrap justify-center">
      {word.split('').map((char, index) => (
        <span key={`${char}-${index}`} className="woven-char" style={{ animationDelay: `${index * 60}ms` }}>
          {char}
        </span>
      ))}
    </span>
  );
};

const WovenCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let time = 0;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < 24; i++) {
        const t = time * 0.002 + i * 0.3;
        const x = w * (0.45 + Math.sin(t * 1.4) * 0.3);
        const y = h * (0.5 + Math.cos(t * 1.1) * 0.28);
        const r = 220 + Math.sin(t * 0.8) * 70;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(145,175,255,0.22)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      time += 1;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
};

export const WovenLightHero = () => {
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
    <div className="relative flex min-h-screen w-full flex-col items-center justify-end overflow-hidden bg-black pb-24 pt-24">
      <WovenCanvas />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_48%,rgba(91,129,231,0.50),transparent_42%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.95),rgba(0,0,0,0.86)_38%,rgba(0,0,0,0.95))]" />

      <div className="relative z-10 w-full max-w-5xl px-4 text-center">
        <h1 className="mb-4 text-[clamp(80px,18vw,240px)] leading-[0.88] tracking-[-0.06em] text-white/90">
          <AnimatedWord word="Nocta" />
        </h1>

        <div className="mx-auto w-full max-w-3xl">
          <form
            className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-tr from-[rgba(54,244,164,0.05)] to-[rgba(54,244,164,0.22)] p-px"
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage();
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="What do you want to know?"
              className="block h-[112px] w-full resize-none rounded-3xl border-none bg-black py-5 pl-5 pr-16 text-[clamp(18px,2vw,34px)] leading-tight text-white placeholder:text-white/40 focus:outline-none"
            />
            <button
              aria-label="Submit"
              type="submit"
              disabled={!canSend}
              className="absolute bottom-2.5 right-2.5 inline-flex aspect-square items-center justify-center rounded-full border border-zinc-600 bg-zinc-200 p-3 text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
              </svg>
            </button>
          </form>

          <div ref={listRef} className="no-scrollbar mt-4 max-h-[210px] space-y-3 overflow-y-auto text-left">
            {messages.map((m, idx) => (
              <div key={`${m.role}-${idx}`} className={`rounded-2xl border px-4 py-3 text-[15px] leading-6 ${m.role === 'assistant' ? 'border-zinc-800 bg-zinc-950/85 text-zinc-100' : 'ml-auto border-zinc-700 bg-zinc-900/80 text-white'}`}>
                {m.content}
              </div>
            ))}
            {loading && <div className="rounded-2xl border border-zinc-800 bg-zinc-950/85 px-4 py-3 text-zinc-400">Thinking…</div>}
          </div>

          {limitReached && <p className="mt-3 text-center text-[14px] text-[var(--color-accent)]">Chat limit reached — Sign up to continue.</p>}
        </div>
      </div>
    </div>
  );
};
