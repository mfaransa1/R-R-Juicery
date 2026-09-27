import PublicJournalDetail from "@/components/content/PublicJournalDetail";
export default async function JournalPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <PublicJournalDetail slug={slug}/>}
