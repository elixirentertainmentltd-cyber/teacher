"use client";
import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw, Shuffle, Sparkles, Timer, Users } from "lucide-react";
export default function ClassroomTools() {
  const [minutes,setMinutes] = useState(5);
  const [remaining,setRemaining] = useState(300);
  const [running,setRunning] = useState(false);
  const [names,setNames] = useState("Alex\nCharlie\nJordan\nSam");
  const [picked,setPicked] = useState("");
  useEffect(()=>{
    if (!running) return;
    const interval = window.setInterval(()=>setRemaining(seconds=>Math.max(0,seconds-1)),1000);
    return ()=>window.clearInterval(interval);
  },[running]);
  useEffect(()=>{if (remaining===0) setRunning(false);},[remaining]);
  function changeMinutes(value:number) {setMinutes(value);setRemaining(value*60);setRunning(false);}
  function pickName() {
    const choices = names.split(/\r?\n/).map(name=>name.trim()).filter(Boolean);
    if (!choices.length) {setPicked(""); return;}
    setPicked(choices[Math.floor(Math.random()*choices.length)]);
  }
  const mm = String(Math.floor(remaining/60)).padStart(2,"0");
  const ss = String(remaining%60).padStart(2,"0");
  return <div className="container tools-grid">
    <section className="interactive-tool timer-tool">
      <div className="tool-icon bubble-pink"><Timer size={27}/></div><h2>Classroom countdown</h2><p>Focus time, tidy-up time or a five-minute challenge. You choose.</p>
      <div className="timer-display" aria-live="off" role="timer">{mm}<span>:</span>{ss}</div>
      <div className="timer-presets" role="group" aria-label="Timer length">{[1,3,5,10,15].map(value=><button type="button" key={value} onClick={()=>changeMinutes(value)} className={minutes===value?"preset current":"preset"} aria-pressed={minutes===value}>{value} min</button>)}</div>
      <div className="tool-actions"><button className="button button-primary" onClick={()=>setRunning(value=>!value)} disabled={remaining===0}>{running?<Pause size={17}/>:<Play size={17}/>} {running?"Pause timer":"Start timer"}</button><button className="button button-outline" onClick={()=>{setRunning(false);setRemaining(minutes*60)}}><RotateCcw size={17}/> Reset</button></div>
      {remaining===0&&<p className="timer-finished" role="status">Time’s up! Brilliant effort. ✨</p>}
    </section>
    <section className="interactive-tool picker-tool">
      <div className="tool-icon bubble-purple"><Users size={27}/></div><h2>Random pupil picker</h2><p>Paste one name per line to choose someone fairly for the next question.</p>
      <label className="field-label" htmlFor="pupil-names">Names <span>One per line</span><textarea id="pupil-names" rows={7} value={names} onChange={e=>{setNames(e.target.value);setPicked("");}} maxLength={3000}/></label>
      <button className="button button-primary picker-button" onClick={pickName} disabled={!names.trim()}><Shuffle size={19}/> Pick a name</button>
      <div className="picked-name" aria-live="polite">{picked?<><small>THE NEXT STAR IS…</small><strong>{picked}</strong><Sparkles size={25}/></>:<span>Your next classroom star will appear here ✨</span>}</div>
      <p className="privacy-hint">Names are only used in this browser tab. This tool does not send or save them to a server.</p>
    </section>
  </div>;
}
