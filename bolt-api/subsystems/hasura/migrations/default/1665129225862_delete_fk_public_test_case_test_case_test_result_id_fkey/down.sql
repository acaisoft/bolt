alter table "public"."test_case"
  add constraint "test_case_test_result_id_fkey"
  foreign key ("test_result_id")
  references "public"."test_result"
  ("id") on update restrict on delete restrict;
