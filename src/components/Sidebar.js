"use client";

import { LayoutDashboard, ReceiptText, Wallet, User } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive =  (path) => pathname === path;

  return (
    <div className="w-64 h-full bg-zinc-50 border-r border-zinc-200 p-6 flex flex-col">
      <h2 className="text-xl font-black uppercase tracking-tighter mb-10" style={{ fontFamily: "var(--font-montserrat)" }}>
        Vault
      </h2>

      <nav className="flex-1 space-y-2">

        <Link href="/" className= {`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive('/') ? 'bg-zinc-200 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-100'} `}>
          <LayoutDashboard size = {20} />
          <span>Dashboard</span>
        </Link>

        <Link href="/transaction" className= {`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive('/transaction') ? 'bg-zinc-200 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-100'} `}>
          <ReceiptText size={20} />
          <span>Transactions</span>
        </Link>

        <Link href="/wallet" className= {`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive('/wallet') ? 'bg-zinc-200 text-zinc-900' : 'text-zinc-500 hover:bg-zinc-100'} `}>
          <Wallet size={20} />
          <span>Wallet</span>
        </Link>

      </nav>

      <div className="border-t border-zinc-200 pt-4 text-sm text-zinc-500">
        <div className= "w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center"> {/*future change: change this soon to use actual photo*/}
          <User size = {16}/>
        </div>
        
        <span>User</span>
      </div>

    </div>
  );
}