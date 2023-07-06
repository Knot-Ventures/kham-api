DO $$ BEGIN
 CREATE TYPE "business_entity_type" AS ENUM('factory', 'supplier', 'restaurant');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "catalog_requests_status" AS ENUM('accepted', 'rejected', 'canceled', 'pending_response', 'parked');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "user_type" AS ENUM('individual', 'business');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "catalog_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" serial NOT NULL,
	"vendor_id" serial NOT NULL,
	"description" text,
	"images" varchar(256)[],
	"title" varchar(256),
	"subtitle" varchar(256),
	"min_qty" double precision,
	"available_qty" double precision,
	"unit" varchar(16),
	"average_market_price" double precision
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "catalog_request_contact_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"governorate" text,
	"city" text,
	"address" text,
	"phone_number" text,
	"email" text,
	"location" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "catalog_request_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"catalog_entry_id" serial NOT NULL,
	"catalog_request_id" serial NOT NULL,
	"quantity" double precision
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "catalog_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"request_contact_info_id" serial NOT NULL,
	"item_count" integer,
	"created_at" timestamp,
	"submitted_at" timestamp,
	"responded_at" timestamp,
	"status" "catalog_requests_status",
	"notes" text,
	"other_items" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"e_number" varchar(6),
	"other_names" text,
	"uses" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text,
	"last_name" text,
	"profile_image" varchar(256),
	"auth_id" serial NOT NULL,
	"contact_info_id" serial NOT NULL,
	"fcm_tokens" varchar(256)[],
	"user_type" "user_type",
	"business_type" "business_entity_type"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_contact_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"governorate" text,
	"city" text,
	"address" text,
	"phone_number" text,
	"email" text,
	"location" jsonb,
	"default" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vendors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"address" text,
	"image" varchar(256)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catalog_entries" ADD CONSTRAINT "catalog_entries_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catalog_entries" ADD CONSTRAINT "catalog_entries_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catalog_request_items" ADD CONSTRAINT "catalog_request_items_catalog_entry_id_catalog_entries_id_fk" FOREIGN KEY ("catalog_entry_id") REFERENCES "catalog_entries"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catalog_request_items" ADD CONSTRAINT "catalog_request_items_catalog_request_id_catalog_requests_id_fk" FOREIGN KEY ("catalog_request_id") REFERENCES "catalog_requests"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catalog_requests" ADD CONSTRAINT "catalog_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "catalog_requests" ADD CONSTRAINT "catalog_requests_request_contact_info_id_catalog_request_contact_info_id_fk" FOREIGN KEY ("request_contact_info_id") REFERENCES "catalog_request_contact_info"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_contact_info_id_user_contact_info_id_fk" FOREIGN KEY ("contact_info_id") REFERENCES "user_contact_info"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
