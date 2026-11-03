import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { mkdir,writeFile,unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID,createHash } from "node:crypto";
import type { ResultSetHeader } from "mysql2";
export const runtime="nodejs";
const types:Record<string,string>={"application/pdf":".pdf","image/png":".png","image/jpeg":".jpg","image/webp":".webp"};
export async function POST(req:Request){
 if(!await isAdmin())return NextResponse.json({error:"Unauthorised"},{status:401});
 const origin=req.headers.get("origin");if(origin&&origin!==new URL(req.url).origin)return NextResponse.json({error:"Invalid origin"},{status:403});
 const dir=process.env.TML_UPLOAD_DIR;
 if(!dir||!path.isAbsolute(dir))return NextResponse.json({error:"Set an absolute persistent TML_UPLOAD_DIR in Hostinger settings"},{status:503});
 const data=await req.formData().catch(()=>null);const file=data?.get("file");
 if(!(file instanceof File)||file.size<1||file.size>20*1024*1024||!types[file.type])return NextResponse.json({error:"Upload a PDF, PNG, JPEG or WebP under 20 MB"},{status:400});
 const buffer=Buffer.from(await file.arrayBuffer());
 const valid=file.type==="application/pdf"?buffer.subarray(0,5).toString()==="%PDF-":file.type==="image/png"?buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):file.type==="image/jpeg"?buffer[0]===255&&buffer[1]===216&&buffer[2]===255:buffer.subarray(0,4).toString()==="RIFF"&&buffer.subarray(8,12).toString()==="WEBP";
 if(!valid)return NextResponse.json({error:"File content does not match the selected format"},{status:400});
 const key=randomUUID()+types[file.type];const destination=path.join(dir,key);
 try{await mkdir(dir,{recursive:true,mode:0o700});await writeFile(destination,buffer,{flag:"wx",mode:0o600});try{const [result]=await db().execute<ResultSetHeader>("INSERT INTO tml_media (original_name,storage_key,mime_type,size_bytes,sha256) VALUES (?,?,?,?,?)",[file.name.slice(0,255),key,file.type,buffer.length,createHash("sha256").update(buffer).digest("hex")]);return NextResponse.json({id:result.insertId,name:file.name,url:"/api/media/"+result.insertId},{status:201})}catch(e){await unlink(destination).catch(()=>{});throw e}}catch{return NextResponse.json({error:"Unable to store file. Check database and persistent storage permissions."},{status:503})}
}
