CREATE TABLE "public"."group" ("uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "project" text NOT NULL DEFAULT 'Unknown', "name" text NOT NULL DEFAULT 'Unnamed', PRIMARY KEY ("uuid") , UNIQUE ("uuid"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
