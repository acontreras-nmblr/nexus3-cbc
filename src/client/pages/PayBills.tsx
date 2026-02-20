import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { recordBillPayment, saveFavoriteBiller, downloadReceipt } from "../mockData";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Category {
  icon: string;
  label: string;
  active?: boolean;
}

const categories: Category[] = [
  { icon: "bolt", label: "Utilities", active: true },
  { icon: "cell_tower", label: "Telco" },
  { icon: "credit_card", label: "Credit Cards" },
  { icon: "account_balance", label: "Govt" },
  { icon: "school", label: "Education" },
  { icon: "security", label: "Insurance" },
  { icon: "real_estate_agent", label: "Real Estate" },
  { icon: "more_horiz", label: "More" },
];

interface Biller {
  id: string;
  name: string;
  category: string;
  color: string;
  icon: string;
}

const popularBillers: Biller[] = [
  { id: "meralco", name: "Meralco", category: "Electric Utility", color: "bg-yellow-500", icon: "bolt" },
  { id: "globe", name: "Globe Telecom", category: "Mobile & Internet", color: "bg-blue-600", icon: "cell_tower" },
  { id: "pldt", name: "PLDT", category: "Landline & DSL", color: "bg-red-600", icon: "router" },
  { id: "maynilad", name: "Maynilad", category: "Water Utility", color: "bg-sky-500", icon: "water_drop" },
  { id: "sss", name: "SSS Contribution", category: "Government Agency", color: "bg-slate-800", icon: "account_balance" },
];

interface PaymentForm {
  accountNumber: string;
  amount: string;
}

type Step = "browse" | "details" | "review" | "success";

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function PayBills() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBiller, setSelectedBiller] = useState<Biller | null>(null);
  const [form, setForm] = useState<PaymentForm>({ accountNumber: "", amount: "" });
  const [earnedPoints, setEarnedPoints] = useState(0);

  const amount = parseFloat(form.amount) || 0;
  const fee = 15;
  const total = amount + fee;

  function selectBiller(biller: Biller) {
    setSelectedBiller(biller);
    setStep("details");
  }

  function handleBack() {
    if (step === "details") {
      setStep("browse");
      setSelectedBiller(null);
      setForm({ accountNumber: "", amount: "" });
    } else if (step === "review") {
      setStep("details");
    } else {
      navigate("/");
    }
  }

  const canProceed = form.accountNumber !== "" && form.amount !== "" && amount > 0;

  const filteredBillers = searchQuery
    ? popularBillers.filter(
        (b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : popularBillers;

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display text-slate-900 dark:text-slate-100">
      <div className="relative mx-auto flex min-h-screen max-w-[480px] flex-col bg-white dark:bg-background-dark shadow-xl">
        {/* Header varies by step */}
        {step === "browse" && <BrowseHeader onBack={() => navigate("/")} />}
        {step === "details" && <BackHeader title="Payment Details" onBack={handleBack} />}
        {step === "review" && <BackHeader title="Review Payment" onBack={handleBack} />}
        {step === "success" && (
          <SuccessHeader onClose={() => navigate("/")} />
        )}

        {/* Progress bar for steps 1-3 */}
        {step !== "browse" && <ProgressBar step={step} />}

        {/* Step content */}
        {step === "browse" && (
          <BrowseStep
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            billers={filteredBillers}
            onSelectBiller={selectBiller}
          />
        )}
        {step === "details" && selectedBiller && (
          <DetailsStep
            biller={selectedBiller}
            form={form}
            onFormChange={setForm}
          />
        )}
        {step === "review" && selectedBiller && (
          <ReviewStep biller={selectedBiller} amount={amount} fee={fee} total={total} />
        )}
        {step === "success" && selectedBiller && (
          <SuccessStep
            biller={selectedBiller}
            amount={amount}
            fee={fee}
            total={total}
            accountNumber={form.accountNumber}
            earnedPoints={earnedPoints}
            onGoHome={() => navigate("/")}
            onPayAnother={() => {
              setStep("browse");
              setSelectedBiller(null);
              setForm({ accountNumber: "", amount: "" });
              setEarnedPoints(0);
            }}
          />
        )}

        {/* Bottom actions */}
        {step === "details" && (
          <div className="fixed bottom-0 z-50 w-full max-w-[480px] border-t border-slate-100 bg-white p-4 pb-8 dark:border-slate-800 dark:bg-background-dark">
            <button
              onClick={() => setStep("review")}
              disabled={!canProceed}
              className="w-full rounded-xl bg-primary py-4 text-base font-bold text-white shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:active:scale-100"
            >
              Next
            </button>
          </div>
        )}
        {step === "review" && (
          <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => {
                  if (selectedBiller) {
                    const pts = recordBillPayment(selectedBiller.name, total);
                    setEarnedPoints(pts);
                  }
                  setStep("success");
                }}
                className="flex items-center justify-center rounded-lg h-14 bg-primary hover:bg-primary/90 text-white text-base font-bold transition-all shadow-md active:scale-[0.98]"
              >
                Confirm Payment
              </button>
              <button
                onClick={handleBack}
                className="flex items-center justify-center rounded-lg h-12 bg-transparent text-slate-500 dark:text-slate-400 text-base font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                Cancel Payment
              </button>
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

function BrowseHeader({ onBack }: { onBack: () => void }) {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 flex items-center gap-4">
      <button
        onClick={onBack}
        className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>
      <div className="flex items-center h-8">
        <img alt="Chinabank Logo" className="h-full object-contain" src="/chinabank-logo.png" />
      </div>
      <h1 className="text-xl font-bold tracking-tight">Pay Bills</h1>
      <div className="ml-auto">
        <button className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">history</span>
        </button>
      </div>
    </header>
  );
}

function BackHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center bg-white dark:bg-slate-900 p-4 pb-2 justify-between sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800">
      <button
        onClick={onBack}
        className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>
      <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
        {title}
      </h2>
    </div>
  );
}

function SuccessHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center bg-white dark:bg-background-dark p-4 pb-2 justify-between">
      <div className="text-slate-900 dark:text-slate-100 flex size-12 shrink-0 items-center">
        <span
          className="material-symbols-outlined cursor-pointer"
          onClick={onClose}
        >
          close
        </span>
      </div>
      <div className="flex-1 flex justify-center">
        <img alt="Chinabank Logo" className="h-8 object-contain" src="/chinabank-logo.png" />
      </div>
      <div className="flex w-12 items-center justify-end">
        <button className="flex cursor-pointer items-center justify-center rounded-lg h-12 bg-transparent text-slate-900 dark:text-slate-100">
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
  const stepNum = step === "details" ? 1 : step === "review" ? 2 : 3;
  const pct = step === "details" ? "33%" : step === "review" ? "66%" : "100%";
  const label = step === "details" ? "Enter Details" : step === "review" ? "Review Details" : "Payment Finalized";

  return (
    <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-800/50">
      <div className="flex gap-6 justify-between items-center">
        <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold uppercase tracking-wider">
          Step {stepNum} of 3
        </p>
        <p className="text-primary text-sm font-bold leading-normal">{label}</p>
      </div>
      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500 rounded-full"
          style={{ width: pct }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Browse Step                                                        */
/* ------------------------------------------------------------------ */

function BrowseStep({
  searchQuery,
  onSearchChange,
  billers,
  onSelectBiller,
}: {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  billers: Biller[];
  onSelectBiller: (b: Biller) => void;
}) {
  return (
    <main className="flex-1 overflow-y-auto pb-24">
      {/* Search */}
      <div className="px-4 py-6">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">
              search
            </span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-base font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none transition-all shadow-sm"
            placeholder="Search for biller (e.g. Meralco)"
          />
        </div>
      </div>

      {/* Categories */}
      {!searchQuery && (
        <section className="px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Categories</h2>
            <button className="text-primary font-semibold text-sm">View All</button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((cat) => (
              <div key={cat.label} className="flex flex-col items-center gap-2">
                <div
                  className={`size-14 rounded-xl flex items-center justify-center ${
                    cat.active
                      ? "bg-primary/10 dark:bg-primary/20 text-primary"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                </div>
                <span className="text-xs font-semibold text-center leading-tight">{cat.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Popular Billers */}
      <section className="px-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
          {searchQuery ? "Search Results" : "Popular Billers"}
        </h2>
        <div className="space-y-3">
          {billers.map((biller) => (
            <div
              key={biller.id}
              onClick={() => onSelectBiller(biller)}
              className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-primary transition-colors cursor-pointer"
            >
              <div
                className={`size-12 rounded-lg ${biller.color} flex items-center justify-center text-white`}
              >
                <span className="material-symbols-outlined">{biller.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-slate-100">{biller.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{biller.category}</p>
              </div>
              <span className="material-symbols-outlined text-slate-300">chevron_right</span>
            </div>
          ))}
          {billers.length === 0 && (
            <p className="text-center text-slate-400 py-8 text-sm">No billers found</p>
          )}
        </div>
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Details Step (Step 1 of 3)                                         */
/* ------------------------------------------------------------------ */

function DetailsStep({
  biller,
  form,
  onFormChange,
}: {
  biller: Biller;
  form: PaymentForm;
  onFormChange: React.Dispatch<React.SetStateAction<PaymentForm>>;
}) {
  function update(patch: Partial<PaymentForm>) {
    onFormChange((prev) => ({ ...prev, ...patch }));
  }

  return (
    <main className="flex-1 overflow-y-auto pb-32">
      {/* Biller Info */}
      <div className="flex items-center gap-4 p-6 border-b border-slate-100 dark:border-slate-800">
        <div className={`size-14 rounded-xl ${biller.color} flex items-center justify-center text-white`}>
          <span className="material-symbols-outlined text-2xl">{biller.icon}</span>
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{biller.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{biller.category}</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Account Number */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Account Number
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter account number"
            value={form.accountNumber}
            onChange={(e) => update({ accountNumber: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white p-4 text-base text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Payment Amount
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-lg font-bold text-slate-400">PHP</span>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => update({ amount: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-16 pr-4 text-2xl font-bold text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-300"
            />
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-primary/5 p-3 dark:bg-primary/10">
            <span className="material-symbols-outlined text-primary text-sm">info</span>
            <p className="text-[11px] leading-tight text-slate-600 dark:text-slate-400">
              Convenience fee: <span className="font-bold">PHP 15.00</span>. Payment will be posted
              within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Review Step (Step 2 of 3)                                          */
/* ------------------------------------------------------------------ */

function ReviewStep({
  biller,
  amount,
  fee,
  total,
}: {
  biller: Biller;
  amount: number;
  fee: number;
  total: number;
}) {
  return (
    <main className="flex-1 overflow-y-auto">
      {/* Biller Branding */}
      <div className="flex p-8 flex-col items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center overflow-hidden p-4">
            <div className={`w-16 h-16 rounded-xl ${biller.color} flex items-center justify-center text-white`}>
              <span className="material-symbols-outlined text-3xl">{biller.icon}</span>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1.5 rounded-lg shadow-lg">
            <span className="material-symbols-outlined text-sm">verified</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Paying To</p>
          <h3 className="text-slate-900 dark:text-slate-100 text-2xl font-extrabold tracking-tight">
            {biller.name}
          </h3>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">{biller.category}</p>
        </div>
      </div>

      {/* Details Card */}
      <div className="px-4 pb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">
                  Account Number
                </p>
                <p className="text-slate-900 dark:text-slate-100 text-base font-bold">1234-5678-90</p>
              </div>
              <span className="material-symbols-outlined text-slate-300 cursor-pointer">content_copy</span>
            </div>
            <div className="h-px bg-slate-100 dark:bg-slate-700 w-full" />
            <div className="flex justify-between items-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Payment Amount</p>
              <p className="text-slate-900 dark:text-slate-100 text-base font-bold">
                PHP {amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Convenience Fee</p>
              <p className="text-slate-900 dark:text-slate-100 text-base font-bold">
                PHP {fee.toFixed(2)}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t-2 border-dashed border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <p className="text-slate-900 dark:text-slate-100 text-lg font-bold">Total Amount</p>
                <p className="text-primary text-2xl font-extrabold">
                  PHP {total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
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
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Success Step (Step 3 of 3)                                         */
/* ------------------------------------------------------------------ */

function SuccessStep({
  biller,
  amount,
  fee,
  total,
  accountNumber,
  earnedPoints,
  onGoHome,
  onPayAnother,
}: {
  biller: Biller;
  amount: number;
  fee: number;
  total: number;
  accountNumber: string;
  earnedPoints: number;
  onGoHome: () => void;
  onPayAnother: () => void;
}) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  const refNo = `CBC-${Date.now().toString().slice(-8)}`;
  const [favSaved, setFavSaved] = useState(false);

  function handleSaveFavorite() {
    const saved = saveFavoriteBiller({
      name: biller.name,
      category: biller.category,
      accountNumber,
    });
    setFavSaved(true);
    if (!saved) {
      // Already exists, still show as saved
    }
  }

  function handleDownloadReceipt() {
    downloadReceipt({
      title: "BILL PAYMENT RECEIPT",
      refNo,
      date: dateStr,
      time: timeStr,
      rows: [
        { label: "Biller", value: biller.name },
        { label: "Category", value: biller.category },
        { label: "Account No.", value: accountNumber },
        { label: "Payment Amount", value: `PHP ${amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}` },
        { label: "Convenience Fee", value: `PHP ${fee.toFixed(2)}` },
        ...(earnedPoints > 0 ? [{ label: "Rewards Earned", value: `+${earnedPoints} pts` }] : []),
      ],
      total: { label: "Total Amount", value: `PHP ${total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}` },
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
        <h1 className="text-slate-900 dark:text-slate-100 text-2xl font-extrabold leading-tight text-center">
          Payment Successful
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Your transaction has been processed.
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
        <h2 className="text-slate-900 dark:text-slate-100 tracking-tight text-[40px] font-extrabold leading-tight">
          PHP {amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </h2>
      </div>

      {/* Transaction Details Card */}
      <div className="mx-4 mb-6 p-5 bg-background-light dark:bg-primary/5 rounded-xl border border-slate-200 dark:border-primary/20">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Biller Name
              </p>
              <p className="text-slate-900 dark:text-slate-100 font-bold text-lg">{biller.name}</p>
            </div>
            <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-primary">receipt_long</span>
            </div>
          </div>
          <div className="h-px bg-slate-200 dark:bg-slate-700 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Reference No.
              </p>
              <p className="text-slate-900 dark:text-slate-100 font-medium text-sm">{refNo}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Date & Time
              </p>
              <p className="text-slate-900 dark:text-slate-100 font-medium text-sm">
                {dateStr} | {timeStr}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Save to Favorites */}
      <div className="px-4 mb-8">
        <button
          onClick={handleSaveFavorite}
          disabled={favSaved}
          className={`w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed transition-colors group ${
            favSaved
              ? "border-green-300 bg-green-50 dark:bg-green-900/20 text-green-600 cursor-default"
              : "border-primary/30 text-primary hover:bg-primary/5"
          }`}
        >
          <span className="material-symbols-outlined">
            {favSaved ? "check_circle" : "favorite"}
          </span>
          <span className="font-bold">
            {favSaved ? "Biller Saved to Favorites!" : "Save Biller to Favorites"}
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
          Download Official Receipt
        </button>
      </div>

      {/* Spacer */}
      <div className="grow" />

      {/* Bottom Actions */}
      <div className="p-4 flex flex-col gap-3">
        <button
          onClick={onGoHome}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-lg shadow-primary/20"
        >
          Back to Home
        </button>
        <button
          onClick={onPayAnother}
          className="w-full bg-transparent text-slate-500 dark:text-slate-400 font-bold py-3 text-sm"
        >
          Make Another Payment
        </button>
      </div>

      {/* Branding Footer */}
      <div className="pb-6 text-center">
        <p className="text-slate-400 dark:text-slate-600 text-[10px] uppercase tracking-widest font-bold">
          Member: PDIC. Regulated by BSP.
        </p>
      </div>
    </main>
  );
}
