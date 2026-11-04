"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mic, MicOff, Pause, Play, RotateCcw, Settings2, ShieldCheck, Volume2 } from "lucide-react";
import "./calm-critters.css";

type Habitat = "meadow" | "reef" | "galaxy";
type Creature = { name: string; emoji: string; left: number; top: number };
const HABITATS: Record<Habitat, { name: string; tagline: string; emoji: string; creatures: Creature[] }> = {
  meadow: { name: "Rainbow Meadow", tagline: "A bright, blooming place to find new friends", emoji: "🌻", creatures: [
    { name: "Butterfly", emoji: "🦋", left: 17, top: 34 },
    { name: "Bunny", emoji: "🐰", left: 71, top: 70 },
    { name: "Ladybird", emoji: "🐞", left: 35, top: 75 },
    { name: "Fox", emoji: "🦊", left: 82, top: 39 },
    { name: "Hedgehog", emoji: "🦔", left: 52, top: 61 },
    { name: "Deer", emoji: "🦌", left: 14, top: 69 },
    { name: "Unicorn", emoji: "🦄", left: 61, top: 30 },
  ] },
  reef: { name: "Bubble Bay", tagline: "A gentle underwater journey", emoji: "🪸", creatures: [
    { name: "Fish", emoji: "🐠", left: 23, top: 33 },
    { name: "Crab", emoji: "🦀", left: 74, top: 77 },
    { name: "Dolphin", emoji: "🐬", left: 54, top: 43 },
    { name: "Octopus", emoji: "🐙", left: 30, top: 76 },
    { name: "Turtle", emoji: "🐢", left: 78, top: 37 },
    { name: "Whale", emoji: "🐳", left: 48, top: 68 },
    { name: "Pufferfish", emoji: "🐡", left: 13, top: 67 },
  ] },
  galaxy: { name: "Starlight Valley", tagline: "Quiet explorers find cosmic wonders", emoji: "✨", creatures: [
    { name: "Moon", emoji: "🌙", left: 21, top: 28 },
    { name: "Rocket", emoji: "🚀", left: 76, top: 68 },
    { name: "Planet", emoji: "🪐", left: 62, top: 30 },
    { name: "Star", emoji: "🌟", left: 29, top: 66 },
    { name: "Alien", emoji: "👽", left: 79, top: 39 },
    { name: "Satellite", emoji: "🛰️", left: 47, top: 73 },
    { name: "UFO", emoji: "🛸", left: 12, top: 58 },
  ] },
};

