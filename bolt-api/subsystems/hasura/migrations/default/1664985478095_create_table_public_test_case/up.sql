CREATE TABLE "public"."test_case" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name_from_file" text NOT NULL DEFAULT 'Unnamed', "project" uuid NOT NULL, "custom_name" text, "description" text, "group" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("group") REFERENCES "public"."group"("uuid") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
