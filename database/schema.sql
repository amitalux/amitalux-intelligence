-- Amitalux Intelligence SaaS production schema draft.
-- Intended for Postgres, Neon, Supabase, or another managed Postgres provider.

create table businesses (
  id uuid primary key default gen_random_uuid(),
  clerk_org_id text unique,
  name text not null,
  plan text not null default 'trial',
  status text not null default 'active',
  brand_voice text,
  support_hours text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table users (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  clerk_user_id text not null,
  email text not null,
  name text,
  role text not null check (role in ('owner', 'admin', 'agent', 'viewer')),
  created_at timestamptz not null default now(),
  unique (business_id, clerk_user_id)
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  email text not null,
  name text not null,
  preferred_channel text,
  relationship_value text,
  consent text,
  memory text,
  data_health text,
  stale_risk text,
  external_square_id text,
  external_crm_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, email)
);

create table agents (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  name text not null,
  role_label text,
  status text not null default 'green',
  permissions jsonb not null default '{}',
  coaching text,
  created_at timestamptz not null default now()
);

create table cases (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  assigned_agent_id uuid references agents(id) on delete set null,
  title text not null,
  channel text not null,
  status text not null default 'received',
  risk text not null default 'yellow',
  sentiment text,
  context text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  case_id uuid not null references cases(id) on delete cascade,
  sender_type text not null check (sender_type in ('customer', 'agent', 'ai', 'system')),
  channel text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table ai_drafts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  case_id uuid not null references cases(id) on delete cascade,
  prompt_context jsonb not null default '{}',
  draft text not null,
  status text not null default 'draft',
  created_by_user_id uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text not null,
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create table integrations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  provider text not null,
  status text not null default 'disconnected',
  external_account_id text,
  encrypted_config jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, provider)
);

create index customers_business_email_idx on customers (business_id, email);
create index cases_business_status_idx on cases (business_id, status);
create index messages_case_created_idx on messages (case_id, created_at);
create index audit_business_created_idx on audit_logs (business_id, created_at desc);
