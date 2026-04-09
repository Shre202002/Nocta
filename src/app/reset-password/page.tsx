"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  async function handleSubmit() {
    if (!password || !confirm) return setError("Please fill in all fields.");
    if (password !== confirm) return setError("Passwords do not match.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (!token) return setError("Invalid reset link.");
    setLoading(true); setError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    setSuccess(true);
    setTimeout(() => router.push("/login"), 3000);
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

        {!success ? (
          <>
            <h1 className="syne" style={{ fontSize:28, fontWeight:800, letterSpacing:"-0.02em", marginBottom:8, color:"#FAFAFA" }}>
              Set new password
            </h1>
            <p style={{ color:"#71717A", fontSize:14, marginBottom:32 }}>Must be at least 8 characters.</p>

            {error && (
              <div style={{ background:"#1a0a0a", border:"1px solid #7f1d1d", borderRadius:6, padding:"10px 14px", marginBottom:16 }}>
                <p style={{ color:"#fca5a5", fontSize:13 }}>{error}</p>
              </div>
            )}

            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:16 }}>
              <div>
                <label style={{ color:"#71717A", fontSize:12, fontWeight:500, display:"block", marginBottom:6, letterSpacing:"0.03em" }}>NEW PASSWORD</label>
                <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <div>
                <label style={{ color:"#71717A", fontSize:12, fontWeight:500, display:"block", marginBottom:6, letterSpacing:"0.03em" }}>CONFIRM PASSWORD</label>
                <input type="password" className="input-field" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
              </div>
            </div>

            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Resetting..." : "Reset password →"}
            </button>
          </>
        ) : (
          <div style={{ textAlign:"center" }}>
            <div style={{ width:48, height:48, background:"#0D0D0D", border:"1px solid #22c55e", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", fontSize:22, color:"#22c55e" }}>✓</div>
            <h1 className="syne" style={{ fontSize:24, fontWeight:800, marginBottom:12, color:"#FAFAFA" }}>Password reset!</h1>
            <p style={{ color:"#71717A", fontSize:14, lineHeight:1.65, marginBottom:8 }}>Your password has been updated successfully.</p>
            <p style={{ color:"#3F3F46", fontSize:13 }}>Redirecting to sign in...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return <Suspense><ResetForm /></Suspense>;
}