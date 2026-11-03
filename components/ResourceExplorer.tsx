"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, BookOpen, Search, SlidersHorizontal, X } from "lucide-react";
import { RESOURCES, STAGES, SUBJECTS, RESOURCE_TYPES, resourceHref, type Stage, type Subject, type ResourceType } from "@/lib/resources";

type StageFilter = "All" | Stage;
type SubjectFilter = "All" | Subject;
type TypeFilter = "All" | ResourceType;
const symbols: Record<string, string> = {
  "clock-adventures": "◷", "number-bonds": "10", "addition-subtraction": "+",
  "spelling": "Aa", "times-tables": "×", "punctuation": "?!",
  "fractions": "½", "percentages": "%", "algebra": "x²"
};

export default function ResourceExplorer({ initialStage }: { initialStage: StageFilter }) {
  const [stage, setStage] = useState<StageFilter>(initialStage);
  const [subject, setSubject] = useState<SubjectFilter>("All");
  const [type, setType] = useState<TypeFilter>("All");
  const [year, setYear] = useState("All");
  const [query, setQuery] = useState("");
  const results = useMemo(() => RESOURCES.filter(item =>
    (stage === "All" || item.stages.includes(stage)) &&
    (subject === "All" || item.subject === subject) &&
    (type === "All" || item.type === type) &&
    (year === "All" || item.yearGroups.includes(Number(year))) &&
    (item.title + " " + item.description + " " + item.category + " " + item.subject).toLowerCase().includes(query.trim().toLowerCase())
  ), [stage, subject, type, year, query]);
  const reset = () => { setStage("All"); setSubject("All"); setType("All"); setYear("All"); setQuery(""); };
  const active = stage !== "All" || subject !== "All" || type !== "All" || year !== "All" || query !== "";
  return (
    <>
      <section className="inner-hero redesigned-library-hero">
        <div className="container">
          <span className="section-kicker"><BookOpen size={17}/> THE FREE RESOURCE LIBRARY</span>
          <h1>Find it. Play it.<br/><span>Print it. Love it.</span></h1>
          <p>Explore free interactive learning games and printable worksheets for UK schools, home learning and SEND support. No sign-up, no paywall, just learning.</p>
          <div className="hero-facts"><span>✓ Completely free</span><span>✓ KS1 to GCSE</span><span>✓ Print or play straight away</span></div>
        </div>
      </section>
      <section className="section library-section">
        <div className="container">
          <div className="filters-panel">
            <label className="search-box" htmlFor="library-search"><Search size={21}/><span className="sr-only">Search resources</span><input id="library-search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Try fractions, spelling, clocks or maths…"/></label>
            <div className="library-selects">
              <label>Key stage<select value={stage} onChange={event=>setStage(event.target.value as StageFilter)}><option value="All">All key stages</option>{STAGES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></label>
              <label>Year group<select value={year} onChange={event=>setYear(event.target.value)}><option value="All">All years</option>{Array.from({length:11},(_,i)=>i+1).map(n=><option key={n} value={n}>Year {n}</option>)}</select></label>
              <label>Subject<select value={subject} onChange={event=>setSubject(event.target.value as SubjectFilter)}><option value="All">All subjects</option>{SUBJECTS.map(s=><option key={s}>{s}</option>)}</select></label>
              <label>Resource type<select value={type} onChange={event=>setType(event.target.value as TypeFilter)}><option value="All">All resources</option>{RESOURCE_TYPES.map(t=><option key={t}>{t}</option>)}</select></label>
            </div>
            <div className="library-filter-bottom"><span><SlidersHorizontal size={16}/> Filter resources to suit your learners</span>{active&&<button type="button" className="filter-clear" onClick={reset}>Clear all filters <X size={15}/></button>}</div>
          </div>
          <div className="results-bar"><strong>{results.length} {results.length === 1 ? "resource" : "resources"} ready to explore</strong><span>All currently available resources are free.</span></div>
          {results.length ? <div className="resource-grid library-grid">
            {results.map(item=><Link key={item.slug} href={resourceHref(item)} className={"resource-card accent-"+item.colour}>
              <div className="resource-top"><span className="resource-subject">{item.subject} · {item.category}</span><span className="round-arrow"><ArrowUpRight size={18}/></span></div>
              <div className="resource-doodle" aria-hidden="true">{symbols[item.slug] || "✎"}</div>
              <span className="resource-type">{item.type === "Interactive activity" ? "Play online" : "Make & print"}</span>
              <h3>{item.title}</h3><p>{item.description}</p>
              <div className="resource-footer"><span>{item.stages.join(" · ")}</span><span>{item.years}</span></div>
            </Link>)}
          </div> : <div className="empty-state"><span className="empty-emoji">🔎</span><h2>No matching resources yet</h2><p>Try another subject, key stage or search phrase. We are adding more free activities.</p><button className="button button-primary" onClick={reset}>Clear filters <X size={17}/></button></div>}
          <div className="library-note"><strong>For teachers and families:</strong> These are original starter practice activities, not officially endorsed exam-board materials. Please review their suitability for your learners. Additional subjects and SEND resources are planned; the current library only displays activities that are available now.</div>
        </div>
      </section>
    </>
  );
}
