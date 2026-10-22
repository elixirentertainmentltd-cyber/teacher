import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findResource, RESOURCES } from "@/lib/resources";
import ActivityBuilder from "@/components/ActivityBuilder";

export function generateStaticParams() { return RESOURCES.map(item=>({slug:item.slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata> {
  const {slug} = await params; const resource = findResource(slug);
  return {title:resource?.title ?? "Resource",description:resource?.description};
}
export default async function WorksheetPage({params}:{params:Promise<{slug:string}>}) {
  const {slug} = await params; const resource = findResource(slug);
  if (!resource) notFound();
  return <ActivityBuilder resource={resource}/>;
}
