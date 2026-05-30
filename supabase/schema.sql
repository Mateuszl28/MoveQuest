-- ============================================================================
-- MoveQuest — Supabase / PostgreSQL schema
-- ----------------------------------------------------------------------------
-- The shipped MVP runs fully self-contained (state persists in the browser via
-- localStorage), so no backend is required to demo it. This schema is the
-- production blueprint: run it in the Supabase SQL editor, drop your
-- NEXT_PUBLIC_SUPABASE_URL / ANON_KEY into .env.local, and swap the local
-- game-store for Supabase calls. Row Level Security is enabled throughout so
-- every player can only touch their own data.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---- enums ----------------------------------------------------------------
do $$ begin
  create type fitness_level as enum ('beginner','intermediate','advanced');
exception when duplicate_object then null; end $$;

do $$ begin
  create type difficulty as enum ('easy','medium','hard');
exception when duplicate_object then null; end $$;

-- ---- users / profiles -----------------------------------------------------
-- mirrors auth.users (Supabase Auth handles credentials)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  avatar text not null default '🦸',
  age int check (age between 5 and 120),
  fitness_level fitness_level not null default 'beginner',
  difficulty_preference difficulty not null default 'medium',
  total_xp int not null default 0,
  created_at timestamptz not null default now()
);

-- ---- character stats ------------------------------------------------------
create table if not exists public.character_stats (
  user_id uuid primary key references public.users(id) on delete cascade,
  strength int not null default 0,
  endurance int not null default 0,
  agility int not null default 0,
  consistency int not null default 0,
  updated_at timestamptz not null default now()
);

-- ---- quests (daily, AI-generated) -----------------------------------------
create table if not exists public.quests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  difficulty difficulty not null,
  xp_reward int not null,
  damage int not null default 0,
  quest_date date not null default current_date,
  completed boolean not null default false
);
create index if not exists quests_user_date_idx on public.quests(user_id, quest_date);

-- ---- quest completions (audit trail / analytics) --------------------------
create table if not exists public.quest_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  quest_id uuid not null references public.quests(id) on delete cascade,
  xp_earned int not null,
  completed_at timestamptz not null default now()
);

-- ---- achievements ---------------------------------------------------------
create table if not exists public.achievements (
  user_id uuid not null references public.users(id) on delete cascade,
  achievement_id text not null,           -- e.g. 'seven-day-hero'
  unlocked boolean not null default false,
  unlocked_at timestamptz,
  primary key (user_id, achievement_id)
);

-- ---- bosses (one per user per day) ----------------------------------------
create table if not exists public.bosses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  boss_date date not null default current_date,
  name text not null,
  title text not null,
  emoji text not null,
  max_hp int not null,
  hp int not null,
  bonus_xp int not null,
  defeated boolean not null default false,
  unique (user_id, boss_date)
);

-- ---- boss damage log ------------------------------------------------------
create table if not exists public.boss_damage (
  id uuid primary key default gen_random_uuid(),
  boss_id uuid not null references public.bosses(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  quest_id uuid references public.quests(id) on delete set null,
  damage int not null,
  created_at timestamptz not null default now()
);

-- ---- streaks --------------------------------------------------------------
create table if not exists public.streaks (
  user_id uuid primary key references public.users(id) on delete cascade,
  current int not null default 0,
  best int not null default 0,
  last_active_date date,
  active_days date[] not null default '{}'
);

-- ---- leaderboard (materialised view for fast global ranking) --------------
create or replace view public.leaderboard as
  select u.id,
         u.username,
         u.avatar,
         u.total_xp as xp,
         floor(u.total_xp / 500) + 1 as level,
         coalesce(s.current, 0) as streak
  from public.users u
  left join public.streaks s on s.user_id = u.id
  order by u.total_xp desc;

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.users            enable row level security;
alter table public.character_stats  enable row level security;
alter table public.quests           enable row level security;
alter table public.quest_completions enable row level security;
alter table public.achievements     enable row level security;
alter table public.bosses           enable row level security;
alter table public.boss_damage      enable row level security;
alter table public.streaks          enable row level security;

-- everyone can read profiles (needed for the global leaderboard)…
create policy "profiles are public" on public.users for select using (true);
-- …but only the owner can write their own row
create policy "users manage self" on public.users for all
  using (auth.uid() = id) with check (auth.uid() = id);

-- generic owner-only policy for the per-user tables
do $$
declare t text;
begin
  foreach t in array array[
    'character_stats','quests','quest_completions','achievements',
    'bosses','boss_damage','streaks'
  ] loop
    execute format($f$
      create policy "owner all %1$s" on public.%1$I for all
        using (auth.uid() = user_id) with check (auth.uid() = user_id);
    $f$, t);
  end loop;
end $$;

-- ============================================================================
-- Auto-provision profile + stats + streak on signup
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, username)
    values (new.id, coalesce(new.raw_user_meta_data->>'username', 'Adventurer-' || left(new.id::text, 6)));
  insert into public.character_stats (user_id) values (new.id);
  insert into public.streaks (user_id) values (new.id);
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
