'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { AuthTabs, Ripple, TechOrbitDisplay } from '@/components/ui/modern-animated-sign-in';

type FormData = { Email: string; Password: string };

const imageSet = [
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=80&q=60',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=80&q=60',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=80&q=60',
  'https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?auto=format&fit=crop&w=80&q=60',
];

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({ Email: '', Password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const iconsArray = imageSet.map((src, idx) => ({
    component: () => <Image width={40} height={40} src={src} alt={`Tech ${idx + 1}`} className="rounded-full object-cover" />,
    className: 'size-[42px] border-none bg-transparent',
    radius: 130 + idx * 55,
    duration: 18 + idx * 2,
    delay: idx * 8,
    path: false,
    reverse: idx % 2 !== 0,
  }));

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>, name: keyof FormData) => {
    setFormData((prev) => ({ ...prev, [name]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.Email, password: formData.Password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Unable to create account');
      return;
    }

    router.push('/dashboard');
  };

  const formFields = {
    header: 'Create account',
    subHeader: 'Start building with Nocta today',
    fields: [
      { label: 'Email', required: true, type: 'email' as const, placeholder: 'Enter your email address', onChange: (e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'Email') },
      { label: 'Password', required: true, type: 'password' as const, placeholder: 'Choose a strong password', onChange: (e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'Password') },
    ],
    submitButton: 'Create account',
    textVariantButton: 'Already have an account?',
  };

  return (
    <section className="relative flex min-h-screen bg-black text-white max-lg:justify-center">
      <span className="relative hidden w-1/2 flex-col justify-center lg:flex">
        <Ripple mainCircleSize={100} />
        <TechOrbitDisplay iconsArray={iconsArray} text="Nocta Register" />
      </span>
      <span className="w-full lg:w-1/2">
        <AuthTabs formFields={formFields} goTo={(e) => { e.preventDefault(); router.push('/login'); }} handleSubmit={handleSubmit} />
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm text-zinc-400">
          Already registered? <Link href="/login" className="text-[var(--color-accent)]">Sign in</Link>
        </p>
        {error && <p className="absolute top-8 left-1/2 w-[90%] max-w-md -translate-x-1/2 rounded-xl border border-red-900 bg-red-950/60 px-4 py-2 text-sm text-red-300">{error}</p>}
      </span>
    </section>
  );
}
