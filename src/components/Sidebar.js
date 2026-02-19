"use client";

import {
  LayoutDashboard,
  ReceiptText,
  Wallet,
  User,
  LogOut,
  X,
  CircleUserRound,
  Settings,
  Camera,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function Sidebar() {
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [joinDate, setJoinDate] = useState("");
  const [walletCount, setWalletCount] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);

  const fileInputRef = useRef();
  const pathname = usePathname();

  const isActive = (path) => pathname === path;
  const fetchNickName = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setNickName("User");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("user_id", user.id)
        .single();
      setNickName(data?.nickname || "User");
    } catch (error) {
      console.error("Error fetching nickname:", error);
      setNickName("User");
    }
  };

  const router = useRouter();
  const handleLogOut = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully!");
    setTimeout(() => router.push("/"), 500);
  };

  const fetchUserEmail = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.log(error);
      return null;
    }

    if (user) {
      setEmail(user.email);
    } else {
      return null;
    }
  };

  const fetchUserJoinDate = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.log(error);
      return null;
    }

    const date = new Date(user.created_at);
    setJoinDate(date.toLocaleDateString());
  };

  const fetchWalletCount = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    const { count, error: dbError } = await supabase
      .from("wallets")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (dbError) {
      console.log(dbError);
      return null;
    }

    setWalletCount(count);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileUpload = async () => {
    if (!pendingFile) {
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const fileExt = pendingFile.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, pendingFile, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      setProfilePicture(publicUrl);
      setPreviewUrl(null);
      setPendingFile(null);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Faled to upload image.");
    }
  };

  const handleCancelUpload = () => {
    setPreviewUrl(null);
    setPendingFile(null);
  };

  const fetchProfilePicture = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("user_id", user.id)
      .single();

    if (data?.avatar_url) {
      setProfilePicture(data.avatar_url);
    }
  };

  useEffect(() => {
    fetchNickName();
    fetchUserEmail();
    fetchUserJoinDate();
    fetchWalletCount();
    fetchProfilePicture();
  }, []);

  return (
    <div className="w-64 h-full bg-zinc-50 border-r border-zinc-200 p-6 flex flex-col">
      <Toaster position="top-right" />
      <h2
        className="text-xl font-black uppercase tracking-tighter mb-10"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        Vault
      </h2>

      <nav className="flex-1 space-y-2">
        <Link
          href="/"
          className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive("/") ? "bg-zinc-200 text-zinc-900" : "text-zinc-500 hover:bg-zinc-100"} `}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/transaction"
          className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive("/transaction") ? "bg-zinc-200 text-zinc-900" : "text-zinc-500 hover:bg-zinc-100"} `}
        >
          <ReceiptText size={20} />
          <span>Transactions</span>
        </Link>

        <Link
          href="/wallet"
          className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive("/wallet") ? "bg-zinc-200 text-zinc-900" : "text-zinc-500 hover:bg-zinc-100"} `}
        >
          <Wallet size={20} />
          <span>Wallet</span>
        </Link>
      </nav>

      <div className="border-t border-zinc-200 pt-6">
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600 cursor-pointer border border-zinc-600 "
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              {profilePicture ? (
                <img
                  src={profilePicture}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User size={20} />
              )}
            </div>

            {isProfileOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-2 rounded-xl w-full max-w-md shadow-xl relative modal-animate">
                  <div className="absolute absolute top-4 right-4">
                    <X
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      size={40}
                    />
                  </div>

                  <div className="flex flex-col items-center mt-5 border-zinc-200 border-b pb-3">
                    <div className="w-30 h-30 rounded-full bg-zinc-100 flex items-center justify-center mb-3 overflow-hidden border border-zinc-600">
                      {profilePicture ? (
                        <img
                          src={profilePicture}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={40} className="text-zinc-400" />
                      )}
                    </div>

                    <div className="text-l text-zinc-700 font-bold">
                      {nickName}
                    </div>
                    <div className="text-xs text-zinc-400 font-bold">
                      {email}
                    </div>
                  </div>

                  <div className="pl-2 pr-2 mt-2 space-y-1 text-zinc-700">
                    <div
                      className="transition-colors cursor-pointer bg-slate-50 hover:bg-slate-100 flex items-center gap-2 rounded-t-lg p-2"
                      onClick={() => setIsProfileEditOpen(!isProfileEditOpen)}
                    >
                      <CircleUserRound size={20} />
                      My profile
                    </div>

                    <div className="transition-colors cursor-pointer bg-slate-50 hover:bg-slate-100 flex items-center gap-2 p-2">
                      <Settings size={20} />
                      Settings
                    </div>

                    <div
                      className="transition-colors cursor-pointer bg-slate-50 hover:bg-slate-100 flex items-center gap-2 rounded-b-lg p-2"
                      onClick={handleLogOut}
                    >
                      <LogOut size={20} />
                      Log out
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isProfileEditOpen && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
                <div className="bg-white p-2 rounded-xl w-full max-w-md shadow-xl relative modal-animate h-100 flex flex-col">
                  <div className="absolute absolute top-4 right-4">
                    <X
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                      onClick={() => setIsProfileEditOpen(!isProfileEditOpen)}
                      size={40}
                    />
                  </div>

                  <div className="flex flex-col items-center mb-2 mt-6">
                    <div className="relative w-34 h-34">
                      <div className="w-full h-full rounded-full bg-zinc-100 flex items-center justify-center mb-3 overflow-hidden border border-zinc-600">
                        {profilePicture ? (
                          <img
                            src={profilePicture}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={40} className="text-zinc-400" />
                        )}
                      </div>

                      <div
                        className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-neutral-200 transition-colors border border-0.5 border-zinc-300"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <Camera size={18} className="text-zinc-700" />
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="text-base font-bold text-zinc-800">
                      {nickName}
                    </div>
                    <div className="text-xs text-zinc-400">{email}</div>
                  </div>

                  <div className="pl-2 pr-2 mt-auto space-y-1 text-zinc-700 pb-2">
                    <div className="transition-colors bg-slate-200 hover:bg-slate-300 flex items-center gap-2 rounded-t-lg p-2 justify-between">
                      <div className="text-sm">Email</div>

                      <div className="text-sm">{email}</div>
                    </div>
                    <div className="transition-colors bg-slate-200 hover:bg-slate-300 flex items-center gap-2 p-2 justify-between">
                      <div className="text-sm">Nickname</div>

                      <div className="text-sm">{nickName}</div>
                    </div>

                    <div className="transition-colors bg-slate-200 hover:bg-slate-300 flex items-center gap-2 p-2 justify-between">
                      <div className="text-sm">Wallet Count</div>

                      <div className="text-sm">{walletCount}</div>
                    </div>

                    <div className="transition-colors bg-slate-200 hover:bg-slate-300 flex items-center gap-2 rounded-b-lg p-2 justify-between">
                      <div className="text-sm">Join Date</div>

                      <div className="text-sm">{joinDate}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {previewUrl && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[70]">
                <div className="bg-white p-4 rounded-xl w-full max-w-sm shadow-xl flex flex-col items-center gap-4">
                  <p className="font-bold text-zinc-700">Use this photo?</p>

                  <img
                    src={previewUrl}
                    className="w-24 h-24 rounded-full object-cover border border-zinc-300"
                  />

                  <div className="flex gap-3 w-full">
                    <button
                      onClick={handleCancelUpload}
                      className="flex-1 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors cursor-hover"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleFileUpload}
                      className="flex-1 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-700 text-white font-medium transition-colors cursor-hover"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col">
              <span className="text-sm font-bold text-zinc-900 leading-none">
                {nickName || "User"}
              </span>

              <span className="text-xs text-zinc-400">{email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}