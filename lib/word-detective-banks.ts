import "server-only";
import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";
import type { Stage, WordCase } from "@/lib/word-detective";
export type WordBank={id:number;title:string;subject:string;stage:Stage;yearGroup:string;wordLength:number;published:boolean;cases:WordCase[]};
export const WORD_BANK_SCHEMA=`CREATE TABLE IF NOT EXISTS tml_word_banks (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 title VARCHAR(120) NOT NULL, subject VARCHAR(80) NOT NULL, stage VARCHAR(3) NOT NULL,
 year_group VARCHAR(24) NOT NULL DEFAULT '', published TINYINT(1) NOT NULL DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 INDEX idx_word_banks_public (published,stage)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`;
export const WORD_CASE_SCHEMA=`CREATE TABLE IF NOT EXISTS tml_word_bank_cases (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, bank_id BIGINT UNSIGNED NOT NULL,
 word VARCHAR(12) NOT NULL, clue VARCHAR(300) NOT NULL, example VARCHAR(300) NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY unique_case (bank_id,word),
 FOREIGN KEY (bank_id) REFERENCES tml_word_banks(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`;
export async function ensureWordTables(){
 await db().query(WORD_BANK_SCHEMA);await db().query(WORD_CASE_SCHEMA);
}
export function cleanCase(raw:unknown):WordCase|null{
 if(!raw||typeof raw!=="object")return null;
 const row=raw as Record<string,unknown>;
 const word=typeof row.word==="string"?row.word.trim().toUpperCase():"";
 const clue=typeof row.clue==="string"?row.clue.trim():"";
 const example=typeof row.example==="string"?row.example.trim():"";
 if(!/^[A-Z]{4,12}$/.test(word)||clue.length<8||clue.length>300||example.length<8||example.length>300)return null;
 return {word,clue,example};
}
export function validateBank(raw:unknown):Omit<WordBank,"id">|null{
 if(!raw||typeof raw!=="object")return null;
 const b=raw as Record<string,unknown>;
 const wordLength=Number(b.wordLength);
 const title=""+b.stage+" · "+wordLength+" letters";
 const subject="Vocabulary";
 const stage=b.stage;
 const yearGroup="";
 const published=b.published===true;
 if(!["KS1","KS2","KS3","KS4"].includes(String(stage))||!Number.isInteger(wordLength)||wordLength<4||wordLength>12||!Array.isArray(b.cases)||b.cases.length<1||b.cases.length>500)return null;
 const cases=b.cases.map(cleanCase);
 if(cases.some(c=>!c))return null;
 const words=cases.map(c=>c!.word);
 if(new Set(words).size!==words.length||words.some(word=>word.length!==wordLength))return null;
 return {title,subject,stage:stage as Stage,yearGroup,wordLength,published,cases:cases as WordCase[]};
}
export async function readWordBanks(admin=false):Promise<WordBank[]>{
 const [rows]=await db().query<RowDataPacket[]>("SELECT id,title,subject,stage,year_group,published FROM tml_word_banks "+(admin?"":"WHERE published=1 ")+"ORDER BY subject,title,id");
 const ids=rows.map(row=>Number(row.id));
 if(ids.length===0)return [];
 const [words]=await db().query<RowDataPacket[]>("SELECT bank_id,word,clue,example FROM tml_word_bank_cases WHERE bank_id IN ("+ids.map(()=>"?").join(",")+") ORDER BY id",ids);
 return rows.map(row=>({id:Number(row.id),title:String(row.title),subject:String(row.subject),stage:row.stage as Stage,yearGroup:String(row.year_group),wordLength:(()=>{const lengths=new Set(words.filter(c=>Number(c.bank_id)===Number(row.id)).map(c=>String(c.word).length));return lengths.size===1?[...lengths][0]:0;})(),published:!!row.published,cases:words.filter(c=>Number(c.bank_id)===Number(row.id)).map(c=>({word:String(c.word),clue:String(c.clue),example:String(c.example)}))})).filter(bank=>admin||bank.cases.length>0);
}
