import type { Metadata } from "next";
import { EditorialStudyPage, getStudyMetadata } from "@/app/editorial-study-page";

type MakerPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: MakerPageProps): Promise<Metadata> {
  const { slug } = await params;
  return getStudyMetadata("maker", slug);
}

export default async function MakerPage({ params }: MakerPageProps) {
  const { slug } = await params;
  return <EditorialStudyPage type="maker" slug={slug} />;
}
