export type Profile = {
  id: string;
  user_id: string;
  name: string;
  age: number;
  bio: string | null;
  photos: string[];
  location: string | null;
  gender: string | null;
  interested_in: string[];
  breakup_time: string | null; // e.g. "3 months ago"
  interests: string[];
  looking_for: string | null;
  is_onboarded: boolean;
  created_at: string;
  updated_at: string;
};

export type Match = {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  profile?: Profile; // the other person's profile
};

export type Message = {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
};

export type Like = {
  id: string;
  liker_id: string;
  liked_id: string;
  created_at: string;
};

export type SwipeAction = "like" | "pass";
