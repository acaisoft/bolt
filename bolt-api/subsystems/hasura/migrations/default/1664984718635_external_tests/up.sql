CREATE TABLE "public"."group" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "name" text NOT NULL DEFAULT 'Unnamed',
    PRIMARY KEY ("id") ,
    UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."test_case" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "name_from_file" text NOT NULL DEFAULT 'Unnamed',
    "custom_name" text NOT NULL DEFAULT 'Unknown',
    "description" text,
    "group_id" uuid NOT NULL,
    PRIMARY KEY ("id") ,
    FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON UPDATE restrict ON DELETE restrict,
    UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."test_run" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "scenario_id" uuid NOT NULL,
    "external_scenario_id" uuid NOT NULL,
    "timestamp" timestamptz NOT NULL,
    "duration" float4 NOT NULL,
    "successes" INTEGER NOT NULL DEFAULT '0',
    "failures" INTEGER NOT NULL DEFAULT '0',
    "skipped" INTEGER NOT NULL DEFAULT '0',
    "total" INTEGER NOT NULL DEFAULT '0',
    "errors" INTEGER NOT NULL DEFAULT '0',
    PRIMARY KEY ("id") ,
    FOREIGN KEY ("scenario_id") REFERENCES "public"."configuration"("id") ON UPDATE restrict ON DELETE restrict,
    UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."test_result" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "result" text,
    "message" text,
    "duration" float4 NOT NULL,
    "test_run_id" uuid NOT NULL,
    "test_case_id" uuid NOT NULL,
    PRIMARY KEY ("id") ,
    FOREIGN KEY ("test_run_id") REFERENCES "public"."test_run"("id") ON UPDATE restrict ON DELETE restrict,
    FOREIGN KEY ("test_case_id") REFERENCES "public"."test_case"("id") ON UPDATE restrict ON DELETE restrict,
    UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."custom_field" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "name" text NOT NULL,
    "value" text NOT NULL,
    "test_run_id" uuid NOT NULL,
    PRIMARY KEY ("id") ,
    FOREIGN KEY ("test_run_id") REFERENCES "public"."test_run"("id") ON UPDATE restrict ON DELETE restrict,
    UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
