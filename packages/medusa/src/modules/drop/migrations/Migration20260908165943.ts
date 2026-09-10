import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260908165943 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "drop" drop constraint if exists "drop_slug_unique";`);
    this.addSql(`create table if not exists "drop" ("id" text not null, "name" text not null, "slug" text not null, "subtitle" text null, "description" text null, "status" text check ("status" in ('DRAFT', 'UPCOMING', 'LIVE', 'ARCHIVED')) not null default 'DRAFT', "launchAt" timestamptz null, "endAt" timestamptz null, "commerceCollectionId" text null, "homepageTakeover" boolean not null default false, "homepageExperienceId" text null, "campaignThemeId" text null, "navigationMode" text check ("navigationMode" in ('DEFAULT', 'CAMPAIGN', 'CUSTOM')) not null default 'DEFAULT', "navigationConfigId" text null, "announcement" text null, "seo" jsonb null, "publishedAt" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "drop_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_drop_slug_unique" ON "drop" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_drop_deleted_at" ON "drop" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "drop" cascade;`);
  }

}
