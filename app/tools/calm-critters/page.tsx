import { getScenes } from "@/lib/calm-critters-store";
import type { Metadata } from "next";
import CalmCritters from "./CalmCritters";
export const metadata: Metadata = {
  title: "Calm Critters | Classroom tools",
  description: "A free, gentle classroom listening activity by Teach Me a Lesson. Reveal friendly creatures as your class stays calm."
};
export const dynamic="force-dynamic";
export default async function CalmCrittersPage() {
  try {const scenes=await getScenes();return scenes.length?<CalmCritters initialScenes={scenes}/>:<section className="section container"><h1>Calm Critters</h1><p>New worlds are being prepared. Please check back soon.</p></section>;}catch{return <section className="section container"><h1>Calm Critters</h1><p>Our worlds are temporarily unavailable. Please try again shortly.</p></section>;}
}
