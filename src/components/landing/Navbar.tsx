'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';

const links = ['Features', 'Pricing', 'Docs', 'Blog'];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 z-50 w-full border-b transition-[background,border-color] duration-300 ${scrolled ? 'bg-[rgba(10,10,10,0.8)] backdrop-blur-xl border-[var(--color-border-mid)]' : 'bg-transparent border-transparent'}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-12 py-6 md:px-8">
        <Link href="/" className="text-[18px] leading-6 text-white">Nocta<span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" /></Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link, idx) => (
            <a key={link} href={`#${link.toLowerCase()}`} className={`text-[16px] leading-6 text-[var(--color-text-secondary)] transition duration-150 hover:text-white ${idx === 0 ? 'text-white underline underline-offset-4 decoration-[var(--color-accent)]' : ''}`}>
              {link}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login"><Button variant="ghost">Log in</Button></Link>
          <Link href="/register"><Button>Get Started</Button></Link>
        </div>

        <button aria-label="Open menu" className="md:hidden min-h-11 min-w-11 rounded-full border border-[var(--color-border-mid)] text-white" onClick={() => setOpen(true)}>☰</button>
      </div>
      <div className={`fixed inset-0 z-40 transition ${open ? 'pointer-events-auto bg-black/60 opacity-100' : 'pointer-events-none opacity-0'}`} onClick={() => setOpen(false)}>
        <aside className={`absolute right-0 top-0 h-full w-[280px] bg-[var(--color-deep-black)] border-l border-[var(--color-border-mid)] p-6 transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col gap-4">
            {links.map((link) => <a key={link} href={`#${link.toLowerCase()}`} className="text-[16px] leading-6 text-[var(--color-text-secondary)]">{link}</a>)}
            <Link href="/login" className="mt-4 text-[16px] leading-6 text-white">Log in</Link>
            <Link href="/register" className="text-[16px] leading-6 text-[var(--color-accent)]">Get Started</Link>
          </div>
        </aside>
      </div>
    </header>
  );
}
