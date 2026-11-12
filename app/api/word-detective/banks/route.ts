import {NextResponse} from "next/server";
import {configured} from "@/lib/db";
import {readWordBanks} from "@/lib/word-detective-banks";
export const dynamic="force-dynamic";
export async function GET(){
 if(!configured())return NextResponse.json({banks:[]},{headers:{"Cache-Control":"no-store"}});
 try{return NextResponse.json({banks:await readWordBanks()},{headers:{"Cache-Control":"no-store"}});}
 catch(error){console.error("Word Detective banks unavailable",{code:(error as {code?:string}).code});return NextResponse.json({banks:[],error:"Custom cases are temporarily unavailable"},{status:503,headers:{"Cache-Control":"no-store"}});}
}
