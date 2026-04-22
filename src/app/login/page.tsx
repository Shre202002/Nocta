'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { AuthTabs, Ripple, TechOrbitDisplay } from '@/components/ui/modern-animated-sign-in';

type FormData = { Email: string; Password: string };

const imageSet = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=80&q=60',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=80&q=60',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=80&q=60',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=80&q=60',
];

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

  const iconsArray = imageSet.map((src, idx) => ({
    component: () => <Image width={40} height={40} src={src} alt={`Tech ${idx + 1}`} className="rounded-full object-cover" />,
    className: 'size-[42px] border-none bg-transparent',
    radius: 130 + idx * 55,
    duration: 18 + idx * 2,
    delay: idx * 8,
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
    subHeader: 'Sign in to your account',
    fields: [
      { label: 'Email', required: true, type: 'email' as const, placeholder: 'Enter your email address', onChange: (e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'Email') },
      { label: 'Password', required: true, type: 'password' as const, placeholder: 'Enter your password', onChange: (e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'Password') },
    ],
    submitButton: 'Sign in',
    textVariantButton: 'Forgot password?',
  };

  return (
    <section className="relative flex min-h-screen bg-black text-white max-lg:justify-center">
      <span className="relative hidden w-1/2 flex-col justify-center lg:flex">
        <Ripple mainCircleSize={100} />
        <TechOrbitDisplay iconsArray={iconsArray} text="Nocta Login" />
      </span>
      <span className="w-full lg:w-1/2">
        <AuthTabs formFields={formFields} goTo={(e) => { e.preventDefault(); router.push('/forgot-password'); }} handleSubmit={handleSubmit} />
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm text-zinc-400">
          New here? <Link href="/register" className="text-[var(--color-accent)]">Create account</Link>
        </p>
        {(error || oauthError) && <p className="absolute top-8 left-1/2 w-[90%] max-w-md -translate-x-1/2 rounded-xl border border-red-900 bg-red-950/60 px-4 py-2 text-sm text-red-300">{error || oauthError}</p>}
      </span>
    </section>
  );
}

export default function LoginPage() {
  return <Suspense><LoginBody /></Suspense>;
}
