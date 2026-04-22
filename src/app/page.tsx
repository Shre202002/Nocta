import { Features, FinalCTA, Footer, Hero, HowItWorks, LogoBar, Navbar, Pricing, Testimonials } from '@/components/landing';

export default function HomePage() {
  return (
    <main className="bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <Navbar />
      <Hero />
      <LogoBar />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
