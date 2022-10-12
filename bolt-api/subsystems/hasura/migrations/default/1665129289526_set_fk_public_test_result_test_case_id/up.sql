alter table "public"."test_result"
  add constraint "test_result_test_case_id_fkey"
  foreign key ("test_case_id")
  references "public"."test_case"
  ("id") on update restrict on delete restrict;
