drop extension if exists "pg_net";


  create table "public"."testimonials" (
    "id" uuid not null default gen_random_uuid(),
    "author_id" uuid not null,
    "profile_id" uuid not null,
    "content" text not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."testimonials" enable row level security;


  create table "public"."users" (
    "id" uuid not null,
    "username" text not null,
    "display_name" text,
    "about" text,
    "avatar_url" text,
    "generated_avatar_url" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."users" enable row level security;

CREATE INDEX idx_testimonials_author ON public.testimonials USING btree (author_id);

CREATE INDEX idx_testimonials_created ON public.testimonials USING btree (created_at DESC);

CREATE INDEX idx_testimonials_profile ON public.testimonials USING btree (profile_id);

CREATE INDEX idx_users_username ON public.users USING btree (username);

CREATE UNIQUE INDEX testimonials_author_id_profile_id_key ON public.testimonials USING btree (author_id, profile_id);

CREATE UNIQUE INDEX testimonials_pkey ON public.testimonials USING btree (id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);

alter table "public"."testimonials" add constraint "testimonials_pkey" PRIMARY KEY using index "testimonials_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."testimonials" add constraint "testimonials_author_id_fkey" FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."testimonials" validate constraint "testimonials_author_id_fkey";

alter table "public"."testimonials" add constraint "testimonials_author_id_profile_id_key" UNIQUE using index "testimonials_author_id_profile_id_key";

alter table "public"."testimonials" add constraint "testimonials_content_check" CHECK ((char_length(content) <= 140)) not valid;

alter table "public"."testimonials" validate constraint "testimonials_content_check";

alter table "public"."testimonials" add constraint "testimonials_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES public.users(id) ON DELETE CASCADE not valid;

alter table "public"."testimonials" validate constraint "testimonials_profile_id_fkey";

alter table "public"."users" add constraint "users_about_check" CHECK ((char_length(about) <= 280)) not valid;

alter table "public"."users" validate constraint "users_about_check";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

alter table "public"."users" add constraint "users_username_key" UNIQUE using index "users_username_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.users (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'preferred_username',
      NEW.raw_user_meta_data->>'user_name',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name'
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."testimonials" to "anon";

grant insert on table "public"."testimonials" to "anon";

grant references on table "public"."testimonials" to "anon";

grant select on table "public"."testimonials" to "anon";

grant trigger on table "public"."testimonials" to "anon";

grant truncate on table "public"."testimonials" to "anon";

grant update on table "public"."testimonials" to "anon";

grant delete on table "public"."testimonials" to "authenticated";

grant insert on table "public"."testimonials" to "authenticated";

grant references on table "public"."testimonials" to "authenticated";

grant select on table "public"."testimonials" to "authenticated";

grant trigger on table "public"."testimonials" to "authenticated";

grant truncate on table "public"."testimonials" to "authenticated";

grant update on table "public"."testimonials" to "authenticated";

grant delete on table "public"."testimonials" to "service_role";

grant insert on table "public"."testimonials" to "service_role";

grant references on table "public"."testimonials" to "service_role";

grant select on table "public"."testimonials" to "service_role";

grant trigger on table "public"."testimonials" to "service_role";

grant truncate on table "public"."testimonials" to "service_role";

grant update on table "public"."testimonials" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";


  create policy "Authenticated users can create testimonials"
  on "public"."testimonials"
  as permissive
  for insert
  to public
with check ((auth.uid() = author_id));



  create policy "Author or profile owner can delete"
  on "public"."testimonials"
  as permissive
  for delete
  to public
using (((auth.uid() = author_id) OR (auth.uid() = profile_id)));



  create policy "Testimonials are viewable by everyone"
  on "public"."testimonials"
  as permissive
  for select
  to public
using (true);



  create policy "Users are viewable by everyone"
  on "public"."users"
  as permissive
  for select
  to public
using (true);



  create policy "Users can delete own profile"
  on "public"."users"
  as permissive
  for delete
  to public
using ((auth.uid() = id));



  create policy "Users can update own profile"
  on "public"."users"
  as permissive
  for update
  to public
using ((auth.uid() = id));


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


