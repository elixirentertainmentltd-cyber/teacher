import { NextResponse } from "next/server";
import { getScenes } from "@/lib/calm-critters-store";
export const dynamic="force-dynamic";
export async function GET(){try{return NextResponse.json({scenes:await getScenes()},{headers:{"Cache-Control":"no-store"}})}catch{return NextResponse.json({error:"Scenes temporarily unavailable"},{status:503})}}
