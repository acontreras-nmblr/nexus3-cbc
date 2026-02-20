import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { recordTransfer, saveFavoriteRecipient, downloadReceipt } from "../mockData";

interface TransferForm {
  fromAccount: string;
  toBank: string;
  accountNumber: string;
  amount: string;
  addToFavorites: boolean;
}

const banks = [
  { value: "", label: "Select Bank" },
  { value: "cbc", label: "Chinabank" },
  { value: "bdo", label: "BDO Unibank" },
  { value: "bpi", label: "BPI" },
  { value: "metrobank", label: "Metrobank" },
  { value: "gcash", label: "GCash / G-Xchange" },
  { value: "maya", label: "Maya Philippines" },
];

const accounts = [
  { value: "savings", label: "Savings Account - **** 4592", balance: "45,280.50" },
  { value: "checking", label: "Checking Account - **** 8810", balance: "12,150.00" },
];

const stepLabels = ["Details", "Confirm", "Complete"];

export function Transfer() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<TransferForm>({
    fromAccount: "savings",
    toBank: "",
    accountNumber: "",
    amount: "",
    addToFavorites: false,
  });
  const [favoriteNickname, setFavoriteNickname] = useState("");

  const selectedAccount = accounts.find((a) => a.value === form.fromAccount);
  const selectedBank = banks.find((b) => b.value === form.toBank);

  const canProceed =
    form.toBank !== "" && form.accountNumber !== "" && form.amount !== "" && parseFloat(form.amount) > 0;

  function handleNext() {
    if (step === 1 && canProceed) {
      setStep(2);
    } else if (step === 2) {
      const amount = parseFloat(form.amount) || 0;
      const fee = form.toBank === "cbc" ? 0 : 15;
      const bankLabel = selectedBank?.label ?? form.toBank;
      recordTransfer(bankLabel, amount, fee);
      setStep(3);
    }
  }

  function handleBack() {
    if (step === 2) {
      setStep(1);
    } else if (step === 1) {
      navigate("/");
    }
  }

  function handleDownloadTransferReceipt() {
    const amount = parseFloat(form.amount) || 0;
    const fee = form.toBank === "cbc" ? 0 : 15;
    const total = amount + fee;
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
    const refNo = `CB-${Date.now().toString().slice(-9)}`;

    downloadReceipt({
      title: "FUND TRANSFER RECEIPT",
      refNo,
      date: dateStr,
      time: timeStr,
      rows: [
        { label: "Recipient Bank", value: selectedBank?.label ?? form.toBank },
        { label: "Account No.", value: form.accountNumber },
        { label: "Transfer Amount", value: `PHP ${amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}` },
        { label: "Service Fee", value: `PHP ${fee.toFixed(2)}` },
      ],
      total: { label: "Total Amount", value: `PHP ${total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}` },
    });
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display">
      <div className="relative mx-auto flex min-h-screen max-w-[480px] flex-col bg-white dark:bg-background-dark shadow-xl">
        {/* Header */}
        {step < 3 ? (
          <TransferHeader onBack={handleBack} />
        ) : (
          <SuccessHeader onClose={() => navigate("/")} />
        )}

        {/* Progress Indicator */}
        <ProgressBar step={step} />

        {/* Step Content */}
        {step === 1 && (
          <StepDetails
            form={form}
            accounts={accounts}
            selectedAccount={selectedAccount}
            onFormChange={setForm}
          />
        )}
        {step === 2 && (
          <StepConfirm
            form={form}
            selectedAccount={selectedAccount}
            selectedBank={selectedBank}
          />
        )}
        {step === 3 && (
          <StepSuccess
            form={form}
            selectedBank={selectedBank}
            favoriteNickname={favoriteNickname}
            onFavoriteNicknameChange={setFavoriteNickname}
            onToggleFavorite={(checked) => setForm((f) => ({ ...f, addToFavorites: checked }))}
            addToFavorites={form.addToFavorites}
          />
        )}

        {/* Bottom Actions */}
        {step === 1 && (
          <div className="fixed bottom-0 z-50 w-full max-w-[480px] border-t border-slate-100 bg-white p-4 pb-8 dark:border-slate-800 dark:bg-background-dark">
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="w-full rounded-xl bg-primary py-4 text-base font-bold text-white shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:active:scale-100"
            >
              Next
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="fixed bottom-0 z-50 w-full max-w-[480px] border-t border-slate-100 bg-white p-4 pb-8 dark:border-slate-800 dark:bg-background-dark">
            <button
              onClick={handleNext}
              className="w-full rounded-xl bg-primary py-4 text-base font-bold text-white shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
            >
              Confirm Transfer
            </button>
          </div>
        )}
        {step === 3 && (
          <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[480px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 pb-8 flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                onClick={handleDownloadTransferReceipt}
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <span className="material-symbols-outlined text-xl">download</span>
                Download Receipt
              </button>
              <button
                onClick={() => {
                  const amount = parseFloat(form.amount) || 0;
                  const text = `I transferred PHP ${amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })} to ${selectedBank?.label ?? form.toBank} (${form.accountNumber}) via Chinabank.`;
                  if (navigator.share) {
                    navigator.share({ title: "Transfer Receipt", text });
                  } else {
                    navigator.clipboard.writeText(text);
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <span className="material-symbols-outlined text-xl">share</span>
                Share
              </button>
            </div>
            <button
              onClick={() => navigate("/")}
              className="w-full h-12 rounded-lg bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 transition-transform active:scale-95"
            >
              Back to Home
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function TransferHeader({ onBack }: { onBack: () => void }) {
  return (
    <header className="sticky top-0 z-50 flex items-center bg-white dark:bg-background-dark px-4 py-4 border-b border-slate-100 dark:border-slate-800">
      <button
        onClick={onBack}
        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>
      <div className="ml-2 flex-1">
        <img alt="Chinabank Logo" className="h-8 w-auto object-contain" src="/chinabank-logo.png" />
      </div>
      <button className="flex h-10 w-10 items-center justify-center rounded-full text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        <span className="material-symbols-outlined">help_outline</span>
      </button>
    </header>
  );
}

function SuccessHeader({ onClose }: { onClose: () => void }) {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="w-10">
          <span
            onClick={onClose}
            className="material-symbols-outlined text-slate-600 dark:text-slate-400 cursor-pointer"
          >
            close
          </span>
        </div>
        <img alt="Chinabank Logo" className="h-6 w-auto object-contain" src="/chinabank-logo.png" />
        <div className="w-10" />
      </div>
    </header>
  );
}

function ProgressBar({ step }: { step: number }) {
  const label =
    step === 3
      ? "Transfer Complete"
      : `Step ${step} of 3: ${stepLabels[step - 1]}`;

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-primary">{label}</p>
        {step < 3 && (
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-8 rounded-full ${s <= step ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"}`}
              />
            ))}
          </div>
        )}
        {step === 3 && (
          <span className="text-xs font-medium text-slate-500">Step 3 of 3</span>
        )}
      </div>
      {step === 3 && (
        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-primary w-full rounded-full" />
        </div>
      )}
    </div>
  );
}

/* ---------- Step 1: Details ---------- */

function StepDetails({
  form,
  accounts,
  selectedAccount,
  onFormChange,
}: {
  form: TransferForm;
  accounts: { value: string; label: string; balance: string }[];
  selectedAccount: { value: string; label: string; balance: string } | undefined;
  onFormChange: React.Dispatch<React.SetStateAction<TransferForm>>;
}) {
  function update(patch: Partial<TransferForm>) {
    onFormChange((prev) => ({ ...prev, ...patch }));
  }

  return (
    <main className="flex-1 overflow-y-auto pb-32">
      {/* From Account */}
      <section className="px-4 py-2">
        <label className="mb-3 block text-sm font-bold text-slate-900 dark:text-slate-100">
          From Account
        </label>
        <div className="relative">
          <select
            value={form.fromAccount}
            onChange={(e) => update({ fromAccount: e.target.value })}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 p-4 pr-10 text-base font-medium text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {accounts.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
            <span className="material-symbols-outlined">expand_more</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Available Balance:{" "}
          <span className="font-bold text-slate-700 dark:text-slate-200">
            PHP {selectedAccount?.balance ?? "—"}
          </span>
        </p>
      </section>

      <div className="my-4 h-2 bg-slate-50 dark:bg-slate-900" />

      {/* Destination Details */}
      <section className="px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-bold text-slate-900 dark:text-slate-100">
            To Bank / Recipient
          </label>
          <button className="flex items-center gap-1 text-xs font-bold text-primary">
            <span className="material-symbols-outlined text-sm">star</span>
            Favorites
          </button>
        </div>

        {/* Bank Dropdown */}
        <div className="mb-4 relative">
          <select
            value={form.toBank}
            onChange={(e) => update({ toBank: e.target.value })}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white p-4 pr-10 text-base text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {banks.map((b) => (
              <option key={b.value} value={b.value} disabled={b.value === ""}>
                {b.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
            <span className="material-symbols-outlined">account_balance</span>
          </div>
        </div>

        {/* Account Number */}
        <div className="mb-4">
          <label className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">
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
        <div className="mb-6">
          <label className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">
            Amount
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
              Transfer fee: <span className="font-bold">PHP 15.00</span> (InstaPay). Funds will be
              credited instantly.
            </p>
          </div>
        </div>

        {/* Add to Favorites */}
        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined">grade</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Add to Favorites</p>
              <p className="text-xs text-slate-500">Save this account for next time</p>
            </div>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={form.addToFavorites}
              onChange={(e) => update({ addToFavorites: e.target.checked })}
            />
            <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-slate-700" />
          </label>
        </div>
      </section>
    </main>
  );
}

/* ---------- Step 2: Confirm ---------- */

function StepConfirm({
  form,
  selectedAccount,
  selectedBank,
}: {
  form: TransferForm;
  selectedAccount: { value: string; label: string; balance: string } | undefined;
  selectedBank: { value: string; label: string } | undefined;
}) {
  const amount = parseFloat(form.amount) || 0;
  const fee = form.toBank === "cbc" ? 0 : 15;
  const total = amount + fee;

  return (
    <main className="flex-1 overflow-y-auto pb-32">
      <div className="px-4 py-2">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
          Review Transfer
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Please confirm the details below before proceeding.
        </p>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-5">
          <div className="flex justify-between items-start">
            <span className="text-sm text-slate-500">From</span>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {selectedAccount?.label}
              </p>
              <p className="text-xs text-slate-500">
                Balance: PHP {selectedAccount?.balance}
              </p>
            </div>
          </div>

          <div className="border-t border-dashed border-slate-200 dark:border-slate-700" />

          <div className="flex justify-between items-start">
            <span className="text-sm text-slate-500">To</span>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {selectedBank?.label}
              </p>
              <p className="text-xs text-slate-500">{form.accountNumber}</p>
            </div>
          </div>

          <div className="border-t border-dashed border-slate-200 dark:border-slate-700" />

          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Amount</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              PHP {amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Service Fee</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              PHP {fee.toFixed(2)}
            </span>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700" />

          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-900 dark:text-white">Total</span>
            <span className="text-lg font-extrabold text-primary">
              PHP {total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/5 p-3 dark:bg-primary/10">
          <span className="material-symbols-outlined text-primary text-sm">info</span>
          <p className="text-[11px] leading-tight text-slate-600 dark:text-slate-400">
            By proceeding, you agree that the transfer details are correct. This action cannot be
            undone.
          </p>
        </div>
      </div>
    </main>
  );
}

/* ---------- Step 3: Success ---------- */

function StepSuccess({
  form,
  selectedBank,
  favoriteNickname,
  onFavoriteNicknameChange,
  onToggleFavorite,
  addToFavorites,
}: {
  form: TransferForm;
  selectedBank: { value: string; label: string } | undefined;
  favoriteNickname: string;
  onFavoriteNicknameChange: (v: string) => void;
  onToggleFavorite: (checked: boolean) => void;
  addToFavorites: boolean;
}) {
  const amount = parseFloat(form.amount) || 0;
  const fee = form.toBank === "cbc" ? 0 : 15;
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const refNo = `CB-${Date.now().toString().slice(-9)}`;
  const [favSaved, setFavSaved] = useState(false);

  function handleToggleFavorite(checked: boolean) {
    onToggleFavorite(checked);
    if (checked && selectedBank) {
      saveFavoriteRecipient({
        bankValue: form.toBank,
        bankLabel: selectedBank.label,
        accountNumber: form.accountNumber,
        nickname: favoriteNickname,
      });
      setFavSaved(true);
    }
  }

  function handleSaveFavoriteWithNickname() {
    if (selectedBank) {
      saveFavoriteRecipient({
        bankValue: form.toBank,
        bankLabel: selectedBank.label,
        accountNumber: form.accountNumber,
        nickname: favoriteNickname,
      });
      setFavSaved(true);
    }
  }

  return (
    <main className="flex-1 overflow-y-auto pb-48">
      {/* Success Icon */}
      <div
        className="relative py-10 flex flex-col items-center"
        style={{
          background: "radial-gradient(circle at center, rgba(46,125,50,0.1) 0%, transparent 70%)",
        }}
      >
        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-6 rounded-full mb-4">
          <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 !text-6xl">
            check_circle
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Transfer Successful!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Your funds have been sent</p>
      </div>

      {/* Transaction Details Card */}
      <div className="px-4 -mt-2">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5">
          <div className="text-center mb-6 pb-6 border-b border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-1">
              Amount Transferred
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              PHP {amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-sm text-slate-500">Recipient</span>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedBank?.label}
                </p>
                <p className="text-xs text-slate-500">{form.accountNumber}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Reference No.</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-medium text-slate-900 dark:text-white">
                  {refNo}
                </span>
                <span
                  className="material-symbols-outlined text-primary text-lg cursor-pointer"
                  onClick={() => navigator.clipboard.writeText(refNo)}
                >
                  content_copy
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Date & Time</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {dateStr} &bull; {timeStr}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Service Fee</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                PHP {fee.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add to Favorites */}
      <div className="px-4 mt-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${favSaved ? "bg-green-100 dark:bg-green-900/30" : "bg-primary/10"}`}>
                <span className={`material-symbols-outlined ${favSaved ? "text-green-600" : "text-primary"}`}>
                  {favSaved ? "check_circle" : "favorite"}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {favSaved ? "Saved to Favorites!" : "Add to Favorites"}
                </p>
                <p className="text-xs text-slate-500">
                  {favSaved ? "You can find this in your favorites" : "Save for faster future transfers"}
                </p>
              </div>
            </div>
            {!favSaved && (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={addToFavorites}
                  onChange={(e) => handleToggleFavorite(e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
              </label>
            )}
          </div>
          {addToFavorites && !favSaved && (
            <div className="px-4 pb-4 pt-0 flex gap-2">
              <input
                type="text"
                className="flex-1 bg-background-light dark:bg-slate-800 border-none rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="Set a nickname (e.g. Rent, Mom)"
                value={favoriteNickname}
                onChange={(e) => onFavoriteNicknameChange(e.target.value)}
              />
              <button
                onClick={handleSaveFavoriteWithNickname}
                className="bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-lg"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Promo Banner */}
      <div className="px-4 mt-6">
        <div className="rounded-xl overflow-hidden h-24 bg-slate-800 relative flex items-center p-4">
          <div className="z-10 w-2/3">
            <p className="text-white text-xs font-bold uppercase opacity-80 mb-1">Did you know?</p>
            <p className="text-white text-sm font-medium">
              You can now schedule recurring transfers to your favorites.
            </p>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-primary/20 rounded-l-full" />
        </div>
      </div>
    </main>
  );
}
