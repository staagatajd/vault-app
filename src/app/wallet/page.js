"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; 
import { Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";

export default function WalletPage() 
{
    const [wallets,setWallets] = useState([]); //this stores wallets from database
    const [isModalOpen, setIsModalOpen] = useState(false); //this controls the pop-ups
    const [name, setName] = useState(''); //name for the card
    const [balance, setBalance] = useState(''); //stores the balance of that card
    const [type, setType] = useState('Cash');

    const fetchWallets = async () =>
    {
        const {data , error} = await supabase.from('wallets').select('*');

        if(data)
        {
            setWallets(data);
        }
            
    };

    //save a new wallet card
    const saveWallet = async () =>
    {
        if(!name || !balance)
        {
            return;
        }

        const {error} = await supabase.from('wallets').insert([{ name: name, balance: parseFloat(balance), type: type}]);

        if(!error)
        {
            setIsModalOpen(false); //closes the pop-up

            setBalance('');
            setName('');
            setType('Cash');

            fetchWallets();
        }
    };

    const updateBalance = async (id, currentBalance, typeOfAction) => 
    {
        const amount = prompt(`Enter ${typeOfAction} amount: `);

        if(amount === null || amount === "" || isNaN(amount))
        {
            return;
        }

        const numericAmount = parseFloat(amount);
        let newBalance = currentBalance;

        if(typeOfAction === 'income')
        {
            newBalance = currentBalance + numericAmount;
        }
        else
        {
            newBalance = currentBalance - numericAmount;
        }

        const {error: walletError} = await supabase.from('wallets').update({balance: newBalance}).eq('id', id);

        if(!walletError)
        {
            const {error: transactionError} = await supabase.from('transactions').insert([{wallet_id: id, amount: numericAmount, type: typeOfAction}]);

            if(transactionError)
            {
                console.error("Error saving transaction:", transactionError);
            }

            fetchWallets();
        }
    }

    const deleteWallet = async (id) =>
    {
        if(confirm("Are you sure you want to delete this wallet?"))
        {
            const {error} = await supabase.from('wallets').delete().eq('id', id);
            if(!error)
            {
                fetchWallets();
            }
        }
    }

    const editWalletName = async (id) =>
    {
        const new_name = prompt("Enter new name: ");

        if(new_name === null || new_name === '')
        {
            return;
        }

        const {error} = await supabase.from('wallets').update({name: new_name}).eq('id', id);

        if(!error)
        {
            fetchWallets();
        }
    }

    useEffect(() => 
    {
        fetchWallets();
    }, []);

    return (
        <div className = "p-8 space-y-8">

            <div className = "flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">My Wallets</h1>
                    <p className="text-zinc-500"> Manage your accounts and balances</p>

                    <button onClick = {() => setIsModalOpen(true)} className = "bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer mt-4">
                        + Add Wallet
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className= "fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold mb-4">New Wallet</h2>

                        <input 
                            className="w-full p-2 border border-zinc-200 rounded-lg mb-3"
                            placeholder="Wallet Name (e.g. GCash)"
                            onChange={(e) => setName(e.target.value)}
                        />

                        <select className = "w-full mb-3 mr-5 p-2 border border-zinc-200 rounded-lg bg-white focus:outline-zinc-900 "
                         onChange={(e) => setType(e.target.value)}>
                            <option value = "Cash"> Cash </option>
                            <option value = "E-Wallet"> E-Wallet</option>
                            <option value ="Bank"> Bank </option>
                        </select>

                        <input
                            type = "number"
                            className="w-full p-2 border border-zinc-200 rounded-lg mb-3"
                            placeholder="Initial Balance (₱)"
                            onChange={(e) => setBalance(e.target.value)}
                        />

                        <div className="flex gap-2">

                            <button onClick={() => setIsModalOpen(false)} className="flex-1 p-2 bg-rose-500 hover:bg-rose-600 rounded-lg text-white">Cancel</button>

                            <button onClick={saveWallet} className="flex-1 p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg">Save</button>
                        </div>
                         
                    </div>
                </div>
            )}



            <div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wallets.map((wallet) => {
                    return (
                        <div key = {wallet.id} className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-4">

                            <div className="flex justify-between items-start">

                                <div className="flex-1">

                                    <div className="flex justify-between items-center w-full">

                                        <div className="flex items-start gap-1">
                                            <h2 className="font-bold text-lg text-zinc-900">{wallet.name}</h2>
                                            <Pencil size = {25} onClick = {() => editWalletName(wallet.id)}className="text-zinc-400 hover:text-blue-500 cursor-pointer transition-colors p-1 hover:bg-blue-50 rounded"/>
                                        </div>
                  
                                        <Trash2 size = {20} onClick={() => deleteWallet(wallet.id)} className="text-zinc-400 hover:text-red-500 cursor-pointer"/>
                                    </div>
                                    
                                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${
                                        wallet.type ===  'E-Wallet' ? 'bg-blue-100 text-blue-600' :
                                        wallet.type === 'Bank' ? 'bg-purple-100 text-purple-600' : 
                                        'bg-amber-100 text-amber-600'
                                        }`}>
                                        {wallet.type}
                                    </span>
                                </div> 
                 
                            </div>

                            <div>
                                <p className="text-sm text-zinc-500">Current Balance</p>
                                <p className="text-3xl font-mono font-bold">
                                    ₱{Number(wallet.balance).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                </p>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button onClick = {() => {updateBalance(wallet.id, Number(wallet.balance), 'expense')}} className ="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
                                    - Expense
                                </button>

                                <button onClick = {() => {updateBalance(wallet.id, Number(wallet.balance), 'income')}} className = "flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
                                    + Income
                                </button>
                            </div>
                        </div>
                    )})}
            </div>

            {wallets.length === 0 && (
                <div className="text-center p-12 border-2 border-dashed border-zinc-200 rounded-2xl">
                    <p className="text-zinc-500">No wallets found. Click "+ Add Wallet" to start!</p>
                </div>
            )}
        </div>
    );
}