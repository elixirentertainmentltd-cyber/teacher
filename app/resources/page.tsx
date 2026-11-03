import type { Metadata } from "next";
import ResourceExplorer from "@/components/ResourceExplorer";
import { STAGES, type Stage } from "@/lib/resources";
export const metadata: Metadata = { title: "Teaching resources", description: "Browse free UK maths and English worksheets by Key Stage from KS1 to KS4. Print and customise classroom activities." };
export default async function ResourcesPage({searchParams}:{searchParams: Promise<{stage?: string; type?: string; subject?: string}>}) {
  const {stage, type, subject} = await searchParams;
  const initialStage: "All" | Stage = STAGES.some(item=>item.id===stage) ? stage as Stage : "All";
  return <ResourceExplorer initialStage={initialStage} initialType={type === "interactive" ? "Interactive activity" : type === "printable" ? "Printable worksheet" : "All"} initialSubject={subject ?? "All"}/>;
}
