import Link from 'next/link';

const columns = {
  Product: ['Features', 'Pricing', 'Roadmap'],
  Company: ['About', 'Careers', 'Contact'],
  Resources: ['Docs', 'Guides', 'API'],
  Legal: ['Privacy', 'Terms', 'Security'],
};

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-mid)] pt-12">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-10 md:grid-cols-5">
        <div>
          <p className="text-[18px] leading-6 text-white">Nocta</p>
          <p className="mt-3 text-[16px] leading-6 text-[var(--color-text-secondary)]">AI infrastructure for modern products</p>
        </div>
        {Object.entries(columns).map(([title, links]) => (
          <div key={title}>
            <p className="text-[16px] leading-6 text-[var(--color-text-secondary)]">{title}</p>
            <ul className="mt-3 space-y-2">
              {links.map((link) => <li key={link}><Link href="#" className="text-[16px] leading-6 text-[var(--color-text-secondary)] hover:text-white">{link}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between border-t border-[var(--color-border-mid)] px-6 py-6 text-[12px] leading-4 tracking-[1.2px] text-[var(--color-text-muted)]">
        <p>© 2026 Nocta. All rights reserved.</p>
        <div className="flex items-center gap-4"><span>X</span><span>GitHub</span><span>LinkedIn</span></div>
      </div>
    </footer>
  );
}
