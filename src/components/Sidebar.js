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
  ArrowRight,
  SunMoon,
  ALargeSmall,
  Lock,
  Mail,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState, useEffect, useRef, use } from "react";
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [fromSettings, setFromSettings] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const toggle = () =>
  {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
  }

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

  const handleDeleteAccount = async () => 
  {
    try {
      const { data : {user} } = await supabase.auth.getUser();

      await supabase.from('profiles').delete().eq('user_id', user.id);

      await supabase.auth.signOut();
      toast.success('Account Deleted');
      router.push('/');
    }
    catch(error)
    {
      toast.error(error);
    }
  }

  const handleUpdateCredentials = async (type, value) => 
  {
    try
    {
      if(type === 'email')
      { 
        const { error } = await supabase.auth.updateUser({ email: value })
        if(error)
        {
          toast.error(error);
          return;
        } 

        toast.success("Email Updated! Check your new email to confirm. " )
      }
      else if(type === 'password')
      {
        const { error } = await supabase.auth.updateUser({ password: value })
        if(error)
        {
          toast.error(error);
          return;
        } 

        toast.success("Password Updated!")
      }
      else if(type === 'nickname')
      {
        const { data : {user}} = await supabase.auth.getUser();
        const {error} = await supabase.from('profiles').update({nickname: value}).eq('user_id', user.id);

        if(error)
        {
          toast.error(error);
          return;
        } 

        setNickName(value);
        toast.success("Nickname updated!");

      }

      setActiveModal(null); 
    }
    catch(error)
    {
      toast.error(error.message); 
    }
  }

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
                  <div className="absolute top-4 right-4">
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
                      onClick={() => {setIsProfileEditOpen(true); setFromSettings(false);}}
                    >
                      <CircleUserRound size={20} />
                      My profile
                    </div>

                    <div
                      className="transition-colors cursor-pointer bg-slate-50 hover:bg-slate-100 flex items-center gap-2 p-2"
                      onClick={() => setIsSettingsOpen(true)}
                    >
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
                  <div className="absolute top-4 right-4">
                    <X
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                      onClick={() => {setIsProfileEditOpen(false);
                        if(fromSettings)
                        {
                          setIsSettingsOpen(true);
                          setFromSettings(false);
                        }
                      }}
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

            {isSettingsOpen && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
                <div className="bg-white p-2 rounded-xl w-full max-w-md shadow-xl relative modal-animate h-100 flex flex-col">
                  <div className="absolute top-4 right-4">
                    <X
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                      onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                      size={40}
                    />
                  </div>

                  <div className="mt-15 mb-20 space-y-2 text-sm">
                    <div className="rounded-t-lg bg-slate-200 hover:bg-slate-300 w-full h-10 flex items-center p-4 justify-between cursor-pointer" onClick = {() => {setIsProfileEditOpen(!isProfileEditOpen);
                       setIsSettingsOpen(false); setFromSettings(true);}}>
                      
                      <div className="flex items-center gap-2">
                        <User className = "text-zinc-400" size = {20}/>
                        <span>
                          Profile
                        </span>
                      </div>
                      
                      <ArrowRight className="text-zinc-500" size = {17}/>
                    </div>
                    <div className="bg-slate-200 hover:bg-slate-300 w-full h-10 flex items-center p-4 justify-between cursor-pointer" onClick={() => { setIsSettingsOpen(true); setActiveModal('email');}}>
                      <div className="flex items-center gap-2">
                        <Mail className = "text-zinc-400" size = {20}/>
                        <span>
                          Change Email
                        </span>
                      </div>
                      <ArrowRight className="text-zinc-500" size = {17}/>
                    </div>
                    <div className="bg-slate-200 hover:bg-slate-300 w-full h-10 flex items-center p-4 justify-between cursor-pointer" onClick={() => { setIsSettingsOpen(true); setActiveModal('password');}}>
                      <div className="flex items-center gap-2">
                        <Lock className = "text-zinc-400" size = {20}/>
                        <span>
                          Change password
                        </span>
                      </div>
                      <ArrowRight className="text-zinc-500" size = {17}/>
                    </div>
                    <div className="bg-slate-200 hover:bg-slate-300 w-full h-10 flex items-center p-4 justify-between cursor-pointer" onClick={() => { setIsSettingsOpen(true); setActiveModal('nickname');}}>
                      <div className="flex items-center gap-2">
                        <ALargeSmall className = "text-zinc-400" size = {20}/>
                        <span>
                          Change Nickname
                        </span>
                      </div>
                      <ArrowRight className="text-zinc-500" size = {17}/>
                    </div>
                    <div className="bg-slate-200 hover:bg-slate-300 w-full h-10 flex items-center p-4 justify-between cursor-pointer" onClick = {() => setConfirmDelete(true)}>
                      <div className="flex items-center gap-2">
                        <Trash2 className = "text-zinc-400" size = {20}/>
                        <span>
                          Delete Account
                        </span>
                      </div>
                      <ArrowRight className="text-zinc-500" size = {17}/>
                    </div>
                    <div className="rounded-b-lg bg-slate-200 hover:bg-slate-300 w-full h-10 flex items-center p-4 justify-between">
                      <div className="flex items-center gap-2">
                        <SunMoon className = "text-zinc-400" size = {20}/>
                        <span>
                          Appearance
                        </span>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        {/* Sun icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-yellow-400"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 4a1 1 0 0 1 1-1V2a1 1 0 1 0-2 0v1a1 1 0 0 1 1 1zm0 16a1 1 0 0 1-1 1v1a1 1 0 1 0 2 0v-1a1 1 0 0 1-1-1zM4 12a1 1 0 0 1-1 1H2a1 1 0 1 0 0-2h1a1 1 0 0 1 1 1zm16 0a1 1 0 0 1 1-1h1a1 1 0 1 0 0 2h-1a1 1 0 0 1-1-1zM12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z" />
                        </svg>

                        {/* Toggle */}
                        <div className="relative">
                          <input type="checkbox" className="sr-only peer" onChange={toggle} checked={dark} />
                          <div className="w-12 h-6 bg-yellow-300 rounded-full peer-checked:bg-indigo-600 transition-colors duration-300" />
                          <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-6 flex items-center justify-center">
                            {/* Small indicator dot */}
                            <div className="w-2 h-2 rounded-full bg-yellow-400 peer-checked:bg-indigo-400" />
                          </div>
                        </div>

                        {/* Moon icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 text-indigo-400"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
                        </svg>
                      </label>
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

            {activeModal && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[70]">
                <div className="bg-white p-4 rounded-xl w-full max-w-sm shadow-xl flex flex-col gap-4">
                  <div className="flex flex-col gap-1 w-full items-center">
                    <p className="font-bold text-zinc-700">
                      {activeModal === 'email' && 'Change Email'}
                      {activeModal === 'password' && 'Change Password'}
                      {activeModal === 'nickname' && 'Change Nickname'}
                    </p>
                    <p className="text-zinc-600">
                      {activeModal === 'email' && (<>Current Email: <span className="font-bold text-zinc-700">{email}</span></>)}
                      {activeModal === 'password' && 'Enter your new password below'}
                      {activeModal === 'nickname' && (<>Current Nickname: <span className="font-bold text-zinc-700">{nickName}</span></>)}
                    </p>
                  </div>
                  <input
                    type={activeModal === 'password' ? 'password' : 'text'}
                    placeholder={`Enter new ${activeModal}`}
                    className="border border-zinc-300 rounded-lg p-2 text-sm w-full"
                    onChange={(e) => setInputValue(e.target.value)}
                  />

                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="flex-1 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors cursor-hover cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex-1 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-700 text-white font-medium transition-colors cursor-hover cursor-pointer"
                      onClick={() => handleUpdateCredentials(activeModal, inputValue)}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}

            {confirmDelete && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[70]">
                <div className="bg-white p-4 rounded-xl w-full max-w-sm shadow-xl flex flex-col items-center gap-4">
                  <p className="font-bold text-zinc-700">Are you sure to delete your account?</p>

                  <p className="text-sm text-zinc-500">
                    This action is <span className="font-bold text-red-500">permanent</span> and cannot be undone. 
                    All your data will be lost.
                  </p>

                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors cursor-hover cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex-1 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-700 text-white font-medium transition-colors cursor-hover cursor-pointer"
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
