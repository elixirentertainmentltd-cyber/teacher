import type { Creature } from "./calm-critters-data";
export const MOTIONS = ["walk","hop","fly","swim","drift","still"] as const;
export type CreatureMotion = typeof MOTIONS[number];
export function creatureMotion(creature:Creature,sceneId:string):CreatureMotion {
 if(creature.motion)return creature.motion;
 const name=creature.name.toLowerCase();
 if(/shell|fossil|fern|volcano|egg|snowman/.test(name))return "still";
 if(sceneId==="galaxy")return "drift";
 if(/butterfly|bee|bird|owl|parrot|toucan|dragonfly|ptero/.test(name))return "fly";
 if(/rabbit|hare|bunny|frog/.test(name))return "hop";
 if(/fish|whale|orca|dolphin|shark|jellyfish|seahorse/.test(name)||sceneId==="reef"&&!/crab|shell|seal/.test(name))return "swim";
 return "walk";
}
export type CreatureActor={creature:Creature;leaving:boolean;exitX?:number;exitY?:number};
/** Retain departing artwork until its exit animation finishes. Re-entry cancels a stale departure. */
export function reconcileActors(previous:CreatureActor[],visible:Creature[],retreating:boolean):CreatureActor[]{
 const ids=new Set(visible.map(c=>c.id));
 return [...visible.map(creature=>({creature,leaving:false})),...previous.filter(a=>!ids.has(a.creature.id)&&(a.leaving||retreating)).map(a=>({...a,leaving:true}))];
}

// Audited against the source illustration sheets. Most subjects face right; these face left.
const LEFT_FACING_CELLS:Record<string,number[]>={woodland:[1,3],reef:[7],arctic:[2,3,6,7],galaxy:[8]};
export function artworkFacing(creature:Pick<Creature,"image"|"facing">):1|-1 {
 if(creature.facing)return creature.facing==="left"?-1:1;
 const match=creature.image.match(/\/([a-z0-9-]+)\/sprites\.webp#(\d+)$/);
 return match&&LEFT_FACING_CELLS[match[1]]?.includes(Number(match[2]))?-1:1;
}
export function motionDuration(motion:CreatureMotion,seed:number):number {
 return motion==="fly"?12:motion==="swim"?17:motion==="drift"?26:14+seed%13;
}
