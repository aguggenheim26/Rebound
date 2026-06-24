-- ============================================
-- REBOUND — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
create table if not exists public.profiles (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null unique,
  name        text not null default '',
  age         integer check (age >= 18 and age <= 99),
  bio         text,
  photos      text[] default '{}',
  location    text,
  gender      text,
  interested_in text[] default '{}',
  breakup_time  text,
  interests   text[] default '{}',
  looking_for text,
  is_onboarded boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (user_id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- LIKES TABLE
-- ============================================
create table if not exists public.likes (
  id         uuid primary key default uuid_generate_v4(),
  liker_id   uuid references auth.users(id) on delete cascade not null,
  liked_id   uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(liker_id, liked_id)
);

-- ============================================
-- MATCHES TABLE
-- ============================================
create table if not exists public.matches (
  id         uuid primary key default uuid_generate_v4(),
  user1_id   uuid references auth.users(id) on delete cascade not null,
  user2_id   uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user1_id, user2_id)
);

-- ============================================
-- MESSAGES TABLE
-- ============================================
create table if not exists public.messages (
  id         uuid primary key default uuid_generate_v4(),
  match_id   uuid references public.matches(id) on delete cascade not null,
  sender_id  uuid references auth.users(id) on delete cascade not null,
  content    text not null,
  created_at timestamptz default now(),
  read_at    timestamptz
);

-- ============================================
-- STORAGE BUCKET for profile photos
-- ============================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict do nothing;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.profiles enable row level security;
alter table public.likes enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;

-- PROFILES
create policy "Public profiles are viewable by all authenticated users"
  on public.profiles for select
  to authenticated using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated with check (auth.uid() = user_id);

-- LIKES
create policy "Users can see their own likes"
  on public.likes for select
  to authenticated using (auth.uid() = liker_id or auth.uid() = liked_id);

create policy "Users can create likes"
  on public.likes for insert
  to authenticated with check (auth.uid() = liker_id);

create policy "Users can delete own likes"
  on public.likes for delete
  to authenticated using (auth.uid() = liker_id);

-- MATCHES
create policy "Users can see their own matches"
  on public.matches for select
  to authenticated using (auth.uid() = user1_id or auth.uid() = user2_id);

create policy "System can create matches"
  on public.matches for insert
  to authenticated with check (auth.uid() = user1_id or auth.uid() = user2_id);

-- MESSAGES
create policy "Match participants can view messages"
  on public.messages for select
  to authenticated using (
    exists (
      select 1 from public.matches m
      where m.id = match_id
      and (m.user1_id = auth.uid() or m.user2_id = auth.uid())
    )
  );

create policy "Match participants can send messages"
  on public.messages for insert
  to authenticated with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.matches m
      where m.id = match_id
      and (m.user1_id = auth.uid() or m.user2_id = auth.uid())
    )
  );

-- STORAGE
create policy "Anyone can view avatars"
  on storage.objects for select using (bucket_id = 'avatars');

create policy "Users can upload own avatar"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update own avatar"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================
-- REALTIME for messages
-- ============================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.matches;

-- ============================================
-- INDEXES for performance
-- ============================================
create index if not exists idx_profiles_user_id on public.profiles(user_id);
create index if not exists idx_likes_liker on public.likes(liker_id);
create index if not exists idx_likes_liked on public.likes(liked_id);
create index if not exists idx_matches_users on public.matches(user1_id, user2_id);
create index if not exists idx_messages_match on public.messages(match_id);
create index if not exists idx_messages_created on public.messages(created_at);
