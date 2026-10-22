import type { Metadata } from "next";
import ClockLiteracy from "@/components/ClockLiteracy";
export const metadata: Metadata = {title:"Clock adventures | Teach Me a Lesson",description:"Practise telling the time on an analogue clock. Easy, medium and hard rounds for UK learners."};
export default function ClockAdventuresPage(){return <ClockLiteracy/>;}
