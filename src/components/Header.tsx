import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import React from "react";

type HeaderProps = {
  page: string;
  setPage: (page: string) => void;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const navItems = [
  "Home",
  "Dashboard",
  "Wallet",
  "Payments",
  "Cards",
  "AI Assistant",
  "Security",
  "Profile",
];

export default function Header({
  page,
  setPage,
  setLoggedIn,
}: HeaderProps) {

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLoggedIn(false);
    } catch (error) {
      alert("Logout failed.");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 border-b border-pink-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        <div>
          <h1 className="text-2xl font-black text-pink-600">
            BOLD INTERCONTINENTAL
          </h1>
          <p className="text-xs text-slate-500">
            Private Banking
          </p>
        </div>

        <nav className="hidden lg:flex gap-3">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setPage(item)}
              className={`px-5 py-2 rounded-full transition-all ${
                page === item
                  ? "bg-pink-600 text-white shadow-lg"
                  : "hover:bg-pink-100"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-full border border-red-500 text-red-600 hover:bg-red-50"
          >
            Logout
          </button>

          <button className="px-5 py-2 rounded-full bg-pink-600 text-white">
            Open Account
          </button>
        </div>
      </div>
    </header>
  );
}