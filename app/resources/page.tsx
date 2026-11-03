import type { Metadata } from "next";
import ResourceExplorer from "@/components/ResourceExplorer";
import { STAGES, SUBJECTS, type Stage, type Subject, type ResourceType } from "@/lib/resources";
import { getPublishedResources } from "@/lib/catalogue";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Free teaching resources",description:"Discover free learning resources for UK Key Stages 1 to 4."};
export default async function ResourcesPage({searchParams}:{searchParams:Promise<{stage?:string;type?:string;subject?:string}>}) {
 const {stage,type,subject}=await searchParams;
 const initialStage:"All"|Stage=STAGES.some(s=>s.id===stage)?stage as Stage:"All";
 const initialType:"All"|ResourceType=type==="interactive"?"Interactive activity":type==="printable"?"Printable worksheet":"All";
 const initialSubject=SUBJECTS.includes(subject as Subject)?subject!:"All";
 const resources=await getPublishedResources();
 return <ResourceExplorer resources={resources} initialStage={initialStage} initialType={initialType} initialSubject={initialSubject}/>;
}
