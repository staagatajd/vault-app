"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // check if your path is correct!
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { User, Lock, PersonStanding, Mail } from "lucide-react";

export default function AuthWrapper({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSignUp, setSignUp] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
        <h1 className="text-2xl font-bold mb-1">Welcome to</h1>

        <h1
          className="text-2xl font-black tracking-tighter uppercase "
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          Vault
        </h1>

        <p className="text-zinc-500">Your personal finance tracker.</p>

        <div className="w-full max-w-md p-8 m-4 bg-white rounded-lg shadow-lg flex justify-center items-center flex-col">
          {/* SIGNUP UI */}
          {isSignUp ? (
            <>
              <div className="font-sans font-bold text-2xl text-zinc-600">
                {" "}
                Sign up
              </div>
              <div className="relative w-full mt-8">
                <PersonStanding
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  className="w-full rounded-xl bg-zinc-100 pl-10 h-11 border border-zinc-200 transition-all outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                  placeholder="Nickname"
                />
              </div>

              <div className="relative w-full mt-6">
                <Mail
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  type="email"
                  className="w-full  rounded-xl bg-zinc-100 pl-10 h-11 border border-zinc-200 transition-all outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                  placeholder="Email"
                />
              </div>

              <div className="relative w-full mt-6">
                <Lock
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  type="password"
                  className="w-full  rounded-xl bg-zinc-100 pl-10 h-11 border border-zinc-200 transition-all outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                  placeholder="Password"
                />
              </div>

              <button className="bg-zinc-900 text-white mt-8 rounded-xl px-10 py-2 cursor-pointer hover:bg-zinc-700">
                SIGN UP
              </button>

              <div className="flex items-center pt-3">
                <h1 className="pr-2">Already have an account?</h1>
                <a
                  href="#"
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                  onClick={() => setSignUp(false)}
                >
                  Log in
                </a>
              </div>

            </>
          ) : (
            // LOGIN UI
            <>
              <div className="font-sans font-bold text-2xl text-zinc-600">
                Login
              </div>

              <div className="relative w-full mt-8">
                <Mail
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  type = "email"
                  className="w-full rounded-xl bg-zinc-100 pl-10 h-11 border border-zinc-200 transition-all outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                  placeholder="Email"
                />
              </div>

              <div className="relative w-full mt-6">
                <Lock
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  type="password"
                  className="w-full  rounded-xl bg-zinc-100 pl-10 h-11 border border-zinc-200 transition-all outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                  placeholder="Password"
                />
              </div>

              <button className="bg-zinc-900 text-white mt-8 rounded-xl px-10 py-2 cursor-pointer hover:bg-zinc-700">
                LOG IN
              </button>

              <div className="flex items-center pt-3">
                <h1 className="pr-2">Don't have an account?</h1>
                <a
                  href="#"
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                  onClick={() => setSignUp(true)}
                >
                  Sign up now
                </a>
              </div>
            </>
          )}
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
