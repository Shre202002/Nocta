'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { AuthTabs, Ripple, TechOrbitDisplay } from '@/components/ui/modern-animated-sign-in';

type FormData = { Email: string; Password: string };

function LoginBody() {
  const [formData, setFormData] = useState<FormData>({ Email: '', Password: '' });
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const oauthError = useMemo(() => {
    const err = searchParams.get('error');
    if (err === 'google_failed') return 'Google sign-in failed. Please try again.';
    if (err === 'no_email') return 'Could not get email from Google.';
    return '';
  }, [searchParams]);

  const iconsArray = Array.from({ length: 6 }, (_, idx) => ({
    component: () => <Image width={36} height={36} src="/logo-icon.png.png" alt="Nocta" className="rounded-md" />,
    className: 'size-[40px] border-none bg-transparent',
    radius: 110 + idx * 45,
    duration: 16 + idx,
    delay: idx * 6,
    path: false,
    reverse: idx % 2 === 0,
  }));

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>, name: keyof FormData) => {
    setFormData((prev) => ({ ...prev, [name]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.Email, password: formData.Password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Unable to sign in');
      return;
    }

    router.push('/dashboard');
  };

  const formFields = {
    header: 'Welcome back',
    subHeader: 'Sign in to your Nocta account',
    fields: [
      { label: 'Email', required: true, type: 'email' as const, placeholder: 'Enter your email address', onChange: (e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'Email') },
      { label: 'Password', required: true, type: 'password' as const, placeholder: 'Enter your password', onChange: (e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'Password') },
    ],
    submitButton: 'Sign in',
    textVariantButton: 'Forgot password?',
  };

  return (
    <section className="min-h-screen bg-black text-white px-4 py-8 md:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
        <div className="relative hidden min-h-[520px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/50 lg:block">
          <Ripple />
          <TechOrbitDisplay iconsArray={iconsArray} text="Nocta" />
        </div>

        <div className="space-y-5">
          <Link href="/" className="inline-flex items-center gap-2 text-lg text-white">
            <Image src="/logo-icon.png.png" width={26} height={26} alt="Nocta" className="rounded-sm" />
            Nocta
          </Link>

          {(error || oauthError) && <p className="rounded-xl border border-red-900 bg-red-950/60 px-4 py-2 text-sm text-red-300">{error || oauthError}</p>}

          <AuthTabs formFields={formFields} goTo={(e) => { e.preventDefault(); router.push('/forgot-password'); }} handleSubmit={handleSubmit} />

          <p className="text-center text-sm text-zinc-400">
            New here? <Link href="/register" className="text-[var(--color-accent)]">Create account</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return <Suspense><LoginBody /></Suspense>;
}
