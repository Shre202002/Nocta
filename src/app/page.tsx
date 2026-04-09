"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────
type FAQ = { q: string; a: string };
type Feature = { icon: JSX.Element; title: string; body: string };
type Step = { num: string; icon: JSX.Element; title: string; body: string; tag: string };
type Plan = {
  name: string;
  price: string;
  sub: string;
  features: string[];
  cta: string;
  highlight: boolean;
  badge?: string;
  strikethrough?: string;
};

// ── SVG Icons ──────────────────────────────────────────
const IconCode = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);
const IconDatabase = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);
const IconZap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IconShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconBarChart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const IconPlug = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" />
  </svg>
);
const IconUpload = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);
const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
  </svg>
);
const IconGithub = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconChevron = ({ open }: { open: boolean }) => (
  <svg
    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transition: "transform 0.25s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconCopy = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const IconCopied = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#86EFAC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconMenu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconCPU = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
  </svg>
);

// ── Data ──────────────────────────────────────────────
const FEATURES: Feature[] = [
  { icon: <IconCode />, title: "One-Line Embed", body: "One <script> tag. Your chatbot goes live on any website instantly. No backend, no config, no DevOps. Just paste and ship." },
  { icon: <IconDatabase />, title: "RAG on Your Data", body: "Upload PDFs, paste URLs, or push via API. Nocta chunks, embeds with Gemini, and stores vectors in Qdrant. Answers from YOUR knowledge — not the internet." },
  { icon: <IconZap />, title: "Groq-Powered Speed", body: "LLaMA 3.3 70B running on Groq's LPU inference. First token in under 500ms. Streaming via SSE means users see responses as they generate." },
  { icon: <IconShield />, title: "Per-Tenant Isolation", body: "Multi-tenant architecture with JWT auth. Every client's data — vectors, conversations, configs — completely isolated. Enterprise-grade by design." },
  { icon: <IconBarChart />, title: "Client Dashboard", body: "Every business gets their own portal. Manage knowledge sources, view conversation logs, update chatbot behavior, and track usage — without touching code." },
  { icon: <IconPlug />, title: "Developer-First API", body: "REST API for everything. Train from private databases, query programmatically, or build custom integrations. Works with any stack — React, Vue, plain HTML, mobile apps." },
];

const STEPS: Step[] = [
  {
    num: "01", icon: <IconUpload />,
    title: "Feed Nocta your knowledge",
    body: "Upload product docs, FAQs, support articles, or any text content. Paste a URL and we'll scrape it. Nocta chunks everything, generates Gemini embeddings, and stores them in Qdrant.",
    tag: "Qdrant · Gemini Embeddings · RAG Pipeline",
  },
  {
    num: "02", icon: <IconSettings />,
    title: "Set your chatbot's personality",
    body: "Give your chatbot a name, set its tone, define what it can and can't answer. Configure fallback responses. All through your Nocta dashboard — no prompt engineering required.",
    tag: "Dashboard · JWT Auth · Per-tenant config",
  },
  {
    num: "03", icon: <IconCode />,
    title: "Go live in 2 minutes",
    body: "Copy your unique embed script. Paste it into your website's HTML — one line. The Nocta widget loads, connects to your knowledge base, and starts answering in real-time.",
    tag: "<script> tag · SSE Streaming · Any platform",
  },
];

const PLANS: Plan[] = [
  {
    name: "Free", price: "₹0", sub: "Perfect to explore Nocta",
    features: ["1 chatbot", "500 messages / month", "1 knowledge source (up to 50 pages)", "Community support", "Nocta branding on widget"],
    cta: "Get Started Free", highlight: false,
  },
  {
    name: "Pro", price: "₹999", strikethrough: "₹1,499", sub: "For growing products and teams",
    badge: "Most Popular",
    features: ["5 chatbots", "10,000 messages / month", "10 knowledge sources (unlimited pages)", "Priority email support (24h response)", "Remove Nocta branding", "Custom chatbot name + avatar", "Conversation analytics", "API access"],
    cta: "Start Pro Trial", highlight: true,
  },
  {
    name: "Enterprise", price: "Custom", sub: "For companies needing scale and control",
    features: ["Unlimited chatbots", "Unlimited messages", "Dedicated Qdrant cluster", "99.9% SLA guarantee", "On-premise deployment option", "Dedicated success manager", "Custom model fine-tuning", "SSO + SAML auth"],
    cta: "Contact Sales", highlight: false,
  },
];

