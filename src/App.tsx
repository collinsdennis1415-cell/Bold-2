import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import Login from "./Login";
import Register from "./Register";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Features from "./components/Features";
import Footer from "./components/Footer";

import Dashboard from "./Dashboard";
import Wallet from "./Wallet";
import Payments from "./Payments";
import Cards from "./Cards";
import AIAssistant from "./AIAssistant";
import Security from "./Security";
import Notifications from "./Notifications";
import Profile from "./Profile";
import Statements from "./Statements";
import Settings from "./Settings";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  const [page, setPage] = useState("Dashboard");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-2xl">
        Loading...
      </div>
    );
  }

  if (!loggedIn) {
    return showRegister ? (
      <Register
        onRegister={() => {
          setShowRegister(false);
        }}
      />
    ) : (
      <Login
        onLogin={() => setLoggedIn(true)}
        onCreateAccount={() => setShowRegister(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100">
      <Header
        page={page}
        setPage={setPage}
        setLoggedIn={setLoggedIn}
      />

      <main className="mx-auto max-w-7xl p-6 pt-28">

        {page === "Home" && (
          <>
            <Hero setPage={setPage} />
            <Stats />
            <Features />
            <Footer />
          </>
        )}

        {page === "Dashboard" && (
          <Dashboard setPage={setPage} />
        )}

        {page === "Wallet" && <Wallet />}

        {page === "Payments" && <Payments />}

        {page === "Cards" && <Cards />}

        {page === "AI Assistant" && <AIAssistant />}

        {page === "Security" && <Security />}

        {page === "Notifications" && <Notifications />}

        {page === "Profile" && <Profile />}

        {page === "Statements" && <Statements />}

        {page === "Settings" && <Settings />}

      </main>
    </div>
  );
}