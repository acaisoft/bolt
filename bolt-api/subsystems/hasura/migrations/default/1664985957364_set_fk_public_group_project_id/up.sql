alter table "public"."group"
  add constraint "group_project_id_fkey"
  foreign key ("project_id")
  references "public"."project"
  ("id") on update restrict on delete restrict;
