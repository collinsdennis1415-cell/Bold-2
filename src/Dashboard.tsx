import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

import luxuryBank from "./assets/luxury-bank.jpg";

import RecentTransactions from "./components/RecentTransactions";
import CurrencyRates from "./components/CurrencyRates";
import InvestmentPortfolio from "./components/InvestmentPortfolio";
import StockWatchlist from "./components/StockWatchlist";
import FinancialInsights from "./components/FinancialInsights";
import SecurityCenter from "./components/SecurityCenter";
import Notifications from "./components/Notifications";

type DashboardProps = {
  setPage: (page: string) => void;
};

export default function Dashboard({
  setPage,
}: DashboardProps) {
  const [userData, setUserData] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    if (!auth.currentUser) return;

    const snap = await getDoc(
      doc(db, "users", auth.currentUser.uid)
    );

    if (snap.exists()) {
      setUserData(snap.data());
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#f7f8fc]">
          {/* Hero Banner */}

      <div className="relative h-[520px] overflow-hidden">

        <img
          src={luxuryBank}
          alt="Luxury Banking"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-pink-900/60 to-black/70" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 mx-auto flex h-full max-w-7xl items-center justify-between px-8"
        >

          {/* Left */}

          <div>

            <p className="uppercase tracking-[6px] text-pink-300">
              Welcome Back
            </p>

            <h1 className="mt-4 text-6xl font-black text-white">

              {userData?.fullName}

            </h1>

            <p className="mt-6 max-w-xl text-xl leading-9 text-white/80">

              Welcome to your premium private banking experience.
              Manage your wealth, investments and global transfers securely.

            </p>

            <div className="mt-10 flex gap-5">

              <button
                onClick={() => setPage("Transfer")}
                className="rounded-2xl bg-pink-600 px-8 py-4 font-bold text-white hover:bg-pink-700"
              >
                Transfer Money
              </button>

              <button
                onClick={() => setPage("Wallet")}
                className="rounded-2xl border border-white/30 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-xl"
              >
                My Wallet
              </button>

            </div>

          </div>

          {/* Balance Card */}

          <div className="w-[430px] rounded-[40px] border border-white/20 bg-white/10 p-10 backdrop-blur-3xl shadow-2xl">

            <p className="uppercase tracking-[4px] text-pink-200">
              Available Balance
            </p>

            <h2 className="mt-5 text-5xl font-black text-white">
              $
              {Number(
                userData?.balance || 0
              ).toLocaleString()}
            </h2>

            <div className="mt-10">

              <p className="text-white/70">
                Account Number
              </p>

              <h3 className="mt-2 text-2xl font-bold text-white">
                {userData?.accountNumber}
              </h3>

            </div>

            <div className="mt-8 flex items-center justify-between">

              <div>

                <p className="text-white/60">
                  Client
                </p>

                <h3 className="font-bold text-white">
                  {userData?.fullName}
                </h3>

              </div>

              <div className="rounded-full bg-pink-600 px-5 py-2 font-bold text-white">
                PRIVATE
              </div>

            </div>

          </div>

        </motion.div>

      </div>
            {/* Dashboard Content */}

      <div className="mx-auto max-w-7xl px-8 py-12">

        {/* Statistics */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {[
            {
              title: "Portfolio Value",
              value: `$${Number(userData?.balance || 0).toLocaleString()}`,
            },
            {
              title: "Account Status",
              value: "Active",
            },
            {
              title: "Currency",
              value: "USD",
            },
            {
              title: "Security",
              value: "Protected",
            },
          ].map((item) => (

            <div
              key={item.title}
              className="rounded-3xl bg-white p-8 shadow-lg"
            >

              <p className="text-gray-500">
                {item.title}
              </p>

              <h3 className="mt-4 text-3xl font-black text-pink-600">
                {item.value}
              </h3>

            </div>

          ))}

        </div>

        {/* Quick Actions */}

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <button
            onClick={() => setPage("Transfer")}
            className="rounded-3xl bg-pink-600 p-8 text-left text-white shadow-lg hover:bg-pink-700"
          >
            <h3 className="text-2xl font-bold">
              Transfer
            </h3>

            <p className="mt-3 text-white/80">
              Send money instantly
            </p>
          </button>

          <button
            onClick={() => setPage("Wallet")}
            className="rounded-3xl bg-white p-8 text-left shadow-lg hover:bg-gray-50"
          >
            <h3 className="text-2xl font-bold">
              Wallet
            </h3>

            <p className="mt-3 text-gray-500">
              View balances
            </p>
          </button>

          <button
            onClick={() => setPage("Cards")}
            className="rounded-3xl bg-white p-8 text-left shadow-lg hover:bg-gray-50"
          >
            <h3 className="text-2xl font-bold">
              Cards
            </h3>

            <p className="mt-3 text-gray-500">
              Manage your cards
            </p>
          </button>

          <button
            onClick={() => setPage("AI Assistant")}
            className="rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-left text-white shadow-lg"
          >
            <h3 className="text-2xl font-bold">
              AI Banker
            </h3>

            <p className="mt-3 text-white/80">
              Personal financial assistant
            </p>
          </button>

        </div>

        {/* Main Dashboard Grid */}

        <div className="mt-12 grid gap-8 lg:grid-cols-2">

          <RecentTransactions />

          <CurrencyRates />

        </div>
                {/* Premium Banking Card */}

        <div className="mt-12 grid gap-8 lg:grid-cols-2">

          <div className="rounded-[36px] bg-gradient-to-br from-slate-900 via-black to-slate-800 p-10 text-white shadow-2xl">

            <p className="uppercase tracking-[6px] text-pink-300">
              BOLD INTERCONTINENTAL
            </p>

            <div className="mt-16 text-3xl font-semibold tracking-[6px]">
              **** **** **** {String(userData?.accountNumber).slice(-4)}
            </div>

            <div className="mt-10 flex justify-between">

              <div>

                <p className="text-white/60">
                  Card Holder
                </p>

                <h3 className="mt-2 text-xl font-bold">
                  {userData?.fullName}
                </h3>

              </div>

              <div>

                <p className="text-white/60">
                  Status
                </p>

                <h3 className="mt-2 text-xl font-bold text-green-400">
                  Active
                </h3>

              </div>

            </div>

          </div>

          <InvestmentPortfolio />

        </div>

        <div className="mt-12">
          <StockWatchlist />
        </div>

        <div className="mt-12">
          <FinancialInsights />
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">

          <SecurityCenter />

          <Notifications />

        </div>

        {/* Premium Banner */}

        <div className="mt-12 rounded-[40px] bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-700 p-12 text-white shadow-2xl">

          <h2 className="text-4xl font-black">
            Private Wealth Management
          </h2>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/90">
            Enjoy exclusive wealth management, global transfers,
            premium investment services, dedicated relationship managers,
            AI-powered financial advice and world-class banking security.
          </p>

          <button
            onClick={() => setPage("AI Assistant")}
            className="mt-10 rounded-2xl bg-white px-8 py-4 font-bold text-pink-600 hover:scale-105 transition"
          >
            Talk to AI Banker
          </button>

        </div>
              </div>

    </section>
  );
}