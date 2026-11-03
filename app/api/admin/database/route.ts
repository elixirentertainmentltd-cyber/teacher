import { validAdminOrigin } from "@/lib/request-origin";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { configured,testDatabase } from "@/lib/db";

type DatabaseError = { code?:string; errno?:number };
function safeDiagnosis(error:unknown):string{
 const code=(error as DatabaseError)?.code;
 switch(code){
  case "ENOTFOUND":case "EAI_AGAIN":return "Database hostname could not be resolved. Check TML_DB_HOST in Hostinger.";
  case "ECONNREFUSED":return "Database server refused the connection. Check the host, port and whether remote MySQL connections are allowed.";
  case "ETIMEDOUT":case "ETIMEDOUT_READ":return "Database connection timed out. Check the network, firewall and MySQL host/port.";
  case "ER_ACCESS_DENIED_ERROR":return "MySQL rejected the username, password or allowed connection host. Check TML_DB_USER and TML_DB_PASSWORD.";
  case "ER_BAD_DB_ERROR":return "MySQL connected but the named database does not exist. Check TML_DB_NAME.";
  case "ER_DBACCESS_DENIED_ERROR":return "MySQL user does not have access to the selected database.";
  case "HANDSHAKE_SSL_ERROR":return "MySQL SSL handshake failed. Check the hosting provider's database connection requirements.";
  default:return "MySQL connection failed. Check Hostinger application logs for the database error code.";
 }
}
export async function GET(){
 if(!await isAdmin())return NextResponse.json({error:"Unauthorised"},{status:401});
 return NextResponse.json({configured:configured(),host:process.env.TML_DB_HOST||null,database:process.env.TML_DB_NAME||null,port:process.env.TML_DB_PORT||"3306"});
}
export async function POST(req:Request){
 if(!await isAdmin())return NextResponse.json({error:"Unauthorised"},{status:401});
 if(!validAdminOrigin(req))return NextResponse.json({error:"Invalid origin"},{status:403});
 if(!configured())return NextResponse.json({connected:false,error:"Missing one or more required database environment variables."},{status:503});
 try{await testDatabase();return NextResponse.json({connected:true})}
 catch(error){
  const code=(error as DatabaseError)?.code;
  console.error("TML MySQL connection test failed", {code:typeof code==="string"?code:"UNKNOWN"});
  return NextResponse.json({connected:false,error:safeDiagnosis(error),code:typeof code==="string"?code:"UNKNOWN"},{status:503});
 }
}
