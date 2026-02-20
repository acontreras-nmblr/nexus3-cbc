import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRewards, getTotalPoints, redeemVoucher } from "../mockData";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Voucher {
  id: string;
  brand: string;
  icon: string;
  cost: number;
}

type TabFilter = "all" | "earned" | "redeemed";

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const vouchers: Voucher[] = [
  { id: "v1", brand: "SM Store", icon: "storefront", cost: 1000 },
  { id: "v2", brand: "Grab", icon: "local_taxi", cost: 500 },
  { id: "v3", brand: "Starbucks", icon: "coffee", cost: 500 },
  { id: "v4", brand: "Jollibee", icon: "restaurant", cost: 300 },
];

const TIER = "Gold";
const NEXT_TIER = "Platinum";
const PLATINUM_THRESHOLD = 2000;

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function Rewards() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [showRedeemDialog, setShowRedeemDialog] = useState<Voucher | null>(null);
  const [, setRefresh] = useState(0);

  const totalPoints = getTotalPoints();
  const rewardsHistory = getRewards();

  const pointsToNext = Math.max(0, PLATINUM_THRESHOLD - totalPoints);
  const tierProgress = Math.min(100, Math.round((totalPoints / PLATINUM_THRESHOLD) * 100));

  const filteredHistory = rewardsHistory.filter((item) => {
    if (activeTab === "earned") return item.points > 0;
    if (activeTab === "redeemed") return item.points < 0;
    return true;
  });

  function handleRedeem(voucher: Voucher) {
    redeemVoucher(voucher.brand, voucher.cost);
    setShowRedeemDialog(null);
    setRefresh((n) => n + 1);
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-slate-100 font-display">
      <div className="relative flex min-h-screen w-full max-w-md mx-auto flex-col bg-white dark:bg-background-dark shadow-xl overflow-x-hidden">
        {/* Header */}
        <nav className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">
                arrow_back
              </span>
            </button>
            <h1 className="text-lg font-bold tracking-tight">Chinabank Rewards</h1>
          </div>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">
              info
            </span>
          </button>
        </nav>

        <main className="flex-1 overflow-y-auto pb-24">
          {/* Total Rewards Balance */}
          <section className="p-6">
            <div className="relative overflow-hidden bg-gradient-to-br from-primary to-red-800 rounded-xl p-8 shadow-xl shadow-primary/20 text-white">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-black/10 rounded-full blur-xl" />

              <p className="text-sm font-medium opacity-90 mb-1">Total Rewards Balance</p>
              <h2 className="text-4xl font-extrabold tracking-tight mb-2">
                {totalPoints.toLocaleString()}{" "}
                <span className="text-xl font-medium">Points</span>
              </h2>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{TIER} Member Tier</span>
                  <span>{pointsToNext > 0 ? `${pointsToNext} pts to ${NEXT_TIER}` : `${NEXT_TIER} Achieved!`}</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-500"
                    style={{ width: `${tierProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Redeemable Vouchers */}
          <section className="mb-8">
            <div className="px-6 flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Redeemable Vouchers</h3>
              <button className="text-primary text-sm font-semibold">See All</button>
            </div>
            <div className="flex gap-4 overflow-x-auto px-6 scrollbar-hide pb-2">
              {vouchers.map((v) => (
                <div
                  key={v.id}
                  className="min-w-[160px] bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center text-center shadow-sm"
                >
                  <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-3xl text-slate-600 dark:text-slate-300">
                      {v.icon}
                    </span>
                  </div>
                  <p className="font-bold text-sm mb-1">{v.brand}</p>
                  <p className="text-primary font-bold text-xs mb-3">
                    {v.cost.toLocaleString()} Points
                  </p>
                  <button
                    onClick={() => setShowRedeemDialog(v)}
                    disabled={totalPoints < v.cost}
                    className="w-full bg-primary text-white text-xs font-bold py-2 rounded-lg transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Redeem
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Rewards History */}
          <section className="px-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Rewards History</h3>
            </div>

            {/* Tab Filters */}
            <div className="flex gap-2 mb-4">
              {(["all", "earned", "redeemed"] as TabFilter[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors capitalize ${
                    activeTab === tab
                      ? "bg-primary text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full ${item.iconBg} flex items-center justify-center`}
                    >
                      <span className={`material-symbols-outlined ${item.iconColor}`}>
                        {item.icon}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.date}</p>
                    </div>
                  </div>
                  <p
                    className={`font-bold ${
                      item.points > 0
                        ? "text-primary"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {item.points > 0 ? "+" : ""}
                    {item.points} pts
                  </p>
                </div>
              ))}

              {filteredHistory.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <span className="material-symbols-outlined text-4xl mb-2 block">
                    history
                  </span>
                  <p className="text-sm">No history found</p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Redeem Confirmation Dialog */}
      {showRedeemDialog && (
        <RedeemDialog
          voucher={showRedeemDialog}
          totalPoints={totalPoints}
          onConfirm={() => handleRedeem(showRedeemDialog)}
          onCancel={() => setShowRedeemDialog(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Redeem Dialog                                                      */
/* ------------------------------------------------------------------ */

function RedeemDialog({
  voucher,
  totalPoints,
  onConfirm,
  onCancel,
}: {
  voucher: Voucher;
  totalPoints: number;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-3xl">
            card_giftcard
          </span>
        </div>

        <h3 className="text-lg font-bold text-center mb-2">Redeem Voucher?</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-2">
          Redeem a <span className="font-bold text-slate-700 dark:text-slate-200">{voucher.brand}</span> voucher
          for <span className="font-bold text-primary">{voucher.cost.toLocaleString()} points</span>?
        </p>
        <p className="text-xs text-slate-400 text-center mb-6">
          Remaining balance: {(totalPoints - voucher.cost).toLocaleString()} points
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-primary/20"
          >
            Confirm Redemption
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
