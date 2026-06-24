"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { Heart, X, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types";
import toast from "react-hot-toast";

interface SwipeDeckProps {
  profiles: Profile[];
  userId: string;
}

export default function SwipeDeck({ profiles: initialProfiles, userId }: SwipeDeckProps) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const supabase = createClient();

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, -20], [1, 0]);

  const currentProfile = profiles[current];

  const handleSwipe = async (action: "like" | "pass") => {
    if (!currentProfile) return;
    setDirection(action === "like" ? "right" : "left");

    if (action === "like") {
      // Insert like
      const { error } = await supabase.from("likes").insert({
        liker_id: userId,
        liked_id: currentProfile.user_id,
      });
      if (!error) {
        // Check for mutual match
        const { data: mutual } = await supabase
          .from("likes")
          .select("id")
          .eq("liker_id", currentProfile.user_id)
          .eq("liked_id", userId)
          .single();

        if (mutual) {
          // Create match
          await supabase.from("matches").insert({
            user1_id: userId,
            user2_id: currentProfile.user_id,
          });
          toast("It's a match! 🎉", {
            icon: "💘",
            style: {
              background: "var(--gradient-brand)",
              color: "white",
              border: "none",
            },
          });
        }
      }
    }

    setTimeout(() => {
      setCurrent((c) => c + 1);
      setDirection(null);
      x.set(0);
    }, 300);
  };

  if (!currentProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="text-6xl mb-6 animate-float">🌸</div>
        <h2 className="font-display text-2xl font-bold text-[#2D1B0E] mb-3">
          You&apos;ve seen everyone!
        </h2>
        <p className="text-[#7A5C48] max-w-xs">
          Check back soon — new people are joining every day. Your match might be on their way.
        </p>
      </div>
    );
  }

  return (
    <div className="relative select-none">
      {/* Stack of cards behind */}
      {profiles[current + 1] && (
        <div
          className="absolute inset-0 rounded-4xl overflow-hidden bg-white shadow-card scale-95 translate-y-4"
          style={{ zIndex: 0 }}
        />
      )}
      {profiles[current + 2] && (
        <div
          className="absolute inset-0 rounded-4xl overflow-hidden bg-white shadow-card scale-90 translate-y-8"
          style={{ zIndex: -1 }}
        />
      )}

      {/* Current card */}
      <AnimatePresence>
        <motion.div
          key={currentProfile.id}
          style={{ x, rotate, zIndex: 10 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={(_, info) => {
            if (info.offset.x > 120) handleSwipe("like");
            else if (info.offset.x < -120) handleSwipe("pass");
            else x.set(0);
          }}
          animate={
            direction === "right"
              ? { x: 500, opacity: 0 }
              : direction === "left"
              ? { x: -500, opacity: 0 }
              : { x: 0, opacity: 1 }
          }
          transition={{ duration: 0.3 }}
          className="relative rounded-4xl overflow-hidden shadow-card-hover cursor-grab active:cursor-grabbing"
          style={{ height: "68vh", minHeight: "480px" }}
        >
          {/* Photo */}
          {currentProfile.photos?.[0] ? (
            <Image
              src={currentProfile.photos[0]}
              alt={currentProfile.name}
              fill
              className="object-cover pointer-events-none"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center text-8xl"
              style={{ background: "var(--gradient-soft)" }}
            >
              🌸
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0" style={{ background: "var(--gradient-card)" }} />

          {/* Like / Pass indicators */}
          <motion.div
            className="absolute top-8 left-8 px-4 py-2 rounded-2xl border-4 border-green-400 text-green-400 font-display text-2xl font-bold rotate-[-12deg]"
            style={{ opacity: likeOpacity }}
          >
            LIKE 💚
          </motion.div>
          <motion.div
            className="absolute top-8 right-8 px-4 py-2 rounded-2xl border-4 border-red-400 text-red-400 font-display text-2xl font-bold rotate-[12deg]"
            style={{ opacity: passOpacity }}
          >
            NOPE ✗
          </motion.div>

          {/* Profile info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-end justify-between mb-2">
              <div>
                <h2 className="font-display text-3xl font-bold leading-tight">
                  {currentProfile.name}, {currentProfile.age}
                </h2>
                {currentProfile.location && (
                  <p className="text-white/80 text-sm mt-1">📍 {currentProfile.location}</p>
                )}
              </div>
              {currentProfile.breakup_time && (
                <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white/90">
                  Single {currentProfile.breakup_time}
                </span>
              )}
            </div>
            {currentProfile.bio && (
              <p className="text-white/85 text-sm leading-relaxed line-clamp-2 mb-3">
                {currentProfile.bio}
              </p>
            )}
            {currentProfile.interests?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentProfile.interests.slice(0, 4).map((interest) => (
                  <span
                    key={interest}
                    className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-6 mt-6 pb-4">
        <button
          onClick={() => handleSwipe("pass")}
          className="w-14 h-14 rounded-full bg-white shadow-card flex items-center justify-center hover:shadow-card-hover hover:-translate-y-0.5 transition-all border"
          style={{ borderColor: "#EDD9C8" }}
        >
          <X size={24} className="text-[#B08C78]" />
        </button>

        <button
          onClick={() => handleSwipe("like")}
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-warm-lg hover:shadow-warm-md hover:-translate-y-1 transition-all"
          style={{ background: "var(--gradient-brand)" }}
        >
          <Heart size={26} className="text-white fill-white" />
        </button>

        <button
          className="w-14 h-14 rounded-full bg-white shadow-card flex items-center justify-center hover:shadow-card-hover hover:-translate-y-0.5 transition-all border"
          style={{ borderColor: "#EDD9C8" }}
        >
          <Star size={22} className="text-[#FF9E57]" />
        </button>
      </div>

      <p className="text-center text-xs text-[#B08C78] mt-2">
        Swipe right to like · left to pass
      </p>
    </div>
  );
}
