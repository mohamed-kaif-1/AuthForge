create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  role text not null check (role in ('employee', 'manager', 'admin', 'service')),
  manager_id uuid references users(id) on delete set null,
  backup_approver_id uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  original_prompt text not null,
  status text not null check (status in ('submitted', 'parsed', 'pending_approval', 'partially_approved', 'approved', 'rejected', 'executed', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists actions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests(id) on delete cascade,
  action_name text not null,
  target text,
  recipient_email text,
  recipient_group text,
  recipient_type text check (recipient_type in ('internal', 'customer', 'vendor', 'unknown_external')),
  risk_level text check (risk_level in ('low', 'medium', 'high')),
  status text not null check (status in ('extracted', 'classified', 'approved_direct', 'pending_approval', 'approved', 'rejected', 'executing', 'executed', 'failed')),
  approver_id uuid references users(id) on delete set null,
  rationale text,
  execution_result jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  action_id uuid not null references actions(id) on delete cascade,
  approver_id uuid not null references users(id) on delete cascade,
  status text not null check (status in ('pending', 'approved', 'rejected', 'expired')),
  decision text not null check (decision in ('approved', 'rejected', 'pending')),
  reason text,
  expires_at timestamptz,
  escalated_to uuid references users(id) on delete set null,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  type text not null check (type in ('internal', 'customer', 'vendor', 'unknown_external')),
  source text not null,
  company text,
  created_at timestamptz not null default now()
);

create table if not exists recipient_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  type text not null check (type in ('internal', 'customer', 'vendor', 'unknown_external')),
  members text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references requests(id) on delete cascade,
  action_id uuid references actions(id) on delete cascade,
  event_type text not null,
  message text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);
