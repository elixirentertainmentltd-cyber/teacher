import { NextResponse } from "next/server";
import { adminCookieName, createSession, validPassword } from "@/lib/admin-auth";
export async function POST(request:Request){
 const body=await request.json().catch(()=>({}));
 if(typeof body.password!=="string"||!validPassword(body.password))return NextResponse.json({error:"Invalid admin credentials or configuration."},{status:401});
 try{const response=NextResponse.json({ok:true});response.cookies.set(adminCookieName,createSession(),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:8*60*60});return response;}
 catch{return NextResponse.json({error:"Admin login is not configured."},{status:503});}
}
