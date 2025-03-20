CREATE TABLE "drivers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"address" text,
	"license_number" text NOT NULL,
	"vendor_id" text NOT NULL,
	"vehicle_id" text,
	"status" text DEFAULT 'inactive' NOT NULL,
	"onboarding_status" text DEFAULT 'pending' NOT NULL,
	"documents" json DEFAULT '{}'::json,
	"metadata" json,
	"bank_details" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" text PRIMARY KEY NOT NULL,
	"registration_number" text NOT NULL,
	"model" text NOT NULL,
	"type" text NOT NULL,
	"seating_capacity" integer NOT NULL,
	"fuel_type" text NOT NULL,
	"vendor_id" text NOT NULL,
	"driver_id" text,
	"status" text DEFAULT 'inactive' NOT NULL,
	"documents" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vehicles_registration_number_unique" UNIQUE("registration_number")
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"level" text NOT NULL,
	"parent_id" text,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"location" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"permissions" json NOT NULL,
	"metadata" json
);
--> statement-breakpoint
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE no action ON UPDATE no action;