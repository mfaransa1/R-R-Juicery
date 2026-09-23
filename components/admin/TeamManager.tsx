"use client";

import { FormEvent, useMemo, useState } from "react";
import { MailPlus, RefreshCw, ShieldCheck, UserRound, UsersRound } from "lucide-react";

type Member = { id:string; full_name:string|null; phone:string|null; role:"staff"|"admin"; created_at:string; updated_at:string; email:string };

export default function TeamManager({ initialTeam, currentUserId }: { initialTeam: Member[]; currentUserId:string }) {
  const [team, setTeam] = useState(initialTeam);
  const [email,setEmail]=useState("");
  const [fullName,setFullName]=useState("");
  const [phone,setPhone]=useState("");
  const [role,setRole]=useState<"staff"|"admin">("staff");
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");

  const adminCount = useMemo(()=>team.filter((m)=>m.role==="admin").length,[team]);

  async function invite(event:FormEvent){
    event.preventDefault(); setBusy(true); setMessage(""); setError("");
    try{
      const response=await fetch("/api/admin/team/invite",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,fullName,phone,role})});
      const data=await response.json();
      if(!response.ok) throw new Error(data.error||"Could not create team account.");
      setMessage(data.message||"Team account updated."); setEmail(""); setFullName(""); setPhone("");
      window.location.reload();
    }catch(err){setError(err instanceof Error?err.message:"Could not create team account.");}finally{setBusy(false);}
  }

  async function changeRole(userId:string,nextRole:string){
    setBusy(true); setMessage(""); setError("");
    try{
      const response=await fetch("/api/admin/team/role",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId,role:nextRole})});
      const data=await response.json(); if(!response.ok) throw new Error(data.error||"Could not update role.");
      setTeam((current)=>current.map((member)=>member.id===userId?{...member,role:nextRole as Member["role"]}:member));
      setMessage("Role updated.");
    }catch(err){setError(err instanceof Error?err.message:"Could not update role.");}finally{setBusy(false);}
  }

  return <main className="min-h-screen bg-[#f5f1e8] text-[#111]">
    <section className="border-b border-black/10 bg-[#111] py-16 text-white lg:py-20"><div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-14"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">R&R ADMIN · TEAM</p><h1 className="mt-5 font-serif text-6xl leading-[0.86] tracking-[-0.05em] sm:text-8xl">The people<br/>behind the House.</h1><p className="mt-6 max-w-xl text-sm leading-relaxed text-white/55">Invite staff, assign administrator access and keep team permissions under the control of authorized administrators.</p></div></section>
    <section className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 lg:px-14 lg:py-16">
      {(message||error)&&<div className="mb-8 border border-black/10 bg-white p-5 text-sm"><p className={error?"text-red-700":"text-black"}>{error||message}</p></div>}
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="border border-black/10 bg-white p-6 sm:p-8"><div className="flex items-center gap-3"><MailPlus size={18} strokeWidth={1.3}/><div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-black/40">INVITE TEAM</p><h2 className="mt-2 font-serif text-3xl">Create access.</h2></div></div><p className="mt-5 text-sm leading-relaxed text-black/50">New employees receive an invitation from Supabase and create their own password. Existing customer accounts can also be assigned a staff role from here.</p>
          <form onSubmit={invite} className="mt-8 space-y-5"><label className="block"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Email</span><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full border border-black/15 bg-[#f5f1e8] px-4 py-3 text-sm outline-none focus:border-black" placeholder="staff@example.com"/></label><label className="block"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Full name</span><input value={fullName} onChange={e=>setFullName(e.target.value)} className="mt-2 w-full border border-black/15 bg-[#f5f1e8] px-4 py-3 text-sm outline-none focus:border-black" placeholder="Optional"/></label><label className="block"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Phone</span><input value={phone} onChange={e=>setPhone(e.target.value)} className="mt-2 w-full border border-black/15 bg-[#f5f1e8] px-4 py-3 text-sm outline-none focus:border-black" placeholder="Optional"/></label><label className="block"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Role</span><select value={role} onChange={e=>setRole(e.target.value as "staff"|"admin")} className="mt-2 w-full border border-black/15 bg-[#f5f1e8] px-4 py-3 text-sm outline-none focus:border-black"><option value="staff">Staff</option><option value="admin">Admin</option></select></label><button disabled={busy} className="inline-flex w-full items-center justify-center gap-2 bg-[#111] px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-black/80 disabled:opacity-50"><MailPlus size={15}/>{busy?"Working…":"Invite / assign access"}</button></form>
        </section>
        <section><div className="flex items-end justify-between border-b border-black/15 pb-5"><div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-black/40">AUTHORIZED TEAM</p><h2 className="mt-3 font-serif text-4xl">{team.length} member{team.length===1?"":"s"}.</h2></div><span className="text-xs text-black/40">{adminCount} administrator{adminCount===1?"":"s"}</span></div>
          <div className="divide-y divide-black/10 border-b border-black/10">{team.length===0?<div className="py-10 text-sm text-black/45">No staff or administrator profiles yet.</div>:team.map(member=><div key={member.id} className="py-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div className="flex gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center border border-black/10 bg-white">{member.role==="admin"?<ShieldCheck size={17} strokeWidth={1.25}/>:<UserRound size={17} strokeWidth={1.25}/>}</div><div><p className="font-medium">{member.full_name||"Unnamed team member"}</p><p className="mt-1 text-sm text-black/45">{member.email}</p>{member.phone&&<p className="mt-1 text-xs text-black/35">{member.phone}</p>}</div></div><div className="flex items-center gap-3"><span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/35">{member.id===currentUserId?"You · ":""}{member.role}</span><select disabled={busy||member.id===currentUserId} value={member.role} onChange={e=>changeRole(member.id,e.target.value)} className="border border-black/15 bg-white px-3 py-2 text-xs outline-none focus:border-black"><option value="staff">Staff</option><option value="admin">Admin</option><option value="customer">Customer</option></select></div></div></div>)}</div>
          <div className="mt-8 flex gap-3 border border-black/10 bg-white p-5 text-sm text-black/50"><UsersRound size={18} className="shrink-0" strokeWidth={1.25}/><p>Administrator access is protected server-side. Keep at least one administrator active; an administrator cannot remove their own access.</p></div>
        </section>
      </div>
    </section>
  </main>;
}
