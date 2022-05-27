
ALTER TABLE "public"."execution_instance" ADD COLUMN "created_at" timestamptz NOT NULL DEFAULT now()