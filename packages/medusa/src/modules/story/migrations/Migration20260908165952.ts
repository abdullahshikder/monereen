import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260908165952 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "story" drop constraint if exists "story_slug_unique";`);
    this.addSql(`create table if not exists "story" ("id" text not null, "title" text not null, "slug" text not null, "subtitle" text null, "excerpt" text null, "heroMedia" text null, "status" text check ("status" in ('DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED')) not null default 'DRAFT', "pageData" jsonb null, "seo" jsonb null, "publishedAt" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "story_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_story_slug_unique" ON "story" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_story_deleted_at" ON "story" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "story" cascade;`);
  }

}
