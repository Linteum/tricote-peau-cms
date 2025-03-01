import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "art_events" ALTER COLUMN "event_id" SET DEFAULT 'e8cbd55c-fb18-4e89-bcf5-fd870c0c2da8';
  ALTER TABLE "_art_events_v" ALTER COLUMN "version_event_id" SET DEFAULT 'e8cbd55c-fb18-4e89-bcf5-fd870c0c2da8';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "art_events" ALTER COLUMN "event_id" SET DEFAULT 'ba4fe71b-b70d-41fb-bb4b-b37e9eb02769';
  ALTER TABLE "_art_events_v" ALTER COLUMN "version_event_id" SET DEFAULT 'ba4fe71b-b70d-41fb-bb4b-b37e9eb02769';`)
}
