import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260908165959 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "campaign_theme" ("id" text not null, "name" text not null, "backgroundColor" text null, "foregroundColor" text null, "accentColor" text null, "mutedColor" text null, "headingFontToken" text null, "bodyFontToken" text null, "navigationTheme" text null, "logoVariant" text null, "productCardVariant" text null, "buttonVariant" text null, "defaultSectionSpacing" text null, "pageTransition" text null, "cursorVariant" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "campaign_theme_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_campaign_theme_deleted_at" ON "campaign_theme" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "campaign_theme" cascade;`);
  }

}
