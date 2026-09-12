import type { Metadata } from "next";
import { EditorialStudyPage, getStudyMetadata } from "@/app/editorial-study-page";

type PlacePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PlacePageProps): Promise<Metadata> {
  const { slug } = await params;
  return getStudyMetadata("place", slug);
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { slug } = await params;
  return <EditorialStudyPage type="place" slug={slug} />;
}
