import type { CritterScene } from "./calm-critters-data";
import { creatureMotion } from "./calm-critters-motion";
export type CreatureInstance={id:string;creatureId:string;left:number;top:number;size:number};
export const EMPTY_POPULATION:CreatureInstance[]=[];
export function spawnCreature(scene:CritterScene,id:string,random:()=>number=Math.random):CreatureInstance {
 const creature=scene.creatures[Math.min(scene.creatures.length-1,Math.floor(random()*scene.creatures.length))];
 const motion=creatureMotion(creature,scene.id);
 const top=motion==="still"?creature.top:Math.max(15,Math.min(88,creature.top+(random()-.5)*6));
 const size=creature.size*(1+(top-creature.top)/160);
 const edge=size/2+3;
 return {id,creatureId:creature.id,left:Math.max(edge,Math.min(100-edge,creature.left+(motion==="still"?0:(random()-.5)*18))),top,size};
}
export function initialPopulation(scene:CritterScene,count:number,prefix:string):CreatureInstance[]{
 return scene.creatures.slice(0,Math.max(0,count)).map((c,i)=>({id:`${prefix}-${scene.id}-${i}`,creatureId:c.id,left:c.left,top:c.top,size:c.size}));
}
export function populationDiscoveries(populations:Record<string,CreatureInstance[]>):string[]{
 return [...new Set(Object.values(populations).flatMap(items=>items.map(item=>item.creatureId)))];
}
