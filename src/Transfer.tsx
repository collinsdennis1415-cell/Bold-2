import React, { useState } from "react";
import { auth, db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  addDoc,
} from "firebase/firestore";

export default function Transfer() {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");

const handleTransfer = async () => {
  if (!accountNumber || !amount) {
    alert("Please complete all fields.");
    return;
  }

  const currentUser = auth.currentUser;

  if (!currentUser) {
    alert("Please login again.");
    return;
  }

  const senderRef = doc(db, "users", currentUser.uid);

const senderSnap = await getDoc(senderRef);

if (!senderSnap.exists()) {
  alert("Your account could not be found.");
  return;
}

const senderData = senderSnap.data();
const receiverQuery = query(
  collection(db, "users"),
  where("accountNumber", "==", accountNumber)
);

const receiverSnap = await getDocs(receiverQuery);

if (receiverSnap.empty) {
  alert("Recipient account not found.");
  return;
}

const receiverDoc = receiverSnap.docs[0];
const receiverData = receiverDoc.data();
if (receiverDoc.id === currentUser.uid) {
  alert("You cannot transfer money to your own account.");
  return;
}
const transferAmount = Number(amount);

if (isNaN(transferAmount) || transferAmount <= 0) {
  alert("Please enter a valid amount.");
  return;
}

if (senderData.balance < transferAmount) {
  alert("Insufficient balance.");
  return;
}
await updateDoc(senderRef, {
  balance: senderData.balance - transferAmount,
});

await updateDoc(receiverDoc.ref, {
  balance: receiverData.balance + transferAmount,
});
await addDoc(
  collection(db, "users", currentUser.uid, "transactions"),
  {
    title: "Transfer",
    amount: "-" + transferAmount,
    type: "debit",
    createdAt: new Date().toLocaleString(),
    recipient: receiverData.fullName,
    recipientAccount: accountNumber,
  }
);
await addDoc(
  collection(db, "users", receiverDoc.id, "transactions"),
  {
    title: "Money Received",
    amount: "+" + transferAmount,
    type: "credit",
    createdAt: new Date().toLocaleString(),
    sender: senderData.fullName,
    senderAccount: senderData.accountNumber,
  }
);
alert("Transfer Successful!");

setAccountNumber("");
setAmount("");
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
  onChange={async (e) => {
    const value = e.target.value;
    setAccountNumber(value);

    if (value.length < 10) {
      setRecipientName("");
      return;
    }

    const q = query(
      collection(db, "users"),
      where("accountNumber", "==", value.trim())
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      setRecipientName("");
    } else {
      setRecipientName(snap.docs[0].data().fullName);
    }
  }}
/>
{recipientName && (
  <div className="mt-3 rounded-xl bg-green-50 border border-green-200 p-4">
    <p className="text-sm text-gray-500">
      Recipient
    </p>

    <h3 className="text-lg font-bold text-green-700">
      {recipientName} ✓
    </h3>
  </div>
)}

      <input
        className="mt-5 w-full rounded-xl border p-4"
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

    <button
  onClick={handleTransfer}
  disabled={!recipientName}
  className={`mt-8 w-full rounded-xl py-4 font-bold text-white transition ${
    recipientName
      ? "bg-pink-600 hover:bg-pink-700"
      : "bg-gray-400 cursor-not-allowed"
  }`}
>
  {recipientName ? "Transfer" : "Enter a valid account number"}
</button>

    </div>
  );
}