import "server-only";
import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";
import type { Resource } from "@/lib/resources";
export const TAXONOMIES={subjects:"tml_subjects",types:"tml_resource_types",stages:"tml_key_stages",years:"tml_year_groups",categories:"tml_categories"} as const;
export type Taxonomy=keyof typeof TAXONOMIES;
export function isTaxonomy(v:string):v is Taxonomy{return Object.hasOwn(TAXONOMIES,v);}
export async function terms(kind:Taxonomy){const [rows]=await db().query<RowDataPacket[]>(`SELECT id,name,slug,sort_order,enabled FROM ${TAXONOMIES[kind]} ORDER BY sort_order,name`);return rows;}
export async function publicResources():Promise<Resource[]>{
 const [rows]=await db().query<RowDataPacket[]>(`SELECT r.id,r.title,r.summary AS description,s.name AS subject,t.name AS type,c.name AS category,r.external_url,m.id AS media_id FROM tml_resources r LEFT JOIN tml_subjects s ON s.id=r.subject_id LEFT JOIN tml_resource_types t ON t.id=r.resource_type_id LEFT JOIN tml_categories c ON c.id=r.category_id LEFT JOIN tml_media m ON m.id=r.primary_media_id WHERE r.status='published' ORDER BY r.published_at DESC,r.id DESC`);
 const [stages]=await db().query<RowDataPacket[]>("SELECT rs.resource_id,ks.name FROM tml_resource_stages rs JOIN tml_key_stages ks ON ks.id=rs.stage_id");
 const [years]=await db().query<RowDataPacket[]>("SELECT ry.resource_id,yg.name FROM tml_resource_years ry JOIN tml_year_groups yg ON yg.id=ry.year_id");
 return rows.map(r=>({id:String(r.id),title:r.title,description:r.description||"",subject:r.subject||"Other",type:r.type||"Teaching resource",category:r.category||"",stages:stages.filter(s=>s.resource_id===r.id).map(s=>s.name),years:years.filter(y=>y.resource_id===r.id).map(y=>y.name).join(", "),url:r.media_id?"/api/media/"+r.media_id:r.external_url||"#",published:true}));
}
export async function adminResources(){const [rows]=await db().query<RowDataPacket[]>(`SELECT r.id,r.title,r.summary AS description,r.status,r.subject_id,r.resource_type_id,r.category_id,r.external_url,r.primary_media_id,r.featured,r.created_at FROM tml_resources r ORDER BY r.created_at DESC`);return rows;}
export function slugify(value:string){return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,100);}
