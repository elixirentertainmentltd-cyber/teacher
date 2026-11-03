export type Stage = "KS1" | "KS2" | "KS3" | "KS4";
export type Subject = "Maths" | "English" | "Science" | "Reading & Writing" | "Speech & Language" | "Life Skills" | "Special Education";
export type ResourceType = "Printable worksheet" | "Interactive activity" | "Teaching resource";
export type Resource = {
  id: string; title: string; description: string; subject: Subject; stages: Stage[];
  years: string; type: ResourceType; category: string; url: string;
  published: boolean;
};
export const STAGES: { id: Stage; label: string; years: string; caption: string }[] = [
  { id:"KS1", label:"Key Stage 1", years:"Years 1–2", caption:"First big discoveries" },
  { id:"KS2", label:"Key Stage 2", years:"Years 3–6", caption:"Building confidence" },
  { id:"KS3", label:"Key Stage 3", years:"Years 7–9", caption:"Explore and grow" },
  { id:"KS4", label:"Key Stage 4", years:"Years 10–11", caption:"GCSE practice" }
];
export const SUBJECTS: Subject[] = ["Maths","English","Science","Reading & Writing","Speech & Language","Life Skills","Special Education"];
export const RESOURCE_TYPES: ResourceType[] = ["Interactive activity","Printable worksheet","Teaching resource"];
export function resourceHref(item: Resource) { return item.url; }
