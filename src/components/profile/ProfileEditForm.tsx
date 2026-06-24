"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Camera, Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types";
import toast from "react-hot-toast";

const INTERESTS = ["hiking", "cooking", "travel", "music", "reading", "fitness", "movies", "art", "yoga", "gaming", "photography", "coffee", "wine", "dancing", "meditation", "dogs", "cats", "outdoors", "concerts", "baking"];

const BREAKUP_OPTIONS = ["just recently", "a few weeks ago", "1-3 months ago", "3-6 months ago", "6-12 months ago", "over a year ago"];

interface Props {
  profile: Profile | null;
  userId: string;
}

export default function ProfileEditForm({ profile, userId }: Props) {
  const [name, setName] = useState(profile?.name ?? "");
  const [age, setAge] = useState(profile?.age?.toString() ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [location, setLocation] = useState(profile?.location ?? "");
  const [breakupTime, setBreakupTime] = useState(profile?.breakup_time ?? "");
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? []);
  const [lookingFor, setLookingFor] = useState(profile?.looking_for ?? "");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest].slice(0, 8)
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      user_id: userId,
      name,
      age: parseInt(age),
      bio,
      location,
      breakup_time: breakupTime,
      interests,
      looking_for: lookingFor,
      is_onboarded: true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "user_id" });

    if (error) {
      toast.error("Couldn't save changes: " + error.message);
    } else {
      toast.success("Profile saved! ✨");
      router.push("/profile");
      router.refresh();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/profile" className="p-2 rounded-full hover:bg-white transition-all">
          <ArrowLeft size={20} className="text-[#7A5C48]" />
        </Link>
        <h1 className="font-display text-2xl text-[#2D1B0E]">Edit profile</h1>
      </div>

      {/* Photos placeholder */}
      <div className="bg-white rounded-3xl border p-5 shadow-card" style={{ borderColor: "#EDD9C8" }}>
        <h3 className="font-semibold text-[#2D1B0E] mb-3">Photos</h3>
        <div className="grid grid-cols-3 gap-3">
          <div
            className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:opacity-80 transition-all"
            style={{ background: "var(--gradient-soft)", border: "2px dashed #FFCECE" }}
          >
            <Camera size={20} className="text-[#FF7B7B]" />
            <span className="text-xs text-[#F95F5F] font-medium">Add photo</span>
          </div>
        </div>
        <p className="text-xs text-[#B08C78] mt-3">Add up to 6 photos. First photo is your main one.</p>
      </div>

      {/* Basics */}
      <div className="bg-white rounded-3xl border p-5 shadow-card space-y-4" style={{ borderColor: "#EDD9C8" }}>
        <h3 className="font-semibold text-[#2D1B0E]">About you</h3>

        <div>
          <label className="block text-sm font-medium text-[#7A5C48] mb-1.5">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-2xl border bg-[#FAF4EC] text-[#2D1B0E] placeholder-[#B08C78] focus:outline-none focus:ring-2 focus:ring-[#FF7B7B]/30"
            style={{ borderColor: "#EDD9C8" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#7A5C48] mb-1.5">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Your age"
            min={18}
            max={99}
            className="w-full px-4 py-3 rounded-2xl border bg-[#FAF4EC] text-[#2D1B0E] placeholder-[#B08C78] focus:outline-none focus:ring-2 focus:ring-[#FF7B7B]/30"
            style={{ borderColor: "#EDD9C8" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#7A5C48] mb-1.5">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. San Francisco, CA"
            className="w-full px-4 py-3 rounded-2xl border bg-[#FAF4EC] text-[#2D1B0E] placeholder-[#B08C78] focus:outline-none focus:ring-2 focus:ring-[#FF7B7B]/30"
            style={{ borderColor: "#EDD9C8" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#7A5C48] mb-1.5">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell people a little about yourself, what you enjoy, what you're looking for…"
            rows={4}
            maxLength={300}
            className="w-full px-4 py-3 rounded-2xl border bg-[#FAF4EC] text-[#2D1B0E] placeholder-[#B08C78] resize-none focus:outline-none focus:ring-2 focus:ring-[#FF7B7B]/30"
            style={{ borderColor: "#EDD9C8" }}
          />
          <p className="text-right text-xs text-[#B08C78] mt-1">{bio.length}/300</p>
        </div>
      </div>

      {/* Rebound-specific */}
      <div className="bg-white rounded-3xl border p-5 shadow-card space-y-4" style={{ borderColor: "#EDD9C8" }}>
        <h3 className="font-semibold text-[#2D1B0E]">Your story</h3>

        <div>
          <label className="block text-sm font-medium text-[#7A5C48] mb-2">I've been single for…</label>
          <div className="flex flex-wrap gap-2">
            {BREAKUP_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setBreakupTime(opt)}
                className="px-3 py-2 rounded-2xl text-sm font-medium transition-all"
                style={
                  breakupTime === opt
                    ? { background: "var(--gradient-brand)", color: "white" }
                    : { background: "#FAF4EC", color: "#7A5C48", border: "1px solid #EDD9C8" }
                }
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#7A5C48] mb-1.5">I&apos;m looking for</label>
          <input
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value)}
            placeholder="e.g. something real, casual friendship, who knows…"
            className="w-full px-4 py-3 rounded-2xl border bg-[#FAF4EC] text-[#2D1B0E] placeholder-[#B08C78] focus:outline-none focus:ring-2 focus:ring-[#FF7B7B]/30"
            style={{ borderColor: "#EDD9C8" }}
          />
        </div>
      </div>

      {/* Interests */}
      <div className="bg-white rounded-3xl border p-5 shadow-card" style={{ borderColor: "#EDD9C8" }}>
        <h3 className="font-semibold text-[#2D1B0E] mb-1">Interests</h3>
        <p className="text-xs text-[#B08C78] mb-3">Pick up to 8</p>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => {
            const selected = interests.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                style={
                  selected
                    ? { background: "var(--gradient-brand)", color: "white" }
                    : { background: "#FAF4EC", color: "#7A5C48", border: "1px solid #EDD9C8" }
                }
              >
                {interest}
              </button>
            );
          })}
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving || !name || !age}
        className="w-full py-4 rounded-2xl text-white font-semibold text-base shadow-warm-md hover:shadow-warm-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
        style={{ background: "var(--gradient-brand)" }}
      >
        {saving ? "Saving…" : "Save profile ✨"}
      </button>
    </div>
  );
}
