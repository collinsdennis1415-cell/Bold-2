import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { auth, db } from "./firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import Notifications from "./components/Notifications";
import SecurityCenter from "./components/SecurityCenter";
import FinancialInsights from "./components/FinancialInsights";
import RecentTransactions from "./components/RecentTransactions";
import StockWatchlist from "./components/StockWatchlist";
import InvestmentPortfolio from "./components/InvestmentPortfolio";
import CurrencyRates from "./components/CurrencyRates";

import luxuryBank from "./assets/luxury-bank.jpg";

type DashboardProps = {
  setPage: (page: string) => void;
};

export default function Dashboard({
  setPage,
}: DashboardProps) {

  const [userData, setUserData] = useState<any>(null);

  const [transactions, setTransactions] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadUser = async () => {

      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      try {

        const userRef = doc(
          db,
          "users",
          auth.currentUser.uid
        );

        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }

        const transactionQuery = query(
          collection(
            db,
            "users",
            auth.currentUser.uid,
            "transactions"
          ),
          orderBy("createdAt", "desc"),
          limit(10)
        );

        const transactionSnap =
          await getDocs(transactionQuery);

        const history: any[] = [];

        transactionSnap.forEach((doc) => {
          history.push(doc.data());
        });

        setTransactions(history);

      } catch (error) {
        console.error(error);
      }

      setLoading(false);

    };

    loadUser();

  }, []); 
    if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <h1 className="text-3xl font-bold text-white">
          Loading Dashboard...
        </h1>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">

      <img
        src={luxuryBank}
        alt="Luxury Bank"
        className="absolute inset-0 h-full w-full object-cover object-top md:object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-pink-900/50 to-black/60" />

      <nav className="relative z-20 flex items-center justify-between px-6 py-6 lg:px-20">

        <div>
          <h1 className="text-2xl font-black text-white">
            BOLD <span className="text-pink-400">INTERCONTINENTAL</span>
          </h1>

          <p className="text-xs text-white/60">
            Private Banking
          </p>
        </div>

        <div className="hidden gap-8 text-white lg:flex">

          <button onClick={() => setPage("Dashboard")}>
            Dashboard
          </button>

          <button onClick={() => setPage("Payments")}>
            Payments
          </button>

          <button onClick={() => setPage("Wallet")}>
            Wallet
          </button>

          <button onClick={() => setPage("Cards")}>
            Cards
          </button>

          <button onClick={() => setPage("AI Assistant")}>
            AI Banker
          </button>

        </div>

        <button className="rounded-full bg-pink-600 px-6 py-3 font-bold text-white">
          Private Banking
        </button>

      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex min-h-screen items-center px-6 py-10 lg:px-20"
      >

        <div className="grid w-full gap-16 lg:grid-cols-2">

          <div>

            <p className="uppercase tracking-[8px] text-pink-300">
              Welcome Back
            </p>

            <h1 className="mt-6 text-6xl font-black text-white">

              {userData?.fullName || "Premium Client"}

            </h1>

            <p className="mt-5 text-lg text-white/70">

              {userData?.email}

            </p>

            <p className="text-white/70">

              {userData?.phone}

            </p>

            <p className="mt-8 max-w-xl leading-8 text-white/80">

              Experience luxury banking with global transfers,
              premium investment solutions,
              wealth management and AI-powered financial services.

            </p>

            <div className="mt-10 flex flex-wrap gap-4">

            <button
  onClick={() => setPage("Transfer")}
  className="rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 px-8 py-4 font-bold text-white transition hover:scale-105"
>
  Send Money
