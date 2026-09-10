import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260908165954 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "craft" drop constraint if exists "craft_slug_unique";`);
    this.addSql(`create table if not exists "craft" ("id" text not null, "name" text not null, "slug" text not null, "summary" text null, "history" text null, "process" text null, "origin" text null, "heroMedia" text null, "gallery" jsonb null, "videos" jsonb null, "seo" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "craft_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_craft_slug_unique" ON "craft" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_craft_deleted_at" ON "craft" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "craft" cascade;`);
  }

}
