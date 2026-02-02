import React from 'react';

export default function WalletPage()
{
    return (
        <div className = "p-8 space-y-8">

            <div className = "flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">My Wallets</h1>
                    <p className="text-zinc-500"> Manage your accounts and balances</p>

                    <button className = "bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer mt-4">
                        + Add Wallet
                    </button>
                </div>
            </div>

            <div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-4">

                    <div className="flex justify-between items-start">
                        <h2 className="font-bold text-lg text-zinc-900">GCash</h2>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">E-Wallet</span>
                    </div>

                    <div>
                        <p className="text-sm text-zinc-500">Current Balance</p>
                        <p className="text-3xl font-mono font-bold">₱1,250.00</p>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
                            - Expense
                        </button>

                        <button className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">

                            + Income

                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}