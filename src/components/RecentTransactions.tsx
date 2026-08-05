import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    if (!auth.currentUser) return;

    const q = query(
      collection(
        db,
        "users",
        auth.currentUser.uid,
        "transactions"
      ),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    setTransactions(
      snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  }
    return (
    <div className="rounded-[32px] bg-white p-8 shadow-xl">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          Recent Transactions
        </h2>

        <span className="text-sm text-gray-500">
          {transactions.length} Transaction(s)
        </span>

      </div>

      {transactions.length === 0 ? (

        <div className="py-16 text-center">

          <h3 className="text-xl font-semibold text-gray-400">
            No transactions yet
          </h3>

          <p className="mt-2 text-gray-500">
            Your transfers will appear here.
          </p>

        </div>

      ) : (

        <div className="mt-8 space-y-4">

          {transactions.map((tx) => (

            <div
              key={tx.id}
              className="flex items-center justify-between rounded-2xl border border-gray-100 p-5 hover:bg-gray-50 transition"
            >

              <div>

                <h3 className="font-bold text-lg">
                  {tx.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {tx.recipient ||
                    tx.sender ||
                    ""}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {tx.createdAt?.toDate
                    ? tx.createdAt
                        .toDate()
                        .toLocaleString()
                    : String(tx.createdAt)}
                </p>

              </div>

              <div
                className={`text-xl font-bold ${
                  tx.type === "credit"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {tx.type === "credit" ? "+" : "-"}$
                {Math.abs(Number(tx.amount)).toLocaleString()}
              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}
const transactions = [
  {
    name: "Apple Store",
    date: "Today",
    amount: "-$799.00",
    status: "Completed",
    color: "text-red-500",
  },
  {
    name: "Salary Deposit",
    date: "Yesterday",
    amount: "+$3,800.00",
    status: "Received",
    color: "text-green-600",
  },
  {
    name: "International Transfer",
    date: "2 Days Ago",
    amount: "-€2,450.00",
    status: "Completed",
    color: "text-red-500",
  },
  {
    name: "Amazon",
    date: "3 Days Ago",
    amount: "-$129.99",
    status: "Completed",
    color: "text-red-500",
  },
];

export default function RecentTransactions() {
  return (
    <div className="rounded-[32px] bg-white p-8 shadow-xl">
      <h2 className="text-2xl font-bold mb-8">
        Recent Transactions
      </h2>

      <div className="space-y-5">
        {transactions.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-2xl border border-slate-100 p-5 hover:bg-slate-50 transition"
          >
            <div>
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-gray-500">
                {item.date}
              </p>
            </div>

            <div className="text-right">
              <p className={`font-bold ${item.color}`}>
                {item.amount}
              </p>

              <p className="text-xs text-green-600">
                {item.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}