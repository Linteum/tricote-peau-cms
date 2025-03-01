import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'fr');
  CREATE TYPE "public"."enum__art_events_v_published_locale" AS ENUM('en', 'fr');
  ALTER TYPE "public"."enum_art_events_type" ADD VALUE 'projection';
  ALTER TYPE "public"."enum__art_events_v_version_type" ADD VALUE 'projection';
  ALTER TABLE "art_events" ALTER COLUMN "event_id" SET DEFAULT 'ba4fe71b-b70d-41fb-bb4b-b37e9eb02769';
  ALTER TABLE "_art_events_v" ALTER COLUMN "version_event_id" SET DEFAULT 'ba4fe71b-b70d-41fb-bb4b-b37e9eb02769';
  ALTER TABLE "art_events" ADD COLUMN "intern_event" boolean DEFAULT false;
  ALTER TABLE "art_events" ADD COLUMN "description" varchar;
  ALTER TABLE "art_events" ADD COLUMN "text_body" jsonb;
  ALTER TABLE "art_events" ADD COLUMN "text_body_html" varchar;
  ALTER TABLE "art_events" ADD COLUMN "slug" varchar;
  ALTER TABLE "_art_events_v" ADD COLUMN "version_intern_event" boolean DEFAULT false;
  ALTER TABLE "_art_events_v" ADD COLUMN "version_description" varchar;
  ALTER TABLE "_art_events_v" ADD COLUMN "version_text_body" jsonb;
  ALTER TABLE "_art_events_v" ADD COLUMN "version_text_body_html" varchar;
  ALTER TABLE "_art_events_v" ADD COLUMN "version_slug" varchar;
  ALTER TABLE "_art_events_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_art_events_v" ADD COLUMN "published_locale" "enum__art_events_v_published_locale";
  CREATE INDEX IF NOT EXISTS "_art_events_v_snapshot_idx" ON "_art_events_v" USING btree ("snapshot");
  CREATE INDEX IF NOT EXISTS "_art_events_v_published_locale_idx" ON "_art_events_v" USING btree ("published_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "_art_events_v_snapshot_idx";
  DROP INDEX IF EXISTS "_art_events_v_published_locale_idx";
  ALTER TABLE "art_events" ALTER COLUMN "event_id" SET DEFAULT '0124f4c6-d746-4b19-a15e-dc1853754af2';
  ALTER TABLE "_art_events_v" ALTER COLUMN "version_event_id" SET DEFAULT '0124f4c6-d746-4b19-a15e-dc1853754af2';
  ALTER TABLE "art_events" DROP COLUMN IF EXISTS "intern_event";
  ALTER TABLE "art_events" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "art_events" DROP COLUMN IF EXISTS "text_body";
  ALTER TABLE "art_events" DROP COLUMN IF EXISTS "text_body_html";
  ALTER TABLE "art_events" DROP COLUMN IF EXISTS "slug";
  ALTER TABLE "_art_events_v" DROP COLUMN IF EXISTS "version_intern_event";
  ALTER TABLE "_art_events_v" DROP COLUMN IF EXISTS "version_description";
  ALTER TABLE "_art_events_v" DROP COLUMN IF EXISTS "version_text_body";
  ALTER TABLE "_art_events_v" DROP COLUMN IF EXISTS "version_text_body_html";
  ALTER TABLE "_art_events_v" DROP COLUMN IF EXISTS "version_slug";
  ALTER TABLE "_art_events_v" DROP COLUMN IF EXISTS "snapshot";
  ALTER TABLE "_art_events_v" DROP COLUMN IF EXISTS "published_locale";
  ALTER TABLE "public"."art_events" ALTER COLUMN "type" SET DATA TYPE text;
  DROP TYPE "public"."enum_art_events_type";
  CREATE TYPE "public"."enum_art_events_type" AS ENUM('musique', 'expo', 'festival', 'atelier');
  ALTER TABLE "public"."art_events" ALTER COLUMN "type" SET DATA TYPE "public"."enum_art_events_type" USING "type"::"public"."enum_art_events_type";
  ALTER TABLE "public"."_art_events_v" ALTER COLUMN "version_type" SET DATA TYPE text;
  DROP TYPE "public"."enum__art_events_v_version_type";
  CREATE TYPE "public"."enum__art_events_v_version_type" AS ENUM('musique', 'expo', 'festival', 'atelier');
  ALTER TABLE "public"."_art_events_v" ALTER COLUMN "version_type" SET DATA TYPE "public"."enum__art_events_v_version_type" USING "version_type"::"public"."enum__art_events_v_version_type";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum__art_events_v_published_locale";`)
}
