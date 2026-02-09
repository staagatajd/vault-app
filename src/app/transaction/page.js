"use client"
import React, { useEffect, useState } from 'react'; 
import { supabase } from '@/lib/supabase';

export default function TransactionPage()
{
    const [wallets, setWallets] = useState([]);
    const [transActions, setTransactions] = useState([]);

    const fetchWallets = async () =>
    {
        const {data , error} = await supabase.from('wallets').select('*').order('created_at', {ascending: true});

        if(data)
        {
            setWallets(data);
        }
                
    };

    const fetchTransactions = async () =>
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

    const calculateStats = (walletId) =>
    {
        const walletTrans = transActions.filter(t => t.wallet_id === walletId);

        const totalIncome = walletTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
        const totalExpense = walletTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
        const net = totalIncome - totalExpense;

        return {totalIncome, totalExpense, net};
    }

    useEffect(() => 
    {
        fetchWallets();
        fetchTransactions();
    }, []);

    return(
        <div className= "p-8 space-y-8">

            <header>
                <div>
                    <h1 className="text-3xl font-bold">My Transactions</h1>
                    <p className="text-zinc-500"> View and track your activities</p>

                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {wallets.map((wallet) => {

                    const stats = calculateStats(wallet.id);

                  return(  
                    <div key={wallet.id} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col h-[500px]">

                        {/* HEADER OF THE CARD */}
                        <div className="flex justify-between items-start mb-6">

                            <div className="flex flex-col gap-2">

                                <h2 className="text-2xl font-bold text-zinc-900">{wallet.name}</h2>

                                <span className={`w-fit text-sm font-semibold px-3 py-1 rounded-full ${
                                        wallet.type ===  'E-Wallet' ? 'bg-blue-100 text-blue-600' :
                                        wallet.type === 'Bank' ? 'bg-purple-100 text-purple-600' : 
                                        'bg-amber-100 text-amber-600'
                                        }`}>
                                        {wallet.type}
                                </span>

                            </div>
                            
                            <span className="max-w-44 truncate text-xl font-mono font-bold text-zinc-900 border-b border-zinc-100">
                                ₱{Number(wallet.balance).toLocaleString()}
                            </span>   

                        </div>
                        
                        <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Recent Activities</p>

                        {/* SCROLLABLE LOG */}
                        <div className="flex-1 overflow-y-auto mb-0 pr-2 space-y-3">

                            {transActions.filter((t) => t.wallet_id === wallet.id).length === 0 && 
                            (<p className="text-center text-zinc-400 text-sm py-10 italic">No activity yet...</p>)}

                            {transActions.filter((trans) => trans.wallet_id === wallet.id)
                                .map((trans) => (
                                    <div key = {trans.id} className={`rounded-xl flex justify-between items-center text-sm p-2 rounded-large transition-colors shadow-sm 
                                    ${trans.type === 'income' ? 'bg-emerald-100 hover:bg-emerald-200': 'bg-rose-100 hover:bg-rose-200'}`} >
                                        
                                        <div className="flex flex-col">
                                            <span className="font-medium text-zinc-700 capitalize">{trans.type}</span>
                                            <span className="text-[15px] text-zinc-400">{new Date(trans.created_at).toLocaleString()}</span>
                                        </div>

                                        <span className = {`truncate text-xl font-bold ${trans.type === 'income' ? 'text-emerald-700' : 'text-rose-700'}`}>
                                            {trans.type === 'income' ? '+' : '-'}₱{Number(trans.amount).toLocaleString()}
                                        </span>
                                    </div>
                                ))
                            }
                        </div>
                        
                        


                        <div className="mt-4 grid grid-cols-3 gap-4 text-center pt-2 border-t border-zinc-200">
                            <div>
                                <p className="text-xs text-zinc-500">Total Income</p>
                                <p className="font-bold text-emerald-600 truncate text-xl">₱{stats.totalIncome.toLocaleString()}</p>
                            </div>

                            <div>
                                <p className="text-xs text-zinc-500">Total Expense</p>
                                <p className="font-bold text-rose-600 truncate text-xl">₱{stats.totalExpense.toLocaleString()}</p>
                            </div>

                            <div>
                                <p className="text-xs text-zinc-500">Net</p>
                                <p className={`font-bold truncate text-xl ${stats.net < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                    ₱{stats.net.toLocaleString()}
                                </p>
                            </div>
                        </div>
         
                    </div>
                )})}       

            </div>

        </div>

    )
}