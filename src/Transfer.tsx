import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";

import {
  collection,
  doc,
  getDocs,
  query,
  where,
  runTransaction,
  addDoc,
} from "firebase/firestore";

export default function Transfer() {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");

  const [recipient, setRecipient] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [showConfirmation, setShowConfirmation] =
    useState(false);

  const [senderBalance, setSenderBalance] =
    useState(0);

  useEffect(() => {
    loadSender();
  }, []);

  async function loadSender() {
    const user = auth.currentUser;

    if (!user) return;

    const q = query(
      collection(db, "users"),
      where("__name__", "==", user.uid)
    );

    const snap = await getDocs(q);

    if (!snap.empty) {
      setSenderBalance(snap.docs[0].data().balance);
    }
  }

  async function lookupRecipient(value: string) {
    setAccountNumber(value);

    if (value.length < 10) {
      setRecipient(null);
      return;
    }

    const q = query(
      collection(db, "users"),
      where("accountNumber", "==", value.trim())
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      setRecipient(null);
      return;
    }

    const user = snap.docs[0];

    if (user.id === auth.currentUser?.uid) {
      setRecipient(null);
      return;
    }

    setRecipient({
      id: user.id,
      ...user.data(),
    });
  }
    async function confirmTransfer() {
    if (!recipient) return;

    const transferAmount = Number(amount);

    if (isNaN(transferAmount) || transferAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (transferAmount > senderBalance) {
      alert("Insufficient balance.");
      return;
    }

    setLoading(true);

    try {
      await runTransaction(db, async (transaction) => {
        const senderRef = doc(db, "users", auth.currentUser!.uid);
        const receiverRef = doc(db, "users", recipient.id);

        const senderSnap = await transaction.get(senderRef);
        const receiverSnap = await transaction.get(receiverRef);

        if (!senderSnap.exists()) {
          throw new Error("Sender account not found.");
        }

        if (!receiverSnap.exists()) {
          throw new Error("Recipient account not found.");
        }

        const senderData = senderSnap.data();
        const receiverData = receiverSnap.data();

        if (senderData.balance < transferAmount) {
          throw new Error("Insufficient balance.");
        }

        transaction.update(senderRef, {
          balance: senderData.balance - transferAmount,
        });

        transaction.update(receiverRef, {
          balance: receiverData.balance + transferAmount,
        });
      });

      await addDoc(
        collection(db, "users", auth.currentUser!.uid, "transactions"),
        {
          title: "Transfer",
          amount: -transferAmount,
          recipient: recipient.fullName,
          recipientAccount: recipient.accountNumber,
          createdAt: new Date(),
          type: "debit",
        }
      );

      await addDoc(
        collection(db, "users", recipient.id, "transactions"),
        {
          title: "Money Received",
          amount: transferAmount,
          sender: auth.currentUser!.email,
          createdAt: new Date(),
          type: "credit",
        }
      );

      alert("Transfer Successful!");

      setAccountNumber("");
      setAmount("");
      setRecipient(null);
      setShowConfirmation(false);

      loadSender();

    } catch (error: any) {
      alert(error.message);
    }

    setLoading(false);
  }
    return (
    <div className="mx-auto max-w-2xl p-6">

      <div className="rounded-3xl bg-white p-8 shadow-xl">

        <h1 className="text-3xl font-black text-pink-600">
          Transfer Funds
        </h1>

        <p className="mt-2 text-gray-500">
          Send money securely to another Bold Intercontinental account.
        </p>

        {/* Available Balance */}

        <div className="mt-8 rounded-2xl bg-pink-50 p-5">

          <p className="text-gray-500">
            Available Balance
          </p>

          <h2 className="mt-2 text-4xl font-black text-pink-600">
            ${senderBalance.toLocaleString()}
          </h2>

        </div>

        {/* Recipient Account */}

        <input
          className="mt-8 w-full rounded-xl border p-4"
          placeholder="Recipient Account Number"
          value={accountNumber}
          onChange={(e) =>
            lookupRecipient(e.target.value)
          }
        />

        {/* Recipient */}

        {recipient && (

          <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-5">

            <p className="text-sm text-gray-500">
              Recipient
            </p>

            <h3 className="text-xl font-bold text-green-700">
              {recipient.fullName}
            </h3>

            <p className="mt-1 text-gray-600">
              {recipient.accountNumber}
            </p>

          </div>

        )}

        {!recipient && accountNumber.length >= 10 && (

          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-5">

            <p className="font-semibold text-red-600">
              Recipient account not found.
            </p>

          </div>

        )}

        {/* Amount */}

        <input
          className="mt-6 w-full rounded-xl border p-4"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
        />
                <button
          onClick={() => setShowConfirmation(true)}
          disabled={!recipient || !amount || loading}
          className={`mt-8 w-full rounded-xl py-4 font-bold text-white transition ${
            recipient && amount && !loading
              ? "bg-pink-600 hover:bg-pink-700"
              : "cursor-not-allowed bg-gray-400"
          }`}
        >
          {loading ? "Processing..." : "Continue"}
        </button>

      </div>

      {/* Confirmation Modal */}

      {showConfirmation && recipient && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">

          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

            <h2 className="text-3xl font-black text-center text-pink-600">
              Confirm Transfer
            </h2>

            <div className="mt-8 space-y-5">

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-gray-500">Recipient</p>
                <h3 className="text-xl font-bold">
                  {recipient.fullName}
                </h3>
              </div>

              <div className="rounded-2xl bg-gray-50 p-4">
                <p className="text-gray-500">Account Number</p>
                <h3 className="font-bold">
                  {recipient.accountNumber}
                </h3>
              </div>

              <div className="rounded-2xl bg-pink-50 p-4">
                <p className="text-gray-500">Amount</p>
                <h2 className="text-3xl font-black text-pink-600">
                  ${Number(amount).toLocaleString()}
                </h2>
              </div>

            </div>

            <div className="mt-8 flex gap-4">

              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 rounded-xl border border-gray-300 py-4 font-bold"
              >
                Cancel
              </button>

              <button
                onClick={confirmTransfer}
                className="flex-1 rounded-xl bg-pink-600 py-4 font-bold text-white hover:bg-pink-700"
              >
                Confirm
              </button>

            </div>

          </div>

        </div>

      )}
          </div>
  );
}