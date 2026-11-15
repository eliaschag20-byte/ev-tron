-- EV-TRON · Lista de exploradores (Supabase / PostgreSQL). Ejecutar una vez en el SQL Editor.
create table if not exists public.explorers (
  id         uuid primary key default gen_random_uuid(),
  mission    text not null check (mission ~ '^[a-z0-9-]{1,30}$'),
  name       text not null check (char_length(name) between 1 and 16 and name !~* '(http|www\.|@)'),
  hidden     boolean not null default false,   -- ponlo en true desde el panel para moderar un apodo
  created_at timestamptz not null default now()
);
create index if not exists explorers_mission_created on public.explorers (mission, created_at desc);

alter table public.explorers enable row level security;

-- El público (clave anon) solo puede LEER filas visibles e INSERTAR filas visibles. No puede editar ni borrar.
drop policy if exists "read visible"  on public.explorers;
drop policy if exists "add explorer"  on public.explorers;
create policy "read visible" on public.explorers for select to anon using (hidden = false);
create policy "add explorer" on public.explorers for insert to anon with check (hidden = false);

grant select, insert on public.explorers to anon;
