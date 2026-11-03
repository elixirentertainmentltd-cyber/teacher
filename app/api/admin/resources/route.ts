import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { adminResources,slugify } from "@/lib/cms";
import type { ResultSetHeader } from "mysql2";
function deny(){return NextResponse.json({error:"Unauthorised"},{status:401})}
function originOK(req:Request){const origin=req.headers.get("origin");return !origin||origin===new URL(req.url).origin;}
export async function GET(){if(!await isAdmin())return deny();try{return NextResponse.json(await adminResources())}catch{return NextResponse.json({error:"MySQL unavailable or schema not installed"},{status:503})}}
export async function POST(req:Request){if(!await isAdmin())return deny();if(!originOK(req))return deny();const b=await req.json().catch(()=>null);if(!b||typeof b.title!=="string"||b.title.trim().length<3||b.title.length>200||typeof b.description!=="string"||b.description.length>5000||!["draft","published","archived"].includes(b.status)||(!b.mediaId&&!b.url))return NextResponse.json({error:"Enter a title, description and file or link"},{status:400});
 const link=typeof b.url==="string"?b.url.trim():"";if(link){try{const u=new URL(link);if(!["https:","http:"].includes(u.protocol)||u.username||u.password)throw Error()}catch{return NextResponse.json({error:"Use a valid HTTPS or HTTP link"},{status:400})}}
 const id=Number(b.id)||0;const subject=Number(b.subjectId)||null,type=Number(b.typeId)||null,category=Number(b.categoryId)||null,media=Number(b.mediaId)||null;
 try{if(id){await db().execute("UPDATE tml_resources SET title=?,summary=?,subject_id=?,resource_type_id=?,category_id=?,primary_media_id=?,external_url=?,status=?,featured=?,published_at=IF(?='published',COALESCE(published_at,NOW()),NULL) WHERE id=?",[b.title.trim(),b.description.trim(),subject,type,category,media,link||null,b.status,b.featured===true,b.status,id]);return NextResponse.json({id})}
 const slug=slugify(b.title)+"-"+crypto.randomUUID().slice(0,8);
 const [result]=await db().execute<ResultSetHeader>("INSERT INTO tml_resources (title,slug,summary,subject_id,resource_type_id,category_id,primary_media_id,external_url,status,featured,published_at) VALUES (?,?,?,?,?,?,?,?,?,?,IF(?='published',NOW(),NULL))",[b.title.trim(),slug,b.description.trim(),subject,type,category,media,link||null,b.status,b.featured===true,b.status]);return NextResponse.json({id:result.insertId},{status:201})}catch{return NextResponse.json({error:"Unable to save. Check MySQL schema and selected categories."},{status:503})}}
export async function DELETE(req:Request){if(!await isAdmin())return deny();if(!originOK(req))return deny();const b=await req.json().catch(()=>null);if(!Number.isSafeInteger(b?.id)||b.id<1)return NextResponse.json({error:"Invalid resource"},{status:400});try{await db().execute("DELETE FROM tml_resources WHERE id=?",[b.id]);return NextResponse.json({ok:true})}catch{return NextResponse.json({error:"Unable to delete"},{status:503})}}
