-- Supabase Schema for BudgetPro
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- 1. PROFILES TABLE
-- =============================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- =============================================
-- 2. TRANSACTIONS TABLE (income + expenses)
-- =============================================
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('income', 'expense')),
  amount numeric not null check (amount >= 0),
  category text not null,
  description text,
  date date not null default current_date,
  note text,
  created_at timestamptz default now()
);

-- Indexes for better query performance
create index idx_transactions_user_id on public.transactions(user_id);
create index idx_transactions_user_id_date on public.transactions(user_id, date desc);
create index idx_transactions_user_id_type on public.transactions(user_id, type);

-- Enable RLS
alter table public.transactions enable row level security;

-- Policies for transactions
create policy "Users can view their own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
  on public.transactions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- =============================================
-- 3. SAVINGS GOALS TABLE
-- =============================================
create table public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  target numeric not null check (target > 0),
  saved numeric not null default 0 check (saved >= 0),
  emoji text default '🎯',
  deadline date,
  created_at timestamptz default now()
);

-- Index
create index idx_savings_goals_user_id on public.savings_goals(user_id);

-- Enable RLS
alter table public.savings_goals enable row level security;

-- Policies for savings_goals
create policy "Users can view their own savings goals"
  on public.savings_goals for select
  using (auth.uid() = user_id);

create policy "Users can insert their own savings goals"
  on public.savings_goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own savings goals"
  on public.savings_goals for update
  using (auth.uid() = user_id);

create policy "Users can delete their own savings goals"
  on public.savings_goals for delete
  using (auth.uid() = user_id);

-- =============================================
-- 4. BUDGETS TABLE
-- =============================================
create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  category text not null,
  limit_amount numeric not null check (limit_amount > 0),
  month text not null, -- Format: YYYY-MM
  created_at timestamptz default now(),
  unique (user_id, category, month)
);

-- Index
create index idx_budgets_user_id_month on public.budgets(user_id, month);

-- Enable RLS
alter table public.budgets enable row level security;

-- Policies for budgets
create policy "Users can view their own budgets"
  on public.budgets for select
  using (auth.uid() = user_id);

create policy "Users can insert their own budgets"
  on public.budgets for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own budgets"
  on public.budgets for update
  using (auth.uid() = user_id);

create policy "Users can delete their own budgets"
  on public.budgets for delete
  using (auth.uid() = user_id);

-- =============================================
-- HELPER FUNCTIONS (Optional but useful)
-- =============================================

-- Function to get current month in YYYY-MM format
create or replace function public.current_month()
returns text
language sql
stable
as $$
  select to_char(current_date, 'YYYY-MM');
$$;

-- Trigger to auto-create profile on user signup (optional, can be done in app)
-- create or replace function public.handle_new_user()
-- returns trigger
-- language plpgsql
-- security definer
-- as $$
-- begin
--   insert into public.profiles (id, username)
--   values (new.id, new.email)
--   on conflict (id) do nothing;
--   return new;
-- end;
-- $$;

-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute procedure public.handle_new_user();