const FAQS: FAQ[] = [
  { q: "How does Nocta learn about my product?", a: "You upload documents, paste URLs, or use our API to push content. We chunk, embed (Gemini), and store vectors in Qdrant. Your chatbot retrieves relevant context for every question using semantic search." },
  { q: "Is my data shared with other customers?", a: "Never. Per-tenant data isolation is core to our architecture. Your vectors, your conversations, your configs — all isolated by tenant ID with JWT-verified access." },
  { q: "How fast are the chatbot responses?", a: "Nocta runs on Groq's LPU inference — typically under 500ms for first token. Full responses stream in real-time via SSE, so users see output immediately without loading spinners." },
  { q: "Can I embed Nocta on any website?", a: "Yes. One <script> tag, any website. React, plain HTML, WordPress, Webflow — if it renders HTML, Nocta works. No backend setup required on your end." },
  { q: "What AI model does Nocta use?", a: "LLaMA 3.3 70B via Groq for generation. Gemini text-embedding-004 for creating searchable vectors. All open or permissively licensed — no GPT wrappers." },
  { q: "Do I need a developer to set up Nocta?", a: "For the embed widget — no. Paste one script tag. For custom API integrations or training from private databases, basic developer knowledge is helpful." },
];

const SUGGESTIONS = ["How does RAG work?", "Embed on my website", "Compare plans", "LLaMA 3.3 vs GPT-4"];

const DEMO_RESPONSES: Record<string, string> = {
  "How does RAG work?": "RAG (Retrieval Augmented Generation) works in two stages. First, your content is chunked and embedded into vectors stored in Qdrant. When a user asks a question, Nocta converts it to a vector, finds the top-k most semantically similar chunks, then passes only those chunks as context to LLaMA 3.3. The result: precise answers from YOUR data, not hallucinated internet knowledge.",
  "Embed on my website": "Embedding Nocta takes under 2 minutes. Copy your unique script tag from your dashboard and paste it before the closing </body> tag of your HTML. The widget loads asynchronously, connects to your knowledge base via JWT-authenticated API, and starts answering your users instantly. Works on React, plain HTML, WordPress, Webflow — anything that renders HTML.",
  "Compare plans": "The Free plan gives you 1 chatbot, 500 messages/month, and 1 knowledge source — perfect to test Nocta with your product. Pro (₹999/month) scales to 5 chatbots, 10,000 messages, removes Nocta branding, and adds API access. Enterprise is fully custom — dedicated infrastructure, unlimited everything, and on-premise options.",
  "LLaMA 3.3 vs GPT-4": "LLaMA 3.3 70B running on Groq's LPU achieves comparable reasoning to GPT-4 on most tasks, with two key advantages: speed (<500ms first token vs 1–3s for GPT-4) and transparency — open weights, no usage policies, no per-token markup from OpenAI. For RAG workloads where the model is guided by retrieved context, LLaMA 3.3 performs excellently.",
};

const TECH = ["LLaMA 3.3", "Groq", "Qdrant", "MongoDB Atlas", "Next.js", "Gemini"];

const EMBED_CODE = `<script
  src="https://cdn.nocta.app/widget.js"
  data-tenant-id="your-tenant-id"
  data-theme="dark"
  defer
></script>`;

// ── Shared style tokens ────────────────────────────────
const V = "#7C3AED";
const V_HOVER = "#6D28D9";
const BG = "#000000";
const SURFACE = "#0D0D0D";
const SURFACE2 = "#111111";
const BORDER = "#1F1F1F";
const BORDER2 = "#2A2A2A";
const TEXT = "#FAFAFA";
const MUTED = "#71717A";
const DIM = "#3F3F46";

// ── Reusable components ────────────────────────────────
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: V, fontWeight: 600, marginBottom: 14 }}>
    {children}
  </p>
);

const SectionHeading = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <h2
    style={{
      fontFamily: "'Syne', sans-serif",
      fontSize: "clamp(1.9rem, 3.2vw, 2.75rem)",
      fontWeight: 800,
      letterSpacing: "-0.028em",
      color: TEXT,
      lineHeight: 1.1,
      marginBottom: 14,
      ...style,
    }}
  >
    {children}
  </h2>
);

