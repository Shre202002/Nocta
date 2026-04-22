'use client';

import { Reveal } from './motion';

const steps = [
  { n: '01', t: 'Connect your stack', d: 'Add your docs, APIs, and workflows in a guided setup.' },
  { n: '02', t: 'Train your context', d: 'Nocta builds context-aware intelligence from your product data.' },
  { n: '03', t: 'Deploy instantly', d: 'Ship an AI layer that assists users and automates high-friction tasks.' },
];

export function HowItWorks() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal><h2 className="mb-16 text-[48px] leading-[48px] tracking-[-1.2px] text-white">Up and running in minutes</h2></Reveal>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((s, idx) => (
            <Reveal key={s.n} delay={idx * 70} className="relative">
              {idx < 2 && <span className="absolute left-[72%] top-7 hidden h-px w-[56%] border-t border-dashed border-[var(--color-border-mid)] md:block" />}
              <p className="text-[48px] leading-[48px] text-[var(--color-accent)]">{s.n}</p>
              <h3 className="mt-4 text-[36px] leading-[40px] tracking-[-0.9px] text-white">{s.t}</h3>
              <p className="mt-3 max-w-[240px] text-[16px] leading-6 text-[var(--color-text-secondary)]">{s.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
