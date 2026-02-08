"use client";

import Image from "next/image";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {

  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  const fetchBalance = async () => 
  {
    const {data, error} = await supabase.from('wallets').select('*');

    if(!error && data)
    { 
      const totalBalance = data.reduce((sum, wallet) => sum + wallet.balance ,0);

      return totalBalance;
    }

    return error;
  }

  const fecthAllIncome = async () =>
  {
    const {data, error} = await supabase.from('transactions').select('*');

    if(!error && data)
    {
      const totalIncome = data.reduce((sum, transactions) => {
        return sum + (transactions.type === 'income' ? transactions.amount : 0)
      }, 0);

      return totalIncome;
    }

    return 0;
  }

  const fetchAllExpense = async () =>
  {
    const {data, error} = await supabase.from('transactions').select('*');

    if(!error && data)
    {
      const totalExpense = data.reduce((sum, transactions) => {
        return sum + (transactions.type === 'expense' ? transactions.amount : 0)
      }, 0);

      return totalExpense;
    }

    return 0;
  }


  useEffect(() =>
  {

    const getBalance = async () =>
    {
      const result = await fetchBalance();
      setBalance(result);
    }

    const getAllIncome = async () =>
    {
      const result = await fecthAllIncome();
      setIncome(result);
    }

    const getAllExpense = async () =>
    {
      const result = await fetchAllExpense();
      setExpense(result);
    }

    getAllExpense();
    getAllIncome();
    getBalance();  
  }, [])


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
            ₱{Number(balance).toLocaleString()}
          </h2>
        </div>

        {/* income(loss/gain) */}
        <div className="p-6 bg-zinc-50 border rounded-xl">
          <p className="text-sm text-zinc-500">
            Total Income
          </p>
          <h2 className="text-2xl font-bold text-green-600">
            ₱{Number(income).toLocaleString()}
          </h2>
        </div>

        {/* expenses */}
        <div className="p-6 bg-zinc-50 border rounded-xl">
          <p className="text-sm text-zinc-500">
            Total Expenses
          </p>
          <h2 className="text-2xl font-bold text-red-700">
             ₱{Number(expense).toLocaleString()}
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