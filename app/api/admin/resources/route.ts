import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getCatalogue, saveCatalogue } from "@/lib/catalogue";
import { STAGES, SUBJECTS, RESOURCE_TYPES, type Resource } from "@/lib/resources";
const deny=()=>NextResponse.json({error:"Unauthorised"},{status:401});
export async function GET(){if(!await isAdmin())return deny();try{return NextResponse.json((await getCatalogue()).items)}catch{return NextResponse.json({error:"Content storage is not configured or unavailable."},{status:503})}}
export async function POST(request:Request){
 if(!await isAdmin())return deny();
 const origin=request.headers.get("origin");
 if(origin && origin!==new URL(request.url).origin)return NextResponse.json({error:"Invalid origin"},{status:403});
 const body=await request.json().catch(()=>null);
 if(!body||typeof body.title!=="string"||body.title.trim().length<3||body.title.length>120||typeof body.description!=="string"||body.description.length>1200||!SUBJECTS.includes(body.subject)||!RESOURCE_TYPES.includes(body.type)||!Array.isArray(body.stages)||!body.stages.length||body.stages.some((s:unknown)=>!STAGES.some(t=>t.id===s))||typeof body.category!=="string"||body.category.length>80||typeof body.years!=="string"||body.years.length>60||typeof body.url!=="string"||body.url.length>2000)return NextResponse.json({error:"Check the resource details."},{status:400});
 let url:URL;
 try{url=new URL(body.url,new URL(request.url).origin);if(!["https:","http:"].includes(url.protocol)||url.username||url.password)throw Error()}catch{return NextResponse.json({error:"Enter a valid web link."},{status:400})}
 if(body.url.startsWith("/")&&body.url.startsWith("//"))return NextResponse.json({error:"Invalid link."},{status:400});
 const item:Resource={id:crypto.randomUUID(),title:body.title.trim(),description:body.description.trim(),subject:body.subject,type:body.type,stages:[...new Set(body.stages)] as Resource["stages"],years:body.years.trim(),category:body.category.trim(),url:body.url,published:body.published===true};
 try{const {items,sha}=await getCatalogue();if(!sha)throw Error();await saveCatalogue([...items,item],sha);return NextResponse.json({item},{status:201})}catch{return NextResponse.json({error:"Unable to save. Check the GitHub content token and try again."},{status:503})}
}
