alter table "public"."test_case"
  add constraint "test_case_group_fkey"
  foreign key (group)
  references "public"."group"
  (uuid) on update restrict on delete restrict;
alter table "public"."test_case" alter column "group" drop not null;
alter table "public"."test_case" add column "group" uuid;
