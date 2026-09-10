import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260908165953 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "maker" drop constraint if exists "maker_slug_unique";`);
    this.addSql(`create table if not exists "maker" ("id" text not null, "name" text not null, "slug" text not null, "portrait" text null, "shortBio" text null, "longBio" text null, "location" text null, "gallery" jsonb null, "videos" jsonb null, "seo" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "maker_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_maker_slug_unique" ON "maker" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_maker_deleted_at" ON "maker" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "maker" cascade;`);
  }

}
