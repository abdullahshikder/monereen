import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260909170646 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "page_asset" drop constraint if exists "page_asset_fileId_unique";`);
    this.addSql(`create table if not exists "page_asset" ("id" text not null, "fileId" text not null, "url" text not null, "filename" text not null, "mimeType" text not null, "size" integer not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "page_asset_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_page_asset_fileId_unique" ON "page_asset" ("fileId") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_page_asset_deleted_at" ON "page_asset" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "page_asset" cascade;`);
  }

}
