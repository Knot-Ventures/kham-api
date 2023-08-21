DO $$ BEGIN
 CREATE TYPE "admin_role" AS ENUM('administrator', 'customer_service', 'sales', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "business_entity_type" AS ENUM('factory', 'supplier', 'restaurant');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "catalog_requests_status" AS ENUM('fulfilled', 'accepted', 'rejected', 'canceled', 'voided', 'pending_response', 'parked');
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
CREATE TABLE IF NOT EXISTS "admin_access" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_type" "admin_role",
	"permissions" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "catalog_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"vendor_id" uuid NOT NULL,
	"description" text,
	"images" varchar(256)[],
	"title" varchar(256),
	"subtitle" varchar(256),
	"min_qty" double precision,
	"available_qty" double precision,
	"unit" varchar(16),
	"average_market_price" double precision,
	"is_removed" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "catalog_request_contact_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"governorate" text,
	"city" text,
	"address" text,
	"phone_number" text,
	"email" text,
	"location" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "catalog_request_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"catalog_entry_id" uuid,
	"catalog_request_id" uuid,
	"quantity" double precision
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "catalog_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"request_contact_info_id" uuid,
	"item_count" integer,
	"created_at" timestamp,
	"submitted_at" timestamp,
	"responded_at" timestamp,
	"status" "catalog_requests_status",
	"notes" text,
	"other_items" jsonb,
	"is_removed" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256),
	"e_number" varchar(6),
	"other_names" text,
	"uses" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text,
	"last_name" text,
	"profile_image" varchar(256),
	"auth_id" varchar(256) NOT NULL,
	"fcm_tokens" varchar(256)[],
	"user_type" "user_type",
	"business_type" "business_entity_type",
	"admin_access_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_contact_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
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
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
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
 ALTER TABLE "users" ADD CONSTRAINT "users_admin_access_id_admin_access_id_fk" FOREIGN KEY ("admin_access_id") REFERENCES "admin_access"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_contact_info" ADD CONSTRAINT "user_contact_info_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
