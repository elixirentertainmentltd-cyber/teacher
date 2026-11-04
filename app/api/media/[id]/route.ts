import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { publishedSceneMedia } from "@/lib/calm-critters-store";
import { isAdmin } from "@/lib/admin-auth";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { RowDataPacket } from "mysql2";
export const runtime="nodejs";
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;if(!/^[1-9][0-9]*$/.test(id))return new Response("Not found",{status:404});
 try{const [rows]=await db().execute<RowDataPacket[]>(`SELECT m.storage_key,m.mime_type,m.original_name,EXISTS(SELECT 1 FROM tml_resources r WHERE r.primary_media_id=m.id AND r.status='published') AS public_file FROM tml_media m WHERE m.id=?`,[id]);
 const item=rows[0];if(item&&!item.public_file)item.public_file=await publishedSceneMedia(id);if(!item||(!item.public_file&&!await isAdmin()))return new Response("Not found",{status:404});
 const dir=process.env.TML_UPLOAD_DIR;if(!dir||!path.isAbsolute(dir)||!/^[-a-f0-9]+\.(pdf|png|jpg|webp)$/.test(item.storage_key))return new Response("Not found",{status:404});
 const bytes=await readFile(path.join(dir,item.storage_key));
 return new NextResponse(bytes,{headers:{"Content-Type":item.mime_type,"Content-Disposition":`inline; filename*=UTF-8''${encodeURIComponent(item.original_name)}`,"X-Content-Type-Options":"nosniff","Cache-Control":item.public_file?"public, max-age=300":"private, no-store"}});
 }catch{return new Response("Not found",{status:404})}
}
