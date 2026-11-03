import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { configured,testDatabase } from "@/lib/db";
export async function GET(){if(!await isAdmin())return NextResponse.json({error:"Unauthorised"},{status:401});return NextResponse.json({configured:configured(),host:process.env.TML_DB_HOST||null,database:process.env.TML_DB_NAME||null,port:process.env.TML_DB_PORT||"3306"})}
export async function POST(req:Request){if(!await isAdmin())return NextResponse.json({error:"Unauthorised"},{status:401});const origin=req.headers.get("origin");if(origin&&origin!==new URL(req.url).origin)return NextResponse.json({error:"Invalid origin"},{status:403});try{await testDatabase();return NextResponse.json({connected:true})}catch{return NextResponse.json({connected:false,error:"Connection failed. Check Hostinger server environment and the database schema."},{status:503})}}
