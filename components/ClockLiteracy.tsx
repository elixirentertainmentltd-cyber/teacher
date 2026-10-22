"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Printer, RotateCcw, Clock3 } from "lucide-react";

type Level = "Easy" | "Medium" | "Hard";
type Direction = "Clock to time" | "Time to clock";
type Question = { hour:number; minute:number; options:string[]; correct:number };
const pad = (n:number) => String(n).padStart(2,"0");
const label = (h:number,m:number) => `${h}:${pad(m)}`;
const random = (max:number) => Math.floor(Math.random()*max);
function createQuestions(level:Level, total:number):Question[] {
  const steps = level==="Easy" ? [0,30] : level==="Medium" ? [0,15,30,45] : Array.from({length:12},(_,i)=>i*5);
  return Array.from({length:total},()=>{
    const hour=1+random(12), minute=steps[random(steps.length)];
    const distractors=new Set<string>([label(hour,minute)]);
    const near = (hour%12)+1;
    const candidates=[label(near,minute),label(hour,(minute+30)%60),label(hour,(minute+15)%60),label(hour, (60-minute)%60),label(hour===1?12:hour-1,minute)];
    for(const candidate of candidates) { if(distractors.size<4) distractors.add(candidate); }
    while(distractors.size<4) distractors.add(label(1+random(12),steps[random(steps.length)]));
    const options=[...distractors].sort(()=>Math.random()-.5);
    return {hour,minute,options,correct:options.indexOf(label(hour,minute))};
  });
}
function ClockFace({hour,minute,size=240}:{hour:number;minute:number;size?:number}) {
  const hand=(degrees:number,length:number)=>({x:100+Math.sin(degrees*Math.PI/180)*length,y:100-Math.cos(degrees*Math.PI/180)*length});
  const mp=hand(minute*6,70), hp=hand((hour%12)*30+minute*.5,48);
  return <svg width={size} height={size} viewBox="0 0 200 200" role="img" aria-label="Analogue clock face">
    <circle cx="100" cy="100" r="94" fill="#fff" stroke="#504097" strokeWidth="5"/>
    {Array.from({length:60},(_,i)=>{const p=hand(i*6,85),q=hand(i*6,i%5===0?75:81);return <line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#685e82" strokeWidth={i%5===0?2.5:1}/>})}
    {Array.from({length:12},(_,i)=>{const p=hand((i+1)*30,63);return <text key={i} x={p.x} y={p.y+5} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#302653">{i+1}</text>})}
    <line x1="100" y1="100" x2={hp.x} y2={hp.y} stroke="#393064" strokeWidth="8" strokeLinecap="round"/>
    <line x1="100" y1="100" x2={mp.x} y2={mp.y} stroke="#e364a1" strokeWidth="5" strokeLinecap="round"/>
    <circle cx="100" cy="100" r="6" fill="#393064"/>
  </svg>;
}
export default function ClockLiteracy() {
  const [level,setLevel]=useState<Level>("Easy");
  const [direction,setDirection]=useState<Direction>("Clock to time");
  const [length,setLength]=useState(10);
  const [name,setName]=useState("");
  const [questions,setQuestions]=useState<Question[]>([]);
  const [index,setIndex]=useState(0);
  const [choices,setChoices]=useState<number[]>([]);
  const [picked,setPicked]=useState<number|null>(null);
  const finished=questions.length>0&&index>=questions.length;
  const current=questions[index];
  const score=choices.filter((choice,i)=>choice===questions[i]?.correct).length;
  function start(){setQuestions(createQuestions(level,length));setIndex(0);setChoices([]);setPicked(null);}
  function next(){if(picked===null)return;setChoices(prev=>[...prev,picked]);setPicked(null);setIndex(v=>v+1);}
  return <main className="container" style={{paddingTop:40,paddingBottom:90}}>
    <Link href="/tools" className="back-link"><ArrowLeft size={18}/> Back to classroom tools</Link>
    <div className="section-kicker"><Clock3 size={17}/> INTERACTIVE LEARNING</div>
    <h1 style={{fontSize:"clamp(36px,5vw,60px)",margin:"12px 0",color:"#302653"}}>Clock adventures<span style={{color:"#e364a1"}}>.</span></h1>
    <p style={{color:"#77738a",maxWidth:680,lineHeight:1.6}}>Learn to tell the time with Teach Me a Lesson. Choose a level, practise with an analogue clock, and print a progress report for your teacher.</p>
    {!questions.length?<section className="interactive-tool" style={{maxWidth:700,marginTop:24}}>
      <h2>Set up your round</h2>
      <label className="field-label">Learner name (optional)<input value={name} onChange={e=>setName(e.target.value)} maxLength={65} placeholder="Your name" style={{padding:12,border:"2px solid #ede8f4",borderRadius:12}}/></label>
      <div className="field-label">Level</div>
      <div className="filter-pills" role="group" aria-label="Level">{(["Easy","Medium","Hard"] as Level[]).map(v=><button key={v} className={level===v?"pill active":"pill"} onClick={()=>setLevel(v)} aria-pressed={level===v}>{v}</button>)}</div>
      <p style={{fontSize:12,color:"#77738a"}}>Easy: o'clock and half past. Medium: quarter hours. Hard: five-minute intervals.</p>
      <div className="field-label">Direction</div>
      <div className="filter-pills" role="group" aria-label="Direction">{(["Clock to time","Time to clock"] as Direction[]).map(v=><button key={v} className={direction===v?"pill active":"pill"} onClick={()=>setDirection(v)} aria-pressed={direction===v}>{v}</button>)}</div>
      <div className="field-label" style={{marginTop:22}}>Questions per round</div>
      <div className="filter-pills" role="group" aria-label="Number of questions">{[5,10,20].map(v=><button key={v} className={length===v?"pill active":"pill"} onClick={()=>setLength(v)} aria-pressed={length===v}>{v}</button>)}</div>
      <button className="button button-primary" style={{marginTop:27}} onClick={start}>Start learning <ArrowRight size={18}/></button>
    </section>:finished?<section className="interactive-tool" style={{maxWidth:750,marginTop:24}}>
      <div className="no-print"><h2>Wonderful work{ name ? `, ${name}` : ""}!</h2><p>You answered {score} out of {questions.length} correctly.</p><div className="tool-actions"><button className="button button-primary" onClick={()=>window.print()}><Printer size={18}/> Print progress report</button><button className="button button-outline" onClick={()=>setQuestions([])}><RotateCcw size={18}/> New round</button></div></div>
      <div className="clock-print-report"><h2>Clock adventures · Progress report</h2><p>Learner: {name||"Not provided"} | Level: {level} | Direction: {direction}</p><p>Score: {score} / {questions.length}</p><ol>{questions.map((q,i)=><li key={i}>{label(q.hour,q.minute)} · {choices[i]===q.correct?"Correct":"Practise again"}</li>)}</ol><div className="clock-report-footer"><span>Teach Me A Lesson By We Are Elixir</span><img src="/brand/teach-me-a-lesson-logo.png" alt="Teach Me a Lesson" width="75" height="40"/></div></div>
    </section>:<section className="interactive-tool" style={{maxWidth:760,marginTop:24,textAlign:"center"}}>
      <div className="no-print"><p style={{fontWeight:900,color:"#6751aa"}}>Question {index+1} of {questions.length} · {level}</p><h2>{direction==="Clock to time"?"What time does the clock show?":"Which clock shows "+label(current.hour,current.minute)+"?"}</h2>
      {direction==="Clock to time"?<div style={{padding:18}}><ClockFace hour={current.hour} minute={current.minute}/></div>:<div className="clock-choice-grid">{current.options.map((v,i)=>{const [h,m]=v.split(":").map(Number);return <button aria-label={"Clock showing "+v} className={picked===i?"clock-choice chosen":"clock-choice"} key={i} onClick={()=>setPicked(i)}><ClockFace hour={h} minute={m} size={125}/></button>})}</div>}
      {direction==="Clock to time"&&<div className="filter-pills" style={{justifyContent:"center"}}>{current.options.map((v,i)=><button key={i} className={picked===i?"pill active":"pill"} onClick={()=>setPicked(i)}>{v}</button>)}</div>}
      {picked!==null&&<p role="status" style={{fontWeight:800,marginTop:20}}>{picked===current.correct?"Well done!":"Good try! The answer is "+label(current.hour,current.minute)+"."}</p>}
      <button className="button button-primary" style={{marginTop:20}} disabled={picked===null} onClick={next}>{index===questions.length-1?"See my results":"Next question"} <ArrowRight size={17}/></button></div>
    </section>}
    <style jsx>{` .clock-choice-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:20px auto;max-width:420px}.clock-choice{border:2px solid #e8e3f0;border-radius:18px;background:#fff;padding:8px}.clock-choice.chosen{border-color:#7658cc;background:#f4efff}.clock-print-report{display:none}.clock-report-footer{display:flex;align-items:center;justify-content:center;position:relative;border-top:1px solid #ddd;padding-top:9px;margin-top:24px;font-size:9px}.clock-report-footer img{position:absolute;right:0;bottom:0;object-fit:contain}@media print{.no-print{display:none!important}.clock-print-report{display:block!important}.clock-report-footer{break-inside:avoid}}`}</style>
  </main>;
}
