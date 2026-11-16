import type { Metadata } from "next";
import ResourceExplorer from "@/components/ResourceExplorer";
import { getPublishedResources } from "@/lib/catalogue";
import { terms } from "@/lib/cms";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Free teaching resources",description:"Discover free learning resources for UK Key Stages 1 to 4."};
export default async function ResourcesPage({searchParams}:{searchParams:Promise<{stage?:string;type?:string;subject?:string}>}) {
 const {stage,type,subject}=await searchParams;
 const resources=await getPublishedResources();
 const kinds=["stages","subjects","types","categories","years"] as const;
 const data=await Promise.all(kinds.map(async kind=>{try{return (await terms(kind)).filter(t=>!!t.enabled).map(t=>String(t.name))}catch{return [] as string[]}}));
 const fromResources=[
 resources.flatMap(r=>r.stages),resources.map(r=>r.subject),resources.map(r=>r.type),resources.map(r=>r.category),resources.flatMap(r=>r.years.split(",").map(s=>s.trim()))
 ];
 const available=data.map((items,i)=>Array.from(new Set([...items,...fromResources[i]].filter(Boolean))));
 const options={stages:available[0],subjects:available[1],types:available[2],categories:available[3],years:available[4]};
 const legacyType=type==="interactive"?"Interactive activity":type==="printable"?"Printable worksheet":type;
 return <ResourceExplorer resources={resources} options={options} initialStage={stage&&options.stages.includes(stage)?stage:"All"} initialType={legacyType&&options.types.includes(legacyType)?legacyType:"All"} initialSubject={subject&&options.subjects.includes(subject)?subject:"All"}/>;
}
