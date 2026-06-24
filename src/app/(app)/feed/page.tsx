import { createClient } from "@/lib/supabase/server";
import SwipeDeck from "@/components/feed/SwipeDeck";

export default async function FeedPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch profiles to show (exclude self and already-liked)
  const { data: likedIds } = await supabase
    .from("likes")
    .select("liked_id")
    .eq("liker_id", user!.id);

  const excludeIds = [user!.id, ...(likedIds?.map((l) => l.liked_id) ?? [])];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_onboarded", true)
    .not("user_id", "in", `(${excludeIds.join(",")})`)
    .limit(20);

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur-sm border-b px-5 py-4 flex items-center justify-between" style={{ borderColor: "#EDD9C8" }}>
        <span className="font-display text-2xl text-[#2D1B0E]">rebound</span>
        <div className="flex items-center gap-1 text-sm text-[#B08C78]">
          <span>✨</span>
          <span>{profiles?.length ?? 0} near you</span>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-6">
        <SwipeDeck profiles={profiles ?? []} userId={user!.id} />
      </div>
    </div>
  );
}