const BtnPrimary = ({
  children,
  onClick,
  style,
  as: Tag = "button",
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  as?: "button" | "a";
  href?: string;
}) => {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    background: V,
    color: "#fff",
    border: "none",
    borderRadius: 7,
    fontSize: 13,
    fontWeight: 600,
    padding: "9px 18px",
    cursor: "pointer",
    textDecoration: "none",
    transition: "background 0.15s, box-shadow 0.15s",
    ...style,
  };
  if (Tag === "a") return <a href={href} style={base}>{children}</a>;
  return (
    <button onClick={onClick} style={base}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = V_HOVER; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = V; }}
    >
      {children}
    </button>
  );
};

const BtnGhost = ({
  children,
  onClick,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}) => (
  <button
    onClick={onClick}
    style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      background: "transparent", color: MUTED,
      border: `1px solid ${BORDER2}`, borderRadius: 7,
      fontSize: 13, fontWeight: 500, padding: "9px 18px",
      cursor: "pointer", transition: "all 0.15s",
      ...style,
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLButtonElement).style.borderColor = DIM;
      (e.currentTarget as HTMLButtonElement).style.color = TEXT;
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLButtonElement).style.borderColor = BORDER2;
      (e.currentTarget as HTMLButtonElement).style.color = MUTED;
    }}
  >
    {children}
  </button>
);

