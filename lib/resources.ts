import { TOPICS } from "./curriculum-topics";
export type Stage = "KS1" | "KS2" | "KS3" | "KS4";
export type Subject = "Maths" | "English" | "Science" | "Reading & Writing" | "Speech & Language" | "Life Skills" | "Special Education";
export type Resource = {
  slug: string; title: string; description: string; subject: Subject;
  stages: Stage[]; years: string; type: "Printable worksheet"; category: string;
  colour: "coral" | "yellow" | "blue" | "mint" | "purple" | "pink";
};
export const STAGES: { id: Stage; label: string; years: string; caption: string }[] = [
  { id: "KS1", label: "Key Stage 1", years: "Years 1–2", caption: "The little breakthroughs" },
  { id: "KS2", label: "Key Stage 2", years: "Years 3–6", caption: "Growing confidence" },
  { id: "KS3", label: "Key Stage 3", years: "Years 7–9", caption: "Building foundations" },
  { id: "KS4", label: "Key Stage 4", years: "Years 10–11", caption: "GCSE-ready practice" },
];
export const RESOURCES: Resource[] = [
  { slug: "number-bonds", title: "Number bonds to 10 & 20", description: "Quick addition pairs for a confident start with numbers.", subject: "Maths", stages: ["KS1"], years: "Years 1–2", type: "Printable worksheet", category: "Number", colour: "yellow" },
  { slug: "addition-subtraction", title: "Addition & subtraction", description: "Fresh sums each time, with an optional answer sheet.", subject: "Maths", stages: ["KS1", "KS2"], years: "Years 1–4", type: "Printable worksheet", category: "Number", colour: "coral" },
  { slug: "spelling", title: "Spelling practice sheets", description: "Enter your own spelling words and make a ready-to-print sheet.", subject: "English", stages: ["KS1", "KS2", "KS3", "KS4"], years: "Years 1–11", type: "Printable worksheet", category: "Spelling", colour: "purple" },
  { slug: "times-tables", title: "Times tables workout", description: "Choose a table from 2 to 12 and generate mixed questions.", subject: "Maths", stages: ["KS2"], years: "Years 3–6", type: "Printable worksheet", category: "Multiplication", colour: "blue" },
  { slug: "punctuation", title: "Punctuation detective", description: "Find the missing capital letters and punctuation.", subject: "English", stages: ["KS2"], years: "Years 3–6", type: "Printable worksheet", category: "Writing", colour: "pink" },
  { slug: "fractions", title: "Fractions of amounts", description: "Practise finding simple fractions of whole-number amounts.", subject: "Maths", stages: ["KS2", "KS3"], years: "Years 5–7", type: "Printable worksheet", category: "Fractions", colour: "mint" },
  { slug: "percentages", title: "Percentage practice", description: "Work through familiar percentages of amounts with solutions.", subject: "Maths", stages: ["KS3", "KS4"], years: "Years 7–11", type: "Printable worksheet", category: "Number", colour: "yellow" },
  { slug: "algebra", title: "Solve for x", description: "One-step and two-step linear equations for GCSE preparation.", subject: "Maths", stages: ["KS3", "KS4"], years: "Years 9–11", type: "Printable worksheet", category: "Algebra", colour: "purple" },
];
const SUBJECTS: Subject[] = ["Maths","Science","Reading & Writing","Speech & Language","Life Skills","Special Education"];
const COLOURS: Resource["colour"][] = ["yellow","mint","purple","blue","coral","pink"];
for (const stage of STAGES) {
  TOPICS[stage.id].forEach((topics, subjectIndex) => topics.forEach(title => {
    RESOURCES.push({
      slug: stage.id.toLowerCase() + "-" + title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-$/,""),
      title, description: "A structured " + SUBJECTS[subjectIndex].toLowerCase() + " activity exploring " + title.toLowerCase() + ".",
      subject: SUBJECTS[subjectIndex], stages: [stage.id], years: stage.years,
      type: "Printable worksheet", category: SUBJECTS[subjectIndex], colour: COLOURS[subjectIndex]
    });
  }));
}
export function findResource(slug: string) { return RESOURCES.find(resource => resource.slug === slug); }
