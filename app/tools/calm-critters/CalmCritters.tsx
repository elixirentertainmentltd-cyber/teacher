"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, BookOpen, Check, ChevronDown, Clock3, Expand, HelpCircle, Leaf, Mic,
  MicOff, Pause, Play, RotateCcw, Settings2, ShieldCheck, SlidersHorizontal,
  Sparkles, Volume2, X
} from "lucide-react";
import "./calm-critters.css";

type Habitat = "meadow" | "reef" | "galaxy" | "woodland" | "jungle" | "arctic" | "dinosaurs";
type Creature = { name: string; emoji: string; left: number; top: number };
type NoiseResponse = "pause" | "retreat";
type Settings = {
  goal: number; arrivalSeconds: number; showMeter: boolean; showCounter: boolean;
  deviceId: string; noiseResponse: NoiseResponse;
};
const DEFAULT_SETTINGS: Settings = { goal: 24, arrivalSeconds: 90, showMeter: false, showCounter: true, deviceId: "", noiseResponse: "pause" };
const POSITIONS = [[15,36],[76,70],[36,73],[81,40],[55,61],[18,70],[65,29],[43,41],[89,75],[30,23],[69,53],[46,80]] as const;
const habitat = (name: string, tagline: string, emoji: string, animals: [string,string][]) => ({
  name, tagline, emoji, creatures: animals.map(([animal, icon], i) => ({
    name: animal, emoji: icon, left: POSITIONS[i][0], top: POSITIONS[i][1]
  }))
});
const HABITATS: Record<Habitat, ReturnType<typeof habitat>> = {
  meadow: habitat("Rainbow Meadow", "A sunny field full of tiny wonders", "🌼",
    [["Butterfly","🦋"],["Rabbit","🐰"],["Ladybird","🐞"],["Fox","🦊"],["Hedgehog","🦔"],["Deer","🦌"],["Unicorn","🦄"],["Bee","🐝"],["Mouse","🐭"],["Bird","🐦"],["Snail","🐌"],["Owl","🦉"]]),
  reef: habitat("Bubble Bay", "Make discoveries under the waves", "🪸",
    [["Fish","🐠"],["Crab","🦀"],["Dolphin","🐬"],["Octopus","🐙"],["Turtle","🐢"],["Whale","🐳"],["Pufferfish","🐡"],["Seahorse","🐟"],["Shark","🦈"],["Jellyfish","🪼"],["Shell","🐚"],["Seal","🦭"]]),
  galaxy: habitat("Starlight Valley", "Explore a galaxy of little surprises", "🌌",
    [["Moon","🌙"],["Rocket","🚀"],["Planet","🪐"],["Star","🌟"],["Alien","👽"],["Satellite","🛰️"],["Flying saucer","🛸"],["Earth","🌍"],["Meteor","☄️"],["Sun","☀️"],["Astronaut","🧑‍🚀"],["Galaxy","🌌"]]),
  woodland: habitat("Whispering Woods", "Meet curious friends between the trees", "🌲",
    [["Squirrel","🐿️"],["Fox","🦊"],["Owl","🦉"],["Deer","🦌"],["Hedgehog","🦔"],["Rabbit","🐰"],["Bear","🐻"],["Bird","🐦"],["Mouse","🐭"],["Badger","🦡"],["Wolf","🐺"],["Butterfly","🦋"]]),
  jungle: habitat("Jungle Jamboree", "Find colourful wildlife in a tropical hideaway", "🌴",
    [["Parrot","🦜"],["Monkey","🐒"],["Tiger","🐯"],["Sloth","🦥"],["Frog","🐸"],["Toucan","🐦"],["Snake","🐍"],["Gorilla","🦍"],["Crocodile","🐊"],["Butterfly","🦋"],["Elephant","🐘"],["Leopard","🐆"]]),
  arctic: habitat("Snowflake Shores", "Discover friends in a sparkling snowy world", "❄️",
    [["Penguin","🐧"],["Polar bear","🐻‍❄️"],["Seal","🦭"],["Fox","🦊"],["Whale","🐳"],["Owl","🦉"],["Wolf","🐺"],["Fish","🐟"],["Rabbit","🐰"],["Snowman","☃️"],["Walrus","🦭"],["Orca","🐋"]]),
  dinosaurs: habitat("Dinosaur Discovery", "Travel back to a world of prehistoric giants", "🦕",
    [["Diplodocus","🦕"],["Tyrannosaurus","🦖"],["Egg","🥚"],["Dragonfly","🦋"],["Triceratops","🦕"],["Fern","🌿"],["Raptor","🦖"],["Volcano","🌋"],["Baby dinosaur","🐣"],["Ancient turtle","🐢"],["Pterodactyl","🦅"],["Fossil","🦴"]])
};
const KEYS = Object.keys(HABITATS) as Habitat[];
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const freshCounts = () => Object.fromEntries(KEYS.map(key => [key,0])) as Record<Habitat, number>;
function readStored<T>(key: string, fallback: T): T {
  try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; }
  catch { return fallback; }
}
const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2,"0")}:${(seconds % 60).toString().padStart(2,"0")}`;

export default function CalmCritters() {
  const [scene, setScene] = useState<Habitat>("meadow");
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [counts, setCounts] = useState<Record<Habitat,number>>(freshCounts);
  const [quietSeconds, setQuietSeconds] = useState(0);
  const [level, setLevel] = useState(0);
  const [tooLoud, setTooLoud] = useState(false);
  const [listening, setListening] = useState(false);
  const [running, setRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
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
  const countsRef = useRef(counts);
  const runningRef = useRef(false);
  const pressureRef = useRef(0);
  const recoveryRef = useRef(0);
  const tooLoudRef = useRef(false);
  const quietRef = useRef(0);
  const calibrationRef = useRef<{elapsed:number; sum:number; samples:number} | null>(null);
  const meterClockRef = useRef(0);
  const sceneLabel = HABITATS[scene];
  const discovered = counts[scene];
  const complete = discovered >= sceneLabel.creatures.length;
  const revealInterval = discovered === 0 ? Math.min(15, settings.arrivalSeconds) : settings.arrivalSeconds;
  const progress = complete ? 100 : clamp(quietSeconds / revealInterval * 100, 0, 100);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({...prev,[key]:value}));
  };
  useEffect(() => {
    const oldSettings = readStored<Partial<Settings>>("tml-calm-critters-settings-v2",{});
    setSettings({...DEFAULT_SETTINGS,...oldSettings});
    const oldCounts = readStored<Partial<Record<Habitat,number>>>("tml-calm-critters-collections-v2",{});
    setCounts({...freshCounts(),...oldCounts});
    const oldScene = readStored<Habitat>("tml-calm-critters-scene-v2","meadow");
    if (KEYS.includes(oldScene)) setScene(oldScene);
    setMounted(true);
  }, []);
  useEffect(() => { settingsRef.current=settings; if(mounted) localStorage.setItem("tml-calm-critters-settings-v2",JSON.stringify(settings)); },[settings,mounted]);
  useEffect(() => { countsRef.current=counts; if(mounted) localStorage.setItem("tml-calm-critters-collections-v2",JSON.stringify(counts)); },[counts,mounted]);
  useEffect(() => {
    sceneRef.current=scene;
    quietRef.current=0;
    setQuietSeconds(0);
    if(mounted) localStorage.setItem("tml-calm-critters-scene-v2",JSON.stringify(scene));
  },[scene,mounted]);
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
    setCalibrating(false); calibrationRef.current=null;
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
    stopMicrophone();
    try {
      const microphone=await navigator.mediaDevices.getUserMedia({
        audio: { ...(deviceId ? {deviceId:{exact:deviceId}} : {}), echoCancellation:true, noiseSuppression:false },
        video:false
      });
      const context=new AudioContext();
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
    if(!listening) return;
    let raf=0;
    const tick=(now:number) => {
      if(!active.current) return;
      const previous=frameTime.current;
      frameTime.current=now;
      const samples=buffer.current;
      const node=analyser.current;
      if(samples && node) {
        node.getByteTimeDomainData(samples);
        let sum=0;
        for(const value of samples) { const norm=(value-128)/128; sum+=norm*norm; }
        const measured=clamp(Math.round(Math.sqrt(sum/samples.length)*300),0,100);
        const delta=previous===null?0:clamp((now-previous)/1000,0,.15);
        meterClockRef.current+=delta;
        if(meterClockRef.current>.08) { setLevel(measured); meterClockRef.current=0; }
        if(calibrationRef.current) {
          const cal=calibrationRef.current;
          cal.elapsed+=delta;
          cal.sum+=measured; cal.samples++;
          setCalibrationProgress(clamp(cal.elapsed/5*100,0,100));
          if(cal.elapsed>=5) {
            updateSetting("goal",clamp(Math.round(cal.sum/cal.samples)+10,5,65));
            calibrationRef.current=null; setCalibrating(false);
          }
        } else if(runningRef.current) {
          const goal=settingsRef.current.goal;
          const excessive=measured>goal;
          if(!tooLoudRef.current) {
            pressureRef.current=clamp(pressureRef.current+(excessive?
              (1+Math.pow((measured-goal)/12,2))*delta : -1.4*delta),0,6);
            if(pressureRef.current>=6) {
              tooLoudRef.current=true; recoveryRef.current=0; setTooLoud(true);
              if(settingsRef.current.noiseResponse==="retreat") {
                const key=sceneRef.current;
                const updated={...countsRef.current,[key]:Math.max(0,countsRef.current[key]-1)};
                countsRef.current=updated; setCounts(updated);
              }
            }
          } else {
            recoveryRef.current=excessive?0:recoveryRef.current+delta;
            if(recoveryRef.current>=3) {
              tooLoudRef.current=false; pressureRef.current=0;
              recoveryRef.current=0; setTooLoud(false);
            }
          }
          if(!tooLoudRef.current && !calibrationRef.current && !excessive) {
            const key=sceneRef.current;
            const limit=HABITATS[key].creatures.length;
            const seconds=countsRef.current[key]===0?Math.min(15,settingsRef.current.arrivalSeconds):settingsRef.current.arrivalSeconds;
            if(countsRef.current[key]<limit) {
              quietRef.current+=delta;
              if(quietRef.current>=seconds) {
                quietRef.current=0;
                const updated={...countsRef.current,[key]:countsRef.current[key]+1};
                countsRef.current=updated; setCounts(updated);
              }
              setQuietSeconds(quietRef.current);
            }
          }
        }
      }
      raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  },[listening]);

  const resetHabitat=() => {
    const updated={...countsRef.current,[scene]:0};
    countsRef.current=updated; setCounts(updated); quietRef.current=0; setQuietSeconds(0);
    pressureRef.current=0; recoveryRef.current=0; setTooLoud(false); tooLoudRef.current=false;
    setResetConfirm(false);
  };
  const calibrate=() => {
    if(!listening) { setError("Start listening before calibrating the room."); return; }
    setRunning(false);
    calibrationRef.current={elapsed:0,sum:0,samples:0};
    setCalibrationProgress(0); setCalibrating(true); setShowSettings(true);
    setError("");
  };
  const fullscreen=async () => {
    try {
      if(document.fullscreenElement) await document.exitFullscreen();
      else await sceneEl.current?.requestFullscreen();
    } catch { setError("Full-screen mode is unavailable in this browser."); }
  };

  return <div className="cc-v2">
    <div className="cc-shell">
      <nav className="cc-navigation" aria-label="Activity navigation">
        <Link href="/tools"><ArrowLeft size={17}/> Classroom tools</Link>
        <span className="cc-brand">TEACH ME A LESSON <span>•</span> BY WE ARE ELIXIR</span>
      </nav>
      <header className="cc-heading">
        <div>
          <span className="cc-kicker"><Sparkles size={15}/> AN INTERACTIVE CLASSROOM ADVENTURE</span>
          <h1>Calm <span>Critters</span><span aria-hidden="true"> ✨</span></h1>
          <p>Every quiet moment brings a new friend out of hiding. Fill your scene together, at your own pace.</p>
        </div>
        <div className="cc-top-actions">
          <button type="button" onClick={() => setShowGuide(true)}><HelpCircle size={17}/> How it works</button>
          <button type="button" onClick={() => setShowCollection(true)}><BookOpen size={17}/> Collection</button>
          <button type="button" onClick={() => setShowSettings(true)}><Settings2 size={17}/> Settings</button>
        </div>
      </header>
      <div className="cc-habitat-bar">
        <div className="cc-habitat-tabs" role="group" aria-label="Select an adventure">
          {KEYS.map(key => <button type="button" key={key} onClick={()=>setScene(key)}
            className={scene===key?"cc-selected":""} aria-pressed={scene===key}>
            <span aria-hidden="true">{HABITATS[key].emoji}</span> {HABITATS[key].name}
          </button>)}
        </div>
      </div>
      <section ref={sceneEl} className={`cc-adventure cc-${scene}`} aria-label={sceneLabel.name}>
        <div className="cc-landscape cc-landscape-back" aria-hidden="true"/>
        <div className="cc-landscape cc-landscape-front" aria-hidden="true"/>
        <div className="cc-sun" aria-hidden="true"/>
        <div className="cc-sparkle cc-star-one" aria-hidden="true">✦</div>
        <div className="cc-sparkle cc-star-two" aria-hidden="true">✧</div>
        <div className="cc-scene-toolbar">
          <div className="cc-scene-name"><strong>{sceneLabel.emoji} {sceneLabel.name}</strong><small>{sceneLabel.tagline}</small></div>
          <button type="button" onClick={fullscreen} title={isFullscreen?"Exit full screen":"Enter full screen"}><Expand size={17}/> {isFullscreen?"Exit":"Full screen"}</button>
        </div>
        {settings.showMeter && listening && <div className="cc-screen-meter">
          <span><Volume2 size={15}/> {tooLoud?"Time to settle":level>settings.goal?"A little louder":"Lovely and calm"}</span>
          <div className="cc-meter-fill"><i style={{width:`${level}%`}}/><b style={{left:`${settings.goal}%`}}/></div>
        </div>}
        {sceneLabel.creatures.slice(0,discovered).map((animal,i)=>
          <div key={animal.name} className="cc-animal" style={{left:`${animal.left}%`,top:`${animal.top}%`,animationDelay:`${i*.08}s`}}
            role="img" aria-label={animal.name} title={animal.name}><span>{animal.emoji}</span></div>
        )}
        {!listening && discovered===0 && <div className="cc-start-overlay">
          <span aria-hidden="true">🌈</span><h2>A world of wonder awaits</h2>
          <p>Allow your microphone, then see who comes out when your classroom gets quiet.</p>
          <button type="button" onClick={()=>void connect(settings.deviceId)}><Mic size={20}/> Start listening</button>
          <small>No account. No recording. Completely free.</small>
        </div>}
        {tooLoud && running && <div className="cc-weather-overlay" aria-live="polite"><div className="cc-weather-message">☁️ A little more quiet, please</div></div>}
        {!running && listening && <div className="cc-paused-banner">⏸ Adventure paused</div>}
        {timerLeft!==null && <div className="cc-timer-badge"><Clock3 size={18}/> {formatTime(timerLeft)}{timerLeft===0?" • Time's up!":""}</div>}
        <div className="cc-scene-bottom">
          {settings.showCounter && <span>{discovered} / {sceneLabel.creatures.length} friends discovered</span>}
          <span>{complete?"Amazing! Every friend is here 🎉":tooLoud?"Our friends are waiting for calm":running?"Quiet moments bring new friends":"Ready for your adventure"}</span>
        </div>
      </section>
      <div className="cc-command-bar" aria-label="Classroom activity controls">
        <div className="cc-command-buttons">
          {!listening?<button className="cc-primary" type="button" onClick={()=>void connect(settings.deviceId)}><Mic size={18}/> Start listening</button>:
            <button className="cc-primary" type="button" onClick={()=>setRunning(v=>!v)}>{running?<Pause size={18}/>:<Play size={18}/>} {running?"Pause":"Resume"}</button>}
          {listening && <button type="button" onClick={stopMicrophone}><MicOff size={17}/> Disconnect</button>}
          <button type="button" onClick={()=>setResetConfirm(true)}><RotateCcw size={16}/> Reset scene</button>
          <button type="button" onClick={()=>setShowSettings(true)}><Settings2 size={17}/> Settings</button>
        </div>
        <div className="cc-quiet-progress">
          <div><strong>{complete?"All friends found":"Next friend"}</strong><span>{complete?"100%":`${Math.floor(progress)}%`}</span></div>
          <div className="cc-quiet-track" role="progressbar" aria-label="Progress to next creature" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.floor(progress)}><span style={{width:`${progress}%`}}/></div>
          <small>{complete?"Switch scenes to discover more!":`First arrival after 15 seconds, then about every ${settings.arrivalSeconds<60?settings.arrivalSeconds+" seconds":Math.round(settings.arrivalSeconds/60)+" minutes"} of calm.`}</small>
        </div>
      </div>
      {error && <p role="alert" className="cc-error">{error}</p>}
      <section className="cc-below">
        <div className="cc-panel">
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
        </div>
        <div className="cc-panel">
          <div className="cc-panel-heading"><ShieldCheck size={20}/><h2>Private by design</h2></div>
          <p>Sound is measured in your browser on your own device. Audio is never recorded, transmitted or stored. Classroom choices and collected creatures are saved in this browser only.</p>
          <p>Best used with a classroom microphone and a screen everyone can see. A secure HTTPS connection is required for microphone permission.</p>
        </div>
      </section>
      <section className="cc-explainer" aria-label="How Calm Critters works">
        <div className="cc-section-head"><span>THE SIMPLE IDEA</span><h2>A little quiet. A lot of discovery.</h2></div>
        <div className="cc-explainer-grid">
          <article><span>01</span><h3>Choose a world</h3><p>Pick one of seven colourful adventures. Each world keeps the creatures you've discovered on this device.</p></article>
          <article><span>02</span><h3>Set your goal</h3><p>Choose silent, independent or partner work and adjust the sound goal to suit your classroom.</p></article>
          <article><span>03</span><h3>Watch friends appear</h3><p>As your room settles, more creatures come out. Brief noises won't take away what you've earned.</p></article>
        </div>
      </section>
      <div className="cc-bottom-note">Calm Critters is an original Teach Me a Lesson classroom tool • Part of We Are Elixir • Free for everyone</div>
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
          <button className="cc-subtle-button" type="button" disabled={!listening||calibrating} onClick={calibrate}>Calibrate to your room (5 seconds)</button>
          {calibrating && <p role="status">Keep the room quiet while we listen… {Math.round(calibrationProgress)}%</p>}
          <p className="cc-hint">Calibration is optional. Pause any lesson activity while you calibrate, then resume it afterwards.</p>
        </section>
        <section>
          <h3><SlidersHorizontal size={17}/> When the room gets noisy</h3>
          <p>A brief interruption is ignored. Sustained noise shows a gentle weather effect.</p>
          <div className="cc-setting-options">
            <button type="button" className={settings.noiseResponse==="pause"?"active":""} onClick={()=>updateSetting("noiseResponse","pause")}>Pause progress</button>
            <button type="button" className={settings.noiseResponse==="retreat"?"active":""} onClick={()=>updateSetting("noiseResponse","retreat")}>One friend hides</button>
          </div>
          <p className="cc-hint">In Pause progress mode, earned creatures always stay. In One friend hides mode, one creature retreats after sustained noise.</p>
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
        <p className="cc-drawer-foot">Your settings are remembered in this browser. Microphone audio is never stored or uploaded.</p>
      </aside>
    </div>}
    {showGuide && <div className="cc-modal-backdrop cc-drawer-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setShowGuide(false)}}>
      <aside className="cc-drawer" role="dialog" aria-modal="true" aria-labelledby="cc-guide-title">
        <div className="cc-drawer-title"><div><span>CLASSROOM GUIDE</span><h2 id="cc-guide-title">How it works</h2></div><button aria-label="Close guide" onClick={()=>setShowGuide(false)}><X size={20}/></button></div>
        <section><h3>1. Choose a world</h3><p>Pick a setting to display on a screen or interactive whiteboard. Different classes can explore different worlds.</p></section>
        <section><h3>2. Allow your microphone</h3><p>Press Start listening and allow your browser to use the microphone. It measures volume locally without recording speech.</p></section>
        <section><h3>3. Set the right volume goal</h3><p>Open Settings to choose Silent, Independent or Partner work, or set a custom goal. Select the correct microphone and calibrate if needed.</p></section>
        <section><h3>4. Find your critters</h3><p>The first friend appears quickly. More gradually arrive while the room stays calm. A dropped pencil or short interruption won't immediately stop the adventure. Longer noise brings temporary cloudy weather.</p></section>
        <section><h3>5. Pause when you need to teach</h3><p>Pause to speak to the class without affecting progress. Resume when quiet working begins again. Use the classroom timer for a lesson countdown.</p></section>
        <section><h3>Frequently asked questions</h3>
          <details><summary>Does Calm Critters record our conversations? <ChevronDown size={16}/></summary><p>No. The browser measures a sound level only; no audio is recorded or sent to our servers.</p></details>
          <details><summary>Why is it not detecting sound? <ChevronDown size={16}/></summary><p>Check microphone permission, use HTTPS, choose the right input in Settings and move the sensitivity slider. Try the five-second calibration.</p></details>
          <details><summary>Will we lose the animals we've found? <ChevronDown size={16}/></summary><p>Not by default. Pause progress keeps your discoveries. You can choose an optional mode where one creature hides after sustained noise.</p></details>
          <details><summary>Do we need an account? <ChevronDown size={16}/></summary><p>No. This is a free classroom tool. Collections and preferences are saved only in your browser.</p></details>
        </section>
      </aside>
    </div>}
    {showCollection && <div className="cc-modal-backdrop cc-drawer-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setShowCollection(false)}}>
      <aside className="cc-drawer" role="dialog" aria-modal="true" aria-labelledby="cc-collection-title">
        <div className="cc-drawer-title"><div><span>YOUR DISCOVERIES</span><h2 id="cc-collection-title">Creature collection</h2></div><button aria-label="Close collection" onClick={()=>setShowCollection(false)}><X size={20}/></button></div>
        {KEYS.map(key=><section key={key}><h3>{HABITATS[key].emoji} {HABITATS[key].name} <small>{counts[key]}/{HABITATS[key].creatures.length}</small></h3>
          <div className="cc-collection-grid">{HABITATS[key].creatures.map((animal,i)=><div key={animal.name} className={i<counts[key]?"found":"missing"} title={i<counts[key]?animal.name:"Not discovered yet"}>
            <span>{i<counts[key]?animal.emoji:"?"}</span><small>{i<counts[key]?animal.name:"Hidden"}</small>
          </div>)}</div></section>)}
        <p className="cc-drawer-foot">Your collection is stored locally on this device. Clearing browser data may reset it.</p>
      </aside>
    </div>}
  </div>;
}
