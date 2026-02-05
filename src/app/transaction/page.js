"use client"
import React, { useEffect, useState } from 'react'; 
import { supabase } from '@/lib/supabase';

export default function TransactionPage()
{
    const [wallets, setWallets] = useState([]);

    const fetchWallets = async () =>
    {
        const {data , error} = await supabase.from('wallets').select('*');

        if(data)
        {
            setWallets(data);
        }
                
    };

    useEffect(() => 
    {
        fetchWallets();
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
                {wallets.map((wallet) => (
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
                            
                            <span className="text-2xl font-mono font-bold text-zinc-900">
                                ₱{Number(wallet.balance).toLocaleString()}
                            </span>   

                        </div>
                        
                        <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">Recent Activities</p>

                        {/* SCROLLABLE LOG */}
                        <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-3 border-b border-zinc-100">
                        
                            <div className="text-sm text-zinc-400 text-center py-10">
                                records here sample
                            </div>
                        </div>

                        {/* THE GRAPH AREA */}
                        <div className="h-32 bg-zinc-50 rounded-xl flex items-center justify-center border border-dashed border-zinc-200">
                            <span className="text-zinc-400 text-sm">graph to be implemented</span>
                        </div>
         
                    </div>
                ))}       

            </div>

        </div>

    )
}