import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260908170000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "navigation_config" ("id" text not null, "name" text not null, "mode" text check ("mode" in ('DEFAULT', 'CAMPAIGN', 'CUSTOM')) not null default 'DEFAULT', "items" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "navigation_config_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_navigation_config_deleted_at" ON "navigation_config" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "navigation_config" cascade;`);
  }

}
