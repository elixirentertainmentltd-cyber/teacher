import "server-only";
import mysql, { type Pool } from "mysql2/promise";
let pool:Pool|undefined;
export function configured(){return !!(process.env.TML_DB_HOST&&process.env.TML_DB_NAME&&process.env.TML_DB_USER&&process.env.TML_DB_PASSWORD);}
export function db():Pool{
 if(!configured())throw new Error("MySQL is not configured. Add TML_DB_HOST, TML_DB_NAME, TML_DB_USER and TML_DB_PASSWORD to Hostinger environment variables.");
 if(!pool)pool=mysql.createPool({host:process.env.TML_DB_HOST,port:Number(process.env.TML_DB_PORT||3306),database:process.env.TML_DB_NAME,user:process.env.TML_DB_USER,password:process.env.TML_DB_PASSWORD,waitForConnections:true,connectionLimit:5,decimalNumbers:true,enableKeepAlive:true});
 return pool;
}
export async function testDatabase(){await db().query("SELECT 1");return true;}
