alter table "public"."test_run"
  add constraint "test_run_external_scenario_id_fkey"
  foreign key ("external_scenario_id")
  references "public"."external_test_scenario"
  ("id") on update restrict on delete restrict;
