import "server-only";
import { db, configured } from "@/lib/db";
import { DEFAULT_SCENES, type CritterScene } from "@/lib/calm-critters-data";
import type { RowDataPacket } from "mysql2";
export const SCENE_SCHEMA = `CREATE TABLE IF NOT EXISTS tml_calm_scenes (id VARCHAR(64) PRIMARY KEY, definition JSON NOT NULL, published BOOLEAN NOT NULL DEFAULT FALSE, revision INT UNSIGNED NOT NULL DEFAULT 1, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`;
export function validImage(value:unknown):value is string { return typeof value==="string" && (/^\/calm-critters\/[a-z0-9/-]+\.webp(?:#(?:[0-9]|1[01]))?$/.test(value)||/^\/api\/media\/[1-9][0-9]*$/.test(value)); }
export function validateScene(value:unknown): value is CritterScene {
 if(!value || typeof value!=="object") return false;
 const s=value as CritterScene;
 return typeof s.id==="string" && /^[a-z][a-z0-9-]{1,63}$/.test(s.id) && typeof s.name==="string" && s.name.trim().length>=2 && s.name.length<=80 && typeof s.tagline==="string" && s.tagline.length<=180 && validImage(s.background) && typeof s.published==="boolean" && Number.isInteger(s.revision) && s.revision>=0 && Array.isArray(s.creatures) && s.creatures.length>=1 && s.creatures.length<=60 && s.creatures.every(c=>c && typeof c==="object") && new Set(s.creatures.map(c=>c.id)).size===s.creatures.length && s.creatures.every(c=>typeof c.id==="string" && /^[a-zA-Z0-9-]{1,80}$/.test(c.id) && typeof c.name==="string" && c.name.trim().length>=1 && c.name.length<=80 && validImage(c.image) && Number.isFinite(c.left) && c.left>=5 && c.left<=95 && Number.isFinite(c.top) && c.top>=15 && c.top<=90 && Number.isFinite(c.size) && c.size>=1 && c.size<=35 && (c.motion===undefined || ["walk","hop","fly","swim","drift","still"].includes(c.motion)));
}
export async function getScenes(admin=false):Promise<CritterScene[]> {
 const merged=new Map(DEFAULT_SCENES.map(s=>[s.id,s]));
 if(configured()) {
  try { const [rows]=await db().query<RowDataPacket[]>("SELECT definition,revision,published FROM tml_calm_scenes ORDER BY id");
   for(const row of rows){const scene=typeof row.definition==="string"?JSON.parse(row.definition):row.definition;merged.set(scene.id,{...scene,revision:row.revision,published:!!row.published});}
  }catch(error){if((error as {code?:string}).code!=="ER_NO_SUCH_TABLE") throw error;}
 }
 return [...merged.values()].filter(s=>admin||s.published);
}
export async function publishedSceneMedia(id:string):Promise<boolean> {
 try {const [rows]=await db().execute<RowDataPacket[]>("SELECT id FROM tml_calm_scenes WHERE published=TRUE AND JSON_SEARCH(definition,'one',?) IS NOT NULL LIMIT 1",["/api/media/"+id]);return rows.length>0;}catch{return false;}
}
