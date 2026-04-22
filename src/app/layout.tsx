import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nocta — Ask anything. Ship faster.',
  description: 'Nocta is the AI layer for modern products.',
  icons: { icon: '/share_icon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
