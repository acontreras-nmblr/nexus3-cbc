import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Step = 1 | 2 | 3;

interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  contactNumber: string;
  email: string;
}

interface LoanDetails {
  loanType: string;
  amount: string;
  term: string;
}

const loanTypes = [
  { value: "personal", label: "Personal Loan" },
  { value: "auto", label: "Auto Loan" },
  { value: "home", label: "Home Loan" },
];

const termOptions = [
  { value: "12", label: "12 months" },
  { value: "24", label: "24 months" },
  { value: "36", label: "36 months" },
  { value: "48", label: "48 months" },
  { value: "60", label: "60 months" },
];

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function Loans() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);

  const [personal, setPersonal] = useState<PersonalInfo>({
    fullName: "",
    dateOfBirth: "",
    contactNumber: "",
    email: "",
  });

  const [loan, setLoan] = useState<LoanDetails>({
    loanType: "personal",
    amount: "",
    term: "12",
  });

  const [refNo] = useState(() => `CBC-${Date.now().toString().slice(-8)}`);

  const loanAmount = parseFloat(loan.amount) || 0;
  const loanTerm = parseInt(loan.term) || 12;
  const monthlyRate = 0.012; // 1.2% monthly interest
  const estimatedMonthly =
    loanAmount > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) /
        (Math.pow(1 + monthlyRate, loanTerm) - 1)
      : 0;

  const canProceedStep1 =
    personal.fullName.trim() !== "" &&
    personal.dateOfBirth !== "" &&
    personal.contactNumber.trim() !== "" &&
    personal.email.trim() !== "";

  const canProceedStep2 = loanAmount >= 50000 && loanAmount <= 2000000;

  function handleBack() {
    if (step === 1) {
      navigate("/");
    } else {
      setStep((s) => (s - 1) as Step);
    }
  }

  function handleNext() {
    if (step === 1 && canProceedStep1) {
      setStep(2);
    } else if (step === 2 && canProceedStep2) {
      setStep(3);
    }
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display text-slate-900 dark:text-slate-100">
      <div className="relative mx-auto flex min-h-screen max-w-[480px] flex-col bg-white dark:bg-background-dark shadow-xl">
        {/* Header */}
        {step < 3 ? (
          <Header title={step === 1 ? "Loan Application" : "Loan Details"} onBack={handleBack} />
        ) : (
          <SuccessHeader onClose={() => navigate("/")} />
        )}

        {/* Progress Bar */}
        <ProgressBar step={step} />

        {/* Step Content */}
        {step === 1 && (
          <StepPersonalInfo personal={personal} onChange={setPersonal} />
        )}
        {step === 2 && (
          <StepLoanDetails
            loan={loan}
            onChange={setLoan}
            estimatedMonthly={estimatedMonthly}
          />
        )}
        {step === 3 && <StepSuccess refNo={refNo} onGoHome={() => navigate("/")} />}

        {/* Bottom Actions */}
        {step < 3 && (
          <div className="fixed bottom-0 z-50 w-full max-w-[480px] border-t border-slate-100 bg-white p-4 pb-8 dark:border-slate-800 dark:bg-background-dark">
            <button
              onClick={handleNext}
              disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
              className="w-full rounded-xl bg-primary py-4 text-base font-bold text-white shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:active:scale-100"
            >
              {step === 1 ? "Next" : "Submit Application"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Headers                                                            */
/* ------------------------------------------------------------------ */

function Header({ title, onBack }: { title: string; onBack: () => void }) {
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
      <div className="w-12" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Progress Bar                                                       */
/* ------------------------------------------------------------------ */

function ProgressBar({ step }: { step: Step }) {
  const pct = step === 1 ? "33%" : step === 2 ? "66%" : "100%";
  const label =
    step === 1
      ? "Personal Information"
      : step === 2
        ? "Loan Details"
        : "Application Submitted";

  return (
    <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-800/50">
      <div className="flex gap-6 justify-between items-center">
        <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold uppercase tracking-wider">
          Step {step} of 3
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
/*  Step 1: Personal Information                                       */
/* ------------------------------------------------------------------ */

function StepPersonalInfo({
  personal,
  onChange,
}: {
  personal: PersonalInfo;
  onChange: React.Dispatch<React.SetStateAction<PersonalInfo>>;
}) {
  function update(patch: Partial<PersonalInfo>) {
    onChange((prev) => ({ ...prev, ...patch }));
  }

  // Use local state for each dropdown so partial selections persist
  const initParts = (() => {
    if (!personal.dateOfBirth) return { m: "", d: "", y: "" };
    const [y, m, d] = personal.dateOfBirth.split("-");
    return { m, d, y };
  })();
  const [dobMonth, setDobMonth] = useState(initParts.m);
  const [dobDay, setDobDay] = useState(initParts.d);
  const [dobYear, setDobYear] = useState(initParts.y);

  function updateDob(part: "month" | "day" | "year", value: string) {
    const m = part === "month" ? value : dobMonth;
    const d = part === "day" ? value : dobDay;
    const y = part === "year" ? value : dobYear;
    if (part === "month") setDobMonth(value);
    if (part === "day") setDobDay(value);
    if (part === "year") setDobYear(value);
    if (m && d && y) {
      update({ dateOfBirth: `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}` });
    }
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => currentYear - 18 - i);
  const daysInMonth = dobMonth && dobYear
    ? new Date(parseInt(dobYear || String(currentYear)), parseInt(dobMonth), 0).getDate()
    : 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const selectClass =
    "flex-1 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 appearance-none";

  return (
    <main className="flex-1 overflow-y-auto pb-32">
      <div className="px-4 py-6 space-y-6">
        {/* Full Name */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Juan Dela Cruz"
            value={personal.fullName}
            onChange={(e) => update({ fullName: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white p-4 text-base text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Date of Birth
          </label>
          <div className="flex gap-3">
            <select
              value={dobMonth}
              onChange={(e) => updateDob("month", e.target.value)}
              className={selectClass}
            >
              <option value="" disabled>Month</option>
              {months.map((m, i) => (
                <option key={m} value={String(i + 1).padStart(2, "0")}>{m}</option>
              ))}
            </select>
            <select
              value={dobDay}
              onChange={(e) => updateDob("day", e.target.value)}
              className={selectClass}
              style={{ maxWidth: "5.5rem" }}
            >
              <option value="" disabled>Day</option>
              {days.map((d) => (
                <option key={d} value={String(d).padStart(2, "0")}>{d}</option>
              ))}
            </select>
            <select
              value={dobYear}
              onChange={(e) => updateDob("year", e.target.value)}
              className={selectClass}
              style={{ maxWidth: "6.5rem" }}
            >
              <option value="" disabled>Year</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact Number */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Contact Number
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-sm font-bold text-slate-400">+63</span>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="9XX XXX XXXX"
              value={personal.contactNumber}
              onChange={(e) => update({ contactNumber: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-14 pr-4 text-base text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@email.com"
            value={personal.email}
            onChange={(e) => update({ email: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white p-4 text-base text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2: Loan Details                                               */
/* ------------------------------------------------------------------ */

function StepLoanDetails({
  loan,
  onChange,
  estimatedMonthly,
}: {
  loan: LoanDetails;
  onChange: React.Dispatch<React.SetStateAction<LoanDetails>>;
  estimatedMonthly: number;
}) {
  function update(patch: Partial<LoanDetails>) {
    onChange((prev) => ({ ...prev, ...patch }));
  }

  const loanAmount = parseFloat(loan.amount) || 0;

  return (
    <main className="flex-1 overflow-y-auto pb-32">
      <div className="px-4 py-6 space-y-6">
        {/* Loan Type */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Loan Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {loanTypes.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => update({ loanType: t.value })}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  loan.loanType === t.value
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-2xl ${
                    loan.loanType === t.value
                      ? "text-primary"
                      : "text-slate-400"
                  }`}
                >
                  {t.value === "personal"
                    ? "person"
                    : t.value === "auto"
                      ? "directions_car"
                      : "home"}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    loan.loanType === t.value
                      ? "text-primary"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Loan Amount */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Loan Amount
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-lg font-bold text-slate-400">PHP</span>
            <input
              type="number"
              step="1000"
              placeholder="0.00"
              value={loan.amount}
              onChange={(e) => update({ amount: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-16 pr-4 text-2xl font-bold text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-300"
            />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-400 text-sm">info</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Min: PHP 50,000 &bull; Max: PHP 2,000,000
            </p>
          </div>
          {loanAmount > 0 && (loanAmount < 50000 || loanAmount > 2000000) && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {loanAmount < 50000
                ? "Amount must be at least PHP 50,000"
                : "Amount must not exceed PHP 2,000,000"}
            </p>
          )}
        </div>

        {/* Payment Term */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Payment Term
          </label>
          <select
            value={loan.term}
            onChange={(e) => update({ term: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-white p-4 text-base text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 appearance-none"
          >
            {termOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Estimated Monthly Payment Card */}
        {loanAmount >= 50000 && loanAmount <= 2000000 && (
          <div className="rounded-xl bg-gradient-to-br from-primary to-[#8b0b20] p-5 text-white shadow-lg shadow-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-white/80">calculate</span>
              <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                Estimated Monthly Payment
              </p>
            </div>
            <p className="text-3xl font-extrabold tracking-tight">
              PHP{" "}
              {estimatedMonthly.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-white/60 text-xs mt-2">
              Based on 1.2% monthly interest rate &bull;{" "}
              {loan.term} months
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3: Success                                                    */
/* ------------------------------------------------------------------ */

function StepSuccess({
  refNo,
  onGoHome,
}: {
  refNo: string;
  onGoHome: () => void;
}) {
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
          Application Submitted
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 text-center px-8">
          Your loan application has been received and is being processed.
        </p>
      </div>

      {/* Details Card */}
      <div className="mx-4 my-6 p-5 bg-background-light dark:bg-primary/5 rounded-xl border border-slate-200 dark:border-primary/20">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Reference Number
            </p>
            <p className="text-slate-900 dark:text-slate-100 font-bold text-lg">{refNo}</p>
          </div>
          <div className="h-px bg-slate-200 dark:bg-slate-700 w-full" />
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary mt-0.5">schedule</span>
            <div>
              <p className="text-slate-900 dark:text-slate-100 font-semibold text-sm">
                Processing Time
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                Your application will be reviewed within 3-5 business days. We'll notify you via email and SMS.
              </p>
            </div>
          </div>
          <div className="h-px bg-slate-200 dark:bg-slate-700 w-full" />
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary mt-0.5">notifications</span>
            <div>
              <p className="text-slate-900 dark:text-slate-100 font-semibold text-sm">
                What's Next?
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                A loan officer will contact you for document verification and approval.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="grow" />

      {/* Bottom Actions */}
      <div className="p-4 flex flex-col gap-3">
        <button
          onClick={onGoHome}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-lg shadow-primary/20"
        >
          Back to Dashboard
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
