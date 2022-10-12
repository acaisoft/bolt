CREATE TABLE "public"."external_test_scenario" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "project_id" uuid NOT NULL, "description" text, PRIMARY KEY ("id") , FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
