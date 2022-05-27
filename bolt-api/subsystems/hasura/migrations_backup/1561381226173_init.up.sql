SET xmloption = content;
CREATE TABLE public.argo_execution_log (
    id integer NOT NULL,
    data json NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    argo_id text
);
CREATE TABLE public.configuration_parameter (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    configuration_id uuid NOT NULL,
    value text NOT NULL,
    parameter_slug text NOT NULL
);
CREATE TABLE public.execution_additional_data (
    execution_id uuid NOT NULL,
    name text NOT NULL,
    data json NOT NULL,
    id integer NOT NULL,
    slug text,
    created_at timestamp with time zone DEFAULT now()
);
CREATE TABLE public.execution_distribution (
    id integer NOT NULL,
    execution_id uuid NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    identifier text NOT NULL,
    method text NOT NULL,
    name text NOT NULL,
    num_requests integer DEFAULT 0 NOT NULL,
    p50 numeric DEFAULT 0 NOT NULL,
    p66 numeric DEFAULT 0 NOT NULL,
    p75 numeric DEFAULT 0 NOT NULL,
    p80 numeric DEFAULT 0 NOT NULL,
    p90 numeric DEFAULT 0 NOT NULL,
    p95 numeric DEFAULT 0 NOT NULL,
    p98 numeric DEFAULT 0 NOT NULL,
    p99 numeric DEFAULT 0 NOT NULL,
    p100 numeric DEFAULT 0 NOT NULL
);
CREATE TABLE public.execution_errors (
    id integer NOT NULL,
    execution_id uuid NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    identifier text NOT NULL,
    method text NOT NULL,
    name text NOT NULL,
    exception_data text,
    number_of_occurrences integer NOT NULL
);
CREATE TABLE public.execution_instance (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    execution_id uuid NOT NULL,
    job_id uuid,
    status text NOT NULL,
    instance_type text DEFAULT 'master'::text NOT NULL,
    host text,
    port integer,
    expect_slaves integer DEFAULT 0 NOT NULL
);
CREATE TABLE public.execution_metrics_data (
    id integer NOT NULL,
    execution_id uuid NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    data json NOT NULL
);
CREATE TABLE public.execution_metrics_metadata (
    id integer NOT NULL,
    execution_id uuid NOT NULL,
    chart_configuration json NOT NULL
);
CREATE TABLE public.execution_requests (
    id integer NOT NULL,
    execution_id uuid NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    identifier text NOT NULL,
    method text NOT NULL,
    name text NOT NULL,
    num_requests integer NOT NULL,
    num_failures integer NOT NULL,
    median_response_time numeric NOT NULL,
    average_response_time numeric NOT NULL,
    min_response_time numeric NOT NULL,
    max_response_time numeric NOT NULL,
    average_content_size numeric NOT NULL,
    requests_per_second numeric NOT NULL
);
CREATE TABLE public.execution_stage_log (
    id integer NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    stage text NOT NULL,
    level text NOT NULL,
    msg json NOT NULL,
    execution_id uuid NOT NULL,
    job_name text
);
CREATE TABLE public.execution_users (
    execution_id uuid NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    users_count integer DEFAULT 0 NOT NULL,
    instance_id uuid NOT NULL,
    id uuid DEFAULT public.gen_random_uuid() NOT NULL
);
CREATE TABLE public.result_aggregate (
    id bigint NOT NULL,
    execution_id uuid NOT NULL,
    average_response_time numeric,
    number_of_successes integer DEFAULT 0,
    number_of_errors integer DEFAULT 0,
    number_of_fails integer,
    average_response_size numeric,
    "timestamp" timestamp with time zone,
    number_of_users integer DEFAULT 0
);
COMMENT ON COLUMN public.result_aggregate.average_response_size IS 'size in bytes';
CREATE TABLE public.result_error (
    id bigint NOT NULL,
    error_type text NOT NULL,
    name text NOT NULL,
    exception_data text,
    number_of_occurrences integer NOT NULL,
    execution_id uuid NOT NULL
);
CREATE SEQUENCE public.argo_execution_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.argo_execution_log_id_seq OWNED BY public.argo_execution_log.id;
CREATE TABLE public.configuration (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    project_id uuid NOT NULL,
    performed boolean DEFAULT false NOT NULL,
    created_by_id uuid,
    type_slug text,
    test_source_id uuid,
    instances integer DEFAULT 1 NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    has_pre_test boolean DEFAULT false NOT NULL,
    has_post_test boolean DEFAULT false NOT NULL,
    has_load_tests boolean DEFAULT false NOT NULL,
    has_monitoring boolean DEFAULT false NOT NULL,
    monitoring_chart_configuration json
);
CREATE TABLE public.configuration_envvars (
    configuration_id uuid NOT NULL,
    name text NOT NULL,
    value text NOT NULL
);
CREATE TABLE public.configuration_extension (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    configuration_id uuid NOT NULL,
    type text NOT NULL
);
CREATE TABLE public.configuration_type (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    slug_name text DEFAULT 'load_tests'::text NOT NULL
);
CREATE TABLE public.execution (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    configuration_id uuid NOT NULL,
    start timestamp with time zone DEFAULT now(),
    "end" timestamp with time zone,
    status text NOT NULL,
    test_preparation_job_id text,
    test_job_id text,
    test_preparation_job_status text,
    test_preparation_job_statuscheck_timestamp timestamp with time zone,
    test_preparation_job_error text,
    created_by_id uuid,
    test_job_error text,
    commit_hash text,
    start_locust timestamp with time zone,
    end_locust timestamp with time zone,
    total_requests integer DEFAULT 0 NOT NULL,
    passed_requests integer DEFAULT 0 NOT NULL,
    failed_requests integer DEFAULT 0 NOT NULL,
    argo_name text
);
CREATE SEQUENCE public.execution_additional_data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.execution_additional_data_id_seq OWNED BY public.execution_additional_data.id;
CREATE SEQUENCE public.execution_distribution_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.execution_distribution_id_seq OWNED BY public.execution_distribution.id;
CREATE SEQUENCE public.execution_errors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.execution_errors_id_seq OWNED BY public.execution_errors.id;
CREATE TABLE public.execution_export_token (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    execution_id uuid,
    created_by_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    project_id uuid,
    oid integer NOT NULL,
    valid_hours integer DEFAULT 24 NOT NULL
);
CREATE SEQUENCE public.execution_export_token_oid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.execution_export_token_oid_seq OWNED BY public.execution_export_token.oid;
CREATE SEQUENCE public.execution_metrics_data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.execution_metrics_data_id_seq OWNED BY public.execution_metrics_data.id;
CREATE SEQUENCE public.execution_metrics_metadata_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.execution_metrics_metadata_id_seq OWNED BY public.execution_metrics_metadata.id;
CREATE TABLE public.execution_request_totals (
    execution_id uuid NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    method text NOT NULL,
    name text NOT NULL,
    num_requests integer NOT NULL,
    num_failures integer NOT NULL,
    median_response_time numeric NOT NULL,
    average_response_time numeric NOT NULL,
    min_response_time numeric NOT NULL,
    max_response_time numeric NOT NULL,
    average_content_size numeric NOT NULL,
    requests_per_second numeric NOT NULL,
    identifier text NOT NULL,
    min_content_size numeric DEFAULT 0,
    max_content_size numeric DEFAULT 0
);
CREATE SEQUENCE public.execution_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.execution_requests_id_seq OWNED BY public.execution_requests.id;
CREATE SEQUENCE public.execution_stage_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.execution_stage_log_id_seq OWNED BY public.execution_stage_log.id;
CREATE TABLE public.extension_params (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    value text NOT NULL,
    configuration_extension_id uuid NOT NULL
);
CREATE TABLE public.parameter (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    param_type text NOT NULL,
    default_value text,
    param_name text,
    type_slug text DEFAULT 'load_tests'::text,
    slug_name text
);
CREATE TABLE public.project (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    image_url text,
    is_deleted boolean DEFAULT false,
    created_by_id uuid
);
CREATE TABLE public.repository (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    project_id uuid,
    performed boolean DEFAULT false NOT NULL,
    created_by_id uuid,
    type_slug text DEFAULT 'load_tests'::text,
    is_deleted boolean DEFAULT false NOT NULL
);
CREATE SEQUENCE public.result_aggregate_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.result_aggregate_id_seq OWNED BY public.result_aggregate.id;
CREATE SEQUENCE public.result_error_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.result_error_id_seq OWNED BY public.result_error.id;
CREATE TABLE public.test_creator (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    data json,
    created_by_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    max_wait integer NOT NULL,
    min_wait integer NOT NULL,
    name text,
    project_id uuid,
    previous_version_id uuid,
    performed boolean DEFAULT false NOT NULL,
    test_source_id uuid,
    type_slug text DEFAULT 'load_tests'::text NOT NULL
);
CREATE TABLE public.test_source (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    source_type text DEFAULT 'repository'::text NOT NULL,
    repository_id uuid,
    test_creator_id uuid,
    is_deleted boolean DEFAULT false NOT NULL
);
CREATE TABLE public.user_project (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_id uuid,
    project_id uuid
);
CREATE TABLE public.user_registration_token (
    token uuid DEFAULT public.gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    user_role text DEFAULT 'reader'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    invitation_token text
);
ALTER TABLE ONLY public.argo_execution_log ALTER COLUMN id SET DEFAULT nextval('public.argo_execution_log_id_seq'::regclass);
ALTER TABLE ONLY public.execution_additional_data ALTER COLUMN id SET DEFAULT nextval('public.execution_additional_data_id_seq'::regclass);
ALTER TABLE ONLY public.execution_distribution ALTER COLUMN id SET DEFAULT nextval('public.execution_distribution_id_seq'::regclass);
ALTER TABLE ONLY public.execution_errors ALTER COLUMN id SET DEFAULT nextval('public.execution_errors_id_seq'::regclass);
ALTER TABLE ONLY public.execution_export_token ALTER COLUMN oid SET DEFAULT nextval('public.execution_export_token_oid_seq'::regclass);
ALTER TABLE ONLY public.execution_metrics_data ALTER COLUMN id SET DEFAULT nextval('public.execution_metrics_data_id_seq'::regclass);
ALTER TABLE ONLY public.execution_metrics_metadata ALTER COLUMN id SET DEFAULT nextval('public.execution_metrics_metadata_id_seq'::regclass);
ALTER TABLE ONLY public.execution_requests ALTER COLUMN id SET DEFAULT nextval('public.execution_requests_id_seq'::regclass);
ALTER TABLE ONLY public.execution_stage_log ALTER COLUMN id SET DEFAULT nextval('public.execution_stage_log_id_seq'::regclass);
ALTER TABLE ONLY public.result_aggregate ALTER COLUMN id SET DEFAULT nextval('public.result_aggregate_id_seq'::regclass);
ALTER TABLE ONLY public.result_error ALTER COLUMN id SET DEFAULT nextval('public.result_error_id_seq'::regclass);
ALTER TABLE ONLY public.argo_execution_log
    ADD CONSTRAINT argo_execution_log_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.configuration_envvars
    ADD CONSTRAINT configuration_envvars_pkey PRIMARY KEY (configuration_id, name);
