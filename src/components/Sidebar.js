"use client";

import { LayoutDashboard, ReceiptText, Wallet, User, LogOut, X, CircleUserRound, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';

export default function Sidebar() {
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => pathname === path;
  const fetchNickName = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setNickName('User');
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("user_id", user.id)
        .single();
      setNickName(data?.nickname || "User");
    } catch (error) {
      console.error("Error fetching nickname:", error);
      setNickName("User");
    }
  };


  const router = useRouter();
  const handleLogOut = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully!');
    setTimeout(() => router.push("/"), 500);
  }

  const fetchUserEmail = async () => {
    const {data : {user}, error} = await supabase.auth.getUser();

    if(error)
    {
     console.log(error);
     return null; 
    }

    if(user)
    {
      setEmail(user.email);
    }
    else
    {
      return null;
    }
  }

  useEffect(() => {
    fetchNickName();
    fetchUserEmail();
  }, []);

  return (
    <div className="w-64 h-full bg-zinc-50 border-r border-zinc-200 p-6 flex flex-col">
      <Toaster position="top-right" />
      <h2
        className="text-xl font-black uppercase tracking-tighter mb-10"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        Vault
      </h2>

      <nav className="flex-1 space-y-2">
        <Link
          href="/"
          className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive("/") ? "bg-zinc-200 text-zinc-900" : "text-zinc-500 hover:bg-zinc-100"} `}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/transaction"
          className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive("/transaction") ? "bg-zinc-200 text-zinc-900" : "text-zinc-500 hover:bg-zinc-100"} `}
        >
          <ReceiptText size={20} />
          <span>Transactions</span>
        </Link>

        <Link
          href="/wallet"
          className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive("/wallet") ? "bg-zinc-200 text-zinc-900" : "text-zinc-500 hover:bg-zinc-100"} `}
        >
          <Wallet size={20} />
          <span>Wallet</span>
        </Link>
      </nav>

      <div className="border-t border-zinc-200 pt-6">
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600 cursor-pointer" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <User size={20} />
            </div>

            {isProfileOpen && (
              <div className= "fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    
                <div className="bg-white p-2 rounded-xl w-full max-w-md shadow-xl relative modal-animate">
                  <div className="absolute absolute top-4 right-4">
                    <X className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors cursor-pointer" onClick = {() => setIsProfileOpen(!isProfileOpen)} size = {40}/>
                  </div>
                  

                  <div className="flex flex-col items-center mt-5 border-zinc-200 border-b pb-3">
                    <div>pfp here</div>

                    <div className ="text-l text-zinc-700 font-bold">{nickName}</div>
                    <div className ="text-xs text-zinc-400 font-bold">{email}</div>
                  </div>

                  <div className="pl-2 pr-2 mt-2 space-y-1 text-zinc-700">

                    <div className="transition-colors cursor-pointer bg-slate-50 hover:bg-slate-100 flex items-center gap-2 rounded-t-lg p-2" onClick={() => setIsProfileEditOpen(!isProfileEditOpen)}>
                      <CircleUserRound size={20} />
                      My profile
                    </div>

                    <div className="transition-colors cursor-pointer bg-slate-50 hover:bg-slate-100 flex items-center gap-2 p-2">
                      <Settings size={20} />
                      Settings
                    </div>

                    <div className="transition-colors cursor-pointer bg-slate-50 hover:bg-slate-100 flex items-center gap-2 rounded-b-lg p-2" onClick={handleLogOut}>
                      <LogOut size={20} />
                      Log out
                    </div>

                  </div>
                </div>
              </div>
            )}

            {isProfileEditOpen && (
              <div className= "fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-2 rounded-xl w-full max-w-md shadow-xl relative modal-animate h-100">
                  <div className="absolute absolute top-4 right-4">
                    <X className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors cursor-pointer" onClick = {() => setIsProfileEditOpen(!isProfileEditOpen)} size = {40}/>
                  </div>

                  <div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col">
              <span className="text-sm font-bold text-zinc-900 leading-none">
                {nickName || 'User'}
              </span>

              <span className= "text-xs text-zinc-400">
                {email}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}