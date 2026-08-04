import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";

type LoginProps = {
  onLogin: () => void;
  onCreateAccount: () => void;
};

export default function Login({
  onLogin,
  onCreateAccount,
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Please enter your email and password.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);

    alert("Login successful!");

    onLogin();
  } catch (error) {
  alert(error instanceof Error ? error.message : "Login failed");
}
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-pink-900 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-[32px] bg-white p-10 shadow-2xl"
      >
        <h1 className="text-3xl font-black text-center">
          BOLD INTERCONTINENTAL
        </h1>

        <p className="mt-2 text-center text-gray-500">
          Secure Client Login
        </p>

        <input
          className="mt-8 w-full rounded-xl border p-4"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mt-5 w-full rounded-xl border p-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="mt-8 w-full rounded-xl bg-pink-600 py-4 font-bold text-white hover:bg-pink-700"
          type="submit"
        >
          Login
        </button>

        <button
  type="button"
  onClick={onCreateAccount}
  className="mt-4 w-full rounded-xl border border-pink-600 py-4 font-bold text-pink-600 hover:bg-pink-50"
>
  Create Account
</button>
      </form>
    </div>
  );
}