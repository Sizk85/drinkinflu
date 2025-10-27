CREATE TABLE IF NOT EXISTS "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"influencer_id" uuid NOT NULL,
	"team_id" uuid,
	"status" text DEFAULT 'pending' NOT NULL,
	"proof_urls" jsonb,
	"verification_status" text,
	"ai_score" numeric(3, 2),
	"verification_details" jsonb,
	"verified_at" timestamp,
	"payment_status" text DEFAULT 'unpaid',
	"payment_amount" numeric(10, 2),
	"platform_fee" numeric(10, 2),
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"receiver_id" uuid NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"number_of_people" integer DEFAULT 1,
	"total_amount" numeric(10, 2),
	"status" text DEFAULT 'confirmed',
	"checked_in_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"venue_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"event_type" text NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"poster_url" text,
	"images" jsonb,
	"has_promotion" boolean DEFAULT false,
	"promotion_details" jsonb,
	"discount_percentage" integer,
	"requires_booking" boolean DEFAULT false,
	"max_capacity" integer,
	"current_bookings" integer DEFAULT 0,
	"booking_fee" numeric(10, 2),
	"status" text DEFAULT 'upcoming',
	"is_published" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"view_count" integer DEFAULT 0,
	"interested_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bar_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"date" timestamp NOT NULL,
	"time_slot" text,
	"required_count" integer DEFAULT 1,
	"requirements" jsonb,
	"compensation_type" text NOT NULL,
	"cash_amount" numeric(10, 2),
	"drinks_value" numeric(10, 2),
	"total_value" numeric(10, 2) NOT NULL,
	"preferred_gender" text,
	"min_followers" integer,
	"via_team" boolean DEFAULT false,
	"status" text DEFAULT 'open' NOT NULL,
	"accepted_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "keeper_verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"keeper_id" uuid NOT NULL,
	"verification_type" text NOT NULL,
	"status" text DEFAULT 'pending',
	"document_url" text,
	"id_card_number" text,
	"phone_number" text,
	"phone_verified" boolean DEFAULT false,
	"verified_by" uuid,
	"verified_at" timestamp,
	"rejection_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "partner_venues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"venue_name" text NOT NULL,
	"venue_type" text NOT NULL,
	"description" text,
	"zone" text NOT NULL,
	"city" text NOT NULL,
	"address" text,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"phone" text,
	"email" text,
	"website" text,
	"logo_url" text,
	"images" jsonb,
	"music_style" text,
	"capacity" integer,
	"opening_hours" jsonb,
	"amenities" jsonb,
	"rating" numeric(3, 2) DEFAULT '0',
	"total_reviews" integer DEFAULT 0,
	"total_bookings" integer DEFAULT 0,
	"is_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"application_id" uuid,
	"reviewer_id" uuid NOT NULL,
	"reviewee_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "seat_bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"seat_keeper_id" uuid,
	"venue_name" text NOT NULL,
	"venue_zone" text NOT NULL,
	"venue_address" text,
	"keeper_start_time" timestamp NOT NULL,
	"customer_arrival_time" timestamp NOT NULL,
	"actual_arrival_time" timestamp,
	"number_of_seats" integer DEFAULT 2,
	"special_requests" text,
	"hourly_rate" numeric(10, 2) NOT NULL,
	"total_hours" numeric(4, 2) NOT NULL,
	"keeper_fee" numeric(10, 2) NOT NULL,
	"platform_fee" numeric(10, 2) NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"keeper_check_in_time" timestamp,
	"keeper_check_in_proof" text,
	"keeper_check_out_time" timestamp,
	"payment_status" text DEFAULT 'unpaid',
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "seat_keepers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true,
	"rating" numeric(3, 2) DEFAULT '0',
	"total_bookings" integer DEFAULT 0,
	"total_reviews" integer DEFAULT 0,
	"is_verified" boolean DEFAULT false,
	"verification_status" text DEFAULT 'unverified',
	"verified_badges" jsonb,
	"available_zones" jsonb,
	"available_times" jsonb,
	"total_earnings" numeric(10, 2) DEFAULT '0',
	"hourly_rate" numeric(10, 2) DEFAULT '150',
	"total_tips_received" numeric(10, 2) DEFAULT '0',
	"completion_rate" numeric(3, 2) DEFAULT '0',
	"average_response_time" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan" text NOT NULL,
	"status" text DEFAULT 'active',
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"influencer_id" uuid NOT NULL,
	"share_percentage" numeric(3, 2) DEFAULT '1.00',
	"status" text DEFAULT 'active',
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"commission_rate" numeric(3, 2) DEFAULT '0.15',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"from_user_id" uuid NOT NULL,
	"to_user_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"message" text,
	"status" text DEFAULT 'completed',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"balance_before" numeric(10, 2) NOT NULL,
	"balance_after" numeric(10, 2) NOT NULL,
	"related_job_id" uuid,
	"related_application_id" uuid,
	"description" text,
	"metadata" jsonb,
	"status" text DEFAULT 'completed',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"handle" text,
	"avatar_url" text,
	"bio" text,
	"phone" text,
	"ig_username" text,
	"ig_followers" integer,
	"ig_reach_avg" integer,
	"city" text,
	"zones" jsonb,
	"rating" numeric(3, 2) DEFAULT '0',
	"total_jobs" integer DEFAULT 0,
	"is_premium" boolean DEFAULT false,
	"bar_name" text,
	"bar_logo" text,
	"bar_location" text,
	"bar_zone" text,
	"bar_music_style" text,
	"bar_images" jsonb,
	"wallet_balance" numeric(10, 2) DEFAULT '0',
	"email_verified" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "venue_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"venue_id" uuid NOT NULL,
	"date" timestamp NOT NULL,
	"total_bookings" integer DEFAULT 0,
	"total_revenue" numeric(10, 2) DEFAULT '0',
	"total_views" integer DEFAULT 0,
	"unique_visitors" integer DEFAULT 0,
	"seat_keeper_bookings" integer DEFAULT 0,
	"average_wait_time" numeric(5, 2),
	"event_attendance" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "applications" ADD CONSTRAINT "applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "applications" ADD CONSTRAINT "applications_influencer_id_users_id_fk" FOREIGN KEY ("influencer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "applications" ADD CONSTRAINT "applications_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_booking_id_seat_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."seat_bookings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_bookings" ADD CONSTRAINT "event_bookings_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_bookings" ADD CONSTRAINT "event_bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_venue_id_partner_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."partner_venues"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jobs" ADD CONSTRAINT "jobs_bar_id_users_id_fk" FOREIGN KEY ("bar_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "keeper_verifications" ADD CONSTRAINT "keeper_verifications_keeper_id_seat_keepers_id_fk" FOREIGN KEY ("keeper_id") REFERENCES "public"."seat_keepers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "keeper_verifications" ADD CONSTRAINT "keeper_verifications_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "partner_venues" ADD CONSTRAINT "partner_venues_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewee_id_users_id_fk" FOREIGN KEY ("reviewee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "seat_bookings" ADD CONSTRAINT "seat_bookings_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "seat_bookings" ADD CONSTRAINT "seat_bookings_seat_keeper_id_seat_keepers_id_fk" FOREIGN KEY ("seat_keeper_id") REFERENCES "public"."seat_keepers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "seat_keepers" ADD CONSTRAINT "seat_keepers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_members" ADD CONSTRAINT "team_members_influencer_id_users_id_fk" FOREIGN KEY ("influencer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tips" ADD CONSTRAINT "tips_booking_id_seat_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."seat_bookings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tips" ADD CONSTRAINT "tips_from_user_id_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tips" ADD CONSTRAINT "tips_to_user_id_users_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_related_job_id_jobs_id_fk" FOREIGN KEY ("related_job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_related_application_id_applications_id_fk" FOREIGN KEY ("related_application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "venue_analytics" ADD CONSTRAINT "venue_analytics_venue_id_partner_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."partner_venues"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "job_id_idx" ON "applications" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "influencer_id_idx" ON "applications" USING btree ("influencer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_booking_id_idx" ON "chat_messages" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_sender_id_idx" ON "chat_messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_venue_id_idx" ON "events" USING btree ("venue_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_start_time_idx" ON "events" USING btree ("start_time");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_status_idx" ON "events" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bar_id_idx" ON "jobs" USING btree ("bar_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "date_idx" ON "jobs" USING btree ("date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "status_idx" ON "jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "venue_owner_id_idx" ON "partner_venues" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "venue_zone_idx" ON "partner_venues" USING btree ("zone");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "venue_is_active_idx" ON "partner_venues" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "booking_customer_id_idx" ON "seat_bookings" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "booking_seat_keeper_id_idx" ON "seat_bookings" USING btree ("seat_keeper_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "booking_status_idx" ON "seat_bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "handle_idx" ON "users" USING btree ("handle");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "analytics_venue_date_idx" ON "venue_analytics" USING btree ("venue_id","date");