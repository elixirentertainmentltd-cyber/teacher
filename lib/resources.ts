export type Stage = "KS1" | "KS2" | "KS3" | "KS4";
export type Subject = "Maths" | "English" | "Science" | "Reading & Writing" | "Speech & Language" | "Life Skills" | "Special Education";
export type ResourceType = "Printable worksheet" | "Interactive activity";
export type Resource = {
  slug: string;
  title: string;
  description: string;
  subject: Subject;
  stages: Stage[];
  years: string;
  yearGroups: number[];
  type: ResourceType;
  category: string;
  colour: "coral" | "yellow" | "blue" | "mint" | "purple" | "pink";
};

export const STAGES: { id: Stage; label: string; years: string; caption: string }[] = [
  { id: "KS1", label: "Key Stage 1", years: "Years 1–2", caption: "First big discoveries" },
  { id: "KS2", label: "Key Stage 2", years: "Years 3–6", caption: "Building confidence" },
  { id: "KS3", label: "Key Stage 3", years: "Years 7–9", caption: "Explore and grow" },
  { id: "KS4", label: "Key Stage 4", years: "Years 10–11", caption: "GCSE practice" },
];

export const RESOURCES: Resource[] = [
  {
    slug: "clock-adventures", title: "Clock Adventures",
    description: "Read analogue clocks through fun interactive rounds, with a printable progress report.",
    subject: "Maths", stages: ["KS1", "KS2"], years: "Years 1–6",
    yearGroups: [1,2,3,4,5,6], type: "Interactive activity", category: "Time", colour: "purple"
  },
  {
    slug: "number-bonds", title: "Number Bonds",
    description: "Generate number bond practice for totals of 10 and 20, ready to print.",
    subject: "Maths", stages: ["KS1"], years: "Years 1–2",
    yearGroups: [1,2], type: "Printable worksheet", category: "Addition", colour: "yellow"
  },
  {
    slug: "addition-subtraction", title: "Addition & Subtraction",
    description: "Fresh mixed calculation questions with optional answers for teachers.",
    subject: "Maths", stages: ["KS1", "KS2"], years: "Years 2–4",
    yearGroups: [2,3,4], type: "Printable worksheet", category: "Number", colour: "coral"
  },
  {
    slug: "spelling", title: "Spelling Practice",
    description: "Enter your own word list to generate handwriting and spelling sheets.",
    subject: "English", stages: ["KS1", "KS2"], years: "Years 1–6",
    yearGroups: [1,2,3,4,5,6], type: "Printable worksheet", category: "Spelling", colour: "pink"
  },
  {
    slug: "times-tables", title: "Times Tables",
    description: "Customisable multiplication practice from 2 to 12 times tables.",
    subject: "Maths", stages: ["KS2"], years: "Years 3–6",
    yearGroups: [3,4,5,6], type: "Printable worksheet", category: "Multiplication", colour: "blue"
  },
  {
    slug: "punctuation", title: "Punctuation Workshop",
    description: "Practise capital letters, full stops, commas and question marks.",
    subject: "Reading & Writing", stages: ["KS1", "KS2"], years: "Years 2–6",
    yearGroups: [2,3,4,5,6], type: "Printable worksheet", category: "Grammar", colour: "mint"
  },
  {
    slug: "fractions", title: "Fractions Practice",
    description: "Generate questions about finding fractions of whole-number quantities.",
    subject: "Maths", stages: ["KS2", "KS3"], years: "Years 4–7",
    yearGroups: [4,5,6,7], type: "Printable worksheet", category: "Fractions", colour: "purple"
  },
  {
    slug: "percentages", title: "Percentages Practice",
    description: "Find common percentages of amounts with a refreshable question sheet.",
    subject: "Maths", stages: ["KS2", "KS3"], years: "Years 5–8",
    yearGroups: [5,6,7,8], type: "Printable worksheet", category: "Percentages", colour: "yellow"
  },
  {
    slug: "algebra", title: "Algebra Starter",
    description: "Solve simple linear equations with generated questions and answer keys.",
    subject: "Maths", stages: ["KS3", "KS4"], years: "Years 7–11",
    yearGroups: [7,8,9,10,11], type: "Printable worksheet", category: "Algebra", colour: "blue"
  },
];

export const SUBJECTS: Subject[] = ["Maths", "English", "Science", "Reading & Writing", "Speech & Language", "Life Skills", "Special Education"];
export const RESOURCE_TYPES: ResourceType[] = ["Interactive activity", "Printable worksheet"];
export const resourceHref = (item: Resource) => item.type === "Interactive activity" ? "/resources/" + item.slug : "/worksheet/" + item.slug;
export function findResource(slug: string) { return RESOURCES.find(resource => resource.slug === slug); }
