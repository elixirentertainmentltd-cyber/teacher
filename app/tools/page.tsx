import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
export const metadata: Metadata={title:"Teacher tools",description:"Free classroom tools from Teach Me a Lesson."};
export default function ToolsPage(){return <section className="inner-hero"><div className="container"><span className="section-kicker"><Sparkles size={17}/> TEACHER TOOLS</span><h1>Fresh tools are<br/><span>on the way.</span></h1><p>We're rebuilding our classroom tools from scratch. Check back for new free activities.</p></div></section>}
