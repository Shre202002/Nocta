'use client';

import { Card } from '@/components/ui/Card';
import { Reveal } from './motion';

const items = [
  { q: '“Nocta made our docs feel alive. Support response time dropped in the first week.”', n: 'Aria Chen', r: 'Head of Product', i: 'AC' },
  { q: '“The onboarding UX is absurdly fast. We shipped an embedded copilot in a day.”', n: 'Miles Rao', r: 'Staff Engineer', i: 'MR' },
  { q: '“The quality is sharp, concise, and deeply contextual to our product language.”', n: 'Jordan Lee', r: 'Developer Relations', i: 'JL' },
];

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal><h2 className="mb-12 text-[48px] leading-[48px] tracking-[-1.2px] text-white">Loved by developers</h2></Reveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((it, idx) => (
            <Reveal key={it.n} delay={idx * 70}>
              <Card className="h-full">
                <p className="text-[20px] leading-7 italic text-[var(--color-text-secondary)]">{it.q}</p>
                <div className="mt-8 flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-[rgba(37,99,235,0.15)] text-[var(--color-accent-blue)]">{it.i}</div>
                  <div>
                    <p className="text-[16px] leading-6 text-white">{it.n}</p>
                    <p className="text-[12px] leading-4 tracking-[1.2px] text-[var(--color-text-muted)]">{it.r}</p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
