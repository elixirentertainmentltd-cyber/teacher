"use client";
import {useEffect,useMemo,useState,type ChangeEvent,type FormEvent} from "react";
import {STAGE_WORD_LENGTH,type WordCase,type Stage} from "@/lib/word-detective";
type Bank={id:number;title:string;subject:string;stage:Stage;yearGroup:string;wordLength:number;published:boolean;cases:WordCase[]};
const stages:Stage[]=["KS1","KS2","KS3","KS4"];
const blank=():Bank=>({id:0,title:"",subject:"Vocabulary",stage:"KS2",yearGroup:"",wordLength:STAGE_WORD_LENGTH.KS2,published:false,cases:[]});
const stageName=(stage:Stage)=>stage==="KS4"?"GCSE":stage;
const label=(bank:Bank)=>stageName(bank.stage);
const makeCase=(word:string,old?:WordCase):WordCase=>old?{...old,word}:{word,clue:"Solve the mystery using the coloured letter clues.",example:"The mystery word was "+word.toLowerCase()+"."};
function parseWords(text:string,length:number){
 const parts=text.split(/[\r\n,;\t]+/).map(s=>s.trim().toUpperCase()).filter(Boolean).filter(s=>s!=="WORD"&&s!=="WORDS");
 const valid:string[]=[];const invalid:string[]=[];const seen=new Set<string>();let duplicates=0;
 for(const item of parts){if(!/^[A-Z]+$/.test(item)||item.length!==length){invalid.push(item);continue;}if(seen.has(item)){duplicates++;continue;}seen.add(item);valid.push(item);}
 return {valid,invalid,duplicates};
}
export default function WordDetectiveAdmin(){
 const [banks,setBanks]=useState<Bank[]>([]);
 const [form,setForm]=useState<Bank>(blank);
 const [list,setList]=useState("");
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("");
 const [showForm,setShowForm]=useState(false);
 const parsed=useMemo(()=>parseWords(list,form.wordLength),[list,form.wordLength]);
 const existing=useMemo(()=>new Map(form.cases.map(item=>[item.word,item])),[form.cases]);
 async function load(){const response=await fetch("/api/admin/word-detective",{cache:"no-store"});const data=await response.json();if(!response.ok)throw Error(data.error||"Could not load banks");setBanks(data.banks);}
 useEffect(()=>{void load().catch(e=>setMessage(e.message));},[]);
 function edit(bank:Bank){setForm({...bank,wordLength:STAGE_WORD_LENGTH[bank.stage],cases:bank.cases.map(c=>({...c}))});setList(bank.cases.map(c=>c.word).join("\n"));setShowForm(true);setMessage("");window.scrollTo({top:0,behavior:"smooth"});}
 function reset(){setForm(blank());setList("");setShowForm(false);}
 function start(){reset();setShowForm(true);setMessage("");}
 async function upload(event:ChangeEvent<HTMLInputElement>){
  const file=event.target.files?.[0];event.target.value="";if(!file)return;
  if(!/\.(txt|csv)$/i.test(file.name)){setMessage("Please choose a .txt or .csv word-list file.");return;}
  if(file.size>200000){setMessage("The file is too large. Please use a word list under 200 KB.");return;}
  try{const text=await file.text();setList(prev=>[prev,text].filter(Boolean).join("\n"));setMessage("Added "+file.name+" to the list. Review the word count before saving.");}catch{setMessage("The file could not be read.");}
 }
 async function save(event:FormEvent){event.preventDefault();setMessage("");
  if(parsed.invalid.length){setMessage(parsed.invalid.length+" invalid entries. All words must contain exactly "+form.wordLength+" letters: "+parsed.invalid.slice(0,8).join(", ")+(parsed.invalid.length>8?"…":""));return;}
  if(!parsed.valid.length){setMessage("Paste or upload at least one valid word.");return;}
  if(parsed.valid.length>500){setMessage("The maximum is 500 words per bank. Split the list before saving.");return;}
  setBusy(true);
  try{
   const cases=parsed.valid.map(word=>makeCase(word,existing.get(word)));
   const response=await fetch("/api/admin/word-detective",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,cases})});
   const data=await response.json();if(!response.ok)throw Error(data.error||"Could not save");
   await load();reset();setMessage("Saved "+cases.length+" words successfully.");
  }catch(error){setMessage(error instanceof Error?error.message:"Could not save");}finally{setBusy(false);}
 }
 async function remove(bank:Bank){if(!confirm("Delete "+label(bank)+" and all its words?"))return;setBusy(true);setMessage("");try{const response=await fetch("/api/admin/word-detective",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:bank.id})});const data=await response.json();if(!response.ok)throw Error(data.error||"Could not delete");await load();if(form.id===bank.id)reset();setMessage("Bank deleted.");}catch(error){setMessage(error instanceof Error?error.message:"Could not delete");}finally{setBusy(false);}}
 return <section className="wd-admin"><h2>Word Detective studio</h2><p>Choose <strong>KS1, KS2, KS3 or GCSE</strong>. The required word length is set automatically. Then <strong>paste all your words at once</strong> or upload a TXT/CSV list. No individual word forms needed.</p>
 {message&&<p className="admin-message" role="status">{message}</p>}
 {!showForm&&<button type="button" className="button button-primary" onClick={start}>+ Create word bank</button>}
 {showForm&&<div className="admin-panel"><h3>{form.id?"Edit word bank":"Create word bank"}</h3><form onSubmit={save} className="admin-form">
 <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
 <label className="field-label" style={{flex:"1 1 180px"}}>Key stage<select value={form.stage} onChange={e=>{const stage=e.target.value as Stage;setForm({...form,stage,wordLength:STAGE_WORD_LENGTH[stage]});}}>{stages.map(s=><option key={s} value={s}>{stageName(s)}</option>)}</select></label>
 <div style={{flex:"1 1 180px",padding:"9px 14px",borderRadius:12,background:"#f4f0ff"}}><strong>Required word length</strong><p style={{margin:"6px 0 0"}}>{STAGE_WORD_LENGTH[form.stage]} letters, set automatically</p></div>
 </div>
 <p><strong>Bank: {label(form)}</strong></p>
 <label className="field-label" htmlFor="wd-bulk-words">Bulk word list <span>One word per line, or comma-separated</span></label>
 <textarea id="wd-bulk-words" aria-describedby="wd-bulk-help" rows={12} style={{width:"100%",maxWidth:700,display:"block",padding:16,borderRadius:14,border:"2px solid #e8e1f0",background:"#fff",fontFamily:"inherit"}} value={list} onChange={e=>setList(e.target.value)} placeholder={"APPLE\nTRAIN\nHOUSE\nGRAPE\nBREAD"}/>
 <p id="wd-bulk-help" style={{fontSize:13,color:"#656982"}}>Paste a list or upload a plain-text/one-column CSV file. New words use a standard letter-game clue; existing custom clues are preserved when editing a bank.</p>
 <label className="field-label">Upload a word list (.txt or .csv)<input type="file" accept=".txt,.csv,text/plain,text/csv" onChange={upload}/></label>
 <div role="status" aria-live="polite" style={{padding:"12px 16px",background:"#f4f0ff",borderRadius:14,maxWidth:700}}>
 <strong>{parsed.valid.length} valid unique words</strong> · {parsed.invalid.length} wrong length/invalid · {parsed.duplicates} duplicates removed
 {parsed.invalid.length>0&&<p style={{marginBottom:0,color:"#9f385b"}}>Please fix: {parsed.invalid.slice(0,12).join(", ")}{parsed.invalid.length>12?" …":""}</p>}
 {parsed.valid.length>500&&<p style={{color:"#9f385b"}}>Maximum 500 words in a bank.</p>}
 </div>
 <label className="admin-publish"><input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})}/> Publish this bank for pupils</label>
 <div style={{display:"flex",gap:12,flexWrap:"wrap"}}><button type="submit" className="button button-primary" disabled={busy||parsed.valid.length===0||parsed.invalid.length>0||parsed.valid.length>500}>{busy?"Saving…":form.id?"Update word bank":"Save word bank"}</button><button type="button" className="button button-outline" onClick={reset}>Cancel</button></div>
 </form></div>}
 <div className="admin-panel"><h3>Saved word banks ({banks.length})</h3>
 {stages.map(stage=><div key={stage}><h4 style={{marginBottom:8}}>{stageName(stage)} · {STAGE_WORD_LENGTH[stage]} letters</h4>{banks.filter(b=>b.stage===stage).map(bank=><div className="admin-list-item" key={bank.id}><div><strong>{label(bank)}</strong><div style={{margin:"7px 0",fontSize:13,overflowWrap:"anywhere"}}>{bank.cases.map(c=>c.word).join(", ")}</div><span>{bank.cases.length} words · {bank.published?"Published":"Draft"}{bank.wordLength!==STAGE_WORD_LENGTH[bank.stage]?" · Legacy word lengths; edit to update":""}</span></div><div><button type="button" className="button button-outline" onClick={()=>edit(bank)}>Edit</button>{" "}<button type="button" className="button button-outline" disabled={busy} onClick={()=>remove(bank)}>Delete</button></div></div>)}{!banks.some(b=>b.stage===stage)&&<p style={{fontSize:13,color:"#77758b"}}>No word banks for {stage} yet.</p>}</div>)}
 </div></section>;
}