ALTER TABLE ONLY public.configuration_extension
    ADD CONSTRAINT configuration_extension_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.configuration_parameter
    ADD CONSTRAINT configuration_parameter_pkey PRIMARY KEY (configuration_id, parameter_slug);
ALTER TABLE ONLY public.configuration
    ADD CONSTRAINT configuration_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.configuration_type
    ADD CONSTRAINT configuration_type_name_key UNIQUE (name);
ALTER TABLE ONLY public.configuration_type
    ADD CONSTRAINT configuration_type_slug_name_key UNIQUE (slug_name);
ALTER TABLE ONLY public.execution_additional_data
    ADD CONSTRAINT execution_additional_data_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.execution_distribution
    ADD CONSTRAINT execution_distribution_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.execution_errors
    ADD CONSTRAINT execution_errors_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.execution_export_token
    ADD CONSTRAINT execution_export_token_oid_key UNIQUE (oid);
ALTER TABLE ONLY public.execution_export_token
    ADD CONSTRAINT execution_export_token_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.execution_instance
    ADD CONSTRAINT execution_instance_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.execution_metrics_data
    ADD CONSTRAINT execution_metrics_data_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.execution_metrics_metadata
    ADD CONSTRAINT execution_metrics_metadata_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.execution
    ADD CONSTRAINT execution_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.execution_request_totals
    ADD CONSTRAINT execution_request_totals_pkey PRIMARY KEY (execution_id, identifier);
