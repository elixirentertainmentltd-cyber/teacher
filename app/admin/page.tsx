import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";
import { isAdmin } from "@/lib/admin-auth";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Admin",robots:{index:false,follow:false}};
export default async function AdminPage(){return <AdminDashboard authenticated={await isAdmin()}/>;}
