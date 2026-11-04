"use client";
import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { CreatureInstance } from "@/lib/calm-critters-population";
import type { CritterScene } from "@/lib/calm-critters-data";
import { creatureMotion, reconcileActors, type CreatureActor } from "@/lib/calm-critters-motion";
import CritterArtwork from "./CritterArtwork";
function AnimatedCritters({scene,population,retreating,paused}:{scene:CritterScene;population:CreatureInstance[];retreating:boolean;paused:boolean}){
 const visible=useMemo(()=>population.flatMap(instance=>{const species=scene.creatures.find(c=>c.id===instance.creatureId);return species?[{...species,...instance}]:[]}),[scene,population]);
 const elements=useRef(new Map<string,HTMLDivElement>());
 const [actors,setActors]=useState<CreatureActor[]>(()=>reconcileActors([],visible,false));
 useEffect(()=>{
  const visibleIds=new Set(visible.map(c=>c.id));
  const offsets=new Map<string,{exitX:number;exitY:number}>();
  if(retreating)for(const [id,element] of elements.current){if(visibleIds.has(id))continue;const wander=element.querySelector(".cc-wander");if(wander){try{const matrix=new DOMMatrixReadOnly(getComputedStyle(wander).transform);offsets.set(id,{exitX:matrix.m41,exitY:matrix.m42});}catch{}}}
  setActors(previous=>reconcileActors(previous,visible,retreating).map(actor=>actor.leaving&&!previous.find(a=>a.creature.id===actor.creature.id)?.leaving?{...actor,...offsets.get(actor.creature.id)}:actor));
 },[visible,retreating]);
 const departing=actors.filter(a=>a.leaving).map(a=>a.creature.id).join(",");
 useEffect(()=>{if(!departing)return;const timer=setTimeout(()=>setActors(previous=>previous.filter(a=>!a.leaving)),2400);return ()=>clearTimeout(timer);},[departing]);
 return <div className={`cc-creature-layer ${paused?"cc-motion-paused":""}`}>
  {actors.map(({creature:c,leaving,exitX=0,exitY=0})=>{
   const seed=Array.from(c.id).reduce((n,ch)=>n+ch.charCodeAt(0),0);
   const motion=creatureMotion(c,scene.id);
   const style={left:`${c.left}%`,top:`${c.top}%`,width:`min(${c.size}cqw,${c.size*16/9}cqh)`,zIndex:leaving?105:Math.round(c.top),"--cc-exit-x":`${exitX}px`,"--cc-exit-y":`${exitY}px`,"--cc-escape":c.left<50?"-120vw":"120vw","--cc-facing":c.left<50?-1:1,"--cc-roam-time":`${14+seed%13}s`,"--cc-phase":`${-seed%17}s`,"--cc-step-time":`${.8+seed%5*.12}s`,"--cc-roam-range":`${Math.max(0,Math.min(8+seed%11,c.left-c.size/2-2,98-c.left-c.size/2))}cqw`} as CSSProperties;
   return <div key={c.id} ref={element=>{if(element)elements.current.set(c.id,element);else elements.current.delete(c.id)}} className={`cc-animal cc-motion-${motion} ${leaving?"cc-leaving":""}`} style={style} role="img" aria-label={leaving?`${c.name} leaving`:c.name} title={c.name} data-creature-id={c.id}
    onAnimationEnd={e=>{if(leaving&&e.target===e.currentTarget&&(e.animationName==="cc-flee"||e.animationName==="cc-hide"))setActors(previous=>previous.filter(a=>a.creature.id!==c.id||!a.leaving));}}>
    <div className="cc-wander"><div className="cc-direction"><div className="cc-gait"><CritterArtwork image={c.image}/></div></div></div>
    <span className="cc-animal-label">{c.name}</span>
   </div>;
  })}
 </div>;
}

export default memo(AnimatedCritters);
