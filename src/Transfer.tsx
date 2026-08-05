import React, { useState } from "react";

export default function Transfer() {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = () => {
    if (!accountNumber || !amount) {
      alert("Please complete all fields.");
      return;
    }

    alert("Transfer feature coming next...");
  };

  return (
    <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-xl">

      <h1 className="text-4xl font-black">
        Transfer Money
      </h1>

      <p className="mt-2 text-gray-500">
        Send funds instantly to another account.
      </p>

      <input
        className="mt-8 w-full rounded-xl border p-4"
        placeholder="Recipient Account Number"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
      />

      <input
        className="mt-5 w-full rounded-xl border p-4"
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        onClick={handleTransfer}
        className="mt-8 w-full rounded-xl bg-pink-600 py-4 font-bold text-white"
      >
        Transfer
      </button>

    </div>
  );
}