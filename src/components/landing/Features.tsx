'use client';

import { Card } from '@/components/ui/Card';
import { Reveal } from './motion';

const cards = [
  { title: 'Intelligent Pipelines', body: 'Orchestrate ingestion, enrichment, and delivery with one adaptive automation layer.', col: 'md:col-span-2', featured: true },
  { title: 'Real-time Analytics', body: 'Track usage, outcomes, and intent live so your team can ship with confidence.' },
  { title: 'Integrations', body: 'Connect docs, CRM, repos, and internal APIs without wiring custom glue code.' },
  { title: '99.9% Uptime', body: 'Production-grade reliability with resilient failover across critical paths.' },
  { title: 'SOC 2', body: 'Security posture built for teams that need compliance from day one.' },
];

export function Features() {
  return (
    <section id="features" className="py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal><h2 className="text-[48px] leading-[48px] tracking-[-1.2px] text-white">The AI layer your product needs</h2></Reveal>
        <Reveal delay={70}><p className="mb-20 mt-4 max-w-[480px] text-[16px] leading-6 text-[var(--color-text-secondary)]">Nocta plugs into your stack to transform support, delivery, and internal ops with agentic workflows.</p></Reveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((card, idx) => (
            <Reveal key={card.title} delay={idx * 70} className={card.col}>
              <Card featured={card.featured} className="h-full hover:scale-[1.012]">
                <h3 className="text-[36px] leading-[40px] tracking-[-0.9px] text-white">{card.title}</h3>
                <p className="mt-4 text-[16px] leading-6 text-[var(--color-text-secondary)]">{card.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
