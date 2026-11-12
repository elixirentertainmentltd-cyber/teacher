"use client";
import {useEffect,useState,type FormEvent} from "react";
import type {WordCase,Stage} from "@/lib/word-detective";
type Bank={id:number;title:string;subject:string;stage:Stage;yearGroup:string;wordLength:number;published:boolean;cases:WordCase[]};
const stages:Stage[]=["KS1","KS2","KS3","KS4"];
const defaultBank:Bank={id:0,title:"",subject:"Vocabulary",stage:"KS2",yearGroup:"",wordLength:5,published:false,cases:[{word:"",clue:"",example:""}]};
const clone=(bank:Bank):Bank=>({...bank,cases:bank.cases.map(item=>({...item}))});
const label=(bank:Bank)=>bank.stage+" · "+(bank.wordLength?bank.wordLength+"-letter words":"mixed-length legacy bank");
export default function WordDetectiveAdmin(){
 const [banks,setBanks]=useState<Bank[]>([]);
 const [form,setForm]=useState<Bank>(clone(defaultBank));
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("");
 const [showForm,setShowForm]=useState(false);
 async function load(){const response=await fetch("/api/admin/word-detective",{cache:"no-store"});const data=await response.json();if(!response.ok)throw Error(data.error||"Could not load banks");setBanks(data.banks);}
 useEffect(()=>{void load().catch(e=>setMessage(e.message));},[]);
 function edit(bank:Bank){setForm(clone({...bank,wordLength:bank.wordLength||5}));setShowForm(true);setMessage("");window.scrollTo({top:0,behavior:"smooth"});}
 function reset(){setForm(clone(defaultBank));setShowForm(false);}
 function updateCase(index:number,key:keyof WordCase,value:string){setForm(prev=>({...prev,cases:prev.cases.map((item,i)=>i===index?{...item,[key]:value}:item)}));}
 async function save(e:FormEvent){e.preventDefault();setMessage("");
  const invalid=form.cases.filter(c=>c.word.trim().length!==form.wordLength);
  if(invalid.length){setMessage("Every word must contain exactly "+form.wordLength+" letters. Check word "+(form.cases.findIndex(c=>c.word.trim().length!==form.wordLength)+1)+".");return;}
  setBusy(true);try{const response=await fetch("/api/admin/word-detective",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});const data=await response.json();if(!response.ok)throw Error(data.error||"Could not save");await load();reset();setMessage("Word bank saved.");}catch(error){setMessage(error instanceof Error?error.message:"Could not save");}finally{setBusy(false);}
 }
 async function remove(bank:Bank){if(!confirm("Delete "+label(bank)+" and its entire word list?"))return;setBusy(true);setMessage("");try{const response=await fetch("/api/admin/word-detective",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:bank.id})});const data=await response.json();if(!response.ok)throw Error(data.error||"Could not delete");await load();if(form.id===bank.id)reset();setMessage("Bank deleted.");}catch(error){setMessage(error instanceof Error?error.message:"Could not delete");}finally{setBusy(false);}}
 return <section className="wd-admin"><h2>Word Detective studio</h2><p>Organise banks by <strong>key stage</strong> and <strong>number of letters</strong>. Add a list of words, each with a clue and an example for the game. Published banks are available to pupils in Practice mode.</p>
 {message&&<p className="admin-message" role="status">{message}</p>}
 {!showForm&&<button type="button" className="button button-primary" onClick={()=>{setForm(clone(defaultBank));setShowForm(true);}}>+ Create word bank</button>}
 {showForm&&<div className="admin-panel"><h3>{form.id?"Edit word bank":"Create word bank"}</h3><form onSubmit={save} className="admin-form">
 <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
 <label className="field-label" style={{flex:"1 1 180px"}}>Key stage
  <select value={form.stage} onChange={e=>setForm({...form,stage:e.target.value as Stage})}>{stages.map(s=><option key={s} value={s}>{s}</option>)}</select>
 </label>
 <label className="field-label" style={{flex:"1 1 180px"}}>Letters per word
  <select value={form.wordLength} onChange={e=>setForm({...form,wordLength:Number(e.target.value)})}>{Array.from({length:9},(_,i)=>i+4).map(n=><option key={n} value={n}>{n} letters</option>)}</select>
 </label>
 </div>
 <p><strong>Bank: {label(form)}</strong></p>
 <h3>Words in this bank ({form.cases.length}/100)</h3><p>Every word must have exactly <strong>{form.wordLength} letters</strong>. Add a clue and example sentence so pupils can solve the mystery. Duplicate words are not allowed.</p>
 <div style={{display:"grid",gap:12}}>{form.cases.map((item,i)=><fieldset className="admin-panel" key={i}><legend>Word {i+1}</legend>
 <label className="field-label">Word ({item.word.trim().length}/{form.wordLength} letters)<input required pattern={`[A-Za-z]{${form.wordLength}}`} maxLength={form.wordLength} value={item.word} onChange={e=>updateCase(i,"word",e.target.value.replace(/[^a-z]/gi,"").toUpperCase())} placeholder={"Enter "+form.wordLength+" letters"}/></label>
 <label className="field-label">Clue<textarea required minLength={8} maxLength={300} value={item.clue} onChange={e=>updateCase(i,"clue",e.target.value)} placeholder="A clue that helps pupils discover the word"/></label>
 <label className="field-label">Example sentence<textarea required minLength={8} maxLength={300} value={item.example} onChange={e=>updateCase(i,"example",e.target.value)} placeholder="Use the word in a sentence"/></label>
 <button type="button" className="button button-outline" disabled={form.cases.length===1} onClick={()=>setForm({...form,cases:form.cases.filter((_,j)=>j!==i)})}>Remove this word</button>
 </fieldset>)}</div>
 <button type="button" className="button button-outline" disabled={form.cases.length>=100} onClick={()=>setForm({...form,cases:[...form.cases,{word:"",clue:"",example:""}]})}>+ Add word</button>
 <label className="admin-publish"><input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})}/> Publish this bank for pupils</label>
 <div style={{display:"flex",gap:12,flexWrap:"wrap"}}><button type="submit" className="button button-primary" disabled={busy}>{busy?"Saving…":form.id?"Update bank":"Save bank"}</button><button type="button" className="button button-outline" onClick={reset}>Cancel</button></div>
 </form></div>}
 <div className="admin-panel"><h3>Saved word banks ({banks.length})</h3>
 {stages.map(stage=><div key={stage}><h4 style={{marginBottom:8}}>{stage}</h4>{banks.filter(b=>b.stage===stage).map(bank=><div className="admin-list-item" key={bank.id}><div><strong>{label(bank)}</strong><div style={{margin:"7px 0",fontSize:13,overflowWrap:"anywhere"}}>{bank.cases.map(c=>c.word).join(", ")}</div><span>{bank.cases.length} words · {bank.published?"Published":"Draft"}{bank.wordLength===0?" · Choose one word length when editing":""}</span></div><div><button type="button" className="button button-outline" onClick={()=>edit(bank)}>Edit</button>{" "}<button type="button" className="button button-outline" disabled={busy} onClick={()=>remove(bank)}>Delete</button></div></div>)}{!banks.some(b=>b.stage===stage)&&<p style={{fontSize:13,color:"#77758b"}}>No word banks for {stage} yet.</p>}</div>)}
 </div></section>;
}
