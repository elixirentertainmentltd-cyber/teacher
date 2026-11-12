// Original Teach Me a Lesson vocabulary sets. Inspired by the general idea of a daily word puzzle.
// Reference: https://github.com/teacherdotdev/vocab-sleuth (Apache-2.0).
export type Stage = "KS1" | "KS2" | "KS3" | "KS4";
export type WordCase = { word: string; clue: string; example: string };
export type LetterMark = "correct" | "present" | "absent";
export const STAGE_LABELS: Record<Stage,string> = { KS1:"Ages 5–7",KS2:"Ages 7–11",KS3:"Ages 11–14",KS4:"GCSE" };
export const CASES: Record<Stage,WordCase[]> = {
  KS1:[
    {word:"APPLE",clue:"A crunchy fruit that can be red or green.",example:"I packed an apple for lunch."},
    {word:"BRUSH",clue:"You use this to tidy your hair or paint a picture.",example:"I used a brush to paint a tree."},
    {word:"CLOUD",clue:"A white or grey shape floating in the sky.",example:"A fluffy cloud drifted past."},
    {word:"DREAM",clue:"A story or picture you imagine while asleep.",example:"I had a lovely dream."},
    {word:"FRIEND",clue:"Someone you like spending time with.",example:"My friend played with me."},
    {word:"GARDEN",clue:"An outdoor place where flowers may grow.",example:"We planted seeds in the garden."},
    {word:"JACKET",clue:"Clothing that keeps your upper body warm.",example:"I wore a jacket in the rain."},
    {word:"PENCIL",clue:"You can write or draw with this.",example:"I sharpened my pencil."},
    {word:"RABBIT",clue:"An animal with long ears that can hop.",example:"The rabbit hopped across the grass."},
    {word:"SUNSET",clue:"When the sun goes down at the end of the day.",example:"We watched the orange sunset."}
  ],
  KS2:[
    {word:"ANCIENT",clue:"Very old, especially from long ago in history.",example:"We visited an ancient castle."},
    {word:"BRAVERY",clue:"The quality of facing fear with courage.",example:"Her bravery helped the team."},
    {word:"CURIOUS",clue:"Wanting to learn or find something out.",example:"The curious pupil asked why."},
    {word:"DISCOVER",clue:"To find something for the first time.",example:"Scientists discover new things."},
    {word:"EVIDENCE",clue:"Facts or objects that help prove something.",example:"The detective collected evidence."},
    {word:"FRAGILE",clue:"Easy to break or damage.",example:"The fragile vase needed care."},
    {word:"JOURNEY",clue:"Travelling from one place to another.",example:"Our journey took two hours."},
    {word:"MYSTERY",clue:"Something strange that has not been explained.",example:"We solved the mystery together."},
    {word:"PATTERN",clue:"Something that repeats in a regular way.",example:"The tiles formed a pattern."},
    {word:"WEATHER",clue:"The conditions outside, such as rain or sunshine.",example:"The weather changed quickly."}
  ],
  KS3:[
    {word:"ANALYSE",clue:"To examine something closely and explain its parts.",example:"We analyse the poem in English."},
    {word:"CONTRAST",clue:"To show how two things differ.",example:"Contrast the two characters."},
    {word:"DYNAMIC",clue:"Full of energy or changing continually.",example:"The dynamic scene held our attention."},
    {word:"EMPATHY",clue:"The ability to understand another person's feelings.",example:"Empathy helped her support a friend."},
    {word:"FREQUENT",clue:"Happening often.",example:"Frequent practice helped him improve."},
    {word:"HYPOTHESIS",clue:"A testable idea or possible explanation.",example:"The class tested a hypothesis."},
    {word:"INFERENCE",clue:"A conclusion drawn from evidence and reasoning.",example:"Her inference was supported by the text."},
    {word:"RESILIENT",clue:"Able to recover after difficulty.",example:"The resilient team tried again."},
    {word:"SIGNIFICANT",clue:"Important or large enough to be noticed.",example:"The results showed a significant change."},
    {word:"VARIABLE",clue:"Something that can change in an experiment.",example:"We measured one variable at a time."}
  ],
  KS4:[
    {word:"AMBIGUITY",clue:"The quality of having more than one possible meaning.",example:"The ambiguity of the ending invites debate."},
    {word:"COHERENCE",clue:"A clear and logical connection between ideas.",example:"The essay showed coherence throughout."},
    {word:"EVALUATE",clue:"To judge something carefully using evidence.",example:"Evaluate the strength of the argument."},
    {word:"IDEOLOGY",clue:"A system of beliefs or ideas.",example:"The speech reflected a political ideology."},
    {word:"METAPHOR",clue:"A comparison that describes one thing as another.",example:"The metaphor made the description vivid."},
    {word:"PARADOX",clue:"An apparently contradictory statement that may contain truth.",example:"The paradox made readers think."},
    {word:"PRAGMATIC",clue:"Dealing with problems in a practical way.",example:"They chose a pragmatic solution."},
    {word:"SYNTHESIS",clue:"Combining different ideas to form a whole.",example:"Her synthesis brought the findings together."},
    {word:"TENTATIVE",clue:"Not certain or fully decided.",example:"We made a tentative prediction."},
    {word:"VALIDITY",clue:"How well a test or argument measures what it claims.",example:"The scientist considered the validity of the data."}
  ]
};
export function dateInUK(now=new Date()): string {
  return new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/London",year:"numeric",month:"2-digit",day:"2-digit"}).format(now);
}
function hash(text:string):number {let h=2166136261;for(const char of text){h^=char.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
export function dailyCase(stage:Stage,date=dateInUK()):WordCase {const bank=CASES[stage];return bank[hash("tml-word-detective-v1:"+stage+":"+date)%bank.length];}
export function scoreGuess(guess:string,answer:string):LetterMark[]{
  const result:LetterMark[]=Array(answer.length).fill("absent");
  const remaining=answer.split("");
  for(let i=0;i<answer.length;i++)if(guess[i]===answer[i]){result[i]="correct";remaining[i]="";}
  for(let i=0;i<answer.length;i++)if(result[i]!=="correct"){const match=remaining.indexOf(guess[i]);if(match!==-1){result[i]="present";remaining[match]="";}}
  return result;
}
export function caseKey(stage:Stage,date:string){return "tml-word-detective-v1:"+stage+":"+date;}
