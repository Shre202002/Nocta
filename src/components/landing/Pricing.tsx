'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Reveal } from './motion';

export function Pricing() {
  const [annual, setAnnual] = useState(false);
  const plans = [
    { name: 'Free', m: '$0', a: '$0', features: ['50 AI responses', '1 integration', 'Community support'] },
    { name: 'Pro', m: '$49', a: '$39', features: ['Unlimited responses', 'Advanced automation', 'Priority support'], featured: true },
    { name: 'Enterprise', m: 'Custom', a: 'Custom', features: ['SAML + SCIM', 'Dedicated cluster', 'Custom SLAs'] },
  ];
  return (
    <section id="pricing" className="py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal><h2 className="text-[48px] leading-[48px] tracking-[-1.2px] text-white">Simple, transparent pricing</h2></Reveal>
        <Reveal delay={70}><div className="mt-8 inline-flex rounded-[var(--radius-pill)] border border-[var(--color-border-mid)] bg-[var(--color-deep-black)] p-1"><button onClick={() => setAnnual(false)} className={`min-h-11 rounded-[var(--radius-pill)] px-5 ${!annual ? 'bg-[var(--color-accent)] text-black' : 'text-[var(--color-text-secondary)]'}`}>Monthly</button><button onClick={() => setAnnual(true)} className={`min-h-11 rounded-[var(--radius-pill)] px-5 ${annual ? 'bg-[var(--color-accent)] text-black' : 'text-[var(--color-text-secondary)]'}`}>Annual</button></div></Reveal>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((p, idx) => (
            <Reveal key={p.name} delay={idx * 70}>
              <Card featured={p.featured} className="relative h-full">
                {p.featured && <Badge className="absolute right-6 top-6 border-[rgba(54,244,164,0.35)] bg-[rgba(54,244,164,0.1)] text-[var(--color-accent)]">Most Popular</Badge>}
                <p className="text-[36px] leading-[40px] tracking-[-0.9px] text-white">{p.name}</p>
                <p className="mt-4 text-[20px] leading-7 text-white">{annual ? p.a : p.m}<span className="text-[16px] text-[var(--color-text-secondary)]">{p.m !== 'Custom' ? '/mo' : ''}</span></p>
                <ul className="mt-6 space-y-3">
                  {p.features.map((f) => <li key={f} className="text-[16px] leading-6 text-[var(--color-text-secondary)]"><span className="mr-2 text-[var(--color-accent)]">✓</span>{f}</li>)}
                </ul>
                <Button className="mt-8 w-full">{p.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}</Button>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
