/**
* USERS
* Note: This table contains user data. Users should only be able to view and update their own data.
* Some data is synced back and forth to `auth.users` as described below.
*
* `full_name`: synced in both directions
* `email`: synced from user metadata to profile only
* `avatar_url`: synced from user metadata to profile only
* `terms_accepted_at`: synced from profile to user metadata only
*/
create table public.profile (
    -- UUID from auth.users
    id uuid primary key references auth.users on delete cascade,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    terms_accepted_at timestamp,
    email varchar(255),
    full_name text,
    avatar_url text
);

alter table public.profile enable row level security;
create policy "view_own_profile_data" on public.profile for select using (auth.uid() = id);
create policy "update_own_profile_data" on public.profile for update using (auth.uid() = id);

create trigger _100_handle_updated_at before update on public.profile
for each row execute procedure moddatetime('updated_at');

create function public.update_user_metadata() returns trigger
language plpgsql security definer
as $function$
declare
  _user_id uuid = coalesce(new.id, old.id);
begin
  update auth.users
  set raw_user_meta_data = jsonb_set(
      jsonb_set(
        raw_user_meta_data,
        '{terms_accepted_at}',
        coalesce(
          to_jsonb((select terms_accepted_at from public.profile where id = _user_id)),
          'null'::jsonb
        )
      ),
      '{full_name}',
      coalesce(
        to_jsonb((select full_name from public.profile where id = _user_id)),
        'null'::jsonb
      )
    )
  where id = _user_id;
  return null;
end;
$function$;

create trigger _100_on_change_update_user_metadata
after update on public.profile
for each row
when (old . * is distinct from new . *)
execute procedure public.update_user_metadata();

/**
* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
*/
create function public.handle_new_user()
returns trigger
as $$
begin
  insert into public.profile (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$
language plpgsql
security definer;

create trigger _100_on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create function public.handle_updated_user()
returns trigger
as $$
begin
  update public.profile
  set email = new.email,
      full_name = new.raw_user_meta_data->>'full_name',
      avatar_url = new.raw_user_meta_data->>'avatar_url'
  where id = new.id;
  return new;
end;
$$
language plpgsql
security definer;

create trigger _100_on_auth_user_updated
after update on auth.users
for each row
when (old . * is distinct from new . *)
execute procedure public.handle_updated_user();