import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ChatRoom from "@/components/chat/ChatRoom";

export default async function ChatRoomPage({ params }: { params: { matchId: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: match } = await supabase
    .from("matches")
    .select("*")
    .eq("id", params.matchId)
    .or(`user1_id.eq.${user!.id},user2_id.eq.${user!.id}`)
    .single();

  if (!match) notFound();

  const otherId = match.user1_id === user!.id ? match.user2_id : match.user1_id;
  const { data: otherProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", otherId)
    .single();

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("match_id", params.matchId)
    .order("created_at", { ascending: true });

  return (
    <ChatRoom
      matchId={params.matchId}
      userId={user!.id}
      otherProfile={otherProfile}
      initialMessages={messages ?? []}
    />
  );
}
