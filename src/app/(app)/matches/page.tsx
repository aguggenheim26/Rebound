import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";

export default async function MatchesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: matches } = await supabase
    .from("matches")
    .select(`
      id,
      created_at,
      user1_id,
      user2_id
    `)
    .or(`user1_id.eq.${user!.id},user2_id.eq.${user!.id}`)
    .order("created_at", { ascending: false });

  // Fetch the other user's profile for each match
  const matchesWithProfiles = await Promise.all(
    (matches ?? []).map(async (match) => {
      const otherId = match.user1_id === user!.id ? match.user2_id : match.user1_id;
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", otherId)
        .single();
      return { ...match, profile };
    })
  );

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur-sm border-b px-5 py-4" style={{ borderColor: "#EDD9C8" }}>
        <h1 className="font-display text-2xl text-[#2D1B0E]">Your Matches</h1>
        <p className="text-[#B08C78] text-sm mt-0.5">
          {matchesWithProfiles.length} {matchesWithProfiles.length === 1 ? "person" : "people"} who liked you back
        </p>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {matchesWithProfiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-6 animate-float">💛</div>
            <h2 className="font-display text-2xl font-bold text-[#2D1B0E] mb-3">No matches yet</h2>
            <p className="text-[#7A5C48] max-w-xs mb-6">
              Keep exploring — your people are out there. Every swipe is a step forward.
            </p>
            <Link
              href="/feed"
              className="px-6 py-3 rounded-2xl text-white font-semibold shadow-warm-sm hover:-translate-y-0.5 transition-all"
              style={{ background: "var(--gradient-brand)" }}
            >
              Keep discovering
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {matchesWithProfiles.map((match) => (
              <Link
                key={match.id}
                href={`/chat/${match.id}`}
                className="relative rounded-3xl overflow-hidden aspect-[3/4] bg-white shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all"
              >
                {match.profile?.photos?.[0] ? (
                  <Image
                    src={match.profile.photos[0]}
                    alt={match.profile.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-5xl" style={{ background: "var(--gradient-soft)" }}>
                    🌸
                  </div>
                )}
                <div className="absolute inset-0" style={{ background: "var(--gradient-card)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="font-semibold text-base">{match.profile?.name}</p>
                  <p className="text-white/70 text-xs">Tap to say hi 👋</p>
                </div>

                {/* Match badge */}
                <div
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-warm-sm"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  💘
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
