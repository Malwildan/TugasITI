-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create ENUMs for consistency
create type mbti_type as enum (
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
);

create type zodiac_type as enum (
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
);

create type drink_type as enum (
  'Coffee', 'Tea', 'Soda', 'Juice', 'Water', 'EnergyDrink', 'Milk', 'Smoothie'
);

create type memory_type as enum (
  'image', 'video'
);

-- PROFILES TABLE
-- Extends the auth.users table
create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  full_name text not null,
  nickname text not null,
  photo_url text,
  birthday date,
  zodiac zodiac_type,
  mbti mbti_type,
  favorite_drink drink_type,
  instagram_handle text,
  -- Simple counter for player number, or could be a serial if we want strict ordering
  player_number serial, 
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Set up RLS for profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- USER_BADGES TABLE
-- Unlocks for badges
create table public.user_badges (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  badge_id text not null, -- Maps to static IDs in frontend code (e.g. 'star', 'creative')
  unlocked_at timestamptz default now(),
  
  -- Prevent duplicate badges for same user
  unique(user_id, badge_id)
);

-- Set up RLS for user_badges
alter table public.user_badges enable row level security;

create policy "Badges are viewable by everyone"
  on public.user_badges for select
  using ( true );

-- Allow authenticated users to insert badges (simplistic for this app, 
-- ideally would be server-func but client-side logic currently 'unlocks' them)
create policy "Authenticated users can unlock badges"
  on public.user_badges for insert
  to authenticated
  with check ( true );
-- Or restrict to own? 'unlockBadge' function currently modifies 'selectedPlayer'.
-- If I can unlock badges for OTHERS, then we need 'true' or some logic.
-- The code shows I can unlock badges for *selectedPlayer*.
-- So we allow authenticated users to insert for any user_id (social feature).


-- STICKERS TABLE
-- Received stickers
create table public.stickers (
  id uuid default uuid_generate_v4() primary key,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete set null, -- Nullable if anonymous? But app implies 'from: You'
  sticker_id text not null, -- Maps to static IDs in frontend
  created_at timestamptz default now()
);

-- Set up RLS for stickers
alter table public.stickers enable row level security;

create policy "Stickers are viewable by everyone"
  on public.stickers for select
  using ( true );

create policy "Authenticated users can send stickers"
  on public.stickers for insert
  to authenticated
  with check ( auth.uid() = sender_id );


-- FAVORITES (BFFs) TABLE
-- Tracks who a user has 'favorited'
create table public.favorites (
  user_id uuid references public.profiles(id) on delete cascade not null,
  favorite_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  
  primary key (user_id, favorite_id),
  -- Prevent favoriting yourself?
  constraint no_self_favorite check (user_id != favorite_id)
);

-- Set up RLS for favorites
alter table public.favorites enable row level security;

create policy "Users can view their own favorites"
  on public.favorites for select
  using ( auth.uid() = user_id );

create policy "Users can add favorites"
  on public.favorites for insert
  with check ( auth.uid() = user_id );

create policy "Users can remove favorites"
  on public.favorites for delete
  using ( auth.uid() = user_id );


-- MEMORIES TABLE
-- For Memory Reel
create table public.memories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type memory_type not null,
  media_url text not null,
  caption text,
  memory_date date default CURRENT_DATE,
  rotation float default 0,
  -- 'is_new' is likely a transient UI state, but if we need to persist "viewed" state that's complex.
  -- For now, we'll store creation time and let UI decide 'newness' or just drop it.
  -- But to match the interface, let's keep it if they want to explicitly tag it.
  is_new boolean default true,
  created_at timestamptz default now()
);

-- Set up RLS for memories
alter table public.memories enable row level security;

create policy "Memories are viewable by everyone"
  on public.memories for select
  using ( true );

create policy "Users can insert their own memories"
  on public.memories for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own memories"
  on public.memories for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own memories"
  on public.memories for delete
  using ( auth.uid() = user_id );


-- USER_SETTINGS TABLE
-- For user preferences like BGM URL and volume
create table public.user_settings (
  user_id uuid references public.profiles(id) on delete cascade not null primary key,
  bgm_url text,
  bgm_volume float default 0.5 check (bgm_volume >= 0 and bgm_volume <= 1),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Set up RLS for user_settings
alter table public.user_settings enable row level security;

create policy "Users can view their own settings"
  on public.user_settings for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own settings"
  on public.user_settings for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own settings"
  on public.user_settings for update
  using ( auth.uid() = user_id );


-- STORAGE BUCKETS (Optional Script to create them via SQL if Supabase supports it, 
-- or just comments for the user)
-- Note: Supabase storage buckets are usually created via API or Dashboard, 
-- but we can insert into storage.buckets if we have permissions.
-- We will just assume they exist or user creates them: 'avatars', 'memories'.

-- Policy for Storage (avatars)
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
-- create policy "Avatar images are publicly accessible"
--   on storage.objects for select
--   using ( bucket_id = 'avatars' );
-- create policy "Anyone can upload an avatar"
--   on storage.objects for insert
--   with check ( bucket_id = 'avatars' );

-- (Repeated logic for 'memories' bucket)
