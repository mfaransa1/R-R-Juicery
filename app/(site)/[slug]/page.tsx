import PublicEventDetail from "@/components/content/PublicEventDetail";
export default async function EventPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <PublicEventDetail slug={slug}/>}
