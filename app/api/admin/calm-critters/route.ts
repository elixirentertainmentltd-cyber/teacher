import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { validAdminOrigin } from "@/lib/request-origin";
import { db } from "@/lib/db";
import { getScenes, SCENE_SCHEMA, validateScene } from "@/lib/calm-critters-store";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
export const dynamic="force-dynamic";
export async function GET(){if(!await isAdmin())return NextResponse.json({error:"Unauthorised"},{status:401});try{return NextResponse.json({scenes:await getScenes(true)})}catch{return NextResponse.json({error:"Scene management could not connect to MySQL."},{status:503})}}
export async function POST(req:Request){
 if(!await isAdmin())return NextResponse.json({error:"Unauthorised"},{status:401});
 if(!validAdminOrigin(req))return NextResponse.json({error:"Invalid origin"},{status:403});
 if(Number(req.headers.get("content-length"))>100000)return NextResponse.json({error:"Scene is too large"},{status:413});
 const raw=await req.text();
 if(raw.length>100000)return NextResponse.json({error:"Scene is too large"},{status:413});
 let scene:unknown;try{scene=JSON.parse(raw)}catch{scene=null;}
 if(!validateScene(scene))return NextResponse.json({error:"Enter a scene name, background and 1–60 named creatures with valid images and positions."},{status:400});
 try {
  const media=[scene.background,...scene.creatures.map(c=>c.image)].filter(url=>url.startsWith("/api/media/")).map(url=>Number(url.split("/").pop()));
  for(const id of new Set(media)){const [rows]=await db().execute<RowDataPacket[]>("SELECT id FROM tml_media WHERE id=? AND mime_type IN ('image/png','image/jpeg','image/webp')",[id]);if(!rows.length)return NextResponse.json({error:"An image is missing or is not a supported image. Upload it again."},{status:400});}
  try {await db().query("SELECT id FROM tml_calm_scenes LIMIT 0");}catch(error){if((error as {code?:string}).code!=="ER_NO_SUCH_TABLE")throw error;await db().query(SCENE_SCHEMA);}
  let result:ResultSetHeader;
  if(scene.revision===0){try{[result]=await db().execute<ResultSetHeader>("INSERT INTO tml_calm_scenes (id,definition,published,revision) VALUES (?,?,?,1)",[scene.id,JSON.stringify(scene),scene.published]);}catch(error){if((error as {code?:string}).code==="ER_DUP_ENTRY")return NextResponse.json({error:"This scene has changed. Reload before saving."},{status:409});throw error;}}
  else {[result]=await db().execute<ResultSetHeader>("UPDATE tml_calm_scenes SET definition=?,published=?,revision=revision+1 WHERE id=? AND revision=?",[JSON.stringify(scene),scene.published,scene.id,scene.revision]);if(!result.affectedRows)return NextResponse.json({error:"This scene has changed. Reload before saving."},{status:409});}
  return NextResponse.json({scene:{...scene,revision:scene.revision+1}});
 }catch(error){console.error("Calm Critters save failed",{code:(error as {code?:string}).code});return NextResponse.json({error:"Could not save the scene. Check MySQL connection and table permissions."},{status:503});}
}
