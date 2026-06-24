"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back! 🌸");
      router.push("/feed");
      router.refresh();
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: "#FFCECE" }} />
      <div className="fixed bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: "#FFDABB" }} />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-display text-3xl text-[#2D1B0E]">rebound</span>
            <span className="inline-block w-2 h-2 rounded-full ml-1 mb-3" style={{ background: "var(--gradient-brand)" }} />
          </Link>
          <p className="text-[#7A5C48] mt-2">Welcome back 🌸</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border p-8 shadow-card" style={{ borderColor: "#EDD9C8" }}>
          <h1 className="font-display text-2xl font-bold text-[#2D1B0E] mb-6">Sign in</h1>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border font-medium text-[#2D1B0E] hover:bg-[#FAF4EC] transition-all mb-6"
            style={{ borderColor: "#EDD9C8" }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: "#EDD9C8" }} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-[#B08C78]">or</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#7A5C48] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-2xl border bg-[#FAF4EC] text-[#2D1B0E] placeholder-[#B08C78] focus:outline-none focus:ring-2 focus:ring-[#FF7B7B]/30 transition-all"
                style={{ borderColor: "#EDD9C8" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#7A5C48] mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-2xl border bg-[#FAF4EC] text-[#2D1B0E] placeholder-[#B08C78] focus:outline-none focus:ring-2 focus:ring-[#FF7B7B]/30 transition-all"
                style={{ borderColor: "#EDD9C8" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl text-white font-semibold text-base shadow-warm-sm hover:shadow-warm-md hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0"
              style={{ background: "var(--gradient-brand)" }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-[#B08C78] mt-6">
            New here?{" "}
            <Link href="/auth/signup" className="text-[#F95F5F] font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
