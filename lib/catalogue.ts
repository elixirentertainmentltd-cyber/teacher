import "server-only";
import type { Resource } from "@/lib/resources";
const repo=process.env.TML_CONTENT_REPO || "elixirentertainmentltd-cyber/teacher";
const path="data/resources.json";
export async function getCatalogue():Promise<{items:Resource[];sha:string|null}>{
 const token=process.env.TML_GITHUB_TOKEN;
 if(!token) return {items:[],sha:null};
 const response=await fetch("https://api.github.com/repos/"+repo+"/contents/"+path+"?ref=main",{headers:{Authorization:"Bearer "+token,Accept:"application/vnd.github+json"},cache:"no-store"});
 if(!response.ok) throw new Error("Unable to read the resource catalogue");
 const data=await response.json();
 const content=Buffer.from(String(data.content).replace(/\s/g,""),"base64").toString("utf8");
 const items=JSON.parse(content);
 if(!Array.isArray(items)) throw new Error("Invalid resource catalogue");
 return {items,sha:data.sha};
}
export async function getPublishedResources():Promise<Resource[]> {
 try { const {items}=await getCatalogue();return items.filter(item=>item.published); }
 catch(error){console.error("Catalogue unavailable",error);return [];}
}
export async function saveCatalogue(items:Resource[],sha:string){
 const token=process.env.TML_GITHUB_TOKEN;
 if(!token) throw new Error("Content storage is not configured");
 const response=await fetch("https://api.github.com/repos/"+repo+"/contents/"+path,{method:"PUT",headers:{Authorization:"Bearer "+token,Accept:"application/vnd.github+json","Content-Type":"application/json"},body:JSON.stringify({message:"content: update Teach Me a Lesson resources",content:Buffer.from(JSON.stringify(items,null,2)+"\n").toString("base64"),sha,branch:"main"}),cache:"no-store"});
 if(!response.ok) throw new Error("Could not save resources. Refresh and try again.");
}
