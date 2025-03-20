CREATE TABLE "users" (
  "id" uuid PRIMARY KEY NOT NULL,
  "email" varchar(255) NOT NULL UNIQUE,
  "password" text NOT NULL,
  "role" varchar(50) NOT NULL DEFAULT 'local_admin',
  "name" varchar(255) NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);
