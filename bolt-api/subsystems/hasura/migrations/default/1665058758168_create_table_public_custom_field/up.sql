CREATE TABLE "public"."custom_field" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, "value" text NOT NULL, "test_run_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("test_run_id") REFERENCES "public"."test_run"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
