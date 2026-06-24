import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

export default async function ChatListPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: matches } = await supabase
    .from("matches")
    .select("id, created_at, user1_id, user2_id")
    .or(`user1_id.eq.${user!.id},user2_id.eq.${user!.id}`)
    .order("created_at", { ascending: false });

  const chats = await Promise.all(
    (matches ?? []).map(async (match) => {
      const otherId = match.user1_id === user!.id ? match.user2_id : match.user1_id;
      const [{ data: profile }, { data: lastMessage }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", otherId).single(),
        supabase
          .from("messages")
          .select("content, created_at, sender_id")
          .eq("match_id", match.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single(),
      ]);
      return { ...match, profile, lastMessage };
    })
  );

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur-sm border-b px-5 py-4" style={{ borderColor: "#EDD9C8" }}>
        <h1 className="font-display text-2xl text-[#2D1B0E]">Messages</h1>
      </header>

      <div className="max-w-lg mx-auto">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-6">
            <div className="text-6xl mb-6 animate-float">💬</div>
            <h2 className="font-display text-2xl font-bold text-[#2D1B0E] mb-3">No messages yet</h2>
            <p className="text-[#7A5C48] max-w-xs">
              Once you match with someone, you can start a conversation here.
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "#EDD9C8" }}>
            {chats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-white/60 transition-all"
              >
                {/* Avatar */}
                <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                  {chat.profile?.photos?.[0] ? (
                    <Image src={chat.profile.photos[0]} alt={chat.profile?.name ?? ""} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl" style={{ background: "var(--gradient-soft)" }}>
                      🌸
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-[#2D1B0E] truncate">{chat.profile?.name}</p>
                    {chat.lastMessage && (
                      <span className="text-xs text-[#B08C78] flex-shrink-0 ml-2">
                        {formatDistanceToNow(new Date(chat.lastMessage.created_at), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#B08C78] truncate mt-0.5">
                    {chat.lastMessage
                      ? `${chat.lastMessage.sender_id === user!.id ? "You: " : ""}${chat.lastMessage.content}`
                      : "Say hello! 👋"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
