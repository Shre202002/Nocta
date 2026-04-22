'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(54,244,164,0.18),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.88),black)]" />

      <div className="relative mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-10 px-6 py-10 md:grid-cols-2 md:items-center">
        <section className="hidden md:block">
          <Link href="/" className="inline-flex items-center gap-2 text-[18px]">Nocta <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" /></Link>
          <h1 className="mt-8 text-[56px] leading-[56px] tracking-[-1.6px]">Create your account.</h1>
          <p className="mt-4 max-w-md text-[18px] leading-7 text-zinc-400">Go from signup to a live AI assistant on your product in minutes.</p>
        </section>

        <section className="rounded-[28px] border border-zinc-800 bg-zinc-950/80 p-7 backdrop-blur-sm">
          <p className="text-[12px] tracking-[1.2px] text-zinc-500">REGISTER</p>
          <h2 className="mt-2 text-[36px] leading-[40px] tracking-[-0.9px]">Get started</h2>
          <p className="mt-2 text-zinc-400">Already have an account? <Link href="/login" className="text-[var(--color-accent)]">Sign in</Link></p>

          <a href="/api/auth/google" className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 px-5 py-3 text-[16px] leading-6 text-white hover:border-zinc-500">
            Continue with Google
          </a>

          <div className="my-6 h-px bg-zinc-800" />

          {error && <p className="mb-3 rounded-xl border border-red-900 bg-red-950/50 px-3 py-2 text-[14px] text-red-300">{error}</p>}

          <div className="space-y-3">
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="min-h-11 w-full rounded-xl border border-zinc-700 bg-black px-4 text-[16px] outline-none placeholder:text-zinc-500 focus:border-zinc-500" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 8 characters" className="min-h-11 w-full rounded-xl border border-zinc-700 bg-black px-4 text-[16px] outline-none placeholder:text-zinc-500 focus:border-zinc-500" />
          </div>

          <button onClick={handleSubmit} disabled={loading} className="mt-4 min-h-11 w-full rounded-full bg-[var(--color-accent)] px-6 py-3 text-[16px] text-black disabled:opacity-50">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </section>
      </div>
    </div>
  );
}
