--
-- PostgreSQL database dump
--

-- Dumped from database version 11.1 (Debian 11.1-3.pgdg90+1)
-- Dumped by pg_dump version 11.2 (Ubuntu 11.2-1.pgdg18.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.user_project DROP CONSTRAINT IF EXISTS user_project_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_project DROP CONSTRAINT IF EXISTS user_project_project_id_fkey;
ALTER TABLE IF EXISTS ONLY public.result_error DROP CONSTRAINT IF EXISTS result_error_execution_id_fkey;
ALTER TABLE IF EXISTS ONLY public.result_distribution DROP CONSTRAINT IF EXISTS result_distribution_execution_id_fkey;
ALTER TABLE IF EXISTS ONLY public.result_aggregate DROP CONSTRAINT IF EXISTS result_aggregate_execution_id_fkey;
ALTER TABLE IF EXISTS ONLY public.repository DROP CONSTRAINT IF EXISTS repository_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.repository DROP CONSTRAINT IF EXISTS repository_type_id_fkey;
ALTER TABLE IF EXISTS ONLY public.repository DROP CONSTRAINT IF EXISTS repository_project_id_fkey;
ALTER TABLE IF EXISTS ONLY public.parameter DROP CONSTRAINT IF EXISTS parameter_type_id_fkey;
ALTER TABLE IF EXISTS ONLY public.job_status DROP CONSTRAINT IF EXISTS job_status_status_code_fkey;
ALTER TABLE IF EXISTS ONLY public.job_status DROP CONSTRAINT IF EXISTS job_status_execution_id_fkey;
ALTER TABLE IF EXISTS ONLY public.execution_result DROP CONSTRAINT IF EXISTS execution_result_execution_id_fkey;
ALTER TABLE IF EXISTS ONLY public.execution DROP CONSTRAINT IF EXISTS execution_configuration_id_fkey;
ALTER TABLE IF EXISTS ONLY public.configuration DROP CONSTRAINT IF EXISTS configuration_repository_id_fkey;
ALTER TABLE IF EXISTS ONLY public.configuration DROP CONSTRAINT IF EXISTS configuration_project_id_fkey;
ALTER TABLE IF EXISTS ONLY public.configuration_parameter DROP CONSTRAINT IF EXISTS configuration_parameter_parameter_id_fkey;
ALTER TABLE IF EXISTS ONLY public.configuration_parameter DROP CONSTRAINT IF EXISTS configuration_parameter_configuration_id_fkey;
ALTER TABLE IF EXISTS ONLY hdb_catalog.hdb_relationship DROP CONSTRAINT IF EXISTS hdb_relationship_table_schema_fkey;
ALTER TABLE IF EXISTS ONLY hdb_catalog.hdb_permission DROP CONSTRAINT IF EXISTS hdb_permission_table_schema_fkey;
ALTER TABLE IF EXISTS ONLY hdb_catalog.event_invocation_logs DROP CONSTRAINT IF EXISTS event_invocation_logs_event_id_fkey;
DROP TRIGGER IF EXISTS manager__insert__public__repository ON hdb_views.manager__insert__public__repository;
DROP TRIGGER IF EXISTS manager__insert__public__execution ON hdb_views.manager__insert__public__execution;
DROP TRIGGER IF EXISTS manager__insert__public__configuration_parameter ON hdb_views.manager__insert__public__configuration_parameter;
DROP TRIGGER IF EXISTS manager__insert__public__configuration ON hdb_views.manager__insert__public__configuration;
DROP TRIGGER IF EXISTS hdb_table_oid_check ON hdb_catalog.hdb_table;
DROP INDEX IF EXISTS hdb_catalog.hdb_version_one_row;
DROP INDEX IF EXISTS hdb_catalog.event_log_trigger_id_idx;
DROP INDEX IF EXISTS hdb_catalog.event_invocation_logs_event_id_idx;
ALTER TABLE IF EXISTS ONLY public.user_project DROP CONSTRAINT IF EXISTS user_project_pkey;
ALTER TABLE IF EXISTS ONLY public."user" DROP CONSTRAINT IF EXISTS user_pkey;
ALTER TABLE IF EXISTS ONLY public."user" DROP CONSTRAINT IF EXISTS user_email_key;
ALTER TABLE IF EXISTS ONLY public.configuration_type DROP CONSTRAINT IF EXISTS types_pkey;
ALTER TABLE IF EXISTS ONLY public.result_error DROP CONSTRAINT IF EXISTS result_error_pkey;
ALTER TABLE IF EXISTS ONLY public.result_distribution DROP CONSTRAINT IF EXISTS result_distribution_pkey;
ALTER TABLE IF EXISTS ONLY public.result_aggregate DROP CONSTRAINT IF EXISTS result_aggregate_pkey;
ALTER TABLE IF EXISTS ONLY public.repository DROP CONSTRAINT IF EXISTS repository_pkey;
ALTER TABLE IF EXISTS ONLY public.repository_keys DROP CONSTRAINT IF EXISTS repository_keys_pkey;
ALTER TABLE IF EXISTS ONLY public.project DROP CONSTRAINT IF EXISTS project_pkey;
ALTER TABLE IF EXISTS ONLY public.parameter DROP CONSTRAINT IF EXISTS parameter_pkey;
ALTER TABLE IF EXISTS ONLY public.job_status DROP CONSTRAINT IF EXISTS job_status_pkey;
ALTER TABLE IF EXISTS ONLY public.job_status_dict DROP CONSTRAINT IF EXISTS job_status_dict_pkey;
ALTER TABLE IF EXISTS ONLY public.execution_result DROP CONSTRAINT IF EXISTS execution_result_pkey;
ALTER TABLE IF EXISTS ONLY public.execution DROP CONSTRAINT IF EXISTS execution_pkey;
ALTER TABLE IF EXISTS ONLY public.configuration_type DROP CONSTRAINT IF EXISTS configuration_type_name_key;
ALTER TABLE IF EXISTS ONLY public.configuration DROP CONSTRAINT IF EXISTS configuration_pkey;
ALTER TABLE IF EXISTS ONLY public.configuration_parameter DROP CONSTRAINT IF EXISTS configuration_parameter_pkey;
ALTER TABLE IF EXISTS ONLY hdb_catalog.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY hdb_catalog.remote_schemas DROP CONSTRAINT IF EXISTS remote_schemas_pkey;
ALTER TABLE IF EXISTS ONLY hdb_catalog.remote_schemas DROP CONSTRAINT IF EXISTS remote_schemas_name_key;
ALTER TABLE IF EXISTS ONLY hdb_catalog.migration_settings DROP CONSTRAINT IF EXISTS migration_settings_pkey;
ALTER TABLE IF EXISTS ONLY hdb_catalog.hdb_version DROP CONSTRAINT IF EXISTS hdb_version_pkey;
ALTER TABLE IF EXISTS ONLY hdb_catalog.hdb_table DROP CONSTRAINT IF EXISTS hdb_table_pkey;
ALTER TABLE IF EXISTS ONLY hdb_catalog.hdb_relationship DROP CONSTRAINT IF EXISTS hdb_relationship_pkey;
ALTER TABLE IF EXISTS ONLY hdb_catalog.hdb_query_template DROP CONSTRAINT IF EXISTS hdb_query_template_pkey;
ALTER TABLE IF EXISTS ONLY hdb_catalog.hdb_permission DROP CONSTRAINT IF EXISTS hdb_permission_pkey;
ALTER TABLE IF EXISTS ONLY hdb_catalog.hdb_function DROP CONSTRAINT IF EXISTS hdb_function_pkey;
ALTER TABLE IF EXISTS ONLY hdb_catalog.event_triggers DROP CONSTRAINT IF EXISTS event_triggers_pkey;
ALTER TABLE IF EXISTS ONLY hdb_catalog.event_triggers DROP CONSTRAINT IF EXISTS event_triggers_name_key;
ALTER TABLE IF EXISTS ONLY hdb_catalog.event_log DROP CONSTRAINT IF EXISTS event_log_pkey;
ALTER TABLE IF EXISTS ONLY hdb_catalog.event_invocation_logs DROP CONSTRAINT IF EXISTS event_invocation_logs_pkey;
ALTER TABLE IF EXISTS public.result_error ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.result_distribution ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.result_aggregate ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.execution_result ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS hdb_views.manager__insert__public__repository ALTER COLUMN performed DROP DEFAULT;
ALTER TABLE IF EXISTS hdb_views.manager__insert__public__repository ALTER COLUMN type_id DROP DEFAULT;
ALTER TABLE IF EXISTS hdb_views.manager__insert__public__repository ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS hdb_views.manager__insert__public__execution ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS hdb_views.manager__insert__public__configuration_parameter ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS hdb_views.manager__insert__public__configuration ALTER COLUMN performed DROP DEFAULT;
ALTER TABLE IF EXISTS hdb_views.manager__insert__public__configuration ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS hdb_catalog.remote_schemas ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public.user_project;
DROP TABLE IF EXISTS public."user";
DROP SEQUENCE IF EXISTS public.result_error_id_seq;
DROP TABLE IF EXISTS public.result_error;
DROP SEQUENCE IF EXISTS public.result_distribution_id_seq;
DROP TABLE IF EXISTS public.result_distribution;
DROP SEQUENCE IF EXISTS public.result_aggregate_id_seq;
DROP TABLE IF EXISTS public.result_aggregate;
DROP TABLE IF EXISTS public.repository_keys;
DROP TABLE IF EXISTS public.project;
DROP TABLE IF EXISTS public.parameter;
DROP TABLE IF EXISTS public.job_status_dict;
DROP TABLE IF EXISTS public.job_status;
DROP SEQUENCE IF EXISTS public.execution_result_id_seq;
DROP TABLE IF EXISTS public.execution_result;
DROP TABLE IF EXISTS public.configuration_type;
DROP VIEW IF EXISTS hdb_views.manager__insert__public__repository;
DROP TABLE IF EXISTS public.repository;
DROP VIEW IF EXISTS hdb_views.manager__insert__public__execution;
DROP TABLE IF EXISTS public.execution;
DROP VIEW IF EXISTS hdb_views.manager__insert__public__configuration_parameter;
DROP TABLE IF EXISTS public.configuration_parameter;
DROP VIEW IF EXISTS hdb_views.manager__insert__public__configuration;
DROP TABLE IF EXISTS public.configuration;
DROP TABLE IF EXISTS hdb_catalog.schema_migrations;
DROP SEQUENCE IF EXISTS hdb_catalog.remote_schemas_id_seq;
DROP TABLE IF EXISTS hdb_catalog.remote_schemas;
DROP TABLE IF EXISTS hdb_catalog.migration_settings;
DROP TABLE IF EXISTS hdb_catalog.hdb_version;
DROP VIEW IF EXISTS hdb_catalog.hdb_unique_constraint;
DROP TABLE IF EXISTS hdb_catalog.hdb_table;
DROP TABLE IF EXISTS hdb_catalog.hdb_relationship;
DROP TABLE IF EXISTS hdb_catalog.hdb_query_template;
DROP VIEW IF EXISTS hdb_catalog.hdb_primary_key;
DROP VIEW IF EXISTS hdb_catalog.hdb_permission_agg;
DROP TABLE IF EXISTS hdb_catalog.hdb_permission;
DROP VIEW IF EXISTS hdb_catalog.hdb_function_agg;
DROP TABLE IF EXISTS hdb_catalog.hdb_function;
DROP VIEW IF EXISTS hdb_catalog.hdb_foreign_key_constraint;
DROP VIEW IF EXISTS hdb_catalog.hdb_check_constraint;
DROP TABLE IF EXISTS hdb_catalog.event_triggers;
DROP TABLE IF EXISTS hdb_catalog.event_log;
DROP TABLE IF EXISTS hdb_catalog.event_invocation_logs;
DROP FUNCTION IF EXISTS hdb_views.manager__insert__public__repository();
DROP FUNCTION IF EXISTS hdb_views.manager__insert__public__execution();
DROP FUNCTION IF EXISTS hdb_views.manager__insert__public__configuration_parameter();
DROP FUNCTION IF EXISTS hdb_views.manager__insert__public__configuration();
DROP FUNCTION IF EXISTS hdb_catalog.inject_table_defaults(view_schema text, view_name text, tab_schema text, tab_name text);
DROP FUNCTION IF EXISTS hdb_catalog.hdb_table_oid_check();
DROP EXTENSION IF EXISTS pgcrypto;
DROP SCHEMA IF EXISTS hdb_views;
DROP SCHEMA IF EXISTS hdb_catalog;
--
-- Name: hdb_catalog; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA hdb_catalog;


--
-- Name: hdb_views; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA hdb_views;


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: hdb_table_oid_check(); Type: FUNCTION; Schema: hdb_catalog; Owner: -
--

CREATE FUNCTION hdb_catalog.hdb_table_oid_check() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
    IF (EXISTS (SELECT 1 FROM information_schema.tables st WHERE st.table_schema = NEW.table_schema AND st.table_name = NEW.table_name)) THEN
      return NEW;
    ELSE
      RAISE foreign_key_violation using message = 'table_schema, table_name not in information_schema.tables';
      return NULL;
    END IF;
  END;
$$;


--
-- Name: inject_table_defaults(text, text, text, text); Type: FUNCTION; Schema: hdb_catalog; Owner: -
--

CREATE FUNCTION hdb_catalog.inject_table_defaults(view_schema text, view_name text, tab_schema text, tab_name text) RETURNS void
    LANGUAGE plpgsql
    AS $$
    DECLARE
        r RECORD;
    BEGIN
      FOR r IN SELECT column_name, column_default FROM information_schema.columns WHERE table_schema = tab_schema AND table_name = tab_name AND column_default IS NOT NULL LOOP
          EXECUTE format('ALTER VIEW %I.%I ALTER COLUMN %I SET DEFAULT %s;', view_schema, view_name, r.column_name, r.column_default);
      END LOOP;
    END;
$$;


--
-- Name: manager__insert__public__configuration(); Type: FUNCTION; Schema: hdb_views; Owner: -
--

CREATE FUNCTION hdb_views.manager__insert__public__configuration() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE r "public"."configuration"%ROWTYPE;
  DECLARE conflict_clause jsonb;
  DECLARE action text;
  DECLARE constraint_name text;
  DECLARE set_expression text;
  BEGIN
    conflict_clause = current_setting('hasura.conflict_clause')::jsonb;
    IF ((EXISTS  (SELECT  1  FROM "public"."project" AS "_be_0_public_project" WHERE (((("_be_0_public_project"."id") = (NEW."project_id")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."user_project" AS "_be_1_public_user_project" WHERE (((("_be_1_public_user_project"."project_id") = ("_be_0_public_project"."id")) AND ('true')) AND ((((("_be_1_public_user_project"."user_id") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::uuid)) OR ((("_be_1_public_user_project"."user_id") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::uuid) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')))     )) AND ('true')) THEN
      CASE
        WHEN conflict_clause = 'null'::jsonb THEN INSERT INTO "public"."configuration" VALUES (NEW.*) RETURNING * INTO r;
        ELSE
          action = conflict_clause ->> 'action';
          constraint_name = quote_ident(conflict_clause ->> 'constraint');
          set_expression = conflict_clause ->> 'set_expression';
          IF action is NOT NULL THEN
            CASE
              WHEN action = 'ignore'::text AND constraint_name IS NULL THEN
                INSERT INTO "public"."configuration" VALUES (NEW.*) ON CONFLICT DO NOTHING RETURNING * INTO r;
              WHEN action = 'ignore'::text AND constraint_name is NOT NULL THEN
                EXECUTE 'INSERT INTO "public"."configuration" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO NOTHING RETURNING *' INTO r USING NEW;
              ELSE
                EXECUTE 'INSERT INTO "public"."configuration" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO UPDATE ' || set_expression || ' RETURNING *' INTO r USING NEW;
            END CASE;
            ELSE
              RAISE internal_error using message = 'action is not found'; RETURN NULL;
          END IF;
      END CASE;
      IF r IS NULL THEN RETURN null; ELSE RETURN r; END IF;
     ELSE RAISE check_violation using message = 'insert check constraint failed'; RETURN NULL;
     END IF;
  END $_$;


--
-- Name: manager__insert__public__configuration_parameter(); Type: FUNCTION; Schema: hdb_views; Owner: -
--

CREATE FUNCTION hdb_views.manager__insert__public__configuration_parameter() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE r "public"."configuration_parameter"%ROWTYPE;
  DECLARE conflict_clause jsonb;
  DECLARE action text;
  DECLARE constraint_name text;
  DECLARE set_expression text;
  BEGIN
    conflict_clause = current_setting('hasura.conflict_clause')::jsonb;
    IF ((EXISTS  (SELECT  1  FROM "public"."configuration" AS "_be_0_public_configuration" WHERE (((("_be_0_public_configuration"."id") = (NEW."configuration_id")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."project" AS "_be_1_public_project" WHERE (((("_be_1_public_project"."id") = ("_be_0_public_configuration"."project_id")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."user_project" AS "_be_2_public_user_project" WHERE (((("_be_2_public_user_project"."project_id") = ("_be_1_public_project"."id")) AND ('true')) AND ((((("_be_2_public_user_project"."user_id") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::uuid)) OR ((("_be_2_public_user_project"."user_id") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::uuid) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')))     )) AND ('true')))     )) AND ('true')) THEN
      CASE
        WHEN conflict_clause = 'null'::jsonb THEN INSERT INTO "public"."configuration_parameter" VALUES (NEW.*) RETURNING * INTO r;
        ELSE
          action = conflict_clause ->> 'action';
          constraint_name = quote_ident(conflict_clause ->> 'constraint');
          set_expression = conflict_clause ->> 'set_expression';
          IF action is NOT NULL THEN
            CASE
              WHEN action = 'ignore'::text AND constraint_name IS NULL THEN
                INSERT INTO "public"."configuration_parameter" VALUES (NEW.*) ON CONFLICT DO NOTHING RETURNING * INTO r;
              WHEN action = 'ignore'::text AND constraint_name is NOT NULL THEN
                EXECUTE 'INSERT INTO "public"."configuration_parameter" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO NOTHING RETURNING *' INTO r USING NEW;
              ELSE
                EXECUTE 'INSERT INTO "public"."configuration_parameter" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO UPDATE ' || set_expression || ' RETURNING *' INTO r USING NEW;
            END CASE;
            ELSE
              RAISE internal_error using message = 'action is not found'; RETURN NULL;
          END IF;
      END CASE;
      IF r IS NULL THEN RETURN null; ELSE RETURN r; END IF;
     ELSE RAISE check_violation using message = 'insert check constraint failed'; RETURN NULL;
     END IF;
  END $_$;


--
-- Name: manager__insert__public__execution(); Type: FUNCTION; Schema: hdb_views; Owner: -
--

CREATE FUNCTION hdb_views.manager__insert__public__execution() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE r "public"."execution"%ROWTYPE;
  DECLARE conflict_clause jsonb;
  DECLARE action text;
  DECLARE constraint_name text;
  DECLARE set_expression text;
  BEGIN
    conflict_clause = current_setting('hasura.conflict_clause')::jsonb;
    IF ((EXISTS  (SELECT  1  FROM "public"."configuration" AS "_be_0_public_configuration" WHERE (((("_be_0_public_configuration"."id") = (NEW."configuration_id")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."project" AS "_be_1_public_project" WHERE (((("_be_1_public_project"."id") = ("_be_0_public_configuration"."project_id")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."user_project" AS "_be_2_public_user_project" WHERE (((("_be_2_public_user_project"."project_id") = ("_be_1_public_project"."id")) AND ('true')) AND ((((("_be_2_public_user_project"."user_id") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::uuid)) OR ((("_be_2_public_user_project"."user_id") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::uuid) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')))     )) AND ('true')))     )) AND ('true')) THEN
      CASE
        WHEN conflict_clause = 'null'::jsonb THEN INSERT INTO "public"."execution" VALUES (NEW.*) RETURNING * INTO r;
        ELSE
          action = conflict_clause ->> 'action';
          constraint_name = quote_ident(conflict_clause ->> 'constraint');
          set_expression = conflict_clause ->> 'set_expression';
          IF action is NOT NULL THEN
            CASE
              WHEN action = 'ignore'::text AND constraint_name IS NULL THEN
                INSERT INTO "public"."execution" VALUES (NEW.*) ON CONFLICT DO NOTHING RETURNING * INTO r;
              WHEN action = 'ignore'::text AND constraint_name is NOT NULL THEN
                EXECUTE 'INSERT INTO "public"."execution" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO NOTHING RETURNING *' INTO r USING NEW;
              ELSE
                EXECUTE 'INSERT INTO "public"."execution" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO UPDATE ' || set_expression || ' RETURNING *' INTO r USING NEW;
            END CASE;
            ELSE
              RAISE internal_error using message = 'action is not found'; RETURN NULL;
          END IF;
      END CASE;
      IF r IS NULL THEN RETURN null; ELSE RETURN r; END IF;
     ELSE RAISE check_violation using message = 'insert check constraint failed'; RETURN NULL;
     END IF;
  END $_$;


--
-- Name: manager__insert__public__repository(); Type: FUNCTION; Schema: hdb_views; Owner: -
--

CREATE FUNCTION hdb_views.manager__insert__public__repository() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE r "public"."repository"%ROWTYPE;
  DECLARE conflict_clause jsonb;
  DECLARE action text;
  DECLARE constraint_name text;
  DECLARE set_expression text;
  BEGIN
    conflict_clause = current_setting('hasura.conflict_clause')::jsonb;
    IF ('true') THEN
      CASE
        WHEN conflict_clause = 'null'::jsonb THEN INSERT INTO "public"."repository" VALUES (NEW.*) RETURNING * INTO r;
        ELSE
          action = conflict_clause ->> 'action';
          constraint_name = quote_ident(conflict_clause ->> 'constraint');
          set_expression = conflict_clause ->> 'set_expression';
          IF action is NOT NULL THEN
            CASE
              WHEN action = 'ignore'::text AND constraint_name IS NULL THEN
                INSERT INTO "public"."repository" VALUES (NEW.*) ON CONFLICT DO NOTHING RETURNING * INTO r;
              WHEN action = 'ignore'::text AND constraint_name is NOT NULL THEN
                EXECUTE 'INSERT INTO "public"."repository" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO NOTHING RETURNING *' INTO r USING NEW;
              ELSE
                EXECUTE 'INSERT INTO "public"."repository" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO UPDATE ' || set_expression || ' RETURNING *' INTO r USING NEW;
            END CASE;
            ELSE
              RAISE internal_error using message = 'action is not found'; RETURN NULL;
          END IF;
      END CASE;
      IF r IS NULL THEN RETURN null; ELSE RETURN r; END IF;
     ELSE RAISE check_violation using message = 'insert check constraint failed'; RETURN NULL;
     END IF;
  END $_$;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.event_invocation_logs (
    id text DEFAULT public.gen_random_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: event_log; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.event_log (
    id text DEFAULT public.gen_random_uuid() NOT NULL,
    schema_name text NOT NULL,
    table_name text NOT NULL,
    trigger_id text NOT NULL,
    trigger_name text NOT NULL,
    payload jsonb NOT NULL,
    delivered boolean DEFAULT false NOT NULL,
    error boolean DEFAULT false NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    locked boolean DEFAULT false NOT NULL,
    next_retry_at timestamp without time zone
);


--
-- Name: event_triggers; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.event_triggers (
    id text DEFAULT public.gen_random_uuid() NOT NULL,
    name text,
    type text NOT NULL,
    schema_name text NOT NULL,
    table_name text NOT NULL,
    configuration json,
    comment text
);


--
-- Name: hdb_check_constraint; Type: VIEW; Schema: hdb_catalog; Owner: -
--

CREATE VIEW hdb_catalog.hdb_check_constraint AS
 SELECT (n.nspname)::text AS table_schema,
    (ct.relname)::text AS table_name,
    (r.conname)::text AS constraint_name,
    pg_get_constraintdef(r.oid, true) AS "check"
   FROM ((pg_constraint r
     JOIN pg_class ct ON ((r.conrelid = ct.oid)))
     JOIN pg_namespace n ON ((ct.relnamespace = n.oid)))
  WHERE (r.contype = 'c'::"char");


--
-- Name: hdb_foreign_key_constraint; Type: VIEW; Schema: hdb_catalog; Owner: -
--

CREATE VIEW hdb_catalog.hdb_foreign_key_constraint AS
 SELECT (q.table_schema)::text AS table_schema,
    (q.table_name)::text AS table_name,
    (q.constraint_name)::text AS constraint_name,
    (min(q.constraint_oid))::integer AS constraint_oid,
    min((q.ref_table_table_schema)::text) AS ref_table_table_schema,
    min((q.ref_table)::text) AS ref_table,
    json_object_agg(ac.attname, afc.attname) AS column_mapping,
    min((q.confupdtype)::text) AS on_update,
    min((q.confdeltype)::text) AS on_delete
   FROM ((( SELECT ctn.nspname AS table_schema,
            ct.relname AS table_name,
            r.conrelid AS table_id,
            r.conname AS constraint_name,
            r.oid AS constraint_oid,
            cftn.nspname AS ref_table_table_schema,
            cft.relname AS ref_table,
            r.confrelid AS ref_table_id,
            r.confupdtype,
            r.confdeltype,
            unnest(r.conkey) AS column_id,
            unnest(r.confkey) AS ref_column_id
           FROM ((((pg_constraint r
             JOIN pg_class ct ON ((r.conrelid = ct.oid)))
             JOIN pg_namespace ctn ON ((ct.relnamespace = ctn.oid)))
             JOIN pg_class cft ON ((r.confrelid = cft.oid)))
             JOIN pg_namespace cftn ON ((cft.relnamespace = cftn.oid)))
          WHERE (r.contype = 'f'::"char")) q
     JOIN pg_attribute ac ON (((q.column_id = ac.attnum) AND (q.table_id = ac.attrelid))))
     JOIN pg_attribute afc ON (((q.ref_column_id = afc.attnum) AND (q.ref_table_id = afc.attrelid))))
  GROUP BY q.table_schema, q.table_name, q.constraint_name;


--
-- Name: hdb_function; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_function (
    function_schema text NOT NULL,
    function_name text NOT NULL,
    is_system_defined boolean DEFAULT false
);


--
-- Name: hdb_function_agg; Type: VIEW; Schema: hdb_catalog; Owner: -
--

CREATE VIEW hdb_catalog.hdb_function_agg AS
 SELECT (p.proname)::text AS function_name,
    (pn.nspname)::text AS function_schema,
        CASE
            WHEN (p.provariadic = (0)::oid) THEN false
            ELSE true
        END AS has_variadic,
        CASE
            WHEN ((p.provolatile)::text = ('i'::character(1))::text) THEN 'IMMUTABLE'::text
            WHEN ((p.provolatile)::text = ('s'::character(1))::text) THEN 'STABLE'::text
            WHEN ((p.provolatile)::text = ('v'::character(1))::text) THEN 'VOLATILE'::text
            ELSE NULL::text
        END AS function_type,
    pg_get_functiondef(p.oid) AS function_definition,
    (rtn.nspname)::text AS return_type_schema,
    (rt.typname)::text AS return_type_name,
        CASE
            WHEN ((rt.typtype)::text = ('b'::character(1))::text) THEN 'BASE'::text
            WHEN ((rt.typtype)::text = ('c'::character(1))::text) THEN 'COMPOSITE'::text
            WHEN ((rt.typtype)::text = ('d'::character(1))::text) THEN 'DOMAIN'::text
            WHEN ((rt.typtype)::text = ('e'::character(1))::text) THEN 'ENUM'::text
            WHEN ((rt.typtype)::text = ('r'::character(1))::text) THEN 'RANGE'::text
            WHEN ((rt.typtype)::text = ('p'::character(1))::text) THEN 'PSUEDO'::text
            ELSE NULL::text
        END AS return_type_type,
    p.proretset AS returns_set,
    ( SELECT COALESCE(json_agg(pt.typname), '[]'::json) AS "coalesce"
           FROM (unnest(COALESCE(p.proallargtypes, (p.proargtypes)::oid[])) WITH ORDINALITY pat(oid, ordinality)
             LEFT JOIN pg_type pt ON ((pt.oid = pat.oid)))) AS input_arg_types,
    to_json(COALESCE(p.proargnames, ARRAY[]::text[])) AS input_arg_names
   FROM (((pg_proc p
     JOIN pg_namespace pn ON ((pn.oid = p.pronamespace)))
     JOIN pg_type rt ON ((rt.oid = p.prorettype)))
     JOIN pg_namespace rtn ON ((rtn.oid = rt.typnamespace)))
  WHERE (((pn.nspname)::text !~~ 'pg_%'::text) AND ((pn.nspname)::text <> ALL (ARRAY['information_schema'::text, 'hdb_catalog'::text, 'hdb_views'::text])) AND (NOT (EXISTS ( SELECT 1
           FROM pg_aggregate
          WHERE ((pg_aggregate.aggfnoid)::oid = p.oid)))));


--
-- Name: hdb_permission; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_permission (
    table_schema text NOT NULL,
    table_name text NOT NULL,
    role_name text NOT NULL,
    perm_type text NOT NULL,
    perm_def jsonb NOT NULL,
    comment text,
    is_system_defined boolean DEFAULT false,
    CONSTRAINT hdb_permission_perm_type_check CHECK ((perm_type = ANY (ARRAY['insert'::text, 'select'::text, 'update'::text, 'delete'::text])))
);


--
-- Name: hdb_permission_agg; Type: VIEW; Schema: hdb_catalog; Owner: -
--

CREATE VIEW hdb_catalog.hdb_permission_agg AS
 SELECT hdb_permission.table_schema,
    hdb_permission.table_name,
    hdb_permission.role_name,
    json_object_agg(hdb_permission.perm_type, hdb_permission.perm_def) AS permissions
   FROM hdb_catalog.hdb_permission
  GROUP BY hdb_permission.table_schema, hdb_permission.table_name, hdb_permission.role_name;


--
-- Name: hdb_primary_key; Type: VIEW; Schema: hdb_catalog; Owner: -
--

CREATE VIEW hdb_catalog.hdb_primary_key AS
 SELECT tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    json_agg(constraint_column_usage.column_name) AS columns
   FROM (information_schema.table_constraints tc
     JOIN ( SELECT x.tblschema AS table_schema,
            x.tblname AS table_name,
            x.colname AS column_name,
            x.cstrname AS constraint_name
           FROM ( SELECT DISTINCT nr.nspname,
                    r.relname,
                    a.attname,
                    c.conname
                   FROM pg_namespace nr,
                    pg_class r,
                    pg_attribute a,
                    pg_depend d,
                    pg_namespace nc,
                    pg_constraint c
                  WHERE ((nr.oid = r.relnamespace) AND (r.oid = a.attrelid) AND (d.refclassid = ('pg_class'::regclass)::oid) AND (d.refobjid = r.oid) AND (d.refobjsubid = a.attnum) AND (d.classid = ('pg_constraint'::regclass)::oid) AND (d.objid = c.oid) AND (c.connamespace = nc.oid) AND (c.contype = 'c'::"char") AND (r.relkind = ANY (ARRAY['r'::"char", 'p'::"char"])) AND (NOT a.attisdropped))
                UNION ALL
                 SELECT nr.nspname,
                    r.relname,
                    a.attname,
                    c.conname
                   FROM pg_namespace nr,
                    pg_class r,
                    pg_attribute a,
                    pg_namespace nc,
                    pg_constraint c
                  WHERE ((nr.oid = r.relnamespace) AND (r.oid = a.attrelid) AND (nc.oid = c.connamespace) AND (r.oid =
                        CASE c.contype
                            WHEN 'f'::"char" THEN c.confrelid
                            ELSE c.conrelid
                        END) AND (a.attnum = ANY (
                        CASE c.contype
                            WHEN 'f'::"char" THEN c.confkey
                            ELSE c.conkey
                        END)) AND (NOT a.attisdropped) AND (c.contype = ANY (ARRAY['p'::"char", 'u'::"char", 'f'::"char"])) AND (r.relkind = ANY (ARRAY['r'::"char", 'p'::"char"])))) x(tblschema, tblname, colname, cstrname)) constraint_column_usage ON ((((tc.constraint_name)::text = (constraint_column_usage.constraint_name)::text) AND ((tc.table_schema)::text = (constraint_column_usage.table_schema)::text) AND ((tc.table_name)::text = (constraint_column_usage.table_name)::text))))
  WHERE ((tc.constraint_type)::text = 'PRIMARY KEY'::text)
  GROUP BY tc.table_schema, tc.table_name, tc.constraint_name;


--
-- Name: hdb_query_template; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_query_template (
    template_name text NOT NULL,
    template_defn jsonb NOT NULL,
    comment text,
    is_system_defined boolean DEFAULT false
);


--
-- Name: hdb_relationship; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_relationship (
    table_schema text NOT NULL,
    table_name text NOT NULL,
    rel_name text NOT NULL,
    rel_type text,
    rel_def jsonb NOT NULL,
    comment text,
    is_system_defined boolean DEFAULT false,
    CONSTRAINT hdb_relationship_rel_type_check CHECK ((rel_type = ANY (ARRAY['object'::text, 'array'::text])))
);


--
-- Name: hdb_table; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_table (
    table_schema text NOT NULL,
    table_name text NOT NULL,
    is_system_defined boolean DEFAULT false
);


--
-- Name: hdb_unique_constraint; Type: VIEW; Schema: hdb_catalog; Owner: -
--

CREATE VIEW hdb_catalog.hdb_unique_constraint AS
 SELECT tc.table_name,
    tc.constraint_schema AS table_schema,
    tc.constraint_name,
    json_agg(kcu.column_name) AS columns
   FROM (information_schema.table_constraints tc
     JOIN information_schema.key_column_usage kcu USING (constraint_schema, constraint_name))
  WHERE ((tc.constraint_type)::text = 'UNIQUE'::text)
  GROUP BY tc.table_name, tc.constraint_schema, tc.constraint_name;


--
-- Name: hdb_version; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_version (
    hasura_uuid uuid DEFAULT public.gen_random_uuid() NOT NULL,
    version text NOT NULL,
    upgraded_on timestamp with time zone NOT NULL,
    cli_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    console_state jsonb DEFAULT '{}'::jsonb NOT NULL
);


--
-- Name: migration_settings; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.migration_settings (
    setting text NOT NULL,
    value text NOT NULL
);


--
-- Name: remote_schemas; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.remote_schemas (
    id bigint NOT NULL,
    name text,
    definition json,
    comment text
);


--
-- Name: remote_schemas_id_seq; Type: SEQUENCE; Schema: hdb_catalog; Owner: -
--

CREATE SEQUENCE hdb_catalog.remote_schemas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: remote_schemas_id_seq; Type: SEQUENCE OWNED BY; Schema: hdb_catalog; Owner: -
--

ALTER SEQUENCE hdb_catalog.remote_schemas_id_seq OWNED BY hdb_catalog.remote_schemas.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.schema_migrations (
    version bigint NOT NULL,
    dirty boolean NOT NULL
);


--
-- Name: configuration; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.configuration (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    repository_id uuid NOT NULL,
    project_id uuid NOT NULL,
    performed boolean DEFAULT false NOT NULL,
    created_by_id uuid
);


--
-- Name: manager__insert__public__configuration; Type: VIEW; Schema: hdb_views; Owner: -
--

CREATE VIEW hdb_views.manager__insert__public__configuration AS
 SELECT configuration.id,
    configuration.name,
    configuration.repository_id,
    configuration.project_id,
    configuration.performed,
    configuration.created_by_id
   FROM public.configuration;


--
-- Name: configuration_parameter; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.configuration_parameter (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    configuration_id uuid NOT NULL,
    value text NOT NULL,
    parameter_id uuid
);


--
-- Name: manager__insert__public__configuration_parameter; Type: VIEW; Schema: hdb_views; Owner: -
--

CREATE VIEW hdb_views.manager__insert__public__configuration_parameter AS
 SELECT configuration_parameter.id,
    configuration_parameter.configuration_id,
    configuration_parameter.value,
    configuration_parameter.parameter_id
   FROM public.configuration_parameter;


--
-- Name: execution; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.execution (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    configuration_id uuid NOT NULL,
    start timestamp with time zone,
    "end" timestamp with time zone,
    status text NOT NULL,
    test_preparation_job_id text,
    test_job_id text,
    test_preparation_job_status text,
    test_preparation_job_statuscheck_timestamp timestamp with time zone,
    test_preparation_job_error text
);


--
-- Name: manager__insert__public__execution; Type: VIEW; Schema: hdb_views; Owner: -
--

CREATE VIEW hdb_views.manager__insert__public__execution AS
 SELECT execution.id,
    execution.configuration_id,
    execution.start,
    execution."end",
    execution.status,
    execution.test_preparation_job_id,
    execution.test_job_id,
    execution.test_preparation_job_status,
    execution.test_preparation_job_statuscheck_timestamp,
    execution.test_preparation_job_error
   FROM public.execution;


--
-- Name: repository; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.repository (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    user_id uuid,
    project_id uuid,
    type_id uuid DEFAULT '27c6ee12-7cd9-410b-83fc-448e3c4b9272'::uuid NOT NULL,
    performed boolean DEFAULT false NOT NULL,
    created_by_id text
);


--
-- Name: manager__insert__public__repository; Type: VIEW; Schema: hdb_views; Owner: -
--

CREATE VIEW hdb_views.manager__insert__public__repository AS
 SELECT repository.id,
    repository.name,
    repository.url,
    repository.user_id,
    repository.project_id,
    repository.type_id,
    repository.performed,
    repository.created_by_id
   FROM public.repository;


--
-- Name: configuration_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.configuration_type (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    slug_name text
);


--
-- Name: execution_result; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.execution_result (
    id integer NOT NULL,
    execution_id uuid NOT NULL,
    request_type text NOT NULL,
    endpoint text NOT NULL,
    response_time numeric NOT NULL,
    response_length numeric NOT NULL,
    status text NOT NULL,
    exception text NOT NULL,
    "timestamp" bigint
);


--
-- Name: execution_result_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.execution_result_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: execution_result_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.execution_result_id_seq OWNED BY public.execution_result.id;


--
-- Name: job_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_status (
    execution_id uuid NOT NULL,
    status_code text
);


--
-- Name: job_status_dict; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_status_dict (
    code text NOT NULL,
    name text NOT NULL
);


--
-- Name: parameter; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.parameter (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    param_type text NOT NULL,
    default_value text,
    param_name text,
    type_id uuid,
    tooltip text
);


--
-- Name: project; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    contact text,
    description text,
    image_url text,
    is_deleted boolean DEFAULT false
);


--
-- Name: repository_keys; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.repository_keys (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    public text NOT NULL,
    private text NOT NULL
);


--
-- Name: result_aggregate; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.result_aggregate (
    id bigint NOT NULL,
    execution_id uuid NOT NULL,
    average_response_time numeric,
    number_of_successes integer DEFAULT 0,
    number_of_errors integer DEFAULT 0,
    number_of_fails integer,
    average_response_size numeric,
    "timestamp" timestamp with time zone
);


--
-- Name: COLUMN result_aggregate.average_response_size; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.result_aggregate.average_response_size IS 'size in bytes';


--
-- Name: result_aggregate_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.result_aggregate_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: result_aggregate_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.result_aggregate_id_seq OWNED BY public.result_aggregate.id;


--
-- Name: result_distribution; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.result_distribution (
    id bigint NOT NULL,
    execution_id uuid NOT NULL,
    request_result json,
    distribution_result json,
    start timestamp with time zone NOT NULL,
    "end" timestamp with time zone NOT NULL
);


--
-- Name: result_distribution_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.result_distribution_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: result_distribution_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.result_distribution_id_seq OWNED BY public.result_distribution.id;


--
-- Name: result_error; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.result_error (
    id bigint NOT NULL,
    error_type text NOT NULL,
    name text NOT NULL,
    exception_data text,
    number_of_occurrences integer NOT NULL,
    execution_id uuid NOT NULL
);


--
-- Name: result_error_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.result_error_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: result_error_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.result_error_id_seq OWNED BY public.result_error.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    email text NOT NULL,
    active boolean DEFAULT false NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    is_admin boolean DEFAULT false NOT NULL,
    is_reader boolean DEFAULT true NOT NULL,
    is_manager boolean DEFAULT false NOT NULL
);


--
-- Name: user_project; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_project (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_id uuid,
    project_id uuid
);


--
-- Name: remote_schemas id; Type: DEFAULT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.remote_schemas ALTER COLUMN id SET DEFAULT nextval('hdb_catalog.remote_schemas_id_seq'::regclass);


--
-- Name: manager__insert__public__configuration id; Type: DEFAULT; Schema: hdb_views; Owner: -
--

ALTER TABLE ONLY hdb_views.manager__insert__public__configuration ALTER COLUMN id SET DEFAULT public.gen_random_uuid();


--
-- Name: manager__insert__public__configuration performed; Type: DEFAULT; Schema: hdb_views; Owner: -
--

ALTER TABLE ONLY hdb_views.manager__insert__public__configuration ALTER COLUMN performed SET DEFAULT false;


--
-- Name: manager__insert__public__configuration_parameter id; Type: DEFAULT; Schema: hdb_views; Owner: -
--

ALTER TABLE ONLY hdb_views.manager__insert__public__configuration_parameter ALTER COLUMN id SET DEFAULT public.gen_random_uuid();


--
-- Name: manager__insert__public__execution id; Type: DEFAULT; Schema: hdb_views; Owner: -
--

ALTER TABLE ONLY hdb_views.manager__insert__public__execution ALTER COLUMN id SET DEFAULT public.gen_random_uuid();


--
-- Name: manager__insert__public__repository id; Type: DEFAULT; Schema: hdb_views; Owner: -
--

ALTER TABLE ONLY hdb_views.manager__insert__public__repository ALTER COLUMN id SET DEFAULT public.gen_random_uuid();


--
-- Name: manager__insert__public__repository type_id; Type: DEFAULT; Schema: hdb_views; Owner: -
--

ALTER TABLE ONLY hdb_views.manager__insert__public__repository ALTER COLUMN type_id SET DEFAULT '27c6ee12-7cd9-410b-83fc-448e3c4b9272'::uuid;


--
-- Name: manager__insert__public__repository performed; Type: DEFAULT; Schema: hdb_views; Owner: -
--

ALTER TABLE ONLY hdb_views.manager__insert__public__repository ALTER COLUMN performed SET DEFAULT false;


--
-- Name: execution_result id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.execution_result ALTER COLUMN id SET DEFAULT nextval('public.execution_result_id_seq'::regclass);


--
-- Name: result_aggregate id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.result_aggregate ALTER COLUMN id SET DEFAULT nextval('public.result_aggregate_id_seq'::regclass);


--
-- Name: result_distribution id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.result_distribution ALTER COLUMN id SET DEFAULT nextval('public.result_distribution_id_seq'::regclass);


--
-- Name: result_error id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.result_error ALTER COLUMN id SET DEFAULT nextval('public.result_error_id_seq'::regclass);


--
-- Name: event_invocation_logs event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.event_invocation_logs
    ADD CONSTRAINT event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: event_log event_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.event_log
    ADD CONSTRAINT event_log_pkey PRIMARY KEY (id);


--
-- Name: event_triggers event_triggers_name_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.event_triggers
    ADD CONSTRAINT event_triggers_name_key UNIQUE (name);


--
-- Name: event_triggers event_triggers_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.event_triggers
    ADD CONSTRAINT event_triggers_pkey PRIMARY KEY (id);


--
-- Name: hdb_function hdb_function_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_function
    ADD CONSTRAINT hdb_function_pkey PRIMARY KEY (function_schema, function_name);


--
-- Name: hdb_permission hdb_permission_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_permission
    ADD CONSTRAINT hdb_permission_pkey PRIMARY KEY (table_schema, table_name, role_name, perm_type);


--
-- Name: hdb_query_template hdb_query_template_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_query_template
    ADD CONSTRAINT hdb_query_template_pkey PRIMARY KEY (template_name);


--
-- Name: hdb_relationship hdb_relationship_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_relationship
    ADD CONSTRAINT hdb_relationship_pkey PRIMARY KEY (table_schema, table_name, rel_name);


--
-- Name: hdb_table hdb_table_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_table
    ADD CONSTRAINT hdb_table_pkey PRIMARY KEY (table_schema, table_name);


--
-- Name: hdb_version hdb_version_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_version
    ADD CONSTRAINT hdb_version_pkey PRIMARY KEY (hasura_uuid);


--
-- Name: migration_settings migration_settings_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.migration_settings
    ADD CONSTRAINT migration_settings_pkey PRIMARY KEY (setting);


--
-- Name: remote_schemas remote_schemas_name_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.remote_schemas
    ADD CONSTRAINT remote_schemas_name_key UNIQUE (name);


--
-- Name: remote_schemas remote_schemas_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.remote_schemas
    ADD CONSTRAINT remote_schemas_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: configuration_parameter configuration_parameter_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuration_parameter
    ADD CONSTRAINT configuration_parameter_pkey PRIMARY KEY (id);


--
-- Name: configuration configuration_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuration
    ADD CONSTRAINT configuration_pkey PRIMARY KEY (id);


--
-- Name: configuration_type configuration_type_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuration_type
    ADD CONSTRAINT configuration_type_name_key UNIQUE (name);


--
-- Name: execution execution_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.execution
    ADD CONSTRAINT execution_pkey PRIMARY KEY (id);


--
-- Name: execution_result execution_result_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.execution_result
    ADD CONSTRAINT execution_result_pkey PRIMARY KEY (id);


--
-- Name: job_status_dict job_status_dict_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_status_dict
    ADD CONSTRAINT job_status_dict_pkey PRIMARY KEY (code);


--
-- Name: job_status job_status_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_status
    ADD CONSTRAINT job_status_pkey PRIMARY KEY (execution_id);


--
-- Name: parameter parameter_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parameter
    ADD CONSTRAINT parameter_pkey PRIMARY KEY (id);


--
-- Name: project project_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (id);


--
-- Name: repository_keys repository_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repository_keys
    ADD CONSTRAINT repository_keys_pkey PRIMARY KEY (id);


--
-- Name: repository repository_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repository
    ADD CONSTRAINT repository_pkey PRIMARY KEY (id);


--
-- Name: result_aggregate result_aggregate_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.result_aggregate
    ADD CONSTRAINT result_aggregate_pkey PRIMARY KEY (id);


--
-- Name: result_distribution result_distribution_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.result_distribution
    ADD CONSTRAINT result_distribution_pkey PRIMARY KEY (id);


--
-- Name: result_error result_error_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.result_error
    ADD CONSTRAINT result_error_pkey PRIMARY KEY (id);


--
-- Name: configuration_type types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuration_type
    ADD CONSTRAINT types_pkey PRIMARY KEY (id);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user_project user_project_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_project
    ADD CONSTRAINT user_project_pkey PRIMARY KEY (id);


--
-- Name: event_invocation_logs_event_id_idx; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE INDEX event_invocation_logs_event_id_idx ON hdb_catalog.event_invocation_logs USING btree (event_id);


--
-- Name: event_log_trigger_id_idx; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE INDEX event_log_trigger_id_idx ON hdb_catalog.event_log USING btree (trigger_id);


--
-- Name: hdb_version_one_row; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE UNIQUE INDEX hdb_version_one_row ON hdb_catalog.hdb_version USING btree (((version IS NOT NULL)));


--
-- Name: hdb_table hdb_table_oid_check; Type: TRIGGER; Schema: hdb_catalog; Owner: -
--

CREATE TRIGGER hdb_table_oid_check BEFORE INSERT OR UPDATE ON hdb_catalog.hdb_table FOR EACH ROW EXECUTE PROCEDURE hdb_catalog.hdb_table_oid_check();


--
-- Name: manager__insert__public__configuration manager__insert__public__configuration; Type: TRIGGER; Schema: hdb_views; Owner: -
--

CREATE TRIGGER manager__insert__public__configuration INSTEAD OF INSERT ON hdb_views.manager__insert__public__configuration FOR EACH ROW EXECUTE PROCEDURE hdb_views.manager__insert__public__configuration();


--
-- Name: manager__insert__public__configuration_parameter manager__insert__public__configuration_parameter; Type: TRIGGER; Schema: hdb_views; Owner: -
--

CREATE TRIGGER manager__insert__public__configuration_parameter INSTEAD OF INSERT ON hdb_views.manager__insert__public__configuration_parameter FOR EACH ROW EXECUTE PROCEDURE hdb_views.manager__insert__public__configuration_parameter();


--
-- Name: manager__insert__public__execution manager__insert__public__execution; Type: TRIGGER; Schema: hdb_views; Owner: -
--

CREATE TRIGGER manager__insert__public__execution INSTEAD OF INSERT ON hdb_views.manager__insert__public__execution FOR EACH ROW EXECUTE PROCEDURE hdb_views.manager__insert__public__execution();


--
-- Name: manager__insert__public__repository manager__insert__public__repository; Type: TRIGGER; Schema: hdb_views; Owner: -
--

CREATE TRIGGER manager__insert__public__repository INSTEAD OF INSERT ON hdb_views.manager__insert__public__repository FOR EACH ROW EXECUTE PROCEDURE hdb_views.manager__insert__public__repository();


--
-- Name: event_invocation_logs event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.event_invocation_logs
    ADD CONSTRAINT event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.event_log(id);


--
-- Name: hdb_permission hdb_permission_table_schema_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_permission
    ADD CONSTRAINT hdb_permission_table_schema_fkey FOREIGN KEY (table_schema, table_name) REFERENCES hdb_catalog.hdb_table(table_schema, table_name);


--
-- Name: hdb_relationship hdb_relationship_table_schema_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_relationship
    ADD CONSTRAINT hdb_relationship_table_schema_fkey FOREIGN KEY (table_schema, table_name) REFERENCES hdb_catalog.hdb_table(table_schema, table_name);


--
-- Name: configuration_parameter configuration_parameter_configuration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuration_parameter
    ADD CONSTRAINT configuration_parameter_configuration_id_fkey FOREIGN KEY (configuration_id) REFERENCES public.configuration(id);


--
-- Name: configuration_parameter configuration_parameter_parameter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuration_parameter
    ADD CONSTRAINT configuration_parameter_parameter_id_fkey FOREIGN KEY (parameter_id) REFERENCES public.parameter(id);


--
-- Name: configuration configuration_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuration
    ADD CONSTRAINT configuration_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(id);


--
-- Name: configuration configuration_repository_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuration
    ADD CONSTRAINT configuration_repository_id_fkey FOREIGN KEY (repository_id) REFERENCES public.repository(id);


--
-- Name: execution execution_configuration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.execution
    ADD CONSTRAINT execution_configuration_id_fkey FOREIGN KEY (configuration_id) REFERENCES public.configuration(id);


--
-- Name: execution_result execution_result_execution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.execution_result
    ADD CONSTRAINT execution_result_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.execution(id);


--
-- Name: job_status job_status_execution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_status
    ADD CONSTRAINT job_status_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.execution(id);


--
-- Name: job_status job_status_status_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_status
    ADD CONSTRAINT job_status_status_code_fkey FOREIGN KEY (status_code) REFERENCES public.job_status_dict(code);


--
-- Name: parameter parameter_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parameter
    ADD CONSTRAINT parameter_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.configuration_type(id);


--
-- Name: repository repository_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repository
    ADD CONSTRAINT repository_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(id);


--
-- Name: repository repository_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repository
    ADD CONSTRAINT repository_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.configuration_type(id);


--
-- Name: repository repository_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.repository
    ADD CONSTRAINT repository_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: result_aggregate result_aggregate_execution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.result_aggregate
    ADD CONSTRAINT result_aggregate_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.execution(id);


--
-- Name: result_distribution result_distribution_execution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.result_distribution
    ADD CONSTRAINT result_distribution_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.execution(id);


--
-- Name: result_error result_error_execution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.result_error
    ADD CONSTRAINT result_error_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.execution(id);


--
-- Name: user_project user_project_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_project
    ADD CONSTRAINT user_project_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(id);


--
-- Name: user_project user_project_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_project
    ADD CONSTRAINT user_project_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- PostgreSQL database dump complete
--

