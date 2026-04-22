import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  featured?: boolean;
}

export function Card({ featured, className = '', ...props }: Props) {
  return (
    <div
      {...props}
      className={`rounded-[var(--radius-large)] border p-12 bg-[var(--color-deep-black)] transition duration-200 ${featured ? 'border-[rgba(54,244,164,0.2)]' : 'border-[var(--color-border-mid)] hover:border-[rgba(37,99,235,0.4)]'} ${className}`}
    />
  );
}
