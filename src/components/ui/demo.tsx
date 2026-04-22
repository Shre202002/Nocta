'use client';

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import Image from 'next/image';
import { AuthTabs, Ripple, TechOrbitDisplay } from '@/components/ui/modern-animated-sign-in';

type FormData = { email: string; password: string };

interface OrbitIcon {
  component: () => ReactNode;
  className: string;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
  reverse?: boolean;
}

const iconsArray: OrbitIcon[] = [
  {
    component: () => <Image width={40} height={40} src='https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=80&q=60' alt='Tech' className='rounded-full object-cover' />,
    className: 'size-[42px] border-none bg-transparent', duration: 20, delay: 20, radius: 100, path: false, reverse: false,
  },
  {
    component: () => <Image width={40} height={40} src='https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=80&q=60' alt='Tech' className='rounded-full object-cover' />,
    className: 'size-[42px] border-none bg-transparent', duration: 20, delay: 10, radius: 170, path: false, reverse: true,
  },
];

export function Demo() {
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>, name: keyof FormData) => {
    setFormData((prev) => ({ ...prev, [name]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form submitted', formData);
  };

  const formFields = {
    header: 'Welcome back',
    subHeader: 'Sign in to your account',
    fields: [
      { label: 'Email', required: true, type: 'email' as const, placeholder: 'Enter your email address', onChange: (event: ChangeEvent<HTMLInputElement>) => handleInputChange(event, 'email') },
      { label: 'Password', required: true, type: 'password' as const, placeholder: 'Enter your password', onChange: (event: ChangeEvent<HTMLInputElement>) => handleInputChange(event, 'password') },
    ],
    submitButton: 'Sign in',
    textVariantButton: 'Forgot password?',
  };

  return (
    <section className='flex max-lg:justify-center'>
      <span className='flex w-1/2 flex-col justify-center max-lg:hidden'>
        <Ripple mainCircleSize={100} />
        <TechOrbitDisplay iconsArray={iconsArray} />
      </span>
      <span className='w-1/2 max-lg:w-full'>
        <AuthTabs formFields={formFields} goTo={(e) => e.preventDefault()} handleSubmit={handleSubmit} />
      </span>
    </section>
  );
}
