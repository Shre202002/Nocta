import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'ghost' | 'chip';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = 'primary', className = '', ...props }: Props) {
  const variants: Record<Variant, string> = {
    primary: 'bg-[var(--color-accent)] text-black border border-[var(--color-accent)] hover:brightness-105',
    ghost: 'bg-transparent text-[var(--color-text-secondary)] border border-[var(--color-border-mid)] hover:border-white hover:text-white',
    chip: 'bg-white/5 text-[var(--color-text-secondary)] border border-[var(--color-border-mid)] hover:border-[var(--color-accent)] hover:text-white',
  };

  return (
    <button
      {...props}
      className={`min-h-11 rounded-[var(--radius-pill)] px-6 py-3 text-[16px] leading-6 font-normal transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] ${variants[variant]} ${className}`}
    />
  );
}
