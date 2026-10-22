"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, Search, SlidersHorizontal, X } from "lucide-react";
import { RESOURCES, STAGES, type Stage } from "@/lib/resources";

type Filter = "All" | Stage;
export default function ResourceExplorer({ initialStage }: { initialStage: Filter }) {
  const [stage, setStage] = useState<Filter>(initialStage);
  const [subject, setSubject] = useState<"All" | "Maths" | "English">("All");
  const [query, setQuery] = useState("");
  const results = useMemo(() => RESOURCES.filter(item =>
    (stage === "All" || item.stages.includes(stage)) &&
    (subject === "All" || item.subject === subject) &&
    (item.title + " " + item.description + " " + item.category).toLowerCase().includes(query.trim().toLowerCase())
  ), [stage, subject, query]);
  const reset = () => { setStage("All"); setSubject("All"); setQuery(""); };
  return (
    <>
      <section className="inner-hero">
        <div className="container">
          <span className="section-kicker"><BookOpen size={17}/> THE RESOURCE LIBRARY</span>
          <h1>Something brilliant for<br/><span>your next lesson.</span></h1>
          <p>Find printable activities for English and maths, from the first years of primary school through to GCSE-stage practice.</p>
        </div>
      </section>
      <section className="section library-section">
        <div className="container">
          <div className="filters-panel">
            <label className="search-box"><Search size={21}/><span className="sr-only">Search resources</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Try “spelling”, “fractions” or “algebra”…"/></label>
            <div className="filter-row">
              <div className="filter-label"><SlidersHorizontal size={17}/> Key Stage</div>
              <div className="filter-pills" role="group" aria-label="Filter by Key Stage">
                {(["All", ...STAGES.map(item=>item.id)] as Filter[]).map(value=><button key={value} type="button" className={stage===value?"pill active":"pill"} onClick={()=>setStage(value)} aria-pressed={stage===value}>{value==="All"?"All stages":value}</button>)}
              </div>
              <div className="filter-label subject-label">Subject</div>
              <div className="filter-pills" role="group" aria-label="Filter by subject">
                {(["All","Maths","English"] as const).map(value=><button key={value} type="button" className={subject===value?"pill active":"pill"} onClick={()=>setSubject(value)} aria-pressed={subject===value}>{value}</button>)}
              </div>
            </div>
          </div>
          <div className="results-bar"><strong>{results.length} {results.length===1?"resource":"resources"}</strong><span>Each opens a printable activity you can customise.</span></div>
          {results.length ? <div className="resource-grid library-grid">
            {results.map((item,index)=><Link key={item.slug} href={"/worksheet/"+item.slug} className={"resource-card accent-"+item.colour}>
              <div className="resource-top"><span className="resource-subject">{item.subject}</span><span className="round-arrow"><ArrowUpRight size={18}/></span></div>
              <div className="resource-doodle">{({ "number-bonds":"10", "addition-subtraction":"➕", "spelling":"Aa", "times-tables":"×", "punctuation":"?!", "fractions":"½", "percentages":"%", "algebra":"x²" } as Record<string,string>)[item.slug]}</div>
              <h3>{item.title}</h3><p>{item.description}</p>
              <div className="resource-footer"><span>{item.stages.join(" · ")}</span><span>{item.years}</span></div>
            </Link>)}
          </div> : <div className="empty-state"><span className="empty-emoji">🔎</span><h2>Nothing in this corner of the classroom yet.</h2><p>Try another subject, Key Stage or search phrase.</p><button className="button button-primary" onClick={reset}>Clear filters <X size={17}/></button></div>}
          <div className="library-note"><strong>A note for teachers:</strong> These are original, starter practice activities, not an officially endorsed exam-board collection. Please review suitability for your class and specification.</div>
        </div>
      </section>
    </>
  );
}
