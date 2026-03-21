"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const FEATURES = [
  {
    icon: "🕷️",
    title: "Crawl any website",
    desc: "Paste a URL. Nocta scrapes every page, extracts clean content, and builds a knowledge base in seconds.",
  },
  {
    icon: "🧠",
    title: "AI trained on your content",
    desc: "Your bot only answers from your website's data. No hallucinations. No off-topic replies.",
  },
  {
    icon: "⚡",
    title: "Embed in 30 seconds",
    desc: "One script tag. A floating chat bubble appears on your site instantly — no coding required.",
  },
  {
    icon: "🔒",
    title: "Fully isolated per user",
    desc: "Each chatbot is sandboxed. Your data stays yours — completely separated from every other user.",
  },
  {
    icon: "🎨",
    title: "Matches your brand",
    desc: "Auto-detect your website's color palette. Nocta adapts to your brand — not the other way around.",
  },
  {
    icon: "📊",
    title: "Analytics dashboard",
    desc: "Track messages, active users, and bot performance. Know exactly how your visitors engage.",
  },
];

const STEPS = [
  { num: "01", title: "Sign up free", desc: "Create your Nocta account in 30 seconds. No credit card needed." },
  { num: "02", title: "Enter your URL", desc: "Paste your website link. Nocta crawls up to 15 pages automatically." },
  { num: "03", title: "Copy embed code", desc: "One script tag. Paste it before your closing </body> tag." },
  { num: "04", title: "Go live", desc: "Your visitors can now chat with your AI assistant instantly." },
];

