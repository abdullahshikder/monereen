import type { Metadata } from "next";
import { EditorialStudyPage, getStudyMetadata } from "@/app/editorial-study-page";

type CraftPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: CraftPageProps): Promise<Metadata> {
  const { slug } = await params;
  return getStudyMetadata("craft", slug);
}

export default async function CraftPage({ params }: CraftPageProps) {
  const { slug } = await params;
  return <EditorialStudyPage type="craft" slug={slug} />;
}
