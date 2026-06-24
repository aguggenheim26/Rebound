"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Message, Profile } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface ChatRoomProps {
  matchId: string;
  userId: string;
  otherProfile: Profile | null;
  initialMessages: Message[];
}

export default function ChatRoom({ matchId, userId, otherProfile, initialMessages }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${matchId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `match_id=eq.${matchId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [matchId, supabase]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    const content = text.trim();
    setText("");

    await supabase.from("messages").insert({
      match_id: matchId,
      sender_id: userId,
      content,
    });

    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-cream">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-white border-b shadow-warm-sm" style={{ borderColor: "#EDD9C8" }}>
        <Link href="/chat" className="p-2 rounded-full hover:bg-[#FAF4EC] transition-all">
          <ArrowLeft size={20} className="text-[#7A5C48]" />
        </Link>
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          {otherProfile?.photos?.[0] ? (
            <Image src={otherProfile.photos[0]} alt={otherProfile.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl" style={{ background: "var(--gradient-soft)" }}>🌸</div>
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-[#2D1B0E] text-base">{otherProfile?.name ?? "Match"}</p>
          <p className="text-xs text-[#B08C78]">Matched recently</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl mb-3">💌</div>
            <p className="text-[#7A5C48] text-sm">
              You matched with {otherProfile?.name ?? "someone"}!<br />
              Say something kind to break the ice.
            </p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMine = msg.sender_id === userId;
          const showTime = i === messages.length - 1 || messages[i + 1]?.sender_id !== msg.sender_id;

          return (
            <div key={msg.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
              <div className="max-w-[75%]">
                <div
                  className={cn(
                    "px-4 py-2.5 text-sm leading-relaxed",
                    isMine ? "message-bubble-sent" : "message-bubble-received"
                  )}
                >
                  {msg.content}
                </div>
                {showTime && (
                  <p className={cn("text-xs text-[#B08C78] mt-1", isMine ? "text-right" : "text-left")}>
                    {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t" style={{ borderColor: "#EDD9C8" }}>
        <div className="flex items-end gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Say something warm…"
            rows={1}
            className="flex-1 px-4 py-3 rounded-2xl border bg-[#FAF4EC] text-[#2D1B0E] placeholder-[#B08C78] resize-none focus:outline-none focus:ring-2 focus:ring-[#FF7B7B]/30 text-sm"
            style={{ borderColor: "#EDD9C8", maxHeight: "120px" }}
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim() || sending}
            className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-warm-sm hover:shadow-warm-md hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:translate-y-0"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Send size={18} className="text-white ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
