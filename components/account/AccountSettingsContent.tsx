"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, KeyRound, LogOut, Mail, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AccountSettingsPolished(){
  const [email,setEmail]=useState("");
  const [loading,setLoading]=useState(true);
  const [sending,setSending]=useState(false);
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");
  useEffect(()=>{(async()=>{const supabase=createClient();const {data:{user}}=await supabase.auth.getUser();if(!user){window.location.href="/auth";return;}setEmail(user.email??"");setLoading(false);})();},[]);
  async function resetPassword(){try{setSending(true);setError("");setMessage("");const supabase=createClient();const {error:e}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${window.location.origin}/auth/reset-password`});if(e)throw e;setMessage("Password reset instructions have been sent to your email.");}catch(e){setError(e instanceof Error?e.message:"Unable to send password reset instructions.");}finally{setSending(false);}}
  async function signOut(){const supabase=createClient();await supabase.auth.signOut();window.location.href="/auth";}
  if(loading)return <main className="min-h-screen bg-[#f5f1e8] px-5 pt-28 lg:px-10 lg:pt-36"><div className="mx-auto max-w-[900px]"><div className="h-10 w-48 animate-pulse bg-black/10"/></div></main>;
  return <main className="min-h-screen bg-[#f5f1e8] px-5 pb-20 pt-28 lg:px-10 lg:pt-36"><div className="mx-auto max-w-[900px]">
    <Link href="/account" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-black/40 hover:text-black"><ArrowLeft size={14}/>Passport</Link>
    <header className="mt-10 border-b border-black/10 pb-8"><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/35">R&R PASSPORT / ACCOUNT</p><h1 className="mt-3 font-serif text-5xl tracking-[-0.045em]">Account</h1><p className="mt-4 max-w-xl text-sm leading-7 text-black/50">Manage your sign-in details and account access.</p></header>
    {message&&<div className="mt-8 flex gap-3 border border-green-200 bg-green-50 p-4 text-sm text-green-800"><CheckCircle2 size={18}/>{message}</div>}
    {error&&<div className="mt-8 border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
    <section className="mt-8 border border-black/10 bg-white">
      <div className="border-b border-black/10 p-7 md:p-9"><p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/35">SIGN-IN EMAIL</p><div className="mt-5 flex items-center gap-4"><Mail size={19} className="text-black/30"/><p className="text-base">{email}</p></div><p className="mt-4 text-xs leading-5 text-black/40">Your authentication email is managed by Supabase Auth.</p></div>
      <div className="border-b border-black/10 p-7 md:p-9"><div className="flex gap-4"><KeyRound size={20} className="mt-1 text-black/30"/><div><p className="font-serif text-2xl">Password</p><p className="mt-2 max-w-xl text-sm leading-6 text-black/45">Send yourself a secure password reset link whenever you need to change your password.</p><button onClick={resetPassword} disabled={sending} className="mt-6 inline-flex items-center gap-2 bg-[#111111] px-5 py-3 text-sm font-medium text-white disabled:opacity-50">{sending?<RefreshCw size={15} className="animate-spin"/>:<KeyRound size={15}/>}Send reset link</button></div></div></div>
      <div className="p-7 md:p-9"><div className="flex gap-4"><LogOut size={20} className="mt-1 text-black/30"/><div><p className="font-serif text-2xl">Sign out</p><p className="mt-2 max-w-xl text-sm leading-6 text-black/45">Sign out of this R&R account on this device.</p><button onClick={signOut} className="mt-6 inline-flex items-center gap-2 border border-black/15 px-5 py-3 text-sm font-medium hover:bg-black hover:text-white"><LogOut size={15}/>Sign out</button></div></div></div>
    </section>
  </div></main>;
}
