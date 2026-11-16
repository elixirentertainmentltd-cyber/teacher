"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, BookOpen, Pencil, Search, SlidersHorizontal, X } from "lucide-react";
import type { Resource } from "@/lib/resources";

type Options = {
  stages: string[];
  subjects: string[];
  types: string[];
  categories: string[];
  years: string[];
};

type ExplorerProps = {
  resources: Resource[];
  options: Options;
  initialStage?: string;
  initialType?: string;
  initialSubject?: string;
};

function ResourceCover({ url, title }: { url?: string; title: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`resource-cover${!url || failed ? " resource-cover--placeholder" : ""}`}>
      {url && !failed ? (
        <img src={url} alt={`Preview of ${title}`} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <Pencil size={54} strokeWidth={1.7} aria-hidden="true" />
      )}
    </div>
  );
}

export default function ResourceExplorer({
  resources,
  options,
  initialStage = "All",
  initialType = "All",
  initialSubject = "All",
}: ExplorerProps) {
  const [stage, setStage] = useState(initialStage);
  const [subject, setSubject] = useState(initialSubject);
  const [type, setType] = useState(initialType);
  const [category, setCategory] = useState("All");
  const [year, setYear] = useState("All");
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return resources.filter(
      (resource) =>
        (stage === "All" || resource.stages.includes(stage)) &&
        (subject === "All" || resource.subject === subject) &&
        (type === "All" || resource.type === type) &&
        (category === "All" || resource.category === category) &&
        (year === "All" || resource.years.split(",").map((value) => value.trim()).includes(year)) &&
        (`${resource.title} ${resource.description} ${resource.category}`).toLowerCase().includes(needle)
    );
  }, [resources, stage, subject, type, category, year, query]);

  function reset() {
    setStage("All");
    setSubject("All");
    setType("All");
    setCategory("All");
    setYear("All");
    setQuery("");
  }

  function select(label: string, value: string, change: (next: string) => void, values: string[], allLabel: string) {
    return (
      <label key={label}>
        {label}
        <select value={value} onChange={(event) => change(event.target.value)}>
          <option value="All">{allLabel}</option>
          {values.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <>
      <section className="inner-hero redesigned-library-hero">
        <div className="container">
          <span className="section-kicker"><BookOpen size={17} /> FREE RESOURCE LIBRARY</span>
          <h1>Find it. Play it.<br /><span>Print it. Love it.</span></h1>
          <p>Discover free teaching resources, printable materials and activities.</p>
        </div>
      </section>

      <section className="section library-section">
        <div className="container">
          <div className="filters-panel">
            <label className="search-box">
              <Search size={21} />
              <span className="sr-only">Search resources</span>
              <input placeholder="Search the library…" value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
            <div className="library-selects">
              {select("Key stage", stage, setStage, options.stages, "All stages")}
              {select("Year group", year, setYear, options.years, "All year groups")}
              {select("Subject", subject, setSubject, options.subjects, "All subjects")}
              {select("Resource type", type, setType, options.types, "All types")}
              {select("Category / topic", category, setCategory, options.categories, "All categories")}
            </div>
            <div className="library-filter-bottom">
              <span><SlidersHorizontal size={16} /> Browse by your resource classifications</span>
              <button type="button" className="filter-clear" onClick={reset}>Reset filters <X size={15} /></button>
            </div>
          </div>

          <div className="results-bar">
            <strong>{items.length} published {items.length === 1 ? "resource" : "resources"}</strong>
            <span>Every resource is free.</span>
          </div>

          {items.length ? (
            <div className="resource-grid library-grid">
              {items.map((resource) => {
                const external = resource.url.startsWith("http");
                const hasDetails = resource.stages.length > 0 || !!resource.years.trim();
                return (
                  <a
                    key={resource.id}
                    className="resource-card accent-purple"
                    href={resource.url}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                  >
                    <div className="resource-top">
                      <span className="resource-subject">
                        {resource.subject}{resource.category ? ` · ${resource.category}` : ""}
                      </span>
                      <span className="round-arrow"><ArrowUpRight size={18} /></span>
                    </div>
                    <ResourceCover url={resource.thumbnailUrl} title={resource.title} />
                    <div className="resource-body">
                      <span className="resource-type">{resource.type}</span>
                      <h3>{resource.title}</h3>
                      <p>{resource.description}</p>
                    </div>
                    {hasDetails && (
                      <div className="resource-footer">
                        {resource.stages.length > 0 && <span>{resource.stages.join(" · ")}</span>}
                        {resource.years.trim() && <span>{resource.years}</span>}
                      </div>
                    )}
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-emoji">📚</span>
              <h2>{resources.length ? "No matching resources yet" : "Fresh resources are on their way"}</h2>
              <p>{resources.length ? "Try changing the filters." : "We're creating new games, worksheets and teaching materials from scratch. Check back soon!"}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
