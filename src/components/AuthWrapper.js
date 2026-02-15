"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // check if your path is correct!
import Sidebar from "@/components/Sidebar";
import { User, Lock, PersonStanding, Mail, Eye, EyeClosed } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function AuthWrapper({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSignUp, setSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);

    if (!email || !password || !nickName) {
      toast.error("Please fill all fields");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    } 

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if(signInError)
    {
      toast.error(error.message);
      setLoading(false);
    }
    else {

      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from('profiles').insert([
        {user_id: user.id, nickname: nickName}
      ]);
      
      toast.success("Account created! Logging you in...");
      setEmail("");
      setPassword("");
      setNickName("");
      setLoading(false);
    }
  };

  const handleLogIn = async () => {
    setLoading(true);

    if (!email || !password) {
      toast.error("Please fill all fields");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success("Logged in successfully!.");
      setEmail("");
      setPassword("");
      setNickName("");
      setLoading(false);
    }
  };

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
        <Toaster position="top-right" />

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
                  value={nickName}
                  className="w-full rounded-xl bg-zinc-100 pl-10 h-11 border border-zinc-200 transition-all outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                  placeholder="Nickname"
                  onChange={(e) => setNickName(e.target.value)}
                />
              </div>

              <div className="relative w-full mt-6">
                <Mail
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  value={email}
                  type="email"
                  className="w-full  rounded-xl bg-zinc-100 pl-10 h-11 border border-zinc-200 transition-all outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative w-full mt-6">
                <Lock
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  value={password}
                  type={showPassword ? "text" : "password"}
                  className="w-full  rounded-xl bg-zinc-100 pl-10 pr-10 h-11 border border-zinc-200 transition-all outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button type = "button" className = "absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                </button>
              </div>

              <button
                onClick={handleSignUp}
                className="bg-zinc-900 text-white mt-8 rounded-xl px-10 py-2 cursor-pointer hover:bg-zinc-700"
              >
                SIGN UP
              </button>

              <div className="flex items-center pt-3">
                <h1 className="pr-2">Already have an account?</h1>
                <button
                  className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
                  onClick={() => {
                    setSignUp(false);
                    setEmail("");
                    setPassword("");
                    setNickName("");
                  }}
                >
                  Log in
                </button>
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
                  value={email}
                  type="email"
                  className="w-full rounded-xl bg-zinc-100 pl-10 h-11 border border-zinc-200 transition-all outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative w-full mt-6">
                <Lock
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  value={password}
                  type={showPassword ? "text" : "password"}
                  className="w-full  rounded-xl bg-zinc-100 pl-10 pr-10 h-11 border border-zinc-200 transition-all outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button type = "button" className = "absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                </button>
              </div>

              <button
                onClick={handleLogIn}
                className="bg-zinc-900 text-white mt-8 rounded-xl px-10 py-2 cursor-pointer hover:bg-zinc-700"
              >
                LOG IN
              </button>

              <div className="flex items-center pt-3">
                <h1 className="pr-2">Don't have an account?</h1>
                <button
                  className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
                  onClick={() => {
                    setSignUp(true);
                    setEmail("");
                    setPassword("");
                    setNickName("");
                  }}
                >
                  Sign up now
                </button>
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
