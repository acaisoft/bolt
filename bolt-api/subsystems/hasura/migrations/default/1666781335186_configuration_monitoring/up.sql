CREATE TABLE "public"."configuration_monitoring" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "query" text, "chart_type" text, "configuration_id" uuid, "unit" text, PRIMARY KEY ("id") , FOREIGN KEY ("configuration_id") REFERENCES "public"."configuration"("id") ON UPDATE cascade ON DELETE cascade);
CREATE TABLE "public"."monitoring_metric" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "monitoring_id" uuid NOT NULL, "timestamp" timestamptz, "metric_value" json, "execution_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("monitoring_id") REFERENCES "public"."configuration_monitoring"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("execution_id") REFERENCES "public"."execution"("id") ON UPDATE cascade ON DELETE cascade);
CREATE EXTENSION IF NOT EXISTS pgcrypto;
alter table "public"."configuration" add column "prometheus_url" text
 null;
alter table "public"."configuration" add column "prometheus_password" text
 null;
alter table "public"."configuration" add column "prometheus_user" text
 null;
