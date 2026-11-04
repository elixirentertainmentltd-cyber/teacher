"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, BookOpen, Check, ChevronDown, Clock3, Expand, HelpCircle, Leaf, Mic,
  MicOff, Pause, Play, RotateCcw, Settings2, ShieldCheck, SlidersHorizontal,
  Sparkles, Volume2, X
} from "lucide-react";
import "./calm-critters.css";
import AnimatedCritters from "@/components/AnimatedCritters";
import { EMPTY_POPULATION, initialPopulation, spawnCreature, populationDiscoveries, type CreatureInstance } from "@/lib/calm-critters-population";
import { advanceNoise } from "@/lib/calm-critters-noise";
import CritterArtwork from "@/components/CritterArtwork";
import { DEFAULT_SCENES, type CritterScene } from "@/lib/calm-critters-data";

type Habitat = string;
type NoiseResponse = "pause" | "retreat";
type Settings = {
  goal: number; arrivalSeconds: number; showMeter: boolean; showCounter: boolean;
  deviceId: string; noiseResponse: NoiseResponse;
};
const DEFAULT_SETTINGS: Settings = { goal: 24, arrivalSeconds: 120, showMeter: false, showCounter: false, deviceId: "", noiseResponse: "retreat" };
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
function readStored<T>(key: string, fallback: T): T {
  try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; }
  catch { return fallback; }
}
const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2,"0")}:${(seconds % 60).toString().padStart(2,"0")}`;

export default function CalmCritters({ initialScenes = DEFAULT_SCENES }: { initialScenes?: CritterScene[] }) {
  const scenes = initialScenes;
  const HABITATS = Object.fromEntries(scenes.map(s => [s.id,s]));
  const KEYS = scenes.map(s => s.id);
  const habitatsRef = useRef(HABITATS);
  useEffect(() => { habitatsRef.current = HABITATS; });
  const [showScenes, setShowScenes] = useState(false);
  const [demo, setDemo] = useState(false);
  const [demoAnimals, setDemoAnimals] = useState<CreatureInstance[]>(()=>initialPopulation(initialScenes[0],4,"preview"));
  const arrivalId = useRef(0);
  const [demoNoise, setDemoNoise] = useState(false);
  const demoRef = useRef(false);
  const demoNoiseRef = useRef(false);
  useEffect(()=>{demoRef.current=demo;demoNoiseRef.current=demoNoise;},[demo,demoNoise]);
  const [seen, setSeen] = useState<string[]>([]);
  const [scene, setScene] = useState<Habitat>(initialScenes[0].id);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [populations, setPopulations] = useState<Record<string,CreatureInstance[]>>({});
  const [quietSeconds, setQuietSeconds] = useState(0);
  const [level, setLevel] = useState(0);
  const [tooLoud, setTooLoud] = useState(false);
  const [listening, setListening] = useState(false);
  const [running, setRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [calibrationStage, setCalibrationStage] = useState<"quiet"|"talk"|"ready"|null>(null);
  const quietBaseline = useRef(0);
  const retreatClock = useRef(0);
  const [calibrating, setCalibrating] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [timerLength, setTimerLength] = useState(20);
  const [timerLeft, setTimerLeft] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sceneEl = useRef<HTMLElement | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const buffer = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const frameTime = useRef<number | null>(null);
  const active = useRef(false);
  const settingsRef = useRef(settings);
  const sceneRef = useRef(scene);
  const populationsRef = useRef(populations);
  const runningRef = useRef(false);
  const pressureRef = useRef(0);
  const recoveryRef = useRef(0);
  const tooLoudRef = useRef(false);
  const quietRef = useRef(0);
  const calibrationRef = useRef<{elapsed:number; sum:number; samples:number; stage:"quiet"|"talk"} | null>(null);
  const meterClockRef = useRef(0);
  const sceneLabel = HABITATS[scene] || scenes[0];
  const animals = demo ? demoAnimals : (populations[scene] || EMPTY_POPULATION);
  const discovered = animals.length;
  const nextArrivalId = () => `arrival-${Date.now()}-${arrivalId.current++}`;

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({...prev,[key]:value}));
  };
  useEffect(() => {
    const oldSettings = readStored<Partial<Settings>>("tml-calm-critters-settings-v2",{});
    setSettings(readStored<Settings>("tml-calm-critters-settings-v3",{...DEFAULT_SETTINGS,...oldSettings,noiseResponse:"retreat"}));
    const oldCounts = readStored<Record<Habitat,number>>("tml-calm-critters-collections-v2",{});
    const migrated=Object.fromEntries(initialScenes.map(s=>[s.id,initialPopulation(s,oldCounts[s.id]||0,"saved")]));
    const storedPopulations=readStored<Record<string,CreatureInstance[]>>("tml-calm-critters-populations-v4",migrated);
    const restored=Object.fromEntries(initialScenes.map(s=>[s.id,(Array.isArray(storedPopulations[s.id])?storedPopulations[s.id]:[]).filter(a=>a && typeof a.id==="string" && s.creatures.some(c=>c.id===a.creatureId) && [a.left,a.top,a.size].every(Number.isFinite))]));
    setPopulations(restored);
    const oldScene = readStored<Habitat>("tml-calm-critters-scene-v2","meadow");
    if (KEYS.includes(oldScene)) setScene(oldScene);
    const oldSeen=readStored<Record<string,number>>("tml-calm-critters-seen-v3",oldCounts);
    setSeen(readStored<string[]>("tml-calm-critters-seen-v4",initialScenes.flatMap(s=>s.creatures.slice(0,oldSeen[s.id]||0).map(c=>c.id))));
    setMounted(true);
  }, []);
  useEffect(() => { settingsRef.current=settings; if(mounted) try {localStorage.setItem("tml-calm-critters-settings-v3",JSON.stringify(settings));}catch{} },[settings,mounted]);
  useEffect(() => { populationsRef.current=populations; if(mounted) try {localStorage.setItem("tml-calm-critters-populations-v4",JSON.stringify(populations));}catch{} },[populations,mounted]);
  useEffect(() => {
    sceneRef.current=scene;
    quietRef.current=0;
    setQuietSeconds(0);
    if(mounted) try {localStorage.setItem("tml-calm-critters-scene-v2",JSON.stringify(scene));}catch{}
  },[scene,mounted]);
  useEffect(() => {
    setSeen(previous => [...new Set([...previous,...populationDiscoveries(populations)])]);
  },[populations]);
  useEffect(() => { if(mounted) try {localStorage.setItem("tml-calm-critters-seen-v4",JSON.stringify(seen));}catch{} },[seen,mounted]);
  useEffect(() => { runningRef.current=running; if(!running) { pressureRef.current=0; recoveryRef.current=0; tooLoudRef.current=false; setTooLoud(false); } },[running]);
  useEffect(() => {
    if(!timerRunning) return;
    const timer=setInterval(() => setTimerLeft(previous => {
      if(previous === null) return null;
      if(previous <= 1) { setTimerRunning(false); return 0; }
      return previous-1;
    }),1000);
    return () => clearInterval(timer);
  },[timerRunning]);
  useEffect(() => {
    const handle=() => setIsFullscreen(document.fullscreenElement===sceneEl.current);
    document.addEventListener("fullscreenchange",handle);
    return () => document.removeEventListener("fullscreenchange",handle);
  },[]);

  const refreshDevices = async () => {
    if(!navigator.mediaDevices?.enumerateDevices) return;
    try { setDevices((await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind==="audioinput")); }
    catch { /* Device enumeration is optional. */ }
  };
  const stopMicrophone = useCallback(() => {
    active.current=false;
    stream.current?.getTracks().forEach(t=>t.stop());
    stream.current=null; analyser.current=null; buffer.current=null;
    void audio.current?.close().catch(()=>{});
    audio.current=null; frameTime.current=null;
    setListening(false); setRunning(false); setLevel(0);
    setCalibrating(false); setCalibrationStage(null); calibrationRef.current=null;
  },[]);
  useEffect(() => () => {
    active.current=false;
    stream.current?.getTracks().forEach(t=>t.stop());
    void audio.current?.close().catch(()=>{});
  },[]);

  const connect = async (deviceId?: string) => {
    if(!navigator.mediaDevices?.getUserMedia) {
      setError("Microphone access requires HTTPS and a supported browser.");
      return;
    }
    setError("");
    setDemo(false);
    stopMicrophone();
    try {
      const microphone=await navigator.mediaDevices.getUserMedia({
        audio: { ...(deviceId ? {deviceId:{exact:deviceId}} : {}), echoCancellation:true, noiseSuppression:false },
        video:false
      });
      stream.current=microphone;
      const context=new AudioContext();
      audio.current=context;
      await context.resume();
      const input=context.createMediaStreamSource(microphone);
      const meter=context.createAnalyser();
      meter.fftSize=1024;
      meter.smoothingTimeConstant=0.65;
      input.connect(meter); // No connection to speakers; audio never leaves this page.
      audio.current=context; stream.current=microphone; analyser.current=meter;
      buffer.current=new Uint8Array(new ArrayBuffer(meter.fftSize));
      pressureRef.current=0; recoveryRef.current=0; tooLoudRef.current=false;
      active.current=true; frameTime.current=null;
      setListening(true); setRunning(true);
      void refreshDevices();
    } catch {
      stopMicrophone();
      setError("We could not use that microphone. Check browser permission and the selected input device.");
    }
  };

  useEffect(() => {
    if(!listening && !demo) return;
    let raf=0;
    const tick=(now:number) => {
      if(!active.current && !demoRef.current) return;
      const previous=frameTime.current;
      frameTime.current=now;
      const samples=buffer.current;
      const node=analyser.current;
      if((samples && node) || demoRef.current) {
        if(samples && node) node.getByteTimeDomainData(samples);
        let sum=0;
        for(const value of samples || []) { const norm=(value-128)/128; sum+=norm*norm; }
        const measured=demoRef.current?(demoNoiseRef.current?95:0):clamp(Math.round(Math.sqrt(sum/(samples?.length||1))*300),0,100);
        const delta=previous===null?0:clamp((now-previous)/1000,0,.15);
        meterClockRef.current+=delta;
        if(meterClockRef.current>.08) { setLevel(measured); meterClockRef.current=0; }
        if(calibrationRef.current) {
          const cal=calibrationRef.current;
          cal.elapsed+=delta;
          cal.sum+=measured; cal.samples++;
          setCalibrationProgress(clamp(cal.elapsed/5*100,0,100));
          if(cal.elapsed>=5) {
            const mean=cal.sum/cal.samples;
            if(cal.stage==="quiet") { quietBaseline.current=mean;setCalibrationStage("ready"); }
            else { updateSetting("goal",clamp(Math.round(quietBaseline.current+Math.max(8,(mean-quietBaseline.current)*.45)),5,65));setCalibrationStage(null); }
            calibrationRef.current=null; setCalibrating(false);
          }
        } else if(runningRef.current || demoRef.current) {
          const goal=settingsRef.current.goal;
          const excessive=measured>goal;
          const response=advanceNoise({pressure:pressureRef.current,recovery:recoveryRef.current,retreatClock:retreatClock.current,tooLoud:tooLoudRef.current},measured,goal,delta,settingsRef.current.noiseResponse==="retreat");
          pressureRef.current=response.state.pressure;recoveryRef.current=response.state.recovery;retreatClock.current=response.state.retreatClock;
          if(tooLoudRef.current!==response.state.tooLoud){tooLoudRef.current=response.state.tooLoud;setTooLoud(response.state.tooLoud);}
          if(response.retreat){
            quietRef.current=0;setQuietSeconds(0);
            if(demoRef.current)setDemoAnimals(items=>items.slice(0,-1));
            else {const key=sceneRef.current;const updated={...populationsRef.current,[key]:(populationsRef.current[key]||[]).slice(0,-1)};populationsRef.current=updated;setPopulations(updated);}
          }
          if(!demoRef.current && !tooLoudRef.current && !calibrationRef.current && !excessive) {
            const key=sceneRef.current;
            const world=habitatsRef.current[key];
            const seconds=!(populationsRef.current[key]?.length)?Math.min(15,settingsRef.current.arrivalSeconds):settingsRef.current.arrivalSeconds;
            quietRef.current+=delta;
            if(world && quietRef.current>=seconds){
              quietRef.current=0;
              const updated={...populationsRef.current,[key]:[...(populationsRef.current[key]||[]),spawnCreature(world,nextArrivalId())]};
              populationsRef.current=updated;setPopulations(updated);
            }
            setQuietSeconds(quietRef.current);
          }
        }
      }
      raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  },[listening,demo]);

  useEffect(() => {
    if(!showSettings && !showGuide && !showCollection && !resetConfirm) return;
    const previous=document.activeElement as HTMLElement | null;
    const dialog=document.querySelector<HTMLElement>(".cc-dialog,.cc-drawer");
    const focusable=()=>Array.from(dialog?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select,summary,a[href]')||[]);
    focusable()[0]?.focus();
    const key=(e:KeyboardEvent)=>{
      if(e.key==="Escape") {setShowSettings(false);setShowGuide(false);setShowCollection(false);setResetConfirm(false);}
      if(e.key==="Tab") { const nodes=focusable(); const first=nodes[0],last=nodes[nodes.length-1]; if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();} }
    };
    document.addEventListener("keydown",key);
    return ()=>{document.removeEventListener("keydown",key);previous?.focus();};
  },[showSettings,showGuide,showCollection,resetConfirm]);

  const resetHabitat=() => {
    const updated={...populationsRef.current,[scene]:[]};
    populationsRef.current=updated; setPopulations(updated); quietRef.current=0; setQuietSeconds(0);
    pressureRef.current=0; recoveryRef.current=0; setTooLoud(false); tooLoudRef.current=false;
    if(demo) setDemoAnimals([]);
    setResetConfirm(false);
  };
  const calibrate=() => {
    if(!listening) { setError("Start listening before calibrating the room."); return; }
    setRunning(false);
    calibrationRef.current={elapsed:0,sum:0,samples:0,stage:"quiet"};
    setCalibrationStage("quiet");
    setCalibrationProgress(0); setCalibrating(true); setShowSettings(true);
    setError("");
  };
  const fullscreen=async () => {
    try {
      if(document.fullscreenElement) await document.exitFullscreen();
      else await sceneEl.current?.requestFullscreen();
    } catch { setError("Full-screen mode is unavailable in this browser."); }
  };

  return <div className="cc-v2" ref={sceneEl as React.RefObject<HTMLDivElement>}>
    <div className="cc-shell">
      <nav className="cc-navigation" aria-label="Activity navigation">
        <Link href="/tools"><ArrowLeft size={17}/> Classroom tools</Link>
        <span className="cc-brand">TEACH ME A LESSON <span>•</span> BY WE ARE ELIXIR</span>
      </nav>
      <section className={`cc-adventure cc-${scene} ${tooLoud ? "cc-noisy" : ""}`} aria-label={sceneLabel.name}>
        <div className="cc-painted-world" style={{backgroundImage:`url(${sceneLabel.background})`}} aria-hidden="true"/>
        <div className="cc-scene-toolbar">
          <button type="button" className="cc-world-picker" onClick={()=>setShowScenes(v=>!v)} aria-expanded={showScenes}>
            <img src={sceneLabel.background} alt=""/><span><strong>{sceneLabel.name}</strong><small>Change your world</small></span><ChevronDown size={17}/>
          </button>
          <div className="cc-top-actions">
            <button type="button" onClick={()=>setShowGuide(true)} aria-label="How it works"><HelpCircle size={18}/></button>
            <button type="button" onClick={()=>setShowCollection(true)} aria-label="Creature collection"><BookOpen size={18}/></button>
            <button type="button" onClick={()=>setShowSettings(true)} aria-label="Settings"><Settings2 size={18}/></button>
            <button type="button" onClick={fullscreen} aria-label={isFullscreen?"Exit full screen":"Full screen"}><Expand size={18}/></button>
          </div>
        </div>
        {showScenes && <div className="cc-world-menu" role="group" aria-label="Choose a world">{scenes.map(world=><button key={world.id} onClick={()=>{setScene(world.id);setDemoAnimals(initialPopulation(world,4,"preview"));setDemoNoise(false);pressureRef.current=0;recoveryRef.current=0;retreatClock.current=0;tooLoudRef.current=false;setTooLoud(false);setShowScenes(false)}} aria-pressed={scene===world.id}>
          <img src={world.background} alt=""/><span><strong>{world.name}</strong><small>{world.tagline}</small></span>{scene===world.id&&<Check size={17}/>}
        </button>)}</div>}
        {settings.showMeter && listening && <div className="cc-screen-meter">
          <span><Volume2 size={15}/> {tooLoud?"Time to settle":level>settings.goal?"A little louder":"Lovely and calm"}</span>
          <div className="cc-meter-fill"><i style={{width:`${level}%`}}/><b style={{left:`${settings.goal}%`}}/></div>
        </div>}
        <AnimatedCritters key={`${scene}-${demo?"preview":"classroom"}`} scene={sceneLabel} population={animals} retreating={tooLoud && settings.noiseResponse==="retreat"} paused={!(running||demo) || tooLoud}/>
        {!listening && !demo && <div className="cc-start-overlay">
          <span className="cc-welcome-kicker">TEACH ME A LESSON</span><h1>Calm <em>Critters</em></h1><h2>Let quiet bring your world to life.</h2>
          <p>Allow your microphone, then see who comes out when your classroom gets quiet.</p>
          <button type="button" onClick={()=>void connect(settings.deviceId)}><Mic size={20}/> Start listening</button>
          <button type="button" className="cc-preview-link" onClick={()=>{setDemo(true);setDemoAnimals(initialPopulation(sceneLabel,4,"preview"));setDemoNoise(false);pressureRef.current=0;recoveryRef.current=0;retreatClock.current=0;tooLoudRef.current=false;setTooLoud(false)}}>Preview the artwork without a microphone</button><small>No account. No recording. Completely free.</small>
        </div>}
        {tooLoud && (running||demo) && <div className="cc-weather-overlay" aria-live="polite"><div className="cc-weather-message">Let’s settle and watch the world clear</div></div>}
        {!running && listening && <div className="cc-paused-banner">Adventure paused</div>}
        {timerLeft!==null && <div className="cc-timer-badge"><Clock3 size={18}/> {formatTime(timerLeft)}{timerLeft===0?" • Time's up!":""}</div>}
        <div className="cc-scene-bottom">
          {settings.showCounter && <span>{discovered} animals exploring</span>}
          <span>{tooLoud?"Our friends are waiting for calm":running?"Quiet moments bring new friends":"Ready for your adventure"}</span>
        </div>
        {demo && <div className="cc-demo-controls"><span>Artwork preview · microphone off</span><button onClick={()=>{const animal=spawnCreature(sceneLabel,nextArrivalId());setDemoAnimals(items=>[...items,animal])}}>Add an animal</button><button aria-pressed={demoNoise} onClick={()=>setDemoNoise(value=>!value)}>{demoNoise?"Return to quiet":"Test loud noise"}</button><button onClick={()=>{setDemo(false);setDemoNoise(false);setTooLoud(false);tooLoudRef.current=false;pressureRef.current=0;recoveryRef.current=0;retreatClock.current=0}}>Exit preview</button></div>}
        <div className="cc-stage-controls">
          {listening && <button onClick={()=>setRunning(v=>!v)}>{running?<Pause size={17}/>:<Play size={17}/>} {running?"Pause":"Resume"}</button>}
          <button onClick={()=>setResetConfirm(true)} aria-label="Reset scene"><RotateCcw size={17}/></button>
          <span>Calm Critters <i>Teach Me a Lesson by We Are Elixir</i></span>
          <button onClick={()=>setShowSettings(true)}><Settings2 size={17}/> Teacher settings</button>
        </div>
      </section>
      {error && <p role="alert" className="cc-error">{error}</p>}
    </div>
    {resetConfirm && <div className="cc-modal-backdrop" role="presentation"><div className="cc-dialog" role="alertdialog" aria-modal="true" aria-labelledby="cc-reset-title">
      <h2 id="cc-reset-title">Start this scene again?</h2>
      <p>This will hide the friends discovered in {sceneLabel.name}, but won't affect your other worlds.</p>
      <div className="cc-dialog-actions"><button onClick={()=>setResetConfirm(false)}>Keep exploring</button><button className="cc-danger" onClick={resetHabitat}>Reset this scene</button></div>
    </div></div>}
    {showSettings && <div className="cc-modal-backdrop cc-drawer-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setShowSettings(false)}}>
      <aside className="cc-drawer" role="dialog" aria-modal="true" aria-labelledby="cc-settings-title">
        <div className="cc-drawer-title"><div><span>TEACHER CONTROLS</span><h2 id="cc-settings-title">Settings</h2></div><button type="button" aria-label="Close settings" onClick={()=>setShowSettings(false)}><X size={20}/></button></div>
        <section>
          <h3><Mic size={17}/> Microphone</h3>
          <p>Choose the input device that can hear your class.</p>
          <label htmlFor="cc-device">Input microphone</label>
          <select id="cc-device" value={settings.deviceId} onChange={e=>{const id=e.target.value;updateSetting("deviceId",id);if(listening)void connect(id)}}>
            <option value="">System default microphone</option>
            {devices.filter(d=>d.deviceId).map((d,i)=><option key={d.deviceId} value={d.deviceId}>{d.label||`Microphone ${i+1}`}</option>)}
          </select>
          <button className="cc-subtle-button" type="button" onClick={()=>void refreshDevices()}>Refresh microphone list</button>
          {listening && <button className="cc-subtle-button" type="button" onClick={stopMicrophone}><MicOff size={15}/> Disconnect microphone</button>}
          {!listening && <button className="cc-subtle-button" type="button" onClick={()=>void connect(settings.deviceId)}>Connect microphone</button>}
        </section>
        <section>
          <h3><Volume2 size={17}/> Room volume goal</h3>
          <p>Set how quiet the room should be. Sound values are relative, not decibels.</p>
          <div className="cc-setting-options">
            {[{label:"Silent",value:12},{label:"Independent",value:24},{label:"Partner work",value:42}].map(p=><button type="button" key={p.label}
              className={settings.goal===p.value?"active":""} onClick={()=>updateSetting("goal",p.value)}>{p.label}</button>)}
          </div>
          <label htmlFor="cc-goal">Custom sound goal <strong>{settings.goal} / 100</strong></label>
          <input type="range" id="cc-goal" min="5" max="65" value={settings.goal} onChange={e=>updateSetting("goal",Number(e.target.value))}/>
          <div className="cc-setting-live"><div className="cc-meter-fill"><i style={{width:`${level}%`}}/><b style={{left:`${settings.goal}%`}}/></div><span>Live level: {listening?level:"Not connected"} / 100</span></div>
          <button className="cc-subtle-button" type="button" disabled={!listening||calibrating} onClick={calibrate}>Calibrate to your room</button>
          {calibrating && <p role="status">{calibrationStage==="quiet"?"Keep the room quiet for 5 seconds":"Use normal talking voices for 5 seconds"}… {Math.round(calibrationProgress)}%</p>}
          {calibrationStage==="ready"&&<div><p>Quiet level captured. Next, use normal talking voices.</p><button className="cc-subtle-button" onClick={()=>{calibrationRef.current={elapsed:0,sum:0,samples:0,stage:"talk"};setCalibrationStage("talk");setCalibrationProgress(0);setCalibrating(true)}}>Measure talking level</button></div>}
          <p className="cc-hint">Calibration is optional: measure five seconds of quiet, then five seconds of normal talking. Resume the activity afterwards.</p>
        </section>
        <section>
          <h3><SlidersHorizontal size={17}/> When the room gets noisy</h3>
          <p>A brief interruption is ignored. Sustained noise shows a gentle weather effect.</p>
          <div className="cc-setting-options">
            <button type="button" className={settings.noiseResponse==="pause"?"active":""} onClick={()=>updateSetting("noiseResponse","pause")}>Pause progress</button>
            <button type="button" className={settings.noiseResponse==="retreat"?"active":""} onClick={()=>updateSetting("noiseResponse","retreat")}>Animals run away</button>
          </div>
          <p className="cc-hint">In Pause progress mode, earned creatures always stay. In Animals run away mode, creatures visibly run, hop, fly or swim off-screen after sustained noise, then one more leaves every five seconds until the room settles. Your collection remembers every discovery.</p>
        </section>
        <section>
          <h3><Clock3 size={17}/> How often friends arrive</h3>
          <p>First friend appears after about 15 quiet seconds. After that, choose the pace.</p>
          <div className="cc-setting-options">
            {[{label:"Quick · 30s",value:30},{label:"Steady · 2m",value:120},{label:"Gentle · 4m",value:240}].map(p=><button key={p.value} type="button" className={settings.arrivalSeconds===p.value?"active":""}
              onClick={()=>updateSetting("arrivalSeconds",p.value)}>{p.label}</button>)}
          </div>
          <label htmlFor="cc-arrival">Custom arrival interval <strong>{settings.arrivalSeconds} seconds</strong></label>
          <input type="range" id="cc-arrival" min="20" max="600" step="10" value={settings.arrivalSeconds} onChange={e=>updateSetting("arrivalSeconds",Number(e.target.value))}/>
        </section>
        <section>
          <h3><Leaf size={17}/> On-screen display</h3>
          <label className="cc-switch"><span>Show live room sound meter</span><input type="checkbox" checked={settings.showMeter} onChange={e=>updateSetting("showMeter",e.target.checked)}/></label>
          <label className="cc-switch"><span>Show discovered-friends counter</span><input type="checkbox" checked={settings.showCounter} onChange={e=>updateSetting("showCounter",e.target.checked)}/></label>
          <button type="button" className="cc-subtle-button" onClick={()=>{setShowSettings(false);setShowCollection(true)}}>Open creature collection</button>
        </section>
        <section>
          <div className="cc-panel-heading"><Clock3 size={20}/><h2>Classroom timer</h2></div>
          <p>Set a lesson countdown to keep the class on track.</p>
          <div className="cc-timer-actions">
            <label>Length <select value={timerLength} onChange={e=>setTimerLength(Number(e.target.value))}>
              {[5,10,15,20,30,45,60].map(minutes=><option key={minutes} value={minutes}>{minutes} minutes</option>)}
            </select></label>
            <button type="button" onClick={()=>{if(timerLeft===null||timerLeft===0) setTimerLeft(timerLength*60);setTimerRunning(true)}}><Play size={16}/> {timerLeft===null||timerLeft===0?"Start":"Resume"}</button>
            <button type="button" onClick={()=>setTimerRunning(false)}><Pause size={16}/> Pause</button>
            <button type="button" onClick={()=>{setTimerRunning(false);setTimerLeft(null)}}><RotateCcw size={16}/> Clear</button>
          </div>
          {timerLeft!==null && <strong className="cc-timer-readout">{formatTime(timerLeft)}</strong>}
        </section>
        <p className="cc-drawer-foot">Your settings are remembered in this browser. Microphone audio is never stored or uploaded.</p>
      </aside>
    </div>}
    {showGuide && <div className="cc-modal-backdrop cc-drawer-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setShowGuide(false)}}>
      <aside className="cc-drawer" role="dialog" aria-modal="true" aria-labelledby="cc-guide-title">
        <div className="cc-drawer-title"><div><span>CLASSROOM GUIDE</span><h2 id="cc-guide-title">How it works</h2></div><button aria-label="Close guide" onClick={()=>setShowGuide(false)}><X size={20}/></button></div>
        <section><h3>1. Choose a world</h3><p>Pick a setting to display on a screen or interactive whiteboard. Different classes can explore different worlds.</p></section>
        <section><h3>2. Allow your microphone</h3><p>Press Start listening and allow your browser to use the microphone. It measures volume locally without recording speech.</p></section>
        <section><h3>3. Set the right volume goal</h3><p>Open Settings to choose Silent, Independent or Partner work, or set a custom goal. Select the correct microphone and calibrate if needed.</p></section>
        <section><h3>4. Find your critters</h3><p>The first friend appears quickly. More gradually arrive while the room stays calm, including more than one of the same animal. There is no one-per-species limit. A dropped pencil or short interruption won't immediately stop the adventure. Longer noise brings temporary cloudy weather.</p></section>
        <section><h3>5. Pause when you need to teach</h3><p>Pause to speak to the class without affecting progress. Resume when quiet working begins again. Use the classroom timer for a lesson countdown.</p></section>
        <section><h3>Frequently asked questions</h3>
          <details><summary>Does Calm Critters record our conversations? <ChevronDown size={16}/></summary><p>No. The browser measures a sound level only; no audio is recorded or sent to our servers.</p></details>
          <details><summary>Why is it not detecting sound? <ChevronDown size={16}/></summary><p>Check microphone permission, use HTTPS, choose the right input in Settings and move the sensitivity slider. Try the five-second calibration.</p></details>
          <details><summary>Will we lose the animals we've found? <ChevronDown size={16}/></summary><p>Animals run away when the room stays too loud, then return gradually as quiet work resumes. Your collection remembers every discovery. Choose Pause progress in Settings to keep animals on-screen instead.</p></details>
          <details><summary>Do we need an account? <ChevronDown size={16}/></summary><p>No. This is a free classroom tool. Collections and preferences are saved only in your browser.</p></details>
        </section>
      </aside>
    </div>}
    {showCollection && <div className="cc-modal-backdrop cc-drawer-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setShowCollection(false)}}>
      <aside className="cc-drawer" role="dialog" aria-modal="true" aria-labelledby="cc-collection-title">
        <div className="cc-drawer-title"><div><span>YOUR DISCOVERIES</span><h2 id="cc-collection-title">Creature collection</h2></div><button aria-label="Close collection" onClick={()=>setShowCollection(false)}><X size={20}/></button></div>
        {KEYS.map(key=><section key={key}><h3>{HABITATS[key].name} <small>{HABITATS[key].creatures.filter(c=>seen.includes(c.id)).length}/{HABITATS[key].creatures.length}</small></h3>
          <div className="cc-collection-grid">{HABITATS[key].creatures.map((animal,i)=><div key={animal.id} className={seen.includes(animal.id)?"found":"missing"} title={seen.includes(animal.id)?animal.name:"Not discovered yet"}>
            {seen.includes(animal.id)?<CritterArtwork image={animal.image} alt={animal.name}/>:<span>?</span>}<small>{seen.includes(animal.id)?animal.name:"Hidden"}</small>
          </div>)}</div></section>)}
        <p className="cc-drawer-foot">Your collection is stored locally on this device. Clearing browser data may reset it.</p>
      </aside>
    </div>}
  </div>;
}