const FAQS = [
  {
    q: "Do I need coding skills?",
    a: "No. Just copy-paste one line of HTML into your website. That's it.",
  },
  {
    q: "Which AI model powers Nocta?",
    a: "LLaMA 3.3 70B via Groq — extremely fast, highly capable, and production-grade.",
  },
  {
    q: "Can I use my own API key?",
    a: "Yes. You bring your own Groq API key. You stay in full control of costs.",
  },
  {
    q: "What websites does Nocta work on?",
    a: "Any publicly accessible website — business sites, portfolios, docs, e-commerce, blogs, you name it.",
  },
  {
    q: "Can I customise what the bot says?",
    a: "Absolutely. From your dashboard you can edit the system prompt, knowledge base, and even the brand colors.",
  },
  {
    q: "Will the chatbot match my website design?",
    a: "Yes. Nocta auto-detects your site's color palette and applies it to the chat widget automatically.",
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Instrument+Serif:ital@0;1&display=swap');

        .hero-glow {
          background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.2) 0%, transparent 70%);
        }
        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .card-glow:hover {
          box-shadow: 0 0 0 1px rgba(251,146,60,0.2), 0 20px 40px rgba(99,102,241,0.08);
        }
        .gradient-text {
          background: linear-gradient(135deg, #fff 0%, #fb923c 40%, #f97316 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .tag-pill {
          background: rgba(251,146,60,0.1);
          border: 1px solid rgba(251,146,60,0.25);
        }
        .cta-btn {
          background: linear-gradient(135deg, #6366f1, #818cf8);
          transition: all 0.25s;
        }
        .cta-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(99,102,241,0.4);
        }
        .outline-btn {
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.2s;
        }
        .outline-btn:hover {
          border-color: rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.04);
        }
        .nav-blur {
          background: rgba(13,17,23,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .float { animation: float 4s ease-in-out infinite; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .fade-up-2 { animation: fadeUp 0.7s 0.15s ease both; }
        .fade-up-3 { animation: fadeUp 0.7s 0.3s ease both; }
        .chat-bubble-demo {
          box-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05);
        }
        .serif { font-family: 'Instrument Serif', serif; }
        .orange-dot { color: #fb923c; }
        .step-connector {
          position: absolute;
          left: 19px; top: 42px;
          width: 1px; height: 100%;
          background: linear-gradient(to bottom, rgba(251,146,60,0.3), transparent);
        }
      `}</style>

      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "nav-blur border-b border-white/5" : ""}`}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo.png" alt="Nocta" className="h-20   w-auto" />
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#how-it-works" className="hover:text-white transition">How it works</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="outline-btn text-sm text-gray-300 px-4 py-2 rounded-xl">
              Login
            </Link>
            <Link href="/register" className="cta-btn text-sm text-white px-4 py-2 rounded-xl font-medium">
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-6 hero-glow grid-bg">
        <div className="absolute top-32 left-20 w-72 h-72 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-32 right-20 w-80 h-80 bg-orange-600/6 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 tag-pill px-4 py-1.5 rounded-full text-xs text-orange-300 mb-8 fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            Free trial — no credit card required
          </div>

          <h1 className="fade-up-2 text-5xl md:text-7xl font-light leading-[1.05] tracking-tight mb-6">
            <span className="serif italic text-gray-300">Your site.</span>
            <br />
            <span className="gradient-text font-semibold">Now alive.</span>
          </h1>

          <p className="fade-up-3 text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Nocta crawls your website, trains an AI on your content,
            and gives you an embed code. Your visitors get instant answers —
            you get zero support tickets.
          </p>

          <div className="fade-up-3 flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link href="/register"
              className="cta-btn text-white px-8 py-4 rounded-2xl font-medium text-base w-full sm:w-auto text-center">
              Deploy your first bot free →
            </Link>
            <Link href="/bot?userId=demo"
              className="outline-btn text-gray-300 px-8 py-4 rounded-2xl text-base w-full sm:w-auto text-center">
              See live demo
            </Link>
          </div>

          {/* Chat UI Preview */}
          <div className="relative max-w-sm mx-auto float">
            <div className="chat-bubble-demo rounded-3xl overflow-hidden border border-white/6 bg-[#0d1117]">
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5 bg-[#0a0d12]">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">Nocta AI</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <p className="text-gray-500 text-xs">Always on</p>
                  </div>
                </div>
              </div>
              {/* Messages */}
              <div className="px-4 py-4 space-y-3">
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 flex-shrink-0 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white"/>
                    </svg>
                  </div>
                  <div className="bg-[#161b22] text-gray-200 text-xs px-3 py-2.5 rounded-2xl rounded-tl-sm max-w-[80%] leading-relaxed border border-white/5">
                    Hi! I know everything about this website. What can I help you with?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-indigo-600 text-white text-xs px-3 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%] leading-relaxed">
                    What are your pricing plans?
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 flex-shrink-0 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white"/>
                    </svg>
                  </div>
                  <div className="bg-[#161b22] text-gray-200 text-xs px-3 py-2.5 rounded-2xl rounded-tl-sm max-w-[80%] leading-relaxed border border-white/5">
                    Nocta is free to start — no credit card needed. Pro plan unlocks unlimited bots and messages.
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 flex-shrink-0 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white"/>
                    </svg>
                  </div>
                  <div className="bg-[#161b22] px-3 py-3 rounded-2xl rounded-tl-sm border border-white/5">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-600 animate-bounce"
                          style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Input */}
              <div className="px-4 pb-4">
                <div className="flex gap-2 bg-[#161b22] rounded-2xl px-3 py-2.5 border border-white/6">
                  <input readOnly placeholder="Ask anything..." className="flex-1 bg-transparent text-xs text-gray-500 outline-none" />
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                      <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-[#0d1117] border border-white/10 rounded-2xl px-4 py-2.5 flex items-center gap-2 text-xs">
              <span className="text-orange-400 font-semibold">●</span>
              <span className="text-gray-400">Live on your site</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-[#0d1117]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-orange-400 text-sm font-medium mb-3 uppercase tracking-widest">What Nocta does</p>
            <h2 className="text-4xl md:text-5xl font-light leading-tight">
              Everything you need,<br />
              <span className="serif italic text-gray-400">nothing you don't.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i}
                className="card-glow bg-[#161b22] border border-white/5 rounded-2xl p-6 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-[#1c2128] border border-white/8 flex items-center justify-center text-lg mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-white font-medium mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-[#0a0d12]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-orange-400 text-sm font-medium mb-3 uppercase tracking-widest">How it works</p>
            <h2 className="text-4xl md:text-5xl font-light">
              Live in <span className="serif italic text-orange-300">4 steps.</span>
            </h2>
          </div>
          <div className="space-y-2">
            {STEPS.map((step, i) => (
              <div key={i} className="relative flex gap-6 pb-8 last:pb-0">
                {i < STEPS.length - 1 && (
                  <div className="step-connector" />
                )}
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-[#161b22] border border-orange-500/20 flex items-center justify-center">
                  <span className="text-orange-400 text-xs font-mono font-medium">{step.num}</span>
                </div>
                <div className="pt-1.5">
                  <h3 className="text-white font-medium mb-1">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Embed code showcase */}
      <section className="py-24 px-6 bg-[#0d1117]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-orange-400 text-sm font-medium mb-3 uppercase tracking-widest">Dead simple</p>
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            One line of code.<br />
            <span className="serif italic text-gray-400">That's literally it.</span>
          </h2>
          <p className="text-gray-500 mb-10">Paste this before your closing &lt;/body&gt; tag. Nocta appears instantly.</p>
          <div className="bg-[#161b22] border border-white/6 rounded-2xl p-6 text-left relative overflow-hidden">
            <div className="flex items-center gap-1.5 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="text-gray-600 text-xs ml-2 font-mono">index.html</span>
            </div>
            <pre className="text-sm font-mono overflow-x-auto">
              <span className="text-gray-500">{"<script"}</span>
              {"\n  "}
              <span className="text-orange-300">src</span>
              <span className="text-gray-400">{"=\"https://nocta.ai/embed.js\""}</span>
              {"\n  "}
              <span className="text-orange-300">data-user-id</span>
              <span className="text-gray-400">{"=\"your-bot-id\""}</span>
              {"\n  "}
              <span className="text-orange-300">defer</span>
              {"\n"}
              <span className="text-gray-500">{">"}</span>
              <span className="text-gray-500">{"</script>"}</span>
            </pre>
            <div className="absolute top-4 right-4">
              <div className="bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs px-2 py-1 rounded-lg">✓ Works on any site</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-[#0a0d12]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-orange-400 text-sm font-medium mb-3 uppercase tracking-widest">FAQ</p>
            <h2 className="text-4xl font-light">
              <span className="serif italic text-gray-400">Common</span> questions.
            </h2>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-[#161b22] border border-white/5 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left">
                  <span className="text-white text-sm font-medium">{faq.q}</span>
                  <span className={`text-gray-500 text-lg transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-[#0d1117]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-[#161b22] border border-orange-500/15 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/15 via-transparent to-orange-900/10 pointer-events-none" />
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <img src="/logo.png" alt="Nocta" className="h-16 w-auto mx-auto mb-6 opacity-90" />
              <h2 className="text-4xl md:text-5xl font-light mb-4">
                Your site.<br />
                <span className="gradient-text font-semibold">Now alive.</span>
              </h2>
              <p className="text-gray-500 mb-8">Free trial. No credit card. Live in 5 minutes.</p>
              <Link href="/register"
                className="cta-btn inline-block text-white px-10 py-4 rounded-2xl font-medium text-base">
                Deploy Nocta free →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 bg-[#0d1117]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img src="/logo.png" alt="Nocta" className="h-10 w-auto opacity-80" />
          <p className="text-gray-700 text-xs">© 2026 Nocta. Built with Next.js & Groq.</p>
          <div className="flex gap-4 text-xs text-gray-700">
            <Link href="/login" className="hover:text-white transition">Login</Link>
            <Link href="/register" className="hover:text-white transition">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}