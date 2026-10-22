export type Question = { prompt: string; answer: string; kind?: "write" | "spell" };
const PUNCTUATION: Question[] = [
  { prompt: "on monday we went to the park", answer: "On Monday we went to the park." },
  { prompt: "where is my blue pencil", answer: "Where is my blue pencil?" },
  { prompt: "wow that was amazing", answer: "Wow! That was amazing!" },
  { prompt: "my friend sam lives in leeds", answer: "My friend Sam lives in Leeds." },
  { prompt: "can i have some water please", answer: "Can I have some water, please?" },
  { prompt: "we bought apples bananas and pears", answer: "We bought apples, bananas and pears." },
  { prompt: "the dog barked loudly", answer: "The dog barked loudly." },
  { prompt: "stop shouted the teacher", answer: "“Stop!” shouted the teacher." },
  { prompt: "my birthday is in november", answer: "My birthday is in November." },
  { prompt: "what a beautiful rainbow", answer: "What a beautiful rainbow!" },
  { prompt: "i like reading writing and drawing", answer: "I like reading, writing and drawing." },
  { prompt: "does jess know the answer", answer: "Does Jess know the answer?" },
];
function seededRandom(seed: number) {
  let state = seed >>> 0;
  return (min: number, max: number) => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return min + state % (max - min + 1);
  };
}
export function makeQuestions(slug: string, seed: number, amount: number, selectedTable: number, spellingWords: string): Question[] {
  const rand = seededRandom(seed);
  const count = Math.max(4, Math.min(24, amount));
  if (slug === "spelling") {
    const words = spellingWords.split(/[\n,]+/).map(word => word.trim()).filter(Boolean).slice(0, 30);
    return words.map(word => ({ prompt: word, answer: word, kind: "spell" }));
  }
  if (slug === "punctuation") return Array.from({length: Math.min(count, PUNCTUATION.length)}, (_, i) => PUNCTUATION[(i + seed - 1) % PUNCTUATION.length]);
  return Array.from({length: count}, () => {
    if (slug === "number-bonds") {
      const target = rand(0,1) ? 20 : 10; const a = rand(0,target);
      return {prompt: String(a) + " + ____ = " + target, answer: String(target - a)};
    }
    if (slug === "addition-subtraction") {
      const a = rand(5,99), b = rand(1,a); const minus = rand(0,1) === 1;
      return {prompt: String(a) + (minus ? " − " : " + ") + String(b) + " = ____", answer: String(minus ? a-b : a+b)};
    }
    if (slug === "times-tables") {
      const a = selectedTable === 0 ? rand(2,12) : selectedTable, b = rand(1,12);
      return {prompt: String(a) + " × " + String(b) + " = ____", answer: String(a*b)};
    }
    if (slug === "fractions") {
      const denominators = [2,3,4,5,10]; const d = denominators[rand(0,denominators.length-1)];
      const n = rand(1,d-1), multiplier = rand(2,12);
      return {prompt: "Find " + n + "/" + d + " of " + d*multiplier, answer: String(n*multiplier)};
    }
    if (slug === "percentages") {
      const pcts = [10,20,25,50,75]; const pct = pcts[rand(0,pcts.length-1)];
      const number = rand(2,15)*20;
      return {prompt: "Find " + pct + "% of " + number, answer: String(pct*number/100)};
    }
    if (slug === "algebra") {
      const x = rand(-4,12), a = rand(2,8), b = rand(-9,9), total = a*x+b;
      const offset = b >= 0 ? " + " + b : " − " + Math.abs(b);
      return {prompt: "Solve: " + a + "x" + offset + " = " + total, answer: "x = " + x};
    }
    return {prompt: "Practise your skills", answer: ""};
  });
}
