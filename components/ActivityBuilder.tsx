"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Printer, RefreshCw, Sparkles } from "lucide-react";
import type { Resource } from "@/lib/resources";
import { makeQuestions } from "@/lib/worksheets";

const STARTER_WORDS = "because, different, important, enough, answer, possible, remember, interesting";
export default function ActivityBuilder({ resource }: { resource: Resource }) {
  const [seed, setSeed] = useState(7);
  const [count, setCount] = useState(12);
  const [table, setTable] = useState(0);
  const [words, setWords] = useState(STARTER_WORDS);
  const [answers, setAnswers] = useState(false);
  const questions = useMemo(()=>makeQuestions(resource.slug, seed, count, table, words),[resource.slug, seed, count, table, words]);
  const isSpelling = resource.slug==="spelling";
  const isPunctuation = resource.slug==="punctuation";
  return (
    <>
      <section className="worksheet-heading container">
        <Link href="/resources" className="back-link"><ArrowLeft size={17}/> Back to resources</Link>
        <div className="section-kicker"><Sparkles size={17}/> {resource.subject.toUpperCase()} · {resource.stages.join(" / ")}</div>
        <h1>{resource.title}<span>.</span></h1>
        <p>{resource.description}</p>
      </section>
      <section className="worksheet-workspace container">
        <div className="worksheet-controls no-print">
          <div className="control-heading"><h2>Make it yours</h2><p>Set up your worksheet in a few clicks.</p></div>
          {!isSpelling && <label className="field-label" htmlFor="question-count">Number of questions<select id="question-count" value={count} onChange={e=>setCount(Number(e.target.value))}><option value="8">8 questions</option><option value="12">12 questions</option><option value="16">16 questions</option><option value="20">20 questions</option></select></label>}
          {resource.slug==="times-tables" && <label className="field-label" htmlFor="times-table">Times table<select id="times-table" value={table} onChange={e=>setTable(Number(e.target.value))}><option value="0">Mixed: 2 to 12</option>{Array.from({length:11},(_,i)=>i+2).map(n=><option key={n} value={n}>{n} times table</option>)}</select></label>}
          {isSpelling && <label className="field-label" htmlFor="spelling-words">Spelling words <span>Separate with commas or new lines.</span><textarea id="spelling-words" rows={8} value={words} onChange={e=>setWords(e.target.value)} maxLength={1000}/><small>Maximum 30 words. Check spelling before printing.</small></label>}
          {!isSpelling && !isPunctuation && <button className="button button-outline controls-button" onClick={()=>setSeed(value=>value+1)}><RefreshCw size={17}/> New questions</button>}
          {!isSpelling && <button className="button button-outline controls-button" onClick={()=>setAnswers(value=>!value)}>{answers?<EyeOff size={17}/>:<Eye size={17}/>} {answers?"Hide answer key":"Show answer key"}</button>}
          <button className="button button-primary controls-button" onClick={()=>window.print()}><Printer size={18}/> Print / Save as PDF</button>
          <p className="controls-hint">Use your browser's print menu and choose “Save as PDF” to download a copy.</p>
        </div>
        <div className="worksheet-preview-area">
          <div className="preview-label no-print"><span>YOUR WORKSHEET PREVIEW</span><span>Ready for A4 printing <Check size={16}/></span></div>
          <article className="print-page">
            <div className="print-heading">
              <div className="worksheet-brand"><strong>Teach Me a Lesson<span>.</span></strong><small>by We Are Elixir</small></div>
              <div className="worksheet-tag">{resource.subject} · {resource.years}</div>
            </div>
            <h2>{resource.title}</h2>
            <p className="print-instruction">{isSpelling?"Read each word, then practise writing it three times.":isPunctuation?"Rewrite each sentence with the correct capital letters and punctuation.":"Answer the questions. Show your working where needed."}</p>
            <div className="pupil-info"><span>Name: <i/></span><span>Date: <i/></span></div>
            {questions.length ? <div className={isSpelling?"spelling-list":isPunctuation?"punctuation-list":"question-grid"}>
              {questions.map((question,index)=><div className="question-item" key={index}>
                <span className="question-number">{index+1}.</span>
                <div className="question-content"><strong>{question.prompt}</strong>
                  {isSpelling ? <div className="handwriting-rows"><span/><span/><span/></div> : isPunctuation ? <div className="writing-lines"><span/><span/></div> : <div className="answer-line"/>}
                </div>
              </div>)}
            </div> : <p className="no-words">Add at least one word in the options to create your spelling sheet.</p>}
            <div className="print-foot"><span>Keep practising. You’ve got this!</span><span>Teach Me a Lesson · We Are Elixir</span></div>
          </article>
          {answers && !isSpelling && <article className="print-page answer-paper">
            <div className="print-heading"><div className="worksheet-brand"><strong>Teach Me a Lesson<span>.</span></strong><small>by We Are Elixir</small></div><div className="worksheet-tag">Teacher copy</div></div>
            <h2>{resource.title} · Answers</h2>
            <div className="answer-grid">{questions.map((question,index)=><div className="answer-item" key={index}><b>{index+1}.</b> <span>{question.answer}</span></div>)}</div>
            <p className="answer-foot">Teacher answer key. Review before sharing.</p>
          </article>}
          <div className="preview-after no-print"><Link href="/resources">More classroom resources <ArrowRight size={17}/></Link></div>
        </div>
      </section>
    </>
  );
}
