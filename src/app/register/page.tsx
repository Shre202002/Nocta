"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    if (!email || !password) return setError("Please fill in all fields.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    setLoading(true); setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    router.push("/dashboard");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500;600&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
        .input-field { width:100%; background:#0D0D0D; border:1px solid #2A2A2A; border-radius:6px; padding:12px 14px; color:#FAFAFA; font-size:14px; outline:none; transition:border-color 0.2s,box-shadow 0.2s; font-family:'Inter',sans-serif; }
        .input-field:focus { border-color:#7C3AED; box-shadow:0 0 0 3px #7C3AED20; }
        .input-field::placeholder { color:#3F3F46; }
        .btn-primary { width:100%; background:#7C3AED; color:#fff; border:none; border-radius:6px; padding:12px; font-size:14px; font-weight:600; cursor:pointer; transition:background 0.15s,box-shadow 0.15s; font-family:'Inter',sans-serif; }
        .btn-primary:hover:not(:disabled) { background:#6D28D9; box-shadow:0 0 0 1px #7C3AED80,0 0 20px #7C3AED30; }
        .btn-primary:disabled { opacity:0.5; cursor:not-allowed; }
        .btn-google { width:100%; background:#0D0D0D; color:#FAFAFA; border:1px solid #2A2A2A; border-radius:6px; padding:12px; font-size:14px; font-weight:500; cursor:pointer; transition:border-color 0.15s,background 0.15s; display:flex; align-items:center; justify-content:center; gap:10px; font-family:'Inter',sans-serif; text-decoration:none; }
        .btn-google:hover { border-color:#3F3F46; background:#111; }
        .divider { display:flex; align-items:center; gap:12px; margin:20px 0; }
        .divider::before,.divider::after { content:''; flex:1; height:1px; background:#1F1F1F; }
        .grid-bg { background-image:linear-gradient(#1F1F1F 1px,transparent 1px),linear-gradient(90deg,#1F1F1F 1px,transparent 1px); background-size:40px 40px; opacity:0.2; position:absolute; inset:0; pointer-events:none; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.6s ease both; }
      `}</style>

      {/* Left panel */}
      <div style={{ flex:1, background:"#0D0D0D", borderRight:"1px solid #1F1F1F", display:"flex", flexDirection:"column", justifyContent:"center", padding:"64px", position:"relative", overflow:"hidden" }}>
        <div className="grid-bg" />
        <div style={{ position:"absolute", top:"40%", left:"30%", width:400, height:400, background:"radial-gradient(circle, #7C3AED08 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"relative" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:48 }}>
            <div style={{ width:32, height:32, background:"#000", border:"1px solid #7C3AED", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span className="syne" style={{ color:"#7C3AED", fontSize:16, fontWeight:800 }}>N</span>
            </div>
            <span className="syne" style={{ fontSize:20, fontWeight:700, color:"#FAFAFA" }}>NOCTA</span>
          </div>
          <h2 className="syne" style={{ fontSize:"clamp(2rem,3vw,2.8rem)", fontWeight:800, color:"#FAFAFA", letterSpacing:"-0.03em", lineHeight:1.1, marginBottom:20 }}>
            Start for free.<br />
            <span style={{ color:"#7C3AED" }}>Scale as you grow.</span>
          </h2>
          <p style={{ color:"#71717A", fontSize:15, lineHeight:1.65, maxWidth:360, marginBottom:48 }}>
            No credit card required. Your first chatbot is live in under 2 minutes.
          </p>
          {[
            { val: "Free", label: "to start — no credit card" },
            { val: "< 2 min", label: "to go live" },
            { val: "LLaMA 3.3", label: "open source AI model" },
          ].map((s) => (
            <div key={s.val} style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:12 }}>
              <span className="syne" style={{ color:"#FAFAFA", fontWeight:700, fontSize:16 }}>{s.val}</span>
              <span style={{ color:"#71717A", fontSize:14 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width:"100%", maxWidth:480, display:"flex", flexDirection:"column", justifyContent:"center", padding:"48px 40px", margin:"0 auto" }}>
        <div className="fade-up">
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:40 }}>
            <div style={{ width:28, height:28, background:"#0D0D0D", border:"1px solid #7C3AED", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span className="syne" style={{ color:"#7C3AED", fontSize:14, fontWeight:800 }}>N</span>
            </div>
            <span className="syne" style={{ fontSize:18, fontWeight:700 }}>NOCTA</span>
          </div>

          <h1 className="syne" style={{ fontSize:28, fontWeight:800, letterSpacing:"-0.02em", marginBottom:8 }}>Create your account</h1>
          <p style={{ color:"#71717A", fontSize:14, marginBottom:32 }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color:"#7C3AED", textDecoration:"none", fontWeight:500 }}>Sign in →</Link>
          </p>

          <a href="/api/auth/google" className="btn-google">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </a>

          <div className="divider">
            <span style={{ color:"#3F3F46", fontSize:12 }}>or continue with email</span>
          </div>

          {error && (
            <div style={{ background:"#1a0a0a", border:"1px solid #7f1d1d", borderRadius:6, padding:"10px 14px", marginBottom:16 }}>
              <p style={{ color:"#fca5a5", fontSize:13 }}>{error}</p>
            </div>
          )}

          <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:16 }}>
            <div>
              <label style={{ color:"#71717A", fontSize:12, fontWeight:500, display:"block", marginBottom:6, letterSpacing:"0.03em" }}>EMAIL</label>
              <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
            </div>
            <div>
              <label style={{ color:"#71717A", fontSize:12, fontWeight:500, display:"block", marginBottom:6, letterSpacing:"0.03em" }}>PASSWORD</label>
              <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
            </div>
          </div>

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating account..." : "Create account →"}
          </button>

          <p style={{ color:"#3F3F46", fontSize:12, marginTop:24, textAlign:"center", lineHeight:1.6 }}>
            By signing up you agree to our{" "}
            <a href="#" style={{ color:"#71717A", textDecoration:"none" }}>Terms of Service</a>{" "}
            and{" "}
            <a href="#" style={{ color:"#71717A", textDecoration:"none" }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}