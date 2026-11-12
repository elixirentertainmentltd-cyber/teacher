"use client";
import {useEffect,useState,type FormEvent} from "react";
import type {WordCase,Stage} from "@/lib/word-detective";
type Bank={id:number;title:string;subject:string;stage:Stage;yearGroup:string;published:boolean;cases:WordCase[]};
const blank:Bank={id:0,title:"",subject:"English",stage:"KS2",yearGroup:"Year 4",published:false,cases:[{word:"",clue:"",example:""}]};
const copyBank=(b:Bank):Bank=>({...b,cases:b.cases.map(c=>({...c}))});
export default function WordDetectiveAdmin(){
 const [banks,setBanks]=useState<Bank[]>([]),[form,setForm]=useState<Bank>(copyBank(blank)),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 async function load(){const response=await fetch("/api/admin/word-detective",{cache:"no-store"});const data=await response.json();if(!response.ok)throw Error(data.error||"Could not load banks");setBanks(data.banks);}
 useEffect(()=>{load().catch(e=>setMessage(e.message));},[]);
 async function save(event:FormEvent){event.preventDefault();setBusy(true);setMessage("");try{const response=await fetch("/api/admin/word-detective",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});const data=await response.json();if(!response.ok)throw Error(data.error||"Could not save");await load();setForm(copyBank(blank));setMessage("Word bank saved.");}catch(error){setMessage(error instanceof Error?error.message:"Could not save");}finally{setBusy(false);}}
 async function remove(bank:Bank){if(!confirm("Delete "+bank.title+" and all its words?"))return;setBusy(true);setMessage("");try{const response=await fetch("/api/admin/word-detective",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:bank.id})});const data=await response.json();if(!response.ok)throw Error(data.error||"Could not delete");await load();if(form.id===bank.id)setForm(copyBank(blank));setMessage("Bank deleted.");}catch(error){setMessage(error instanceof Error?error.message:"Could not delete");}finally{setBusy(false);}}
 function updateCase(index:number,key:keyof WordCase,value:string){setForm(prev=>({...prev,cases:prev.cases.map((item,i)=>i===index?{...item,[key]:value}:item)}));}
 return <section className="wd-admin"><h2>Word Detective studio</h2><p>Create curriculum vocabulary banks for pupils. Draft banks are staff-only; published banks appear under Word Detective practice mode. No learner accounts are needed.</p>
 {message&&<p className="admin-message" role="status">{message}</p>}
 <div className="admin-panel"><h3>{form.id?"Edit vocabulary bank":"New vocabulary bank"}</h3>
 <form onSubmit={save} className="admin-form">
 <label className="field-label">Bank title<input required minLength={3} maxLength={120} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Year 4 Science – Habitats"/></label>
 <label className="field-label">Subject<input required minLength={2} maxLength={80} value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/></label>
 <label className="field-label">Key stage<select value={form.stage} onChange={e=>setForm({...form,stage:e.target.value as Stage})}>{(["KS1","KS2","KS3","KS4"] as const).map(s=><option key={s}>{s}</option>)}</select></label>
 <label className="field-label">Year group (optional)<input maxLength={24} value={form.yearGroup} onChange={e=>setForm({...form,yearGroup:e.target.value})} placeholder="Year 4 / GCSE"/></label>
 <h3>Vocabulary words ({form.cases.length}/100)</h3><p>Use 4–12 letters, A–Z. Give each word a helpful clue and a full example sentence.</p>
 {form.cases.map((word,i)=><fieldset className="admin-panel" key={i}><legend>Word {i+1}</legend><label className="field-label">Answer<input required pattern="[A-Za-z]{4,12}" maxLength={12} value={word.word} onChange={e=>updateCase(i,"word",e.target.value.toUpperCase())}/></label><label className="field-label">Clue<textarea required minLength={8} maxLength={300} value={word.clue} onChange={e=>updateCase(i,"clue",e.target.value)}/></label><label className="field-label">Example sentence<textarea required minLength={8} maxLength={300} value={word.example} onChange={e=>updateCase(i,"example",e.target.value)}/></label><button type="button" className="button button-outline" disabled={form.cases.length===1} onClick={()=>setForm({...form,cases:form.cases.filter((_,j)=>i!==j)})}>Remove word</button></fieldset>)}
 <button type="button" className="button button-outline" disabled={form.cases.length>=100} onClick={()=>setForm({...form,cases:[...form.cases,{word:"",clue:"",example:""}]})}>+ Add another word</button>
 <label className="admin-publish"><input type="checkbox" checked={form.published} onChange={e=>setForm({...form,published:e.target.checked})}/> Publish this bank for pupils</label>
 <button type="submit" className="button button-primary" disabled={busy}>{busy?"Saving…":form.id?"Update bank":"Save bank"}</button>
 {form.id>0&&<button type="button" className="button button-outline" onClick={()=>setForm(copyBank(blank))}>Cancel editing</button>}
 </form></div>
 <div className="admin-panel"><h3>Saved vocabulary banks ({banks.length})</h3>{banks.map(bank=><div key={bank.id} className="admin-list-item"><div><strong>{bank.title}</strong><span>{bank.subject} · {bank.stage} · {bank.yearGroup||"All years"} · {bank.cases.length} words · {bank.published?"Published":"Draft"}</span></div><div><button type="button" className="button button-outline" onClick={()=>{setForm(copyBank(bank));window.scrollTo({top:0,behavior:"smooth"});}}>Edit</button> <button type="button" className="button button-outline" disabled={busy} onClick={()=>remove(bank)}>Delete</button></div></div>)}{banks.length===0&&<p>No custom banks yet. Create one above.</p>}</div>
 </section>;
}
