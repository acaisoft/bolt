alter table "public"."test_case"
  add constraint "test_case_group_id_fkey"
  foreign key ("group_id")
  references "public"."group"
  ("uuid") on update restrict on delete restrict;
