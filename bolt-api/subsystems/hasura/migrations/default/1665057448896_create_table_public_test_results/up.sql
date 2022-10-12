CREATE TABLE "public"."test_results" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "result" text, "message" text, "duration" integer NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
