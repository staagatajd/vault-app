"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // check if your path is correct!
import Sidebar from "@/components/Sidebar";

export default function AuthWrapper({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {data: { subscription }} = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-bold">Loading Vault...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Welcome to Vault</h1>
        <p className="mb-6">Please log in to manage your wallets.</p>
        <div className="p-8 bg-white shadow-md rounded-lg">
          <p className="text-red-500 font-mono">[Login Form Placeholder]</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="shrink-0">
        <Sidebar />
      </aside>

      <main className="flex-1 bg-white overflow-y-auto">{children}</main>
    </div>
  );
}