import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
type RegisterProps = {
  onRegister: () => void;
};

export default function Register({ onRegister }: RegisterProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!fullName || !email || !phone || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
  auth,
  email,
  password
);

await setDoc(doc(db, "users", userCredential.user.uid), {
  fullName,
  email,
  phone,
  balance: 25480,
  accountNumber: Math.floor(
    1000000000 + Math.random() * 9000000000
  ).toString(),
  createdAt: new Date().toISOString(),
});

    alert("Account created successfully!");

    onRegister();
  } catch (error: any) {
    alert(error.message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-pink-900 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-[32px] bg-white p-10 shadow-2xl"
      >
        <h1 className="text-3xl font-black text-center">
          Open Your Account
        </h1>

        <p className="mt-2 text-center text-gray-500">
          Join BOLD INTERCONTINENTAL
        </p>

        <input
          className="mt-8 w-full rounded-xl border p-4"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          className="mt-5 w-full rounded-xl border p-4"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mt-5 w-full rounded-xl border p-4"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          className="mt-5 w-full rounded-xl border p-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="mt-8 w-full rounded-xl bg-pink-600 py-4 font-bold text-white hover:bg-pink-700"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}