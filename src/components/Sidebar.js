import { LayoutDashboard, ReceiptText, Wallet, User } from "lucide-react";
import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-zinc-50 border-r border-zinc-200 p-6 flex flex-col">
      <h2 className="text-xl font-black uppercase tracking-tighter mb-10" style={{ fontFamily: "var(--font-montserrat)" }}>
        Vault
      </h2>

      <nav className="flex-1 space-y-2">

        <Link href="/" className="flex items-center gap-3 p-3 rounded-lg bg-zinc-200 font-medium text-zinc-900 transition-colors">
          <LayoutDashboard size = {20} />
          <span>Dashboard</span>
        </Link>

        <Link href="/transaction" className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors">
          <ReceiptText size={20} />
          <span>Transactions</span>
        </Link>

        <Link href="/wallet" className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors">
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