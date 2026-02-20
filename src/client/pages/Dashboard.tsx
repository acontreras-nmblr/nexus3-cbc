import { useState } from "react";
import { useNavigate } from "react-router-dom";

const quickActions = [
  { icon: "payments", label: "Pay Bills", to: "/pay-bills" },
  { icon: "smartphone", label: "Buy Load", to: "/buy-load" },
  { icon: "sync_alt", label: "Transfer", to: "/transfer" },
  { icon: "credit_card", label: "Cards", to: "/cards" },
  { icon: "card_giftcard", label: "Rewards", to: "/rewards" },
];

interface Transaction {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  date: string;
  amount: string;
  amountColor: string;
}

const recentTransactions: Transaction[] = [
  {
    icon: "shopping_bag",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: "SM Supermarket",
    date: "Oct 24, 2023 • 2:15 PM",
    amount: "- 1,240.50",
    amountColor: "text-slate-900 dark:text-slate-100",
  },
  {
    icon: "download",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600",
    title: "Payroll Deposit",
    date: "Oct 15, 2023 • 9:00 AM",
    amount: "+ 45,000.00",
    amountColor: "text-green-600",
  },
  {
    icon: "electric_bolt",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: "Meralco Payment",
    date: "Oct 12, 2023 • 4:30 PM",
    amount: "- 3,500.00",
    amountColor: "text-slate-900 dark:text-slate-100",
  },
];

export function Dashboard() {
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);

  return (
    <main className="flex-1 overflow-y-auto pb-24 px-4">
      {/* Greeting */}
      <div className="mt-6 mb-4">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Good morning,
        </p>
        <h2 className="text-2xl font-bold">Juan Dela Cruz</h2>
      </div>

      {/* Main Account Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-[#8b0b20] p-6 text-white shadow-xl shadow-primary/20 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
              Savings Account
            </p>
            <p className="text-white font-semibold">1234-5678-9012</p>
            <p className="text-white/90 text-[10px] mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">stars</span>
              1,250 Points
            </p>
          </div>
          <button
            className="text-white/80 hover:text-white transition-colors"
            onClick={() => setBalanceVisible((v) => !v)}
          >
            <span className="material-symbols-outlined">
              {balanceVisible ? "visibility" : "visibility_off"}
            </span>
          </button>
        </div>
        <p className="text-white/80 text-sm font-medium">
          Total Available Balance
        </p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-xl font-medium">PHP</span>
          <span className="text-4xl font-extrabold tracking-tight">
            {balanceVisible ? "125,450.00" : "••••••••"}
          </span>
        </div>
        <div className="mt-8 flex gap-3">
          <button className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-sm font-bold py-2.5 rounded-lg border border-white/20 transition-all">
            View Details
          </button>
          <button className="flex-1 bg-white text-primary text-sm font-bold py-2.5 rounded-lg transition-all hover:bg-slate-50">
            Add Money
          </button>
        </div>
        {/* Abstract background shape */}
        <div className="absolute -right-8 -bottom-8 size-48 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Quick Actions Grid */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-5 gap-4">
          {quickActions.map((action) => (
            <div key={action.label} className="flex flex-col items-center gap-2">
              <button
                onClick={() => action.to && navigate(action.to)}
                className="size-14 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-primary transition-transform active:scale-95"
              >
                <span className="material-symbols-outlined text-3xl">
                  {action.icon}
                </span>
              </button>
              <span className="text-[11px] font-semibold text-center leading-tight">
                {action.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Recent Activities</h3>
          <button className="text-primary text-sm font-bold">See All</button>
        </div>
        <div className="space-y-3">
          {recentTransactions.map((tx) => (
            <div
              key={tx.title + tx.date}
              className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`size-10 ${tx.iconBg} rounded-lg flex items-center justify-center ${tx.iconColor}`}
                >
                  <span className="material-symbols-outlined">{tx.icon}</span>
                </div>
                <div>
                  <p className="font-bold text-sm">{tx.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tx.date}
                  </p>
                </div>
              </div>
              <p className={`font-bold ${tx.amountColor}`}>{tx.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
