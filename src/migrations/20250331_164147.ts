import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_art_orgs_category" AS ENUM('lieu', 'association', 'plateforme', 'outil');
  CREATE TYPE "public"."enum_art_orgs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__art_orgs_v_version_category" AS ENUM('lieu', 'association', 'plateforme', 'outil');
  CREATE TYPE "public"."enum__art_orgs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__art_orgs_v_published_locale" AS ENUM('en', 'fr');
  CREATE TABLE IF NOT EXISTS "art_orgs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"website" varchar,
  	"category" "enum_art_orgs_category",
  	"subcategory" varchar,
  	"city" varchar,
  	"canceled" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_art_orgs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "_art_orgs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_website" varchar,
  	"version_category" "enum__art_orgs_v_version_category",
  	"version_subcategory" varchar,
  	"version_city" varchar,
  	"version_canceled" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__art_orgs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__art_orgs_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "art_events" ALTER COLUMN "event_id" SET DEFAULT 'c49ddd81-d5c0-44ff-8127-1afe12c5f4c3';
  ALTER TABLE "_art_events_v" ALTER COLUMN "version_event_id" SET DEFAULT 'c49ddd81-d5c0-44ff-8127-1afe12c5f4c3';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "art_orgs_id" integer;
  DO $$ BEGIN
   ALTER TABLE "_art_orgs_v" ADD CONSTRAINT "_art_orgs_v_parent_id_art_orgs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."art_orgs"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE UNIQUE INDEX IF NOT EXISTS "art_orgs_name_idx" ON "art_orgs" USING btree ("name");
  CREATE INDEX IF NOT EXISTS "art_orgs_updated_at_idx" ON "art_orgs" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "art_orgs_created_at_idx" ON "art_orgs" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "art_orgs__status_idx" ON "art_orgs" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_art_orgs_v_parent_idx" ON "_art_orgs_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_art_orgs_v_version_version_name_idx" ON "_art_orgs_v" USING btree ("version_name");
  CREATE INDEX IF NOT EXISTS "_art_orgs_v_version_version_updated_at_idx" ON "_art_orgs_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_art_orgs_v_version_version_created_at_idx" ON "_art_orgs_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_art_orgs_v_version_version__status_idx" ON "_art_orgs_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_art_orgs_v_created_at_idx" ON "_art_orgs_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_art_orgs_v_updated_at_idx" ON "_art_orgs_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_art_orgs_v_snapshot_idx" ON "_art_orgs_v" USING btree ("snapshot");
  CREATE INDEX IF NOT EXISTS "_art_orgs_v_published_locale_idx" ON "_art_orgs_v" USING btree ("published_locale");
  CREATE INDEX IF NOT EXISTS "_art_orgs_v_latest_idx" ON "_art_orgs_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_art_orgs_v_autosave_idx" ON "_art_orgs_v" USING btree ("autosave");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_art_orgs_fk" FOREIGN KEY ("art_orgs_id") REFERENCES "public"."art_orgs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_art_orgs_id_idx" ON "payload_locked_documents_rels" USING btree ("art_orgs_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "art_orgs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_art_orgs_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "art_orgs" CASCADE;
  DROP TABLE "_art_orgs_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_art_orgs_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_art_orgs_id_idx";
  ALTER TABLE "art_events" ALTER COLUMN "event_id" SET DEFAULT 'ba4fe71b-b70d-41fb-bb4b-b37e9eb02769';
  ALTER TABLE "_art_events_v" ALTER COLUMN "version_event_id" SET DEFAULT 'ba4fe71b-b70d-41fb-bb4b-b37e9eb02769';
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "art_orgs_id";
  DROP TYPE "public"."enum_art_orgs_category";
  DROP TYPE "public"."enum_art_orgs_status";
  DROP TYPE "public"."enum__art_orgs_v_version_category";
  DROP TYPE "public"."enum__art_orgs_v_version_status";
  DROP TYPE "public"."enum__art_orgs_v_published_locale";`)
}
