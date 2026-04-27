-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles
  for insert with check (auth.uid() = id);
create policy "Users update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Balances
create table public.balances (
  user_id uuid primary key references auth.users(id) on delete cascade,
  amount numeric(12,2) not null default 30.71,
  updated_at timestamptz not null default now()
);

alter table public.balances enable row level security;

create policy "Users view own balance" on public.balances
  for select using (auth.uid() = user_id);
create policy "Users insert own balance" on public.balances
  for insert with check (auth.uid() = user_id);
create policy "Users update own balance" on public.balances
  for update using (auth.uid() = user_id);

-- Transactions (add-money history)
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  kind text not null default 'add_money',
  created_at timestamptz not null default now()
);

create index transactions_user_created_idx on public.transactions(user_id, created_at desc);

alter table public.transactions enable row level security;

create policy "Users view own transactions" on public.transactions
  for select using (auth.uid() = user_id);
create policy "Users insert own transactions" on public.transactions
  for insert with check (auth.uid() = user_id);

-- Auto-create profile + balance row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;

  insert into public.balances (user_id, amount)
  values (new.id, 30.71)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Atomic add-money RPC
create or replace function public.add_money(p_amount numeric)
returns numeric
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_new numeric;
begin
  if v_user is null then
    raise exception 'Not authenticated';
  end if;
  if p_amount is null or p_amount <= 0 then
    raise exception 'Amount must be > 0';
  end if;

  insert into public.balances (user_id, amount)
  values (v_user, 30.71)
  on conflict (user_id) do nothing;

  update public.balances
     set amount = amount + p_amount,
         updated_at = now()
   where user_id = v_user
   returning amount into v_new;

  insert into public.transactions (user_id, amount, kind)
  values (v_user, p_amount, 'add_money');

  return v_new;
end;
$$;

revoke all on function public.add_money(numeric) from public;
grant execute on function public.add_money(numeric) to authenticated;