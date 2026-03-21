"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    setLoading(true); setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl">🤖</span>
          <h1 className="text-2xl font-bold text-white mt-3">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Login to your account</p>
        </div>
        <div className="space-y-3">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-[#1a1a2e] border border-[#2a2a4a] text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            className="w-full bg-[#1a1a2e] border border-[#2a2a4a] text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600" />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl text-sm transition">
            {loading ? "Logging in..." : "Login →"}
          </button>
        </div>
        <p className="text-center text-gray-600 text-sm mt-4">
          No account? <Link href="/register" className="text-blue-400 hover:underline">Sign up free</Link>
        </p>
      </div>
    </main>
  );
}