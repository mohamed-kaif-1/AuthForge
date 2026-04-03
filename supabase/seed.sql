insert into users (id, name, email, role, manager_id, backup_approver_id)
values
  ('11111111-1111-1111-1111-111111111111', 'Aarav Employee', 'aarav@company.com', 'employee', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333'),
  ('22222222-2222-2222-2222-222222222222', 'Maya Manager', 'maya@company.com', 'manager', null, '33333333-3333-3333-3333-333333333333'),
  ('33333333-3333-3333-3333-333333333333', 'Priya Admin', 'priya@company.com', 'admin', null, null)
on conflict (id) do nothing;

insert into contacts (name, email, type, source, company)
values
  ('Acme Primary Contact', 'client@acme.com', 'customer', 'crm', 'Acme'),
  ('Tools Vendor', 'vendor@tools.com', 'vendor', 'vendor_db', 'Tools Inc'),
  ('Security Team', 'security@company.com', 'internal', 'directory', 'Company')
on conflict (email) do nothing;

insert into recipient_groups (name, type, members)
values
  ('all_customers', 'customer', array['client@acme.com']),
  ('all_employees', 'internal', array['aarav@company.com', 'maya@company.com', 'priya@company.com']),
  ('security_channel', 'internal', array['security@company.com'])
on conflict (name) do nothing;
