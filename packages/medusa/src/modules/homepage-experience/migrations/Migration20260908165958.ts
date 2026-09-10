import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260908165958 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "homepage_experience" ("id" text not null, "name" text not null, "dropId" text null, "pageData" jsonb null, "themeId" text null, "status" text check ("status" in ('DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED')) not null default 'DRAFT', "publishedAt" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "homepage_experience_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_homepage_experience_deleted_at" ON "homepage_experience" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "homepage_experience" cascade;`);
  }

}
