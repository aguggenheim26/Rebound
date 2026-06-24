"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("See you soon 🌸");
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#FAF4EC] transition-all text-left"
    >
      <LogOut size={18} className="text-[#F95F5F]" />
      <span className="text-[#F95F5F] font-medium">Sign out</span>
    </button>
  );
}