const QUIET_SECONDS = 18;
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export default function CalmCritters() {
  const [habitat, setHabitat] = useState<Habitat>("meadow");
  const [goal, setGoal] = useState(25);
  const [unlocked, setUnlocked] = useState<Record<Habitat, number>>({ meadow: 0, reef: 0, galaxy: 0 });
  const [progress, setProgress] = useState(0);
  const [level, setLevel] = useState(0);
  const [listening, setListening] = useState(false);
  const [running, setRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState("");
  const analyser = useRef<AnalyserNode | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const buffer = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const lastTime = useRef<number | null>(null);
  const quietTime = useRef(0);
  const active = useRef(false);
  const runningRef = useRef(false);
  const goalRef = useRef(goal);
  const habitatRef = useRef(habitat);
  const unlockedRef = useRef(unlocked);

  useEffect(() => { goalRef.current = goal; }, [goal]);
  useEffect(() => { habitatRef.current = habitat; quietTime.current = 0; setProgress(0); }, [habitat]);
  useEffect(() => { unlockedRef.current = unlocked; }, [unlocked]);
  useEffect(() => { runningRef.current = running; }, [running]);

  const stop = useCallback(() => {
    active.current = false;
    stream.current?.getTracks().forEach(track => track.stop());
    stream.current = null;
    analyser.current = null;
    buffer.current = null;
    void audio.current?.close().catch(() => {});
    audio.current = null;
    lastTime.current = null;
    setListening(false);
    setRunning(false);
    setLevel(0);
  }, []);
  useEffect(() => () => { active.current = false; stream.current?.getTracks().forEach(t => t.stop()); void audio.current?.close().catch(() => {}); }, []);

  useEffect(() => {
    if (!listening) return;
    let raf = 0;
    const tick = (now: number) => {
      if (!active.current) return;
      const previous = lastTime.current;
      lastTime.current = now;
      const analyserNode = analyser.current;
      const samples = buffer.current;
      if (analyserNode && samples) {
        analyserNode.getByteTimeDomainData(samples);
        let sum = 0;
        for (const x of samples) { const centred = (x - 128) / 128; sum += centred * centred; }
        const rms = Math.sqrt(sum / samples.length);
        const loudness = clamp(Math.round(rms * 300), 0, 100);
        setLevel(loudness);
        if (runningRef.current && previous !== null) {
          const elapsed = clamp((now - previous) / 1000, 0, 0.1);
          if (loudness <= goalRef.current) {
            quietTime.current += elapsed;
            const selected = habitatRef.current;
            if (quietTime.current >= QUIET_SECONDS && unlockedRef.current[selected] < HABITATS[selected].creatures.length) {
              quietTime.current = 0;
              const update = { ...unlockedRef.current, [selected]: unlockedRef.current[selected] + 1 };
              unlockedRef.current = update;
              setUnlocked(update);
            }
            setProgress(clamp(quietTime.current / QUIET_SECONDS * 100, 0, 100));
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [listening]);

  async function startListening() {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Your browser does not support microphone access. Try a recent browser over HTTPS.");
      return;
    }
    try {
      const microphone = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: false }, video: false });
      const context = new AudioContext();
      const source = context.createMediaStreamSource(microphone);
      const meter = context.createAnalyser();
      meter.fftSize = 1024;
      source.connect(meter);
      stream.current = microphone;
      audio.current = context;
      analyser.current = meter;
      buffer.current = new Uint8Array(new ArrayBuffer(meter.fftSize));
      lastTime.current = null;
      active.current = true;
      setListening(true);
      setRunning(true);
    } catch {
      stop();
      setError("Microphone access was not granted. Allow microphone access in your browser settings, then try again.");
    }
  }

  function resetHabitat() {
    const updated = { ...unlockedRef.current, [habitat]: 0 };
    unlockedRef.current = updated;
    setUnlocked(updated);
    quietTime.current = 0;
    setProgress(0);
  }

  const scene = HABITATS[habitat];
  const count = unlocked[habitat];
  const finished = count >= scene.creatures.length;
  const calm = level <= goal;

  return <div className="cc-wrap">
    <div className="cc-shell">
      <nav className="cc-navigation" aria-label="Activity navigation">
        <Link href="/tools"><ArrowLeft size={17} /> All classroom tools</Link>
        <span className="cc-brand">TEACH ME A LESSON <span>•</span> FREE CLASSROOM ACTIVITY</span>
      </nav>
      <header className="cc-heading">
        <div><span className="cc-kicker">A LITTLE CALM. A LOT OF WONDER.</span>
          <h1>Calm <span>Critters</span> <span aria-hidden="true">🌈</span></h1>
          <p>Help your class discover magical little friends by finding moments of quiet together.</p>
        </div>
        <button className="cc-settings-button" type="button" onClick={() => setShowSettings(s => !s)} aria-expanded={showSettings}><Settings2 size={18} /> Settings</button>
      </header>
      <div className="cc-habitat-tabs" role="group" aria-label="Choose an adventure">
        {(Object.keys(HABITATS) as Habitat[]).map(key =>
          <button key={key} type="button" aria-pressed={habitat === key} className={habitat === key ? "cc-selected" : ""} onClick={() => setHabitat(key)}>
            <span aria-hidden="true">{HABITATS[key].emoji}</span> {HABITATS[key].name}
          </button>)}
      </div>
      {showSettings && <section className="cc-settings" aria-label="Activity settings">
        <label htmlFor="cc-goal"><Volume2 size={18} /> Sound sensitivity: <strong>{goal}/100</strong></label>
        <input id="cc-goal" type="range" min="5" max="65" value={goal} onChange={e => setGoal(Number(e.target.value))} />
        <p>Lower values require a quieter room. Adjust the slider to suit your classroom and microphone. This is an approximate sound level, not a calibrated decibel measurement.</p>
      </section>}
      <section className={`cc-scene cc-${habitat}`} aria-label={scene.name}>
        <div className="cc-sun" aria-hidden="true" />
        <div className="cc-scenery cc-scenery-one" aria-hidden="true" />
        <div className="cc-scenery cc-scenery-two" aria-hidden="true" />
        <div className="cc-sparkle cc-sparkle-one" aria-hidden="true">✦</div>
        <div className="cc-sparkle cc-sparkle-two" aria-hidden="true">✧</div>
        <div className="cc-scene-title"><span>{scene.emoji} {scene.name}</span><small>{scene.tagline}</small></div>
        {scene.creatures.slice(0, count).map((creature, i) =>
          <div className="cc-creature" key={creature.name} style={{ left: `${creature.left}%`, top: `${creature.top}%`, animationDelay: `${i * 80}ms` }} aria-label={creature.name} title={creature.name} role="img">
            <span aria-hidden="true">{creature.emoji}</span>
          </div>
        )}
        {count === 0 && <div className="cc-empty-prompt">{listening ? "A little quiet will bring our first friend…" : "Your adventure begins here ✨"}</div>}
        <div className="cc-scene-footer"><span>{count} of {scene.creatures.length} friends discovered</span><span>{finished ? "All friends found! 🎉" : listening && running ? calm ? "Lovely and calm ✨" : "Finding our quiet…" : "Ready when you are"}</span></div>
      </section>
      <section className="cc-controls" aria-label="Activity controls">
        <div className="cc-control-primary">
          {!listening ?
            <button className="cc-action" type="button" onClick={startListening}><Mic size={20} /> Start adventure</button> :
            <button className="cc-action" type="button" onClick={() => setRunning(r => !r)}>{running ? <Pause size={20} /> : <Play size={20} />}{running ? "Pause" : "Resume"}</button>}
          {listening && <button className="cc-secondary" type="button" onClick={stop}><MicOff size={17} /> Stop microphone</button>}
          <button className="cc-secondary" type="button" onClick={resetHabitat}><RotateCcw size={17} /> Start over</button>
        </div>
        <div className="cc-progress-block"><div className="cc-progress-label"><span>{finished ? "Adventure complete!" : "Next friend"}</span><strong>{finished ? "100%" : `${Math.round(progress)}%`}</strong></div>
          <div className="cc-track" role="progressbar" aria-label="Quiet time progress towards next friend" aria-valuenow={finished ? 100 : Math.round(progress)} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${finished ? 100 : progress}%` }} /></div>
          <small>{listening ? "Every 18 seconds of quiet reveals a new friend." : "Microphone access begins only when you press Start adventure."}</small></div>
      </section>
      {listening && <div className="cc-volume"><span><Volume2 size={16} /> Room sound level</span><div className="cc-volume-track"><span style={{ width: `${level}%`, background: calm ? "#2baf86" : "#ef8c42" }} /></div><strong>{level}/100</strong></div>}
      {error && <p className="cc-error" role="alert">{error}</p>}
      <footer className="cc-note"><ShieldCheck size={18} /><p>Your microphone is used only to measure room sound on this device. No audio is recorded, uploaded or stored. This activity is an original Teach Me a Lesson implementation, inspired by the concept of encouraging a calm classroom.</p></footer>
    </div>
  </div>;
}
