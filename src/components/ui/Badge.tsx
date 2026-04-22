import type { HTMLAttributes } from 'react';

export function Badge({ className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...props}
      className={`inline-flex items-center rounded-[var(--radius-pill)] border px-6 py-1.5 text-[12px] leading-4 tracking-[1.2px] font-normal ${className}`}
    />
  );
}
