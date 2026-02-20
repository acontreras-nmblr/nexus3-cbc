import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { recordBuyLoad, saveFavoriteContact, downloadReceipt } from "../mockData";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Network {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const networks: Network[] = [
  { id: "globe", name: "Globe", icon: "public", color: "bg-blue-600" },
  { id: "smart", name: "Smart", icon: "sim_card", color: "bg-green-600" },
  { id: "tnt", name: "TNT", icon: "smartphone", color: "bg-yellow-500" },
  { id: "dito", name: "DITO", icon: "cell_tower", color: "bg-teal-600" },
];

const presetAmounts = [50, 100, 200, 300, 500, 1000];

interface RecentContact {
  label: string;
  number: string;
}

const recentContacts: RecentContact[] = [
  { label: "Mom", number: "0917-888-..." },
  { label: "Self", number: "0917-555-..." },
];

type LoadType = "regular" | "promos";
type Step = "details" | "review" | "success";

interface BuyLoadForm {
  network: string;
  mobileNumber: string;
  loadType: LoadType;
  selectedAmount: number | null;
  customAmount: string;
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function BuyLoad() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("details");
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [form, setForm] = useState<BuyLoadForm>({
    network: "globe",
    mobileNumber: "",
    loadType: "regular",
    selectedAmount: 50,
    customAmount: "",
  });

  const amount = form.customAmount
    ? parseFloat(form.customAmount) || 0
    : form.selectedAmount ?? 0;

  const selectedNetwork = networks.find((n) => n.id === form.network);

  const canProceed = form.mobileNumber.length >= 10 && amount > 0;

  function handleBack() {
    if (step === "review") {
      setStep("details");
    } else {
      navigate("/");
    }
  }

  function update(patch: Partial<BuyLoadForm>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display text-slate-900 dark:text-slate-100">
      <div className="relative mx-auto flex min-h-screen max-w-[480px] flex-col bg-white dark:bg-background-dark shadow-xl">
        {/* Header */}
        {step !== "success" ? (
          <BuyLoadHeader onBack={handleBack} />
        ) : (
          <SuccessHeader onClose={() => navigate("/")} />
        )}

        {/* Progress */}
        <ProgressBar step={step} />

        {/* Step content */}
        {step === "details" && (
          <DetailsStep
            form={form}
            onUpdate={update}
            recentContacts={recentContacts}
          />
        )}
        {step === "review" && selectedNetwork && (
          <ReviewStep
            network={selectedNetwork}
            mobileNumber={form.mobileNumber}
            amount={amount}
          />
        )}
        {step === "success" && selectedNetwork && (
          <SuccessStep
            network={selectedNetwork}
            mobileNumber={form.mobileNumber}
            amount={amount}
            earnedPoints={earnedPoints}
          />
        )}

        {/* Bottom actions */}
        {step === "details" && (
          <div className="fixed bottom-0 z-50 w-full max-w-[480px]">
            <div className="p-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setStep("review")}
                disabled={!canProceed}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
              >
                Review Transaction
              </button>
            </div>
          </div>
        )}
        {step === "review" && (
          <div className="p-4 bg-white dark:bg-background-dark border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  if (selectedNetwork) {
                    const pts = recordBuyLoad(selectedNetwork.name, amount);
                    setEarnedPoints(pts);
                  }
                  setStep("success");
                }}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]"
              >
                Confirm & Buy Load
              </button>
              <button
                onClick={handleBack}
                className="w-full bg-transparent text-slate-500 dark:text-slate-400 font-semibold py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {step === "success" && (
          <div className="p-4 flex flex-col gap-3">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-primary/20 transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={() => {
                setStep("details");
                setEarnedPoints(0);
                setForm({
                  network: "globe",
                  mobileNumber: "",
                  loadType: "regular",
                  selectedAmount: 50,
                  customAmount: "",
                });
              }}
              className="w-full bg-transparent text-slate-500 dark:text-slate-400 font-bold py-3 text-sm"
            >
              Buy Load Again
            </button>
            <div className="pb-4 text-center">
              <p className="text-slate-400 dark:text-slate-600 text-[10px] uppercase tracking-widest font-bold">
                Member: PDIC. Regulated by BSP.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Headers                                                            */
/* ------------------------------------------------------------------ */

function BuyLoadHeader({ onBack }: { onBack: () => void }) {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center p-4 gap-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined text-slate-700 dark:text-slate-200">arrow_back</span>
        </button>
        <div className="flex items-center gap-3">
          <img alt="Chinabank Logo" className="h-8 w-auto object-contain" src="/chinabank-logo.png" />
          <h1 className="text-xl font-bold tracking-tight border-l border-slate-300 dark:border-slate-700 pl-3">
            Buy Load
          </h1>
        </div>
      </div>
    </header>
  );
}

function SuccessHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center bg-white dark:bg-background-dark p-4 pb-2 justify-between">
      <div className="flex size-12 shrink-0 items-center">
        <span
          className="material-symbols-outlined text-slate-600 dark:text-slate-400 cursor-pointer"
          onClick={onClose}
        >
          close
        </span>
      </div>
      <div className="flex-1 flex justify-center">
        <img alt="Chinabank Logo" className="h-8 object-contain" src="/chinabank-logo.png" />
      </div>
      <div className="flex w-12 items-center justify-end">
        <button className="flex items-center justify-center rounded-lg h-12 bg-transparent text-slate-900 dark:text-slate-100">
          <span className="material-symbols-outlined">share</span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Progress Bar                                                       */
/* ------------------------------------------------------------------ */

function ProgressBar({ step }: { step: Step }) {
  const stepNum = step === "details" ? 1 : step === "review" ? 2 : 2;
  const pct = step === "details" ? "50%" : "100%";
  const label = step === "details" ? "Details & Amount" : step === "review" ? "Review" : "Complete";

  return (
    <div className="p-4 bg-white dark:bg-slate-900/50 mb-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-primary">
          {step === "success" ? "Complete" : `Step ${stepNum} of 2`}
        </span>
        <span className="text-sm text-slate-500">{label}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: pct }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Details Step (Step 1 of 2)                                         */
/* ------------------------------------------------------------------ */

function DetailsStep({
  form,
  onUpdate,
  recentContacts,
}: {
  form: BuyLoadForm;
  onUpdate: (patch: Partial<BuyLoadForm>) => void;
  recentContacts: RecentContact[];
}) {
  return (
    <main className="flex-1 overflow-y-auto pb-28">
      {/* Source Account */}
      <div className="p-4">
        <label className="block text-sm font-bold mb-3 uppercase tracking-wider text-slate-500">
          Source Account
        </label>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
            </div>
            <div>
              <p className="font-bold text-sm">Savings Account</p>
              <p className="text-xs text-slate-500">**** 4582</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-sm">PHP 24,500.00</p>
            <p className="text-[10px] text-slate-400 uppercase">Available Balance</p>
          </div>
        </div>
      </div>

      {/* Network Selection */}
      <div className="p-4">
        <label className="block text-sm font-bold mb-4 uppercase tracking-wider text-slate-500">
          Select Network
        </label>
        <div className="grid grid-cols-4 gap-3">
          {networks.map((net) => (
            <button
              key={net.id}
              onClick={() => onUpdate({ network: net.id })}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={`w-full aspect-square rounded-xl border-2 bg-white dark:bg-slate-900 flex items-center justify-center p-3 shadow-sm transition-colors ${
                  form.network === net.id
                    ? "border-primary"
                    : "border-transparent hover:border-slate-300"
                }`}
              >
                <div className={`w-full h-full rounded-lg ${net.color} flex items-center justify-center text-white`}>
                  <span className="material-symbols-outlined">{net.icon}</span>
                </div>
              </div>
              <span
                className={`text-xs font-medium ${
                  form.network === net.id ? "font-bold text-primary" : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {net.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Number */}
      <div className="p-4">
        <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-slate-500">
          Mobile Number
        </label>
        <div className="relative">
          <input
            type="tel"
            placeholder="09XX XXX XXXX"
            value={form.mobileNumber}
            onChange={(e) => onUpdate({ mobileNumber: e.target.value })}
            className="w-full px-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-display text-lg tracking-widest focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all pr-12"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">contact_page</span>
          </button>
        </div>
        {/* Recent Contacts */}
        <div className="mt-4">
          <p className="text-xs font-medium text-slate-400 mb-2 italic">Recently loaded:</p>
          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {recentContacts.map((c) => (
              <button
                key={c.label}
                onClick={() => onUpdate({ mobileNumber: c.number })}
                className="whitespace-nowrap px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[14px]">history</span>
                {c.label} ({c.number})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Load Type Toggle */}
      <div className="px-4 py-2">
        <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => onUpdate({ loadType: "regular" })}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${
              form.loadType === "regular"
                ? "bg-white dark:bg-slate-700 shadow-sm text-primary"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            Regular Load
          </button>
          <button
            onClick={() => onUpdate({ loadType: "promos" })}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${
              form.loadType === "promos"
                ? "bg-white dark:bg-slate-700 shadow-sm text-primary"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            Promos
          </button>
        </div>
      </div>

      {/* Amount Selection */}
      <div className="p-4">
        <label className="block text-sm font-bold mb-4 uppercase tracking-wider text-slate-500">
          Select Amount
        </label>
        <div className="grid grid-cols-3 gap-3">
          {presetAmounts.map((amt) => {
            const isSelected = form.selectedAmount === amt && !form.customAmount;
            return (
              <button
                key={amt}
                onClick={() => onUpdate({ selectedAmount: amt, customAmount: "" })}
                className={`py-4 rounded-xl text-center transition-colors ${
                  isSelected
                    ? "border-2 border-primary bg-primary/5"
                    : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary"
                }`}
              >
                <span
                  className={`block text-xs font-bold uppercase mb-1 ${
                    isSelected ? "text-primary" : "text-slate-400"
                  }`}
                >
                  PHP
                </span>
                <span
                  className={`text-xl font-extrabold ${
                    isSelected ? "text-primary" : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {amt}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Amount */}
        <div className="mt-6">
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-slate-500">
            Other Amount
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">PHP</div>
            <input
              type="number"
              placeholder="Enter custom amount"
              value={form.customAmount}
              onChange={(e) => onUpdate({ customAmount: e.target.value, selectedAmount: null })}
              className="w-full pl-14 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-display focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Review Step (Step 2 of 2)                                          */
/* ------------------------------------------------------------------ */

function ReviewStep({
  network,
  mobileNumber,
  amount,
}: {
  network: Network;
  mobileNumber: string;
  amount: number;
}) {
  return (
    <main className="flex-1 overflow-y-auto">
      {/* Network Branding */}
      <div className="flex p-8 flex-col items-center gap-4">
        <div className={`w-20 h-20 rounded-2xl ${network.color} flex items-center justify-center text-white shadow-lg`}>
          <span className="material-symbols-outlined text-4xl">{network.icon}</span>
        </div>
        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Loading to</p>
          <h3 className="text-2xl font-extrabold tracking-tight">{network.name}</h3>
          <p className="text-slate-500 text-sm mt-1 font-mono tracking-wider">{mobileNumber}</p>
        </div>
      </div>

      {/* Details Card */}
      <div className="px-4 pb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-500">Network</p>
              <p className="text-sm font-bold">{network.name}</p>
            </div>
            <div className="h-px bg-slate-100 dark:bg-slate-700" />
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-500">Mobile Number</p>
              <p className="text-sm font-bold font-mono">{mobileNumber}</p>
            </div>
            <div className="h-px bg-slate-100 dark:bg-slate-700" />
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-500">Load Amount</p>
              <p className="text-sm font-bold">
                PHP {amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="h-px bg-slate-100 dark:bg-slate-700" />
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-500">Service Fee</p>
              <p className="text-sm font-bold text-success">FREE</p>
            </div>
            <div className="mt-4 pt-4 border-t-2 border-dashed border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold">Total</p>
                <p className="text-2xl font-extrabold text-primary">
                  PHP {amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-500 text-lg">lock</span>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-tight">
              Your transaction is encrypted and secured by Chinabank's multi-layer security system.
            </p>
          </div>
        </div>
      </div>

      {/* Source Account Info */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-3 dark:bg-primary/10">
          <span className="material-symbols-outlined text-primary text-sm">info</span>
          <p className="text-[11px] leading-tight text-slate-600 dark:text-slate-400">
            Amount will be deducted from your <span className="font-bold">Savings Account (**** 4582)</span>.
            Load is usually received instantly.
          </p>
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Success Step                                                       */
/* ------------------------------------------------------------------ */

function SuccessStep({
  network,
  mobileNumber,
  amount,
  earnedPoints,
}: {
  network: Network;
  mobileNumber: string;
  amount: number;
  earnedPoints: number;
}) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  const refNo = `CBC-${Date.now().toString().slice(-8)}`;
  const [contactSaved, setContactSaved] = useState(false);

  function handleSaveContact() {
    saveFavoriteContact({ network: network.name, mobileNumber });
    setContactSaved(true);
  }

  function handleDownloadReceipt() {
    downloadReceipt({
      title: "BUY LOAD RECEIPT",
      refNo,
      date: dateStr,
      time: timeStr,
      rows: [
        { label: "Network", value: network.name },
        { label: "Mobile Number", value: mobileNumber },
        { label: "Load Amount", value: `PHP ${amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}` },
        { label: "Service Fee", value: "FREE" },
        ...(earnedPoints > 0 ? [{ label: "Rewards Earned", value: `+${earnedPoints} pts` }] : []),
      ],
      total: { label: "Total Amount", value: `PHP ${amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}` },
    });
  }

  return (
    <main className="flex-1 overflow-y-auto flex flex-col">
      {/* Success Visual */}
      <div className="flex flex-col items-center justify-center pt-8 pb-4">
        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-6 rounded-full mb-4">
          <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 !text-6xl">
            check_circle
          </span>
        </div>
        <h1 className="text-2xl font-extrabold leading-tight text-center">Load Sent!</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Your load has been delivered successfully.
        </p>
      </div>

      {/* Rewards Earned Banner */}
      {earnedPoints > 0 && (
        <div className="mx-4 mb-2 flex items-center gap-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3">
          <span className="material-symbols-outlined text-green-600 dark:text-green-400">stars</span>
          <p className="text-green-700 dark:text-green-400 text-sm font-semibold">
            You earned <span className="font-extrabold">{earnedPoints} points</span> (2% reward)!
          </p>
        </div>
      )}

      {/* Amount */}
      <div className="px-4 py-6 text-center">
        <h2 className="tracking-tight text-[40px] font-extrabold leading-tight">
          PHP {amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </h2>
      </div>

      {/* Transaction Details Card */}
      <div className="mx-4 mb-6 p-5 bg-background-light dark:bg-primary/5 rounded-xl border border-slate-200 dark:border-primary/20">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Network
              </p>
              <p className="font-bold text-lg">{network.name}</p>
            </div>
            <div className={`h-10 w-10 ${network.color} rounded-lg flex items-center justify-center text-white shadow-sm`}>
              <span className="material-symbols-outlined text-xl">{network.icon}</span>
            </div>
          </div>
          <div className="h-px bg-slate-200 dark:bg-slate-700 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Mobile Number
              </p>
              <p className="font-medium text-sm font-mono">{mobileNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Reference No.
              </p>
              <p className="font-medium text-sm">{refNo}</p>
            </div>
          </div>
          <div className="h-px bg-slate-200 dark:bg-slate-700 w-full" />
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Date & Time
              </p>
              <p className="font-medium text-sm">{dateStr} | {timeStr}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Contact to Favorites */}
      <div className="px-4 mb-6">
        <button
          onClick={handleSaveContact}
          disabled={contactSaved}
          className={`w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed transition-colors ${
            contactSaved
              ? "border-green-300 bg-green-50 dark:bg-green-900/20 text-green-600 cursor-default"
              : "border-primary/30 text-primary hover:bg-primary/5"
          }`}
        >
          <span className="material-symbols-outlined">
            {contactSaved ? "check_circle" : "contact_phone"}
          </span>
          <span className="font-bold">
            {contactSaved ? "Contact Saved!" : "Save Number to Favorites"}
          </span>
        </button>
      </div>

      {/* Download Receipt */}
      <div className="px-4 mb-4 flex justify-center">
        <button
          onClick={handleDownloadReceipt}
          className="flex items-center gap-2 text-primary font-bold text-sm"
        >
          <span className="material-symbols-outlined text-[20px]">download</span>
          Download Receipt
        </button>
      </div>

      <div className="grow" />
    </main>
  );
}
