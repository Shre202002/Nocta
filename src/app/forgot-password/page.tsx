"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!email) return setError("Please enter your email.");
    setLoading(true); setError("");
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (res.ok) setSent(true);
    else setError("Something went wrong. Please try again.");
  }

  return (
    <div style={{ minHeight:"100vh", background:"#000", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Inter', sans-serif", padding:"24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
        .input-field { width:100%; background:#0D0D0D; border:1px solid #2A2A2A; border-radius:6px; padding:12px 14px; color:#FAFAFA; font-size:14px; outline:none; transition:border-color 0.2s,box-shadow 0.2s; font-family:'Inter',sans-serif; }
        .input-field:focus { border-color:#7C3AED; box-shadow:0 0 0 3px #7C3AED20; }
        .input-field::placeholder { color:#3F3F46; }
        .btn-primary { width:100%; background:#7C3AED; color:#fff; border:none; border-radius:6px; padding:12px; font-size:14px; font-weight:600; cursor:pointer; transition:background 0.15s; font-family:'Inter',sans-serif; }
        .btn-primary:hover:not(:disabled) { background:#6D28D9; }
        .btn-primary:disabled { opacity:0.5; cursor:not-allowed; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.6s ease both; }
      `}</style>

      <div className="fade-up" style={{ width:"100%", maxWidth:420 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:40 }}>
          <div style={{ width:28, height:28, background:"#0D0D0D", border:"1px solid #7C3AED", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span className="syne" style={{ color:"#7C3AED", fontSize:14, fontWeight:800 }}>N</span>
          </div>
          <span className="syne" style={{ fontSize:18, fontWeight:700, color:"#FAFAFA" }}>NOCTA</span>
        </div>

        {!sent ? (
          <>
            <h1 className="syne" style={{ fontSize:28, fontWeight:800, letterSpacing:"-0.02em", marginBottom:8, color:"#FAFAFA" }}>
              Reset your password
            </h1>
            <p style={{ color:"#71717A", fontSize:14, marginBottom:32, lineHeight:1.6 }}>
              Enter your email and we'll send you a reset link. Valid for 1 hour.
            </p>

            {error && (
              <div style={{ background:"#1a0a0a", border:"1px solid #7f1d1d", borderRadius:6, padding:"10px 14px", marginBottom:16 }}>
                <p style={{ color:"#fca5a5", fontSize:13 }}>{error}</p>
              </div>
            )}

            <div style={{ marginBottom:16 }}>
              <label style={{ color:"#71717A", fontSize:12, fontWeight:500, display:"block", marginBottom:6, letterSpacing:"0.03em" }}>EMAIL</label>
              <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
            </div>

            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Sending..." : "Send reset link →"}
            </button>

            <p style={{ textAlign:"center", marginTop:24 }}>
              <Link href="/login" style={{ color:"#71717A", fontSize:13, textDecoration:"none" }}>← Back to sign in</Link>
            </p>
          </>
        ) : (
          <div style={{ textAlign:"center" }}>
            <div style={{ width:48, height:48, background:"#0D0D0D", border:"1px solid #7C3AED", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", fontSize:22 }}>✓</div>
            <h1 className="syne" style={{ fontSize:24, fontWeight:800, marginBottom:12, color:"#FAFAFA" }}>Check your email</h1>
            <p style={{ color:"#71717A", fontSize:14, lineHeight:1.65, marginBottom:32 }}>
              We sent a reset link to <strong style={{ color:"#FAFAFA" }}>{email}</strong>. It expires in 1 hour.
            </p>
            <Link href="/login" style={{ color:"#7C3AED", fontSize:14, textDecoration:"none", fontWeight:500 }}>← Back to sign in</Link>
          </div>
        )}
      </div>
    </div>
  );
}