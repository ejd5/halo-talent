import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { creators } from "../data";
import { CreatorDetailPage } from "./components/CreatorDetailPage";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const creator = creators.find((c) => c.id === id);
  return {
    title: creator
      ? `${creator.full_name}, Where Talent Forms Admin`
      : "Créateur, Where Talent Forms Admin",
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const creator = creators.find((c) => c.id === id);
  if (!creator) notFound();
  return <CreatorDetailPage creator={creator} />;
}
