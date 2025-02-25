import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "art_events" ALTER COLUMN "event_id" SET DEFAULT '0124f4c6-d746-4b19-a15e-dc1853754af2';
  ALTER TABLE "_art_events_v" ALTER COLUMN "version_event_id" SET DEFAULT '0124f4c6-d746-4b19-a15e-dc1853754af2';
  ALTER TABLE "art_events" ADD COLUMN "canceled" boolean DEFAULT false;
  ALTER TABLE "_art_events_v" ADD COLUMN "version_canceled" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "art_events" ALTER COLUMN "event_id" SET DEFAULT 'a9906e5b-a3f6-4eaf-a618-6f98b1b7b137';
  ALTER TABLE "_art_events_v" ALTER COLUMN "version_event_id" SET DEFAULT 'a9906e5b-a3f6-4eaf-a618-6f98b1b7b137';
  ALTER TABLE "art_events" DROP COLUMN IF EXISTS "canceled";
  ALTER TABLE "_art_events_v" DROP COLUMN IF EXISTS "version_canceled";`)
}
