import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
const cookieName="tml_admin";
function sign(payload:string,secret:string){return createHmac("sha256",secret).update(payload).digest("hex");}
export function validPassword(input:string){
 const expected=process.env.TML_ADMIN_PASSWORD;
 if(!expected || expected.length<16)return false;
 const a=Buffer.from(input),b=Buffer.from(expected);
 return a.length===b.length && timingSafeEqual(a,b);
}
export function createSession(){
 const secret=process.env.TML_SESSION_SECRET;
 if(!secret || secret.length<32)throw new Error("Admin session secret is not configured");
 const expires=Date.now()+8*60*60*1000;
 const payload=String(expires);
 return payload+"."+sign(payload,secret);
}
export async function isAdmin(){
 const secret=process.env.TML_SESSION_SECRET;
 const value=(await cookies()).get(cookieName)?.value;
 if(!secret || !value)return false;
 const [payload,signature]=value.split(".");
 if(!payload||!signature||!/^\d+$/.test(payload)||Number(payload)<Date.now())return false;
 const expected=sign(payload,secret),a=Buffer.from(signature),b=Buffer.from(expected);
 return a.length===b.length && timingSafeEqual(a,b);
}
export const adminCookieName=cookieName;
