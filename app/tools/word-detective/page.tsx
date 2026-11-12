import type { Metadata } from "next";
import WordDetective from "./WordDetective";
export const metadata:Metadata={title:"Word Detective | Free vocabulary game",description:"Find the mystery word using clues and letter hints. A free Teach Me a Lesson vocabulary game for KS1, KS2, KS3 and GCSE."};
export default function WordDetectivePage(){return <WordDetective/>;}
