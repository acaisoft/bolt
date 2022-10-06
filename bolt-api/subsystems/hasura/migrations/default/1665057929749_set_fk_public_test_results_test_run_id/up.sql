alter table "public"."test_results"
  add constraint "test_results_test_run_id_fkey"
  foreign key ("test_run_id")
  references "public"."test_run"
  ("id") on update restrict on delete restrict;
