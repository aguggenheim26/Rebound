import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-cream/80 backdrop-blur-md border-b border-[#EDD9C8]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display text-2xl text-[#2D1B0E]">
            rebound
            <span
              className="inline-block w-2 h-2 rounded-full ml-1 mb-3"
              style={{ background: "var(--gradient-brand)" }}
            />
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-[#7A5C48] hover:text-[#2D1B0E]"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm font-semibold px-5 py-2.5 rounded-full text-white"
              style={{ background: "var(--gradient-brand)" }}
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        {/* Soft decorative blobs */}
        <div
          className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: "#FFCECE" }}
        />
        <div
          className="absolute top-40 right-10 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: "#FFDABB" }}
        />

        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
          style={{ background: "#FFE8E8", color: "#E63E3E" }}
        >
          <span>✨</span>
          <span>A fresh start, when you&apos;re ready</span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight text-[#2D1B0E] mb-6">
          Your next chapter
          <br />
          <span
            style={{
              background: "var(--gradient-brand)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            starts here.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-[#7A5C48] max-w-2xl mx-auto leading-relaxed mb-10">
          Rebound is a warm, judgment-free space to meet people who truly get
          the fresh-start feeling. No pressure. Just genuine connection, when
          you&apos;re ready.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/signup"
            className="px-8 py-4 rounded-full text-white font-semibold text-lg shadow-warm-lg hover:shadow-warm-md hover:-translate-y-0.5 transition-all"
            style={{ background: "var(--gradient-brand)" }}
          >
            Start your story
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-4 rounded-full font-semibold text-lg border-2 text-[#7A5C48] hover:bg-[#FAF4EC] transition-all"
            style={{ borderColor: "#EDD9C8" }}
          >
            I have an account
          </Link>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex items-center justify-center gap-2 text-[#B08C78] text-sm">
          <div className="flex -space-x-2">
            {["🌸", "🌻", "🌺", "🌷", "🌼"].map((emoji, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full flex items-center justify-center text-base border-2 border-white"
                style={{ background: "#FAF4EC" }}
              >
                {emoji}
              </div>
            ))}
          </div>
          <span>Join 12,000+ people finding their way forward</span>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#2D1B0E] mb-4">
              Built with your healing in mind
            </h2>
            <p className="text-[#7A5C48] text-lg">
              Everything here is designed to feel gentle, honest, and real.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-8 rounded-3xl border hover:shadow-card-hover transition-all hover:-translate-y-1"
                style={{ background: "#FFFFFF", borderColor: "#EDD9C8" }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
                  style={{ background: "var(--gradient-soft)" }}
                >
                  {f.icon}
                </div>
                <h3 className="font-display text-xl font-semibold text-[#2D1B0E] mb-2">
                  {f.title}
                </h3>
                <p className="text-[#7A5C48] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6" style={{ background: "#FAF4EC" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#2D1B0E] mb-4">
            Three steps to a new beginning
          </h2>
          <p className="text-[#7A5C48] mb-14 text-lg">
            Simple, gentle, and completely on your terms.
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-5 shadow-warm-sm"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  {s.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-[#2D1B0E] mb-2">
                  {s.title}
                </h3>
                <p className="text-[#7A5C48] text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-5xl mb-6">🌸</div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#2D1B0E] mb-5">
            Ready when you are.
          </h2>
          <p className="text-[#7A5C48] text-lg mb-10">
            There&apos;s no timeline. No pressure. Just people who understand,
            and a space to explore what comes next.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-10 py-4 rounded-full text-white font-semibold text-lg shadow-warm-lg hover:-translate-y-0.5 transition-all"
            style={{ background: "var(--gradient-brand)" }}
          >
            Join Rebound — it&apos;s free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6 text-center" style={{ borderColor: "#EDD9C8" }}>
        <p className="text-[#B08C78] text-sm">
          © 2024 Rebound · Made with care for every fresh start
        </p>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: "💛",
    title: "No judgment, ever",
    desc: "Share as much or as little as you want. Rebound is a safe, pressure-free space where everyone gets it.",
  },
  {
    icon: "🌱",
    title: "Grow at your own pace",
    desc: "Take things slow or dive right in. Your profile, your rules, your timeline.",
  },
  {
    icon: "✨",
    title: "Real people, real stories",
    desc: "Connect with verified profiles and have genuine conversations about what really matters.",
  },
];

const steps = [
  {
    icon: "📝",
    title: "Create your profile",
    desc: "Share your story in your own words. Photos, interests, and what you're hoping for.",
  },
  {
    icon: "💫",
    title: "Discover matches",
    desc: "Browse people who share your vibe and your stage of life. Swipe when it feels right.",
  },
  {
    icon: "💬",
    title: "Start a conversation",
    desc: "Break the ice with something real. No pick-up lines needed — just be yourself.",
  },
];
