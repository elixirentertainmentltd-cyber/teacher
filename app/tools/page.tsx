import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Leaf, Search, Sparkles } from "lucide-react";
export const metadata: Metadata = { title: "Classroom tools", description: "Free classroom tools from Teach Me a Lesson." };
export default function ToolsPage() {
  return <>
    <section className="inner-hero"><div className="container">
      <span className="section-kicker"><Sparkles size={17} /> CLASSROOM TOOLS</span>
      <h1>Make every lesson<br /><span>a little brighter.</span></h1>
      <p>Free interactive tools to support learning, concentration and classroom wellbeing.</p>
    </div></section>
    <section className="section"><div className="container">
      <div className="discovery-grid">
        <Link href="/tools/word-detective" className="discovery-card accent-purple">
          <span className="discovery-icon"><Search size={27} /></span>
          <h3>Word Detective</h3>
          <p>Solve a daily mystery word with clues and colourful letter hints, from KS1 to GCSE.</p>
          <span className="discovery-action">Play Word Detective <ArrowRight size={17} /></span>
        </Link>
        <Link href="/tools/calm-critters" className="discovery-card games-tile">
          <span className="discovery-icon"><Leaf size={27} /></span>
          <h3>Calm Critters</h3>
          <p>Discover friendly creatures as your classroom works together to stay calm.</p>
          <span className="discovery-action">Play Calm Critters <ArrowRight size={17} /></span>
        </Link>
      </div>
    </div></section>
  </>;
}