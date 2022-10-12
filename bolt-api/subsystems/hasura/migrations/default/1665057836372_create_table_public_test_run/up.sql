CREATE TABLE "public"."test_run" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "external_scenario_id" uuid NOT NULL, "timestamp" timestamptz NOT NULL, "duration" integer NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
