import type { Metadata } from "next";
import ClockLiteracy from "@/components/ClockLiteracy";
export const metadata: Metadata = {title:"Clock Adventures | Teach Me a Lesson",description:"Interactive analogue clock practice for KS1 and KS2 Maths."};
export default function ClockAdventuresResource(){return <ClockLiteracy/>;}
