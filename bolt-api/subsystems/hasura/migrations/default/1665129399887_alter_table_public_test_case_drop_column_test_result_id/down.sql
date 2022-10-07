alter table "public"."test_case" alter column "test_result_id" drop not null;
alter table "public"."test_case" add column "test_result_id" uuid;
