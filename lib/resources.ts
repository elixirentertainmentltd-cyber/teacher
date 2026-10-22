export type Stage = "KS1" | "KS2" | "KS3" | "KS4";
export type Subject = "Maths" | "English" | "Science" | "Reading & Writing" | "Speech & Language" | "Life Skills" | "Special Education";
export type Resource = {
  slug: string; title: string; description: string; subject: Subject;
  stages: Stage[]; years: string; type: "Printable worksheet" | "Interactive activity"; category: string;
  colour: "coral" | "yellow" | "blue" | "mint" | "purple" | "pink";
};
export const STAGES: { id: Stage; label: string; years: string; caption: string }[] = [
  { id: "KS1", label: "Key Stage 1", years: "Years 1–2", caption: "The little breakthroughs" },
  { id: "KS2", label: "Key Stage 2", years: "Years 3–6", caption: "Growing confidence" },
  { id: "KS3", label: "Key Stage 3", years: "Years 7–9", caption: "Building foundations" },
  { id: "KS4", label: "Key Stage 4", years: "Years 10–11", caption: "GCSE-ready practice" },
];
export const RESOURCES: Resource[] = [
  { slug:"clock-adventures", title:"Clock Adventures", description:"Practise telling the time on analogue clocks in interactive rounds, with printable progress reports.", subject:"Maths", stages:["KS1","KS2"], years:"Years 1–6", type:"Interactive activity", category:"Time", colour:"purple" }
];
export function findResource(slug: string) { return RESOURCES.find(resource => resource.slug === slug); }