ALTER TABLE ONLY public.execution_requests
    ADD CONSTRAINT execution_requests_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.execution_stage_log
    ADD CONSTRAINT execution_stage_log_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.execution_users
    ADD CONSTRAINT execution_users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.extension_params
    ADD CONSTRAINT extension_params_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.parameter
    ADD CONSTRAINT parameter_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.parameter
    ADD CONSTRAINT parameter_slug_name_key UNIQUE (slug_name);
ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.repository
    ADD CONSTRAINT repository_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.result_aggregate
    ADD CONSTRAINT result_aggregate_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.result_error
    ADD CONSTRAINT result_error_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.test_creator
    ADD CONSTRAINT test_creator_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.test_source
    ADD CONSTRAINT test_source_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.configuration_type
    ADD CONSTRAINT types_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_project
    ADD CONSTRAINT user_project_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_registration_token
    ADD CONSTRAINT user_registration_token_invitation_token_key UNIQUE (invitation_token);
ALTER TABLE ONLY public.user_registration_token
    ADD CONSTRAINT user_registration_token_pkey PRIMARY KEY (token);
ALTER TABLE ONLY public.configuration_envvars
    ADD CONSTRAINT configuration_envvars_configuration_id_fkey FOREIGN KEY (configuration_id) REFERENCES public.configuration(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.configuration_extension
    ADD CONSTRAINT configuration_extension_configuration_id_fkey FOREIGN KEY (configuration_id) REFERENCES public.configuration(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.configuration_parameter
    ADD CONSTRAINT configuration_parameter_configuration_id_fkey FOREIGN KEY (configuration_id) REFERENCES public.configuration(id);
ALTER TABLE ONLY public.configuration_parameter
    ADD CONSTRAINT configuration_parameter_parameter_slug_fkey FOREIGN KEY (parameter_slug) REFERENCES public.parameter(slug_name);
ALTER TABLE ONLY public.configuration
    ADD CONSTRAINT configuration_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(id);
ALTER TABLE ONLY public.configuration
    ADD CONSTRAINT configuration_test_source_id_fkey FOREIGN KEY (test_source_id) REFERENCES public.test_source(id);
ALTER TABLE ONLY public.configuration
    ADD CONSTRAINT configuration_type_slug_fkey FOREIGN KEY (type_slug) REFERENCES public.configuration_type(slug_name);
ALTER TABLE ONLY public.execution_additional_data
    ADD CONSTRAINT execution_additional_data_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.execution(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.execution
    ADD CONSTRAINT execution_configuration_id_fkey FOREIGN KEY (configuration_id) REFERENCES public.configuration(id);
ALTER TABLE ONLY public.execution_distribution
    ADD CONSTRAINT execution_distribution_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.execution(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.execution_errors
    ADD CONSTRAINT execution_errors_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.execution(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.execution_export_token
    ADD CONSTRAINT execution_export_token_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.execution(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.execution_export_token
    ADD CONSTRAINT execution_export_token_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.execution_instance
    ADD CONSTRAINT execution_instance_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.execution(id);
ALTER TABLE ONLY public.execution_metrics_data
    ADD CONSTRAINT execution_metrics_data_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.execution(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.execution_metrics_metadata
    ADD CONSTRAINT execution_metrics_metadata_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.execution(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.execution_request_totals
    ADD CONSTRAINT execution_request_totals_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.execution(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.execution_requests
    ADD CONSTRAINT execution_requests_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.execution(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.execution_stage_log
    ADD CONSTRAINT execution_stage_log_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.execution(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.execution_users
    ADD CONSTRAINT execution_users_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.execution(id) ON UPDATE RESTRICT ON DELETE CASCADE;
ALTER TABLE ONLY public.extension_params
    ADD CONSTRAINT extension_params_configuration_extension_id_fkey FOREIGN KEY (configuration_extension_id) REFERENCES public.configuration_extension(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.parameter
    ADD CONSTRAINT parameter_type_slug_fkey FOREIGN KEY (type_slug) REFERENCES public.configuration_type(slug_name);
ALTER TABLE ONLY public.repository
    ADD CONSTRAINT repository_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(id);
ALTER TABLE ONLY public.repository
    ADD CONSTRAINT repository_type_slug_fkey FOREIGN KEY (type_slug) REFERENCES public.configuration_type(slug_name);
ALTER TABLE ONLY public.result_aggregate
    ADD CONSTRAINT result_aggregate_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.execution(id);
ALTER TABLE ONLY public.result_error
    ADD CONSTRAINT result_error_execution_id_fkey FOREIGN KEY (execution_id) REFERENCES public.execution(id);
ALTER TABLE ONLY public.test_creator
    ADD CONSTRAINT test_creator_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(id);
ALTER TABLE ONLY public.test_source
    ADD CONSTRAINT test_source_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(id);
ALTER TABLE ONLY public.test_source
    ADD CONSTRAINT test_source_repository_id_fkey FOREIGN KEY (repository_id) REFERENCES public.repository(id);
ALTER TABLE ONLY public.test_source
    ADD CONSTRAINT test_source_test_creator_id_fkey FOREIGN KEY (test_creator_id) REFERENCES public.test_creator(id);
ALTER TABLE ONLY public.user_project
    ADD CONSTRAINT user_project_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(id);
ALTER TABLE ONLY public.user_registration_token
    ADD CONSTRAINT user_registration_token_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(id) ON UPDATE CASCADE ON DELETE CASCADE;
