alter table "public"."user_project" drop constraint "user_project_project_id_fkey",
  add constraint "user_project_project_id_fkey"
  foreign key ("project_id")
  references "public"."project"
  ("id") on update cascade on delete cascade;

alter table "public"."configuration" drop constraint "configuration_project_id_fkey",
  add constraint "configuration_project_id_fkey"
  foreign key ("project_id")
  references "public"."project"
  ("id") on update cascade on delete cascade;

alter table "public"."configuration" drop constraint "configuration_test_source_id_fkey",
  add constraint "configuration_test_source_id_fkey"
  foreign key ("test_source_id")
  references "public"."test_source"
  ("id") on update cascade on delete cascade;

alter table "public"."configuration" drop constraint "configuration_type_slug_fkey",
  add constraint "configuration_type_slug_fkey"
  foreign key ("type_slug")
  references "public"."configuration_type"
  ("slug_name") on update cascade on delete cascade;

alter table "public"."configuration_envvars" drop constraint "configuration_envvars_configuration_id_fkey",
  add constraint "configuration_envvars_configuration_id_fkey"
  foreign key ("configuration_id")
  references "public"."configuration"
  ("id") on update cascade on delete cascade;

alter table "public"."configuration_parameter" drop constraint "configuration_parameter_configuration_id_fkey",
  add constraint "configuration_parameter_configuration_id_fkey"
  foreign key ("configuration_id")
  references "public"."configuration"
  ("id") on update cascade on delete cascade;

alter table "public"."configuration_parameter" drop constraint "configuration_parameter_parameter_slug_fkey",
  add constraint "configuration_parameter_parameter_slug_fkey"
  foreign key ("parameter_slug")
  references "public"."parameter"
  ("slug_name") on update cascade on delete cascade;

alter table "public"."custom_field" drop constraint "custom_field_test_run_id_fkey",
  add constraint "custom_field_test_run_id_fkey"
  foreign key ("test_run_id")
  references "public"."test_run"
  ("id") on update cascade on delete cascade;

alter table "public"."execution" drop constraint "execution_configuration_id_fkey",
  add constraint "execution_configuration_id_fkey"
  foreign key ("configuration_id")
  references "public"."configuration"
  ("id") on update cascade on delete cascade;

alter table "public"."execution" drop constraint "execution_configuration_id_fkey",
  add constraint "execution_configuration_id_fkey"
  foreign key ("configuration_id")
  references "public"."configuration"
  ("id") on update cascade on delete cascade;

alter table "public"."execution_additional_data" drop constraint "execution_additional_data_execution_id_fkey",
  add constraint "execution_additional_data_execution_id_fkey"
  foreign key ("execution_id")
  references "public"."execution"
  ("id") on update cascade on delete cascade;

alter table "public"."execution_instance" drop constraint "execution_instance_execution_id_fkey",
  add constraint "execution_instance_execution_id_fkey"
  foreign key ("execution_id")
  references "public"."execution"
  ("id") on update cascade on delete cascade;

alter table "public"."execution_users" drop constraint "execution_users_execution_id_fkey",
  add constraint "execution_users_execution_id_fkey"
  foreign key ("execution_id")
  references "public"."execution"
  ("id") on update cascade on delete cascade;

alter table "public"."parameter" drop constraint "parameter_type_slug_fkey",
  add constraint "parameter_type_slug_fkey"
  foreign key ("type_slug")
  references "public"."configuration_type"
  ("slug_name") on update cascade on delete cascade;

alter table "public"."repository" drop constraint "repository_project_id_fkey",
  add constraint "repository_project_id_fkey"
  foreign key ("project_id")
  references "public"."project"
  ("id") on update cascade on delete cascade;

alter table "public"."repository" drop constraint "repository_type_slug_fkey",
  add constraint "repository_type_slug_fkey"
  foreign key ("type_slug")
  references "public"."configuration_type"
  ("slug_name") on update cascade on delete cascade;

alter table "public"."result_aggregate" drop constraint "result_aggregate_execution_id_fkey",
  add constraint "result_aggregate_execution_id_fkey"
  foreign key ("execution_id")
  references "public"."execution"
  ("id") on update cascade on delete cascade;

alter table "public"."result_error" drop constraint "result_error_execution_id_fkey",
  add constraint "result_error_execution_id_fkey"
  foreign key ("execution_id")
  references "public"."execution"
  ("id") on update cascade on delete cascade;

alter table "public"."test_case" drop constraint "test_case_group_id_fkey",
  add constraint "test_case_group_id_fkey"
  foreign key ("group_id")
  references "public"."group"
  ("id") on update cascade on delete cascade;

alter table "public"."test_creator" drop constraint "test_creator_project_id_fkey",
  add constraint "test_creator_project_id_fkey"
  foreign key ("project_id")
  references "public"."project"
  ("id") on update cascade on delete cascade;

alter table "public"."test_result" drop constraint "test_result_test_case_id_fkey",
  add constraint "test_result_test_case_id_fkey"
  foreign key ("test_case_id")
  references "public"."test_case"
  ("id") on update cascade on delete cascade;

alter table "public"."test_result" drop constraint "test_result_test_run_id_fkey",
  add constraint "test_result_test_run_id_fkey"
  foreign key ("test_run_id")
  references "public"."test_run"
  ("id") on update cascade on delete cascade;

alter table "public"."test_run" drop constraint "test_run_scenario_id_fkey",
  add constraint "test_run_scenario_id_fkey"
  foreign key ("scenario_id")
  references "public"."configuration"
  ("id") on update cascade on delete cascade;

alter table "public"."test_source" drop constraint "test_source_project_id_fkey",
  add constraint "test_source_project_id_fkey"
  foreign key ("project_id")
  references "public"."project"
  ("id") on update cascade on delete cascade;

alter table "public"."test_source" drop constraint "test_source_project_id_fkey",
  add constraint "test_source_project_id_fkey"
  foreign key ("project_id")
  references "public"."project"
  ("id") on update cascade on delete cascade;

alter table "public"."test_source" drop constraint "test_source_repository_id_fkey",
  add constraint "test_source_repository_id_fkey"
  foreign key ("repository_id")
  references "public"."repository"
  ("id") on update cascade on delete cascade;

alter table "public"."test_source" drop constraint "test_source_test_creator_id_fkey",
  add constraint "test_source_test_creator_id_fkey"
  foreign key ("test_creator_id")
  references "public"."test_creator"
  ("id") on update cascade on delete cascade;
