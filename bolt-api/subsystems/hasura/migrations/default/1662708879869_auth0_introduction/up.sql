ALTER TABLE "public"."user_project" ALTER COLUMN "user_id" TYPE text;
ALTER TABLE "public"."project" ALTER COLUMN "created_by_id" TYPE text;
ALTER TABLE "public"."configuration" ALTER COLUMN "created_by_id" TYPE text;
