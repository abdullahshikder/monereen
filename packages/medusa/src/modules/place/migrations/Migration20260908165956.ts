import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260908165956 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "place" drop constraint if exists "place_slug_unique";`);
    this.addSql(`create table if not exists "place" ("id" text not null, "name" text not null, "slug" text not null, "country" text null, "region" text null, "description" text null, "media" jsonb null, "seo" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "place_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_place_slug_unique" ON "place" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_place_deleted_at" ON "place" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "place" cascade;`);
  }

}
