alter table "public"."test_case"
  add constraint "test_case_project_id_fkey"
  foreign key ("project_id")
  references "public"."project"
  ("id") on update restrict on delete restrict;
