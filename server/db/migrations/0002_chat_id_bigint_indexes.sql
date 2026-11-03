ALTER TABLE "profiles" ALTER COLUMN "chat_id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "telegram_chats" ALTER COLUMN "chat_id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "telegram_chats_logs" ALTER COLUMN "chat_id" SET DATA TYPE bigint;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "clubs_url_name_uidx" ON "clubs" USING btree ("url_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gatherings_club_id_start_date_idx" ON "gatherings" USING btree ("club_id","start_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "profiles_chat_id_idx" ON "profiles" USING btree ("chat_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "profiles_club_rights_profile_club_idx" ON "profiles_club_rights" USING btree ("profile_id","club_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_schedules_history_schedule_id_idx" ON "user_schedules_history" USING btree ("schedule_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_telegram_id_idx" ON "user" USING btree ("telegram_id");--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "gatherings_guests" ADD CONSTRAINT "gatherings_guests_gathering_id_gatherings_id_fk" FOREIGN KEY ("gathering_id") REFERENCES "public"."gatherings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "user_schedules_history" ADD CONSTRAINT "user_schedules_history_schedule_id_user_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."user_schedules"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
