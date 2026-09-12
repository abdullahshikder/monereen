import type { Metadata } from "next";
import { EditorialStudyPage, getStudyMetadata } from "@/app/editorial-study-page";

type MaterialPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: MaterialPageProps): Promise<Metadata> {
  const { slug } = await params;
  return getStudyMetadata("material", slug);
}

export default async function MaterialPage({ params }: MaterialPageProps) {
  const { slug } = await params;
  return <EditorialStudyPage type="material" slug={slug} />;
}
