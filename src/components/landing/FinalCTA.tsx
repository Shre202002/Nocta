'use client';

import { Reveal } from './motion';

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-deep-black)] py-[256px]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(54,244,164,0.06)] blur-[120px]" />
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <Reveal><h2 className="text-[48px] leading-[48px] tracking-[-1.2px] text-white md:text-[80px] md:leading-[80px] md:tracking-[-2px]">Start building with Nocta today</h2></Reveal>
        <Reveal delay={70}><div className="mx-auto mt-10 flex max-w-[480px] flex-col gap-3 sm:flex-row"><input type="email" placeholder="you@company.com" className="min-h-11 flex-1 rounded-[var(--radius-pill)] border border-[var(--color-border-mid)] bg-[var(--color-bg)] px-10 py-3 text-[16px] leading-6 text-white outline-none placeholder:text-[var(--color-text-muted)]" /><button className="min-h-11 rounded-[var(--radius-pill)] bg-[var(--color-accent)] px-10 py-3 text-[16px] leading-6 text-black">Get Started</button></div></Reveal>
      </div>
    </section>
  );
}
