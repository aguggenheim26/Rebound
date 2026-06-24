import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Edit, LogOut, Settings } from "lucide-react";
import SignOutButton from "@/components/profile/SignOutButton";

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur-sm border-b px-5 py-4 flex items-center justify-between" style={{ borderColor: "#EDD9C8" }}>
        <h1 className="font-display text-2xl text-[#2D1B0E]">My Profile</h1>
        <Link
          href="/profile/edit"
          className="flex items-center gap-1.5 text-sm font-medium text-[#F95F5F] hover:text-[#E63E3E]"
        >
          <Edit size={16} />
          Edit
        </Link>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Photo & name */}
        <div className="bg-white rounded-3xl border overflow-hidden shadow-card" style={{ borderColor: "#EDD9C8" }}>
          <div className="relative h-72">
            {profile?.photos?.[0] ? (
              <Image src={profile.photos[0]} alt={profile.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ background: "var(--gradient-soft)" }}>
                <span className="text-6xl">🌸</span>
                <Link
                  href="/profile/edit"
                  className="text-sm font-semibold text-[#F95F5F] hover:underline"
                >
                  Add a photo
                </Link>
              </div>
            )}
          </div>
          <div className="p-5">
            <h2 className="font-display text-2xl font-bold text-[#2D1B0E]">
              {profile?.name ?? user?.email?.split("@")[0]}{profile?.age ? `, ${profile.age}` : ""}
            </h2>
            {profile?.location && <p className="text-[#B08C78] text-sm mt-1">📍 {profile.location}</p>}
            {profile?.bio ? (
              <p className="text-[#7A5C48] text-sm leading-relaxed mt-3">{profile.bio}</p>
            ) : (
              <Link href="/profile/edit" className="inline-block text-sm text-[#F95F5F] mt-3 hover:underline">
                Add a bio →
              </Link>
            )}
          </div>
        </div>

        {/* Interests */}
        {profile?.interests?.length > 0 && (
          <div className="bg-white rounded-3xl border p-5 shadow-card" style={{ borderColor: "#EDD9C8" }}>
            <h3 className="font-semibold text-[#2D1B0E] mb-3">My interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest: string) => (
                <span
                  key={interest}
                  className="px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{ background: "var(--gradient-soft)", color: "#E63E3E" }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="bg-white rounded-3xl border overflow-hidden shadow-card" style={{ borderColor: "#EDD9C8" }}>
          <Link
            href="/profile/edit"
            className="flex items-center gap-3 px-5 py-4 hover:bg-[#FAF4EC] transition-all border-b"
            style={{ borderColor: "#EDD9C8" }}
          >
            <Settings size={18} className="text-[#B08C78]" />
            <span className="text-[#2D1B0E] font-medium">Settings & preferences</span>
          </Link>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
