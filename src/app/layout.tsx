import type { Metadata } from "next";
import "./globals.css";
<meta name="theme-color" content="#0d1117" />
export const metadata = {
  title: "Nocta — Deploy AI on your website in minutes",
  description: "Turn any website into an AI chatbot. One embed. Live in 5 minutes.",
  
  icons: {
    icon: "/logo-icon.png",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}