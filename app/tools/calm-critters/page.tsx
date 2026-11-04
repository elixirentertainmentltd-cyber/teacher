import type { Metadata } from "next";
import CalmCritters from "./CalmCritters";
export const metadata: Metadata = {
  title: "Calm Critters | Classroom tools",
  description: "A free, gentle classroom listening activity by Teach Me a Lesson. Reveal friendly creatures as your class stays calm."
};
export default function CalmCrittersPage() { return <CalmCritters />; }
