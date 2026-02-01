import Image from "next/image";

export default function Dashboard() {
  return(
    <div className="p-8">

      {/* HEADER SECTION */}
      <header className="mb-10">
        <h1 className="text-5xl font-black tracking-tighter uppercase " 
        style={{ fontFamily: "var(--font-montserrat)"}}>

          Vault 

        </h1>

        <p className="text-zinc-500"> Overview of your finances </p>
      </header>

      {/* STAT SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        {/* balance card */}
        <div className="p-6 bg-zinc-50 border rounded-xl"> 
          <p className="text-sm text-zinc-500">
            Balance
          </p>
          <h2 className="text-2xl font-bold">
            ₱0.00
          </h2>
        </div>

        {/* income(loss/gain) */}
        <div className="p-6 bg-zinc-50 border rounded-xl">
          <p className="text-sm text-zinc-500">
            Income
          </p>
          <h2 className="text-2xl font-bold text-green-600">
            ₱0.00
          </h2>
        </div>

        {/* expenses */}
        <div className="p-6 bg-zinc-50 border rounded-xl">
          <p className="text-sm text-zinc-500">
            Expenses
          </p>
          <h2 className="text-2xl font-bold text-red-700">
            ₱0.00
          </h2>
        </div>

      </div>

      {/* RECENT ACTIVITY SECTION */}
      <div className="bg-zinc-50 border rounded-xl p-6">
        <h3 className="font-semibold mb-7">Recent Transactions</h3>

        <ul className="space-y-3">
            {/* hardcoded usa kay i chchange mani later */}
          <li className="flex justify-between border-b pb-2 text-sm">
            <span>Coffee</span>
            <span className="text-red-500">-₱50.00</span>
          </li>

          <li className="flex justify-between border-b pb-2 text-sm">
            <span>Allowance</span>
            <span className="text-green-500">+₱500.00</span>
          </li>
        </ul>
      </div>
      
    </div>
  );
}
