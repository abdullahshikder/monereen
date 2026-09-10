import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260908165955 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "material" drop constraint if exists "material_slug_unique";`);
    this.addSql(`create table if not exists "material" ("id" text not null, "name" text not null, "slug" text not null, "summary" text null, "description" text null, "origin" text null, "media" jsonb null, "seo" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "material_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_material_slug_unique" ON "material" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_material_deleted_at" ON "material" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "material" cascade;`);
  }

}
