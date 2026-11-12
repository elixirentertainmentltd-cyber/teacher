import {NextResponse} from "next/server";
import {isAdmin} from "@/lib/admin-auth";
import {validAdminOrigin} from "@/lib/request-origin";
import {db} from "@/lib/db";
import {ensureWordTables,readWordBanks,validateBank} from "@/lib/word-detective-banks";
import type {ResultSetHeader} from "mysql2";
export const dynamic="force-dynamic";
const unauthorised=()=>NextResponse.json({error:"Unauthorised"},{status:401});
async function readBody(request:Request){
 if(Number(request.headers.get("content-length"))>65000)throw Error("Too many words in this request.");
 const text=await request.text();if(text.length>65000)throw Error("Too many words in this request.");
 try{return JSON.parse(text) as unknown;}catch{throw Error("Invalid JSON.");}
}
export async function GET(){
 if(!await isAdmin())return unauthorised();
 try{await ensureWordTables();return NextResponse.json({banks:await readWordBanks(true)},{headers:{"Cache-Control":"no-store"}});}
 catch{return NextResponse.json({error:"Could not load vocabulary banks from MySQL."},{status:503});}
}
export async function POST(request:Request){
 if(!await isAdmin())return unauthorised();
 if(!validAdminOrigin(request))return NextResponse.json({error:"Invalid origin"},{status:403});
 let raw:unknown;try{raw=await readBody(request);}catch(error){return NextResponse.json({error:(error as Error).message},{status:400});}
 const bank=validateBank(raw);
 if(!bank)return NextResponse.json({error:"Choose a key stage and word length (4–12). Add 1–100 unique words of exactly that length, each with a clue and example of at least 8 characters."},{status:400});
 const id=raw&&typeof raw==="object"&&"id" in raw?Number((raw as {id:unknown}).id):0;
 if(!Number.isSafeInteger(id)||id<0)return NextResponse.json({error:"Invalid bank ID"},{status:400});
 try{
  await ensureWordTables();
  const connection=await db().getConnection();
  try{
   await connection.beginTransaction();
   // Keep one bank per key stage and word length. Legacy mixed-length banks remain untouched until edited.
   const [matching]=await connection.execute<import("mysql2").RowDataPacket[]>("SELECT b.id FROM tml_word_banks b JOIN tml_word_bank_cases c ON c.bank_id=b.id WHERE b.stage=? AND b.id<>? GROUP BY b.id HAVING MIN(CHAR_LENGTH(c.word))=? AND MAX(CHAR_LENGTH(c.word))=? LIMIT 1",[bank.stage,id,bank.wordLength,bank.wordLength]);
   if(matching.length){await connection.rollback();return NextResponse.json({error:"A bank already exists for "+bank.stage+" with "+bank.wordLength+" letters. Edit that bank instead."},{status:409});}
   let bankId=id;
   if(id){
    const [changed]=await connection.execute<ResultSetHeader>("UPDATE tml_word_banks SET title=?,subject=?,stage=?,year_group=?,published=? WHERE id=?",[bank.title,bank.subject,bank.stage,bank.yearGroup,bank.published?1:0,id]);
    if(!changed.affectedRows){await connection.rollback();return NextResponse.json({error:"Bank not found"},{status:404});}
    await connection.execute("DELETE FROM tml_word_bank_cases WHERE bank_id=?",[id]);
   }else{
    const [inserted]=await connection.execute<ResultSetHeader>("INSERT INTO tml_word_banks (title,subject,stage,year_group,published) VALUES (?,?,?,?,?)",[bank.title,bank.subject,bank.stage,bank.yearGroup,bank.published?1:0]);
    bankId=inserted.insertId;
   }
   for(const item of bank.cases)await connection.execute("INSERT INTO tml_word_bank_cases (bank_id,word,clue,example) VALUES (?,?,?,?)",[bankId,item.word,item.clue,item.example]);
   await connection.commit();
   return NextResponse.json({id:bankId});
  }catch(error){await connection.rollback();throw error;}finally{connection.release();}
 }catch(error){console.error("Word Detective save failed",{code:(error as {code?:string}).code});return NextResponse.json({error:"Could not save the word bank. Check your database connection."},{status:503});}
}
export async function DELETE(request:Request){
 if(!await isAdmin())return unauthorised();
 if(!validAdminOrigin(request))return NextResponse.json({error:"Invalid origin"},{status:403});
 let raw:unknown;try{raw=await readBody(request);}catch{return NextResponse.json({error:"Invalid request"},{status:400});}
 const id=raw&&typeof raw==="object"&&"id" in raw?Number((raw as {id:unknown}).id):0;
 if(!Number.isSafeInteger(id)||id<=0)return NextResponse.json({error:"Invalid bank ID"},{status:400});
 try{await ensureWordTables();await db().execute("DELETE FROM tml_word_banks WHERE id=?",[id]);return NextResponse.json({ok:true});}
 catch{return NextResponse.json({error:"Could not delete bank"},{status:503});}
}
