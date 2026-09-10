export type DropStatus = "DRAFT" | "UPCOMING" | "LIVE" | "ARCHIVED";
export type PageStatus = "DRAFT" | "REVIEW" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
export type PageType = "STANDARD" | "HOMEPAGE" | "DROP_LANDING" | "STORY" | "LOOKBOOK" | "CUSTOM";
export type NavigationMode = "DEFAULT" | "CAMPAIGN" | "CUSTOM";
export type SectionMode = "GLOBAL" | "DETACHED_COPY";
export type BuilderMode = "STANDARD" | "ADVANCED";

export interface SEO {
  title?: string;
  description?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export interface Drop {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  description?: string;
  status: DropStatus;
  launchAt?: string;
  endAt?: string;
  commerceCollectionId?: string;
  homepageTakeover: boolean;
  homepageExperienceId?: string;
  campaignThemeId?: string;
  navigationMode: NavigationMode;
  navigationConfigId?: string;
  announcement?: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt?: string;
  heroMedia?: string;
  status: PageStatus;
  publishedAt?: string;
  pageData?: Record<string, unknown>;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
}

export interface Maker {
  id: string;
  name: string;
  slug: string;
  portrait?: string;
  shortBio?: string;
  longBio?: string;
  location?: string;
  gallery?: string[];
  videos?: string[];
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
}

export interface Craft {
  id: string;
  name: string;
  slug: string;
  summary?: string;
  history?: string;
  process?: string;
  origin?: string;
  heroMedia?: string;
  gallery?: string[];
  videos?: string[];
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
}

export interface Material {
  id: string;
  name: string;
  slug: string;
  summary?: string;
  description?: string;
  origin?: string;
  media?: string[];
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
}

export interface Place {
  id: string;
  name: string;
  slug: string;
  country?: string;
  region?: string;
  description?: string;
  media?: string[];
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
}

export interface Lookbook {
  id: string;
  name: string;
  slug: string;
  dropId?: string;
  collectionId?: string;
  images?: string[];
  videos?: string[];
  pageData?: Record<string, unknown>;
  status: PageStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  pageType: PageType;
  pageData?: Record<string, unknown>;
  themeId?: string;
  navigationConfigId?: string;
  status: PageStatus;
  publishedAt?: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
}

export interface HomepageExperience {
  id: string;
  name: string;
  dropId?: string;
  pageData?: Record<string, unknown>;
  themeId?: string;
  navigationConfigId?: string;
  status: PageStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReusableSection {
  id: string;
  name: string;
  category?: string;
  componentData?: Record<string, unknown>;
  mode: SectionMode;
  status: PageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PageTemplate {
  id: string;
  name: string;
  category?: string;
  thumbnail?: string;
  description?: string;
  pageData?: Record<string, unknown>;
  themeId?: string;
  createdAt: string;
}

export interface CampaignTheme {
  id: string;
  name: string;
  backgroundColor?: string;
  foregroundColor?: string;
  accentColor?: string;
  mutedColor?: string;
  headingFontToken?: string;
  bodyFontToken?: string;
  navigationTheme?: string;
  logoVariant?: string;
  productCardVariant?: string;
  buttonVariant?: string;
  defaultSectionSpacing?: string;
  pageTransition?: string;
  cursorVariant?: string;
  imageTreatment?: string;
  videoTreatment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NavigationConfig {
  id: string;
  name: string;
  mode: NavigationMode;
  items: NavigationItem[];
  createdAt: string;
  updatedAt: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface BuilderBlock {
  type: string;
  props: Record<string, unknown>;
  children?: BuilderBlock[];
}

export interface BuilderPageData {
  content: BuilderBlock[];
  root: {
    props: Record<string, unknown>;
  };
}
