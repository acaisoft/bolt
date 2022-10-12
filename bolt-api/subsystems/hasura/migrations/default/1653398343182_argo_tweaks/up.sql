CREATE  INDEX IF NOT EXISTS "execution_errors_index_identifier" on
  "public"."execution_errors" using btree ("identifier");
ALTER TABLE "public"."execution" ADD COLUMN IF NOT EXISTS "argo_namespace" text DEFAULT 'default'::text NOT NULL;