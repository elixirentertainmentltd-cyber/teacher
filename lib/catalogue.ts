import "server-only";
import type { Resource } from "@/lib/resources";
import { publicResources } from "@/lib/cms";
export async function getPublishedResources():Promise<Resource[]> {
 try{return await publicResources()}catch(error){console.error("MySQL resource catalogue unavailable",error);return []}
}
