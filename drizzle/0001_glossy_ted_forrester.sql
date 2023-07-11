DO $$ BEGIN
 CREATE TYPE "admin_role" AS ENUM('administrator', 'customer_service', 'sales', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "catalog_requests_status" ADD VALUE 'fulfilled';--> statement-breakpoint
ALTER TYPE "catalog_requests_status" ADD VALUE 'voided';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admin_access" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_type" "admin_role",
	"permissions" jsonb
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "admin_access_id" serial NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_admin_access_id_admin_access_id_fk" FOREIGN KEY ("admin_access_id") REFERENCES "admin_access"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
