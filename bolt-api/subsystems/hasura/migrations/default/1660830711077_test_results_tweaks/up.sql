alter table "public"."execution_requests" add column "successes_per_tick" numeric
 not null;
alter table "public"."execution_requests" add column "total_content_length" numeric
 not null;
alter table "public"."result_aggregate" add column "min_response_time" numeric
 not null default '0';
alter table "public"."result_aggregate" add column "max_response_time" numeric
 not null default '0';
ALTER TABLE "public"."execution" ADD COLUMN IF NOT EXISTS "report" text DEFAULT 'not_generated'::text NOT NULL;