
ALTER TABLE "public"."execution_instance" ADD COLUMN "updated_at" timestamptz NOT NULL DEFAULT now()