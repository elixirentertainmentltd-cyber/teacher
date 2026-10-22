import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import ClassroomTools from "@/components/ClassroomTools";
export const metadata: Metadata = {title:"Free classroom tools",description:"A countdown timer and random pupil picker for UK classrooms. No sign-up needed."};
export default function ToolsPage() {return <><section className="inner-hero"><div className="container"><span className="section-kicker"><Sparkles size={17}/> LITTLE TOOLS, BIG DIFFERENCE</span><h1>More teaching.<br/><span>Less faffing.</span></h1><p>Handy little helpers for classroom moments when you just need something that works.</p></div></section><section className="section classroom-tools-section"><ClassroomTools/></section></>;}
