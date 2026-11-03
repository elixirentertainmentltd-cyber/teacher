import "server-only";
/**
 * Hostinger may route requests through an internal Next.js URL. Compare the
 * browser Origin against explicitly trusted public origins instead of that URL.
 * Never trust X-Forwarded-Host supplied by an arbitrary client.
 */
const trustedOrigins = new Set(["https://teach.weareelixir.co.uk"]);
export function validAdminOrigin(request:Request):boolean{
 const origin=request.headers.get("origin");
 if(!origin)return true; // non-browser requests still require admin authentication
 try{
  const parsed=new URL(origin);
  if(parsed.origin!==origin||!["https:","http:"].includes(parsed.protocol))return false;
  const configured=process.env.TML_PUBLIC_ORIGIN;
  if(configured){try{trustedOrigins.add(new URL(configured).origin)}catch{}}
  return trustedOrigins.has(origin)||origin===new URL(request.url).origin;
 }catch{return false}
}
