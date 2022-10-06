alter table "public"."group" alter column "project" set default ''Unknown'::text';
alter table "public"."group" alter column "project" drop not null;
alter table "public"."group" add column "project" text;
