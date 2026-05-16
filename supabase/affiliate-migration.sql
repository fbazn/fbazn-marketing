-- ============================================================
-- FBAZN Affiliate System — Supabase Migration
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. affiliates
create table if not exists affiliates (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid references auth.users(id) on delete set null,
  email                     text not null unique,
  full_name                 text not null,
  code                      text not null unique,
  stripe_connect_account_id text,
  stripe_connect_onboarded  boolean not null default false,
  status                    text not null default 'active'
                              check (status in ('active', 'suspended', 'banned')),
  balance_pending           numeric(10,2) not null default 0,
  balance_approved          numeric(10,2) not null default 0,
  total_earned              numeric(10,2) not null default 0,
  created_at                timestamptz not null default now()
);

-- 2. affiliate_clicks
create table if not exists affiliate_clicks (
  id           uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references affiliates(id) on delete cascade,
  ip_hash      text,
  referrer     text,
  created_at   timestamptz not null default now()
);

-- 3. affiliate_referrals
create table if not exists affiliate_referrals (
  id                      uuid primary key default gen_random_uuid(),
  affiliate_id            uuid not null references affiliates(id) on delete cascade,
  referred_email          text,
  referred_user_id        uuid references auth.users(id) on delete set null,
  stripe_customer_id      text,
  stripe_subscription_id  text,
  plan                    text check (plan in ('starter', 'pro', 'business')),
  plan_amount             numeric(10,2),
  status                  text not null default 'pending'
                            check (status in ('pending', 'approved', 'paid', 'cancelled', 'refunded')),
  clicked_at              timestamptz not null,
  signed_up_at            timestamptz,
  trial_ended_at          timestamptz,
  first_payment_at        timestamptz,
  hold_until              timestamptz,
  approved_at             timestamptz,
  commissions_remaining   int not null default 12,
  created_at              timestamptz not null default now()
);

-- 4. affiliate_commissions
create table if not exists affiliate_commissions (
  id               uuid primary key default gen_random_uuid(),
  referral_id      uuid not null references affiliate_referrals(id) on delete cascade,
  affiliate_id     uuid not null references affiliates(id) on delete cascade,
  month_number     int not null check (month_number between 1 and 12),
  commission_month date not null,
  gross_amount     numeric(10,2) not null,
  rate_applied     numeric(5,4) not null,
  commission_amount numeric(10,2) not null,
  status           text not null default 'pending'
                     check (status in ('pending', 'approved', 'paid')),
  payout_id        uuid,
  created_at       timestamptz not null default now(),
  unique(referral_id, month_number)
);

-- 5. affiliate_payouts
create table if not exists affiliate_payouts (
  id                 uuid primary key default gen_random_uuid(),
  affiliate_id       uuid not null references affiliates(id) on delete cascade,
  period_month       date not null,
  total_amount       numeric(10,2) not null,
  commission_count   int not null default 0,
  stripe_transfer_id text,
  status             text not null default 'scheduled'
                       check (status in ('scheduled', 'processing', 'paid', 'failed')),
  scheduled_for      date not null,
  failure_reason     text,
  paid_at            timestamptz,
  created_at         timestamptz not null default now()
);

-- Deferred FK: commissions → payouts
alter table affiliate_commissions
  add constraint fk_commissions_payout
  foreign key (payout_id) references affiliate_payouts(id) on delete set null;

-- ============================================================
-- Indexes
-- ============================================================
create index if not exists idx_affiliate_clicks_affiliate    on affiliate_clicks(affiliate_id, created_at);
create index if not exists idx_affiliate_referrals_affiliate on affiliate_referrals(affiliate_id);
create index if not exists idx_affiliate_referrals_sub       on affiliate_referrals(stripe_subscription_id);
create index if not exists idx_affiliate_referrals_status    on affiliate_referrals(status);
create index if not exists idx_affiliate_referrals_hold      on affiliate_referrals(hold_until) where status = 'pending';
create index if not exists idx_affiliate_commissions_aff     on affiliate_commissions(affiliate_id, status);
create index if not exists idx_affiliate_commissions_month   on affiliate_commissions(commission_month);
create index if not exists idx_affiliate_payouts_aff         on affiliate_payouts(affiliate_id);
create index if not exists idx_affiliate_payouts_scheduled   on affiliate_payouts(scheduled_for, status);

-- ============================================================
-- Leaderboard view (ranked by total revenue generated)
-- ============================================================
create or replace view affiliate_leaderboard as
select
  a.id,
  a.full_name,
  a.code,
  count(distinct r.id) filter (where r.status in ('approved','paid')) as total_referrals,
  coalesce(sum(c.gross_amount) filter (where c.status in ('approved','paid')), 0) as total_revenue,
  rank() over (
    order by coalesce(sum(c.gross_amount) filter (where c.status in ('approved','paid')), 0) desc
  ) as rank
from affiliates a
left join affiliate_referrals r on r.affiliate_id = a.id
left join affiliate_commissions c on c.affiliate_id = a.id
where a.status = 'active'
group by a.id, a.full_name, a.code;

-- ============================================================
-- Row Level Security
-- ============================================================
alter table affiliates           enable row level security;
alter table affiliate_clicks     enable row level security;
alter table affiliate_referrals  enable row level security;
alter table affiliate_commissions enable row level security;
alter table affiliate_payouts    enable row level security;

-- affiliates: own record
create policy "affiliates_select_own" on affiliates
  for select using (auth.uid() = user_id);

create policy "affiliates_insert_own" on affiliates
  for insert with check (auth.uid() = user_id);

create policy "affiliates_update_own" on affiliates
  for update using (auth.uid() = user_id);

-- referrals: own records
create policy "referrals_select_own" on affiliate_referrals
  for select using (
    affiliate_id in (select id from affiliates where user_id = auth.uid())
  );

-- commissions: own records
create policy "commissions_select_own" on affiliate_commissions
  for select using (
    affiliate_id in (select id from affiliates where user_id = auth.uid())
  );

-- payouts: own records
create policy "payouts_select_own" on affiliate_payouts
  for select using (
    affiliate_id in (select id from affiliates where user_id = auth.uid())
  );

-- clicks: no user-facing reads (service role only via webhooks/n8n)
-- (service_role bypasses RLS automatically)

-- ============================================================
-- Leaderboard view: public read (anonymised name shown on landing)
-- ============================================================
grant select on affiliate_leaderboard to anon, authenticated;