// ── Main Component ──────────────────────────────────────
export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll listener for nav border
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = "1";
          (e.target as HTMLElement).style.transform = "translateY(0)";
        }
      }),
      { threshold: 0.07 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSuggestion = useCallback((s: string) => {
    if (isTyping) return;
    if (typingRef.current) clearTimeout(typingRef.current);
    setActiveSuggestion(s);
    setDisplayedText("");
    setIsTyping(true);
    const full = DEMO_RESPONSES[s] ?? "";
    let i = 0;
    const type = () => {
      if (i < full.length) {
        setDisplayedText(full.slice(0, i + 1));
        i++;
        typingRef.current = setTimeout(type, 10);
      } else {
        setIsTyping(false);
      }
    };
    type();
  }, [isTyping]);

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(EMBED_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const revealStyle: React.CSSProperties = {
    opacity: 0,
    transform: "translateY(22px)",
    transition: "opacity 0.65s ease, transform 0.65s ease",
  };

  // ── Render ──────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: BG, color: TEXT, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse-badge { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scanline {
          0% { background-position: 0 -100vh; }
          100% { background-position: 0 100vh; }
        }

        .hero-h1 { animation: fadeUp 0.9s 0.05s ease both; }
        .hero-h2 { animation: fadeUp 0.9s 0.2s ease both; }
        .hero-h3 { animation: fadeUp 0.9s 0.35s ease both; }
        .hero-sub { animation: fadeUp 0.9s 0.5s ease both; }
        .hero-chat { animation: fadeUp 0.9s 0.65s ease both; }
        .hero-stats { animation: fadeUp 0.9s 0.8s ease both; }
        .hero-badge { animation: fadeUp 0.9s ease both; }

        .cursor-blink {
          display: inline-block; width: 2px; height: 0.88em;
          background: ${V}; margin-left: 1px; vertical-align: text-bottom;
          animation: blink 900ms step-end infinite;
        }

        .marquee-track { display: flex; animation: marquee 28s linear infinite; width: max-content; }

        .feat-card-hover {
          transition: border-color 0.2s, transform 0.2s;
        }
        .feat-card-hover:hover { border-color: #2A2A2A !important; transform: translateY(-2px); }
        .feat-card-hover:hover .feat-card-top-line { opacity: 1 !important; }

        .plan-card-hover { transition: transform 0.2s, box-shadow 0.2s; }
        .plan-card-hover:hover { transform: translateY(-3px); }

        .step-card { transition: border-color 0.2s; }
        .step-card:hover { border-color: #2A2A2A !important; }

        .chip-btn {
          background: ${SURFACE}; border: 1px solid ${BORDER}; color: ${MUTED};
          border-radius: 999px; font-size: 12px; padding: 6px 14px;
          cursor: pointer; transition: all 0.15s; white-space: nowrap;
          font-family: 'Inter', sans-serif;
        }
        .chip-btn:hover, .chip-btn.active {
          border-color: ${V}; color: #C4B5FD; background: rgba(124,58,237,0.06);
        }

        .faq-item-open { border-left-color: ${V} !important; padding-left: 16px !important; }

        .nav-link-item {
          color: ${MUTED}; font-size: 13px; text-decoration: none;
          transition: color 0.15s; display: inline-flex; align-items: center; gap: 5px;
        }
        .nav-link-item:hover { color: ${TEXT}; }

        .footer-link { color: ${MUTED}; font-size: 13px; text-decoration: none; transition: color 0.15s; }
        .footer-link:hover { color: ${TEXT}; }

        .send-btn-inner { transition: background 0.15s; }
        .send-btn-inner:hover { background: ${V_HOVER} !important; }

        .cta-primary-btn {
          background: ${V}; color: #fff; border: none; border-radius: 7px;
          font-size: 14px; font-weight: 600; padding: 13px 32px;
          cursor: pointer; transition: background 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .cta-primary-btn:hover { background: ${V_HOVER}; }

        .cta-ghost-btn {
          background: transparent; color: ${MUTED};
          border: 1px solid ${BORDER2}; border-radius: 7px;
          font-size: 14px; font-weight: 500; padding: 13px 32px;
          cursor: pointer; transition: all 0.15s; display: inline-flex;
          align-items: center; gap: 8px; font-family: 'Inter', sans-serif;
        }
        .cta-ghost-btn:hover { border-color: ${DIM}; color: ${TEXT}; }

        .copy-btn-inner { transition: all 0.15s; }
        .copy-btn-inner:hover { border-color: ${BORDER2} !important; color: ${TEXT} !important; }

        @media (max-width: 820px) {
          .feat-grid { grid-template-columns: 1fr !important; }
          .steps-grid { flex-direction: column !important; }
          .steps-divider { display: none !important; }
          .price-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .nav-desktop-links { display: none !important; }
          .hero-chat-inner { padding: 16px !important; }
        }
        @media (max-width: 520px) {
          .footer-grid { grid-template-columns: 1fr !important; }
          .hero-stats-inner { flex-direction: column !important; gap: 20px !important; }
          .hero-stats-sep { display: none !important; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50, height: 56,
        background: BG,
        borderBottom: scrolled ? `1px solid ${BORDER}` : "1px solid transparent",
        transition: "border-color 0.3s",
        display: "flex", alignItems: "center",
      }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 30, height: 30, background: SURFACE, border: `1.5px solid ${V}`,
              borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: V, fontSize: 14, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>N</span>
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, letterSpacing: "0.04em", color: TEXT }}>
              NOCTA
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="nav-desktop-links" style={{ display: "flex", gap: 30 }}>
            {[["Features", "#features"], ["How it works", "#how-it-works"], ["Pricing", "#pricing"], ["FAQ", "#faq"]].map(([label, href]) => (
              <a key={label} href={href} className="nav-link-item">{label}</a>
            ))}
            <a href="https://github.com" target="_blank" rel="noreferrer" className="nav-link-item">
              <IconGithub /> GitHub
            </a>
          </nav>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Link href="/login" style={{
              display: "inline-flex", alignItems: "center",
              background: "transparent", color: MUTED, border: `1px solid ${BORDER2}`,
              borderRadius: 7, fontSize: 13, fontWeight: 500, padding: "7px 15px",
              textDecoration: "none", transition: "all 0.15s",
            }}
              className="nav-desktop-links"
            >
              Sign In
            </Link>
            <Link href="/register" style={{
              display: "inline-flex", alignItems: "center",
              background: V, color: "#fff", border: "none",
              borderRadius: 7, fontSize: 13, fontWeight: 600, padding: "7px 15px",
              textDecoration: "none",
            }}>
              Get Started Free
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", padding: 4, display: "none" }}
              className="show-mobile"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <IconX /> : <IconMenu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div style={{
            position: "absolute", top: 56, left: 0, right: 0,
            background: SURFACE, borderBottom: `1px solid ${BORDER}`,
            padding: "20px 28px", display: "flex", flexDirection: "column", gap: 18,
          }}>
            {[["Features", "#features"], ["How it works", "#how-it-works"], ["Pricing", "#pricing"], ["FAQ", "#faq"]].map(([l, h]) => (
              <a key={l} href={h} className="nav-link-item" style={{ fontSize: 15 }} onClick={() => setMobileMenuOpen(false)}>{l}</a>
            ))}
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section style={{
        position: "relative", minHeight: "calc(100vh - 56px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "96px 28px",
      }}>
        {/* Grid background */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(${BORDER} 1px, transparent 1px), linear-gradient(90deg, ${BORDER} 1px, transparent 1px)`,
          backgroundSize: "44px 44px", opacity: 0.28, pointerEvents: "none",
        }} />
        {/* Violet radial glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 700, height: 700,
          background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 68%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", maxWidth: 740, width: "100%", textAlign: "center" }}>
          {/* Badge pill */}
          <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: SURFACE, border: `1px solid ${BORDER2}`, borderRadius: 999, padding: "6px 16px", marginBottom: 36 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: V, animation: "pulse-badge 2.5s ease-in-out infinite" }} />
            <span style={{ color: V, fontSize: 12, fontWeight: 600, letterSpacing: "0.03em" }}>Powered by LLaMA 3.3 70B + Groq</span>
          </div>

          {/* Headline — staggered lines */}
          <h1 style={{ marginBottom: 22, lineHeight: 1.04 }}>
            {["Your AI Chatbot.", "Trained on Your Data.", "Live in 2 Minutes."].map((line, i) => (
              <span
                key={i}
                className={`hero-h${i + 1}`}
                style={{
                  display: "block",
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(1.2rem, 6.5vw, 5.1rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  color: i === 2 ? V : TEXT,
                }}
              >
                {line}
              </span>
            ))}
          </h1>

          {/* Subheading */}
          <p className="hero-sub" style={{ color: MUTED, fontSize: 18, lineHeight: 1.65, maxWidth: 520, margin: "0 auto 52px" }}>
            Nocta embeds a context-aware AI chatbot into any product. Powered by open-source LLMs, your private knowledge base, and real-time streaming — not a generic GPT wrapper.
          </p>

          {/* Chat demo block */}
          <div className="hero-chat" style={{ maxWidth: 660, margin: "0 auto" }}>
            <div style={{
              borderRadius: 14, border: `1px solid ${BORDER2}`,
              background: SURFACE,
              boxShadow: "0 0 0 1px rgba(124,58,237,0.18), 0 0 80px rgba(124,58,237,0.06)",
              overflow: "hidden",
            }}>
              {/* Input row */}
              <div className="hero-chat-inner" style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: `1px solid #161616` }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={DIM} strokeWidth="2" style={{ flexShrink: 0 }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <div style={{ flex: 1, fontSize: 14, color: activeSuggestion ? TEXT : DIM, fontStyle: activeSuggestion ? "normal" : "italic", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                  {activeSuggestion ? `> ${activeSuggestion}` : "Ask Nocta anything — try a suggestion below"}
                </div>
                <div
                  className="send-btn-inner"
                  style={{ width: 32, height: 32, background: V, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                  onClick={() => activeSuggestion && handleSuggestion(activeSuggestion)}
                >
                  <IconArrow />
                </div>
              </div>

              {/* Chips */}
              <div style={{ display: "flex", gap: 6, padding: "10px 18px", flexWrap: "wrap", borderBottom: `1px solid #161616` }}>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className={`chip-btn${activeSuggestion === s ? " active" : ""}`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Streaming response */}
              {activeSuggestion && (
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                    <span style={{ fontSize: 11, color: V, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}>Nocta AI</span>
                  </div>
                  <p style={{ fontSize: 14, color: "#C4B5FD", lineHeight: 1.7 }}>
                    {displayedText}
                    {isTyping && <span className="cursor-blink" />}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Stats strip */}
          <div className="hero-stats" style={{ marginTop: 52 }}>
            <div className="hero-stats-inner" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { val: "< 500ms", label: "Response time", icon: <IconZap /> },
                { val: "LLaMA 3.3 70B", label: "Open source model", icon: <IconCPU /> },
                { val: "Multi-tenant", label: "Enterprise isolated", icon: <IconShield /> },
              ].map((stat, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ textAlign: "center", padding: "0 32px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginBottom: 4 }}>
                      <span style={{ color: V }}>{stat.icon}</span>
                      <span style={{ fontFamily: "'Syne', sans-serif", color: TEXT, fontWeight: 800, fontSize: 17 }}>{stat.val}</span>
                    </div>
                    <div style={{ color: MUTED, fontSize: 12 }}>{stat.label}</div>
                  </div>
                  {i < 2 && <div className="hero-stats-sep" style={{ width: 1, height: 34, background: BORDER2 }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ background: BG, padding: "96px 0", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 28px" }}>
          <div className="reveal" style={{ ...revealStyle, textAlign: "center", marginBottom: 60 }}>
            <SectionLabel>What Nocta does</SectionLabel>
            <SectionHeading>Everything you need to ship an AI chatbot</SectionHeading>
            <p style={{ color: MUTED, fontSize: 16, maxWidth: 540, margin: "0 auto", lineHeight: 1.65 }}>
              From knowledge ingestion to production embed — Nocta handles the entire AI pipeline.
            </p>
          </div>

          <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className={`reveal feat-card-hover`}
                style={{
                  ...revealStyle,
                  transitionDelay: `${i * 0.07}s`,
                  background: "#080808",
                  border: `1px solid ${hoveredFeature === i ? BORDER2 : BORDER}`,
                  borderRadius: 12,
                  padding: "24px 22px",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "default",
                }}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                {/* Top accent line */}
                <div
                  className="feat-card-top-line"
                  style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 1.5,
                    background: V, opacity: hoveredFeature === i ? 1 : 0,
                    transition: "opacity 0.2s",
                  }}
                />
                {/* Icon */}
                <div style={{
                  width: 40, height: 40, background: SURFACE2,
                  border: `1px solid ${BORDER}`, borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 18, color: V,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: TEXT, marginBottom: 9 }}>{f.title}</h3>
                <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.65 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ background: BG, padding: "96px 0", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 28px" }}>
          <div className="reveal" style={{ ...revealStyle, textAlign: "center", marginBottom: 60 }}>
            <SectionLabel>How it works</SectionLabel>
            <SectionHeading>From zero to AI chatbot in three steps</SectionHeading>
          </div>

          {/* Steps */}
          <div style={{ position: "relative" }}>
            {/* Connector line */}
            <div className="steps-divider" style={{ position: "absolute", top: 44, left: "calc(16.5% + 16px)", right: "calc(16.5% + 16px)", height: 1, borderTop: `1px dashed ${BORDER2}`, zIndex: 0 }} />

            <div className="steps-grid" style={{ display: "flex", gap: 12, position: "relative" }}>
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className="reveal step-card"
                  style={{
                    ...revealStyle,
                    transitionDelay: `${i * 0.1}s`,
                    flex: 1,
                    background: "#080808",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 12,
                    padding: "24px 22px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Big background number */}
                  <div style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 80, fontWeight: 800,
                    color: "#141414",
                    position: "absolute", top: -6, left: -2,
                    lineHeight: 1, letterSpacing: "-0.04em",
                    pointerEvents: "none", userSelect: "none",
                  }}>
                    {step.num}
                  </div>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{
                      width: 40, height: 40, background: BG,
                      border: `1px solid ${BORDER2}`, borderRadius: 10,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: 16, color: V,
                    }}>
                      {step.icon}
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: TEXT, marginBottom: 9 }}>{step.title}</h3>
                    <p style={{ fontSize: 13.5, color: MUTED, lineHeight: 1.65, marginBottom: 14 }}>{step.body}</p>
                    <div style={{
                      background: BG, border: `1px solid ${BORDER}`,
                      borderRadius: 5, padding: "4px 10px", display: "inline-block",
                    }}>
                      <span style={{ color: DIM, fontSize: 11, fontFamily: "monospace" }}>{step.tag}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code block */}
          <div className="reveal" style={{ ...revealStyle, maxWidth: 560, margin: "48px auto 0" }}>
            <div style={{ background: "#080808", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 24px" }}>
              {/* Top bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                  ))}
                </div>
                <span style={{ color: DIM, fontSize: 11, fontFamily: "monospace" }}>index.html</span>
                <button
                  onClick={copyCode}
                  className="copy-btn-inner"
                  style={{
                    background: "transparent",
                    border: `1px solid ${BORDER}`,
                    color: copied ? "#86EFAC" : MUTED,
                    borderColor: copied ? "#86EFAC44" : BORDER,
                    fontSize: 11, padding: "4px 10px", borderRadius: 5,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {copied ? <IconCopied /> : <IconCopy />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              {/* Syntax-highlighted code */}
              <div style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: 13, lineHeight: 1.8 }}>
                <span style={{ color: MUTED }}>{`<!-- Add Nocta to your website — that's it -->`}</span>
                {"\n"}<span style={{ color: TEXT }}>{"<script"}</span>
                {"\n  "}<span style={{ color: V }}>src</span><span style={{ color: TEXT }}>=</span><span style={{ color: "#86EFAC" }}>{'"https://cdn.nocta.app/widget.js"'}</span>
                {"\n  "}<span style={{ color: V }}>data-tenant-id</span><span style={{ color: TEXT }}>=</span><span style={{ color: "#86EFAC" }}>{'"your-tenant-id"'}</span>
                {"\n  "}<span style={{ color: V }}>data-theme</span><span style={{ color: TEXT }}>=</span><span style={{ color: "#86EFAC" }}>{'"dark"'}</span>
                {"\n  "}<span style={{ color: V }}>defer</span>
                {"\n"}<span style={{ color: TEXT }}>{"></script>"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tech Stack marquee ── */}
      <div style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "32px 0", overflow: "hidden" }}>
        <p style={{ textAlign: "center", color: "#222", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 22 }}>
          Built on technology you can trust
        </p>
        <div className="marquee-track">
          {[...TECH, ...TECH, ...TECH, ...TECH].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, padding: "0 24px", flexShrink: 0 }}>
              <span style={{ fontSize: 17, fontWeight: 600, color: "#282828", fontFamily: "'Syne', sans-serif", whiteSpace: "nowrap" }}>{t}</span>
              <span style={{ color: "#1A1A1A", fontSize: 22 }}>·</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ background: BG, padding: "96px 0" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 28px" }}>
          <div className="reveal" style={{ ...revealStyle, textAlign: "center", marginBottom: 60 }}>
            <SectionLabel>Pricing</SectionLabel>
            <SectionHeading>Start free. Scale as you grow.</SectionHeading>
            <p style={{ color: MUTED, fontSize: 16 }}>No credit card required to start. Upgrade when you're ready.</p>
          </div>

          <div className="price-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
            {PLANS.map((plan, i) => (
              <div
                key={i}
                className="reveal plan-card-hover"
                style={{
                  ...revealStyle,
                  transitionDelay: `${i * 0.1}s`,
                  background: plan.highlight ? "#0A0A13" : "#080808",
                  border: `1px solid ${plan.highlight ? V : BORDER}`,
                  borderRadius: 14,
                  padding: "28px 24px",
                  position: "relative",
                  transform: hoveredPlan === i ? "translateY(-3px)" : "translateY(0)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={() => setHoveredPlan(i)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {plan.badge && (
                  <div style={{
                    position: "absolute", top: -1, right: 18,
                    background: V, color: "#fff",
                    fontSize: 10, fontWeight: 700, padding: "4px 9px",
                    borderRadius: "0 0 6px 6px", letterSpacing: "0.04em",
                  }}>
                    {plan.badge}
                  </div>
                )}

                <p style={{ fontSize: 11, fontWeight: 600, color: DIM, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                  {plan.name}
                </p>

                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "2.8rem", fontWeight: 800, color: TEXT, lineHeight: 1, letterSpacing: "-0.03em" }}>
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && <span style={{ color: MUTED, fontSize: 13 }}>/month</span>}
                  {plan.strikethrough && <span style={{ color: "#282828", fontSize: 13, textDecoration: "line-through", marginLeft: 8 }}>{plan.strikethrough}</span>}
                </div>

                <p style={{ color: MUTED, fontSize: 13, marginBottom: 22 }}>{plan.sub}</p>
                <hr style={{ border: "none", borderTop: `1px solid ${BORDER}`, marginBottom: 22 }} />

                <ul style={{ listStyle: "none", marginBottom: 24, display: "flex", flexDirection: "column", gap: 9 }}>
                  {plan.features.map((feat, j) => (
                    <li key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13.5, color: "#B0B0B8" }}>
                      <span style={{ flexShrink: 0, marginTop: 1 }}><IconCheck /></span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  style={{
                    display: "block", textAlign: "center",
                    padding: "11px 16px", borderRadius: 7,
                    fontSize: 13.5, fontWeight: 600, textDecoration: "none",
                    background: plan.highlight ? V : "transparent",
                    color: plan.highlight ? "#fff" : MUTED,
                    border: plan.highlight ? "none" : `1px solid ${BORDER2}`,
                    transition: "all 0.15s",
                    boxShadow: plan.highlight ? `0 0 0 1px rgba(124,58,237,0.4)` : "none",
                  }}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="reveal" style={{ ...revealStyle, textAlign: "center", color: "#282828", fontSize: 13, marginTop: 24 }}>
            All plans include: SSL encryption · GDPR compliant data handling · 99.5% uptime · MongoDB Atlas storage
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ background: BG, padding: "96px 0", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 28px" }}>
          <div className="reveal" style={{ ...revealStyle, textAlign: "center", marginBottom: 56 }}>
            <SectionLabel>FAQ</SectionLabel>
            <SectionHeading>Questions? We have answers.</SectionHeading>
          </div>

          <div className="reveal" style={{ ...revealStyle, maxWidth: 720, margin: "0 auto" }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={openFaq === i ? "faq-item-open" : ""}
                style={{
                  borderBottom: `1px solid ${BORDER}`,
                  borderLeft: `2px solid ${openFaq === i ? V : "transparent"}`,
                  paddingLeft: openFaq === i ? 16 : 0,
                  transition: "border-color 0.2s, padding 0.2s",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%", background: "none", border: "none", color: TEXT,
                    fontSize: 15, fontWeight: 500, textAlign: "left",
                    padding: "20px 0", display: "flex", justifyContent: "space-between",
                    alignItems: "center", cursor: "pointer", gap: 14,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <span>{faq.q}</span>
                  <IconChevron open={openFaq === i} />
                </button>
                {openFaq === i && (
                  <p style={{ fontSize: 14.5, color: MUTED, lineHeight: 1.7, paddingBottom: 20 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{
        background: SURFACE, borderTop: `1px solid ${BORDER}`,
        borderBottom: `1px solid ${BORDER}`, padding: "128px 28px",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700, height: 500,
          background: "radial-gradient(ellipse at center, rgba(124,58,237,0.06) 0%, transparent 68%)",
          pointerEvents: "none",
        }} />
        <div className="reveal" style={{ ...revealStyle, position: "relative", maxWidth: 600, margin: "0 auto" }}>
          <SectionLabel>Get started today</SectionLabel>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
            fontWeight: 800, letterSpacing: "-0.035em",
            color: TEXT, maxWidth: 580, margin: "12px auto 18px", lineHeight: 1.1,
          }}>
            Your AI chatbot is one script tag away.
          </h2>
          <p style={{ color: MUTED, fontSize: 18, maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.65 }}>
            Join developers and businesses using Nocta to give their products an intelligent voice. Free forever, no credit card required.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" className="cta-primary-btn" style={{ textDecoration: "none" }}>
              Start Building Free
            </Link>
            <a
              href="https://github.com/Shre202002/Nocta"
              target="_blank"
              rel="noreferrer"
              className="cta-ghost-btn"
            >
              <IconGithub /> View on GitHub
            </a>
          </div>
          <p style={{ color: "#282828", fontSize: 12, marginTop: 22, letterSpacing: "0.06em" }}>
            Free · No credit card · Live in 2 minutes
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: BG, borderTop: `1px solid ${BORDER}`, padding: "64px 28px 32px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
                <div style={{ width: 26, height: 26, background: SURFACE, border: `1.5px solid ${V}`, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: V, fontSize: 12, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>N</span>
                </div>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 800, color: TEXT }}>NOCTA</span>
              </div>
              <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.6, maxWidth: 220, marginBottom: 14 }}>
                AI chatbots trained on your data. Not the internet.
              </p>
              <a href="https://nocta-6pfc.vercel.app" className="footer-link" style={{ fontSize: 12 }}>
                nocta-6pfc.vercel.app
              </a>
              <p style={{ color: "#282828", fontSize: 12, marginTop: 14 }}>© 2026 Nocta. Built by Sriyansh Gupta.</p>
            </div>

            {/* Cols */}
            {[
              { head: "Product", links: ["Features", "How it Works", "Pricing", "Changelog", "Roadmap"] },
              { head: "Developers", links: ["Documentation", "API Reference", "Embed Guide", "GitHub", "Status Page"] },
              { head: "Company", links: ["About", "Blog", "Contact", "Privacy Policy", "Terms of Service"] },
            ].map(({ head, links }) => (
              <div key={head}>
                <p style={{ color: "#282828", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>{head}</p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {links.map((l) => (
                    <li key={l}><a href="#" className="footer-link">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <span style={{ color: "#282828", fontSize: 12 }}>Made with LLaMA 3.3 · Groq · Qdrant</span>
            <a href="https://nocta-6pfc.vercel.app" className="footer-link" style={{ fontSize: 12 }}>nocta-6pfc.vercel.app</a>
          </div>
        </div>
      </footer>
    </div>
  );
}