</button>

              <button
                onClick={() => setPage("Wallet")}
                className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-bold text-white"
              >
                Open Wallet
              </button>

            </div>

          </div>

          <div className="flex justify-center">

            <div className="w-full max-w-md rounded-[40px] border border-white/20 bg-white/10 p-8 backdrop-blur-3xl">

              <p className="uppercase tracking-[5px] text-pink-200">
                Total Portfolio Value
              </p>

              <h2 className="mt-5 text-5xl font-black text-white">

                $
                {Number(
                  userData?.balance ?? 0
                ).toLocaleString()}

              </h2>

              <p className="mt-3 font-semibold text-green-300">
                ▲ Account Synced Successfully
              </p>

              <div className="mt-10 flex justify-between">

                <div>

                  <p className="text-sm text-white/60">
                    Account Number
                  </p>

                  <h3 className="font-bold text-white">
                    {userData?.accountNumber}
                  </h3>

                </div>

                <div className="rounded-full bg-pink-600 px-5 py-2 font-bold text-white">
                  PRIVATE
                </div>

              </div>

            </div>

          </div>

        </div>

      </motion.div>
            {/* Statistics */}
      <div className="relative z-20 -mt-10 px-6 pb-12">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-4">

          {[
            [
              "$" + Number(userData?.balance ?? 0).toLocaleString(),
              "Current Balance",
            ],
            [
              userData?.accountNumber || "----",
              "Account Number",
            ],
            [
              transactions.length.toString(),
              "Transactions",
            ],
            [
              "ACTIVE",
              "Account Status",
            ],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-2xl"
            >
              <h3 className="text-3xl font-black text-pink-300">
                {value}
              </h3>

              <p className="mt-3 text-white">
                {label}
              </p>
            </div>
          ))}

        </div>
      </div>

      {/* Currency */}
      <div className="relative z-20 px-6 pb-16">
        <div className="mx-auto max-w-7xl">

          <h2 className="mb-8 text-3xl font-bold text-white">
            Global Currency Balances
          </h2>

          <CurrencyRates />

        </div>
      </div>

      <div className="relative z-20 rounded-t-[50px] bg-[#faf7fb] py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-8 lg:grid-cols-2">

            <RecentTransactions />

            <div className="rounded-[32px] bg-white p-8 shadow-xl">

              <h2 className="text-2xl font-bold">
                Latest Transactions
              </h2>

              <div className="mt-8 space-y-4">

                {transactions.length === 0 ? (

                  <div className="rounded-2xl bg-slate-50 p-6">

                    <p>No transactions available.</p>

                  </div>

                ) : (

                  transactions.map((item, index) => (

                    <div
                      key={index}
                      className="flex justify-between rounded-2xl bg-slate-50 p-5"
                    >

                      <div>

                        <h3 className="font-semibold">
                          {item.title || "Transaction"}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {item.createdAt || ""}
                        </p>

                      </div>

                      <span
                        className={`font-bold ${
                          item.type === "credit"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {item.amount}
                      </span>

                    </div>

                  ))

                )}

              </div>

            </div>

          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">

            <div className="rounded-[32px] bg-gradient-to-br from-pink-600 via-fuchsia-600 to-purple-700 p-8 text-white">

              <h2 className="text-3xl font-bold">

                AI Private Banker

              </h2>

              <p className="mt-6 leading-8">

                Hello {userData?.fullName || "Client"}.

                Your AI Banker is available 24/7 for
                budgeting, wealth management,
                investments, transfers and financial advice.

              </p>

              <button
                onClick={() => setPage("AI Assistant")}
                className="mt-8 rounded-2xl bg-white px-8 py-4 font-bold text-pink-600"
              >
                Chat with AI
              </button>

            </div>

            <div className="rounded-[32px] bg-white p-8 shadow-xl">

              <h2 className="text-2xl font-bold">

                Quick Actions

              </h2>

              <div className="mt-8 grid grid-cols-2 gap-5">

                <button
                  onClick={() => setPage("Payments")}
                  className="rounded-2xl bg-pink-50 p-6"
                >
                  Send Money
                </button>

                <button
                  onClick={() => setPage("Wallet")}
                  className="rounded-2xl bg-slate-100 p-6"
                >
                  Wallet
                </button>

                <button
                  onClick={() => setPage("Cards")}
                  className="rounded-2xl bg-slate-100 p-6"
                >
                  Cards
                </button>

                <button
                  onClick={() => setPage("Statements")}
                  className="rounded-2xl bg-slate-100 p-6"
                >
                  Statements
                </button>

              </div>

            </div>

          </div>
                    {/* Premium Card */}
          <div className="mt-10 rounded-[36px] bg-gradient-to-br from-slate-900 via-slate-800 to-black p-8 text-white shadow-xl">

            <p className="uppercase tracking-[6px] text-pink-300">
              BOLD INTERCONTINENTAL
            </p>

            <div className="mt-16 text-3xl font-semibold tracking-[6px]">
              {userData?.accountNumber || "**********"}
            </div>

            <div className="mt-10 flex justify-between">

              <div>

                <p className="text-sm text-slate-400">
                  Card Holder
                </p>

                <h3 className="font-bold">
                  {userData?.fullName || "Premium Client"}
                </h3>

              </div>

              <div>

                <p className="text-sm text-slate-400">
                  Expires
                </p>

                <h3 className="font-bold">
                  12 / 31
                </h3>

              </div>

            </div>

          </div>

          {/* Portfolio */}
          <div className="mt-10">
            <InvestmentPortfolio />
          </div>

          {/* Stock Watchlist */}
          <div className="mt-10">
            <StockWatchlist />
          </div>

          {/* Financial Insights */}
          <div className="mt-10">
            <FinancialInsights />
          </div>

          {/* Security */}
          <div className="mt-10">
            <SecurityCenter />
          </div>

          {/* Notifications */}
          <div className="mt-10">
            <Notifications />
          </div>

          {/* User Information */}
          <div className="mt-10 rounded-[36px] bg-white p-10 shadow-xl">

            <h2 className="text-3xl font-bold">
              Account Information
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <div>

                <p className="text-sm text-gray-500">
                  Full Name
                </p>

                <h3 className="text-xl font-bold">
                  {userData?.fullName}
                </h3>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Email
                </p>

                <h3 className="text-xl font-bold">
                  {userData?.email}
                </h3>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Phone
                </p>

                <h3 className="text-xl font-bold">
                  {userData?.phone}
                </h3>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Account Number
                </p>

                <h3 className="text-xl font-bold">
                  {userData?.accountNumber}
                </h3>

              </div>

            </div>

          </div>

          {/* Wealth Management */}
          <div className="mt-10 rounded-[36px] bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-700 p-10 text-white shadow-xl">

            <div className="grid items-center gap-10 lg:grid-cols-2">

              <div>

                <h2 className="text-4xl font-black">
                  Private Wealth Management
                </h2>

                <p className="mt-6 leading-8 text-white/90">
                  Welcome back, {userData?.fullName}. Your dedicated relationship manager,
                  AI banking assistant and global investment team are available
                  24/7 to help you grow and protect your wealth.
                </p>

              </div>

              <div className="grid grid-cols-3 gap-6 text-center">

                <div>

                  <h3 className="text-4xl font-black">
                    ${Number(userData?.balance ?? 0).toLocaleString()}
                  </h3>

                  <p className="mt-2 text-white/80">
                    Balance
                  </p>

                </div>

                <div>

                  <h3 className="text-4xl font-black">
                    {transactions.length}
                  </h3>

                  <p className="mt-2 text-white/80">
                    Transactions
                  </p>

                </div>

                <div>

                  <h3 className="text-4xl font-black">
                    AAA
                  </h3>

                  <p className="mt-2 text-white/80">
                    Security
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

  );
}