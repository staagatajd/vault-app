"use client";

import Image from "next/image";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {

  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [wallets, setWallets] = useState([]);

  const fetchBalance = async () => 
  {
    const {data, error} = await supabase.from('wallets').select('*');

    if(!error && data)
    { 
      const totalBalance = data.reduce((sum, wallet) => sum + wallet.balance ,0);

      return totalBalance;
    }

    return error;
  };

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
  };

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
  };

  const fetchAllTransactions = async () =>
  {
    const {data,error} = await supabase.from('transactions').select('*').order('created_at', {ascending: false});

    if(data)
    {
      setTransactions(data);
    }
    else
    {
      console.log(error);
    }

  };

  const fetchAllWallets = async () => 
  {
    const {data,error} = await supabase.from('wallets').select('*');

    if(!error && data)
    {
      const walletMap = data.reduce((acc, wallet) => {
        acc[wallet.id] = wallet;
        return acc;
      },{});

      setWallets(walletMap);
    }
  };

  

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

    fetchAllWallets();
    fetchAllTransactions();
    getAllExpense();
    getAllIncome();
    getBalance();  
  }, []);


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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        {/* balance card */}
        <div className="p-6 bg-zinc-50 border rounded-xl"> 
          <p className="text-sm text-zinc-500">
            All Wallet Balance
          </p>
          <h2 className="text-xl truncate font-bold">
            ₱{Number(balance).toLocaleString()}
          </h2>
        </div>

        {/* income(loss/gain) */}
        <div className="p-6 bg-zinc-50 border rounded-xl">
          <p className="text-sm text-zinc-500">
            Total Income
          </p>
          <h2 className="text-xl font-bold text-green-600 truncate">
            ₱{Number(income).toLocaleString()}
          </h2>
        </div>

        {/* expenses */}
        <div className="p-6 bg-zinc-50 border rounded-xl">
          <p className="text-sm text-zinc-500">
            Total Expenses
          </p>
          <h2 className="text-xl font-bold text-red-600 truncate">
             ₱{Number(expense).toLocaleString()}
          </h2>
        </div>

        {/* net */}
        <div className="p-6 bg-zinc-50 border rounded-xl">
          
          <p className="text-sm text-zinc-500">
            Net
          </p>

          <h2 className={`text-xl font-bold ${income-expense > 0 ? 'text-green-600' : 'text-red-600'} truncate`}>
             ₱{Number(income-expense).toLocaleString()}
          </h2>
        </div>

      </div>

      {/* RECENT ACTIVITY SECTION */}
      <div className="bg-zinc-50 border rounded-xl p-6">
        <h3 className="font-semibold mb-7">Recent Transactions</h3>

        <ul className="space-y-3 h-[250px] overflow-auto">

            {transactions.map((transact) => {

              const wallet = wallets[transact.wallet_id];
              const walletType = wallet?.type || "...";
              
              return (
                <li key = {transact.id} className="flex justify-between border-b pb-2 text-sm ">
                  <span>
                    <span className="pr-4">
                      {new Date(transact.created_at).toLocaleString()}
                    </span>

                    <span className= { walletType === 'Cash' ? 'text-amber-600' : walletType === 'Bank' ? 'text-purple-600' : 'text-blue-600'}>
                      {walletType}
                    </span>
                  </span>

                  <span className={transact.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                    {transact.type === 'income' ? '+' : '-'}₱{Number(transact.amount).toLocaleString()}
                  </span>
                  
                </li>
              );
            })}

            <div className="mx-auto w-48 pt-14">
              {transactions.length === 0 && (
              <div>
                <p className="text-zinc-500">No activities yet... </p>
              </div>
            )}
            </div>
        </ul>
      </div>
      
    </div>
  );
}