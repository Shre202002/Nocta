'use client';

import { Reveal } from './motion';

const logos = ['ORBITAL', 'LUMEN', 'STACKLOOM', 'ZENOVA', 'APEXLABS', 'NEBULA', 'BYTECRAFT', 'SYNQ'];

export function LogoBar() {
  return (
    <section className="py-12">
      <Reveal className="mx-auto max-w-6xl px-6">
        <p className="mb-10 text-center text-[16px] leading-6 text-[var(--color-text-secondary)]">Trusted by teams building AI products</p>
        <div className="mask-marquee overflow-hidden">
          <div className="marquee-track flex gap-12 hover:[animation-play-state:paused]">
            {[...logos, ...logos].map((logo, i) => (
              <span key={`${logo}-${i}`} className="whitespace-nowrap text-[12px] leading-4 tracking-[1.4px] text-[var(--color-text-muted)]">{logo}</span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
