import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PersonalInfo {
  fullName: string;
  dob: string;
  phone: string;
  email: string;
}

interface EmploymentInfo {
  employmentStatus: string;
  companyName: string;
  monthlyIncome: string;
  sourceOfFunds: string;
}

type Step = 1 | 2 | 3;

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function ApplyCard() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [personal, setPersonal] = useState<PersonalInfo>({
    fullName: "",
    dob: "",
    phone: "",
    email: "",
  });
  const [employment, setEmployment] = useState<EmploymentInfo>({
    employmentStatus: "",
    companyName: "",
    monthlyIncome: "",
    sourceOfFunds: "",
  });

  const refNo = `CB-${Date.now().toString().slice(-8)}`;

  const canProceedStep1 =
    personal.fullName !== "" && personal.dob !== "" && personal.phone !== "" && personal.email !== "";
  const canProceedStep2 =
    employment.employmentStatus !== "" && employment.monthlyIncome !== "";

  function handleBack() {
    if (step === 2) setStep(1);
    else navigate(-1);
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-slate-100 font-display">
      <div className="relative flex min-h-screen w-full max-w-md mx-auto flex-col bg-white dark:bg-background-dark shadow-xl overflow-x-hidden">
        {/* Header */}
        {step < 3 ? (
          <ApplicationHeader onBack={handleBack} />
        ) : (
          <SuccessHeader onClose={() => navigate("/")} />
        )}

        {/* Progress (steps 1 & 2 only) */}
        {step < 3 && <ProgressSection step={step as 1 | 2} />}

        {/* Step content */}
        {step === 1 && (
          <Step1Personal personal={personal} onChange={setPersonal} />
        )}
        {step === 2 && (
          <Step2Employment employment={employment} onChange={setEmployment} />
        )}
        {step === 3 && (
          <Step3Success
            refNo={refNo}
            onGoHome={() => navigate("/")}
            onApplyAnother={() => {
              setStep(1);
              setPersonal({ fullName: "", dob: "", phone: "", email: "" });
              setEmployment({ employmentStatus: "", companyName: "", monthlyIncome: "", sourceOfFunds: "" });
            }}
          />
        )}

        {/* Bottom action (steps 1 & 2) */}
        {step === 1 && (
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-20">
            <button
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              Continue to Next Step
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-20">
            <button
              onClick={() => setStep(3)}
              disabled={!canProceedStep2}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              Submit Application
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
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

function ApplicationHeader({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex items-center bg-white dark:bg-background-dark p-4 border-b border-slate-100 dark:border-slate-800 justify-between sticky top-0 z-10">
      <button
        onClick={onBack}
        className="text-primary flex size-10 shrink-0 items-center justify-center cursor-pointer"
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>
      <div className="flex-1 flex justify-center">
        <img alt="Chinabank Logo" className="h-8 object-contain" src="/chinabank-logo.png" />
      </div>
      <div className="size-10" />
    </div>
  );
}

function SuccessHeader({ onClose }: { onClose: () => void }) {
  return (
    <header className="w-full bg-white dark:bg-background-dark/50 border-b border-primary/10 py-4 px-6 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <img alt="Chinabank Logo" className="h-8" src="/chinabank-logo.png" />
      </div>
      <button onClick={onClose} className="text-slate-500 hover:text-primary transition-colors">
        <span className="material-symbols-outlined">close</span>
      </button>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Progress Section                                                   */
/* ------------------------------------------------------------------ */

function ProgressSection({ step }: { step: 1 | 2 }) {
  const pct = step === 1 ? 33 : 66;
  const title = step === 1 ? "Personal Information" : "Employment Details";

  return (
    <div className="flex flex-col gap-3 p-6 bg-slate-50/50 dark:bg-primary/5">
      <div className="flex gap-6 justify-between items-end">
        <div>
          <h2 className="text-lg font-bold leading-tight tracking-tight">{title}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
            Step {step} of 3
          </p>
        </div>
        <p className="text-primary text-sm font-bold leading-normal">{pct}% Complete</p>
      </div>
      <div className="rounded-full bg-primary/10 h-2 w-full overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 1 – Personal Information                                      */
/* ------------------------------------------------------------------ */

function Step1Personal({
  personal,
  onChange,
}: {
  personal: PersonalInfo;
  onChange: React.Dispatch<React.SetStateAction<PersonalInfo>>;
}) {
  function update(patch: Partial<PersonalInfo>) {
    onChange((prev) => ({ ...prev, ...patch }));
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="px-6 pt-6 pb-2">
        <h3 className="tracking-tight text-2xl font-extrabold leading-tight">
          Apply for a Chinabank Credit Card
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed mt-2">
          Let's start with your basic information to begin your application.
        </p>
      </div>

      <div className="flex flex-col gap-5 p-6 pb-28">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-xl">
              person
            </span>
            <input
              type="text"
              value={personal.fullName}
              onChange={(e) => update({ fullName: e.target.value })}
              placeholder="Enter your full name as per ID"
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date of Birth</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-xl">
              calendar_today
            </span>
            <input
              type="date"
              value={personal.dob}
              onChange={(e) => update({ dob: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
            />
          </div>
        </div>

        {/* Contact Number */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Number</label>
          <div className="relative flex">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-xl z-10">
              call
            </span>
            <div className="flex w-full">
              <span className="inline-flex items-center px-3 pl-10 rounded-l-lg border border-r-0 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-500 text-sm font-medium">
                +63
              </span>
              <input
                type="tel"
                value={personal.phone}
                onChange={(e) => update({ phone: e.target.value })}
                placeholder="9XX XXX XXXX"
                className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-r-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1 italic">We'll use this for OTP verification.</p>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-xl">
              mail
            </span>
            <input
              type="email"
              value={personal.email}
              onChange={(e) => update({ email: e.target.value })}
              placeholder="example@email.com"
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
            />
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/10 flex gap-3">
          <span className="material-symbols-outlined text-primary text-xl shrink-0">info</span>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            By proceeding, you agree to Chinabank's Privacy Policy and consent to the collection of
            your data for credit assessment.
          </p>
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2 – Employment Details                                        */
/* ------------------------------------------------------------------ */

const employmentStatuses = [
  { value: "", label: "Select status" },
  { value: "employed", label: "Employed" },
  { value: "self-employed", label: "Self-Employed / Business Owner" },
  { value: "freelancer", label: "Freelancer" },
  { value: "ofw", label: "OFW" },
  { value: "retired", label: "Retired" },
];

const fundSources = [
  { value: "", label: "Select source" },
  { value: "salary", label: "Salary / Wages" },
  { value: "business", label: "Business Income" },
  { value: "remittance", label: "Remittance" },
  { value: "investments", label: "Investments" },
  { value: "pension", label: "Pension" },
];

function Step2Employment({
  employment,
  onChange,
}: {
  employment: EmploymentInfo;
  onChange: React.Dispatch<React.SetStateAction<EmploymentInfo>>;
}) {
  function update(patch: Partial<EmploymentInfo>) {
    onChange((prev) => ({ ...prev, ...patch }));
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="px-6 pt-6 pb-2">
        <h3 className="tracking-tight text-2xl font-extrabold leading-tight">
          Employment & Financial Info
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed mt-2">
          Help us understand your financial profile for the credit assessment.
        </p>
      </div>

      <div className="flex flex-col gap-5 p-6 pb-28">
        {/* Employment Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Employment Status
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-xl">
              work
            </span>
            <select
              value={employment.employmentStatus}
              onChange={(e) => update({ employmentStatus: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none appearance-none"
            >
              {employmentStatuses.map((s) => (
                <option key={s.value} value={s.value} disabled={s.value === ""}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Company Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Company / Business Name
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-xl">
              apartment
            </span>
            <input
              type="text"
              value={employment.companyName}
              onChange={(e) => update({ companyName: e.target.value })}
              placeholder="Enter company or business name"
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
            />
          </div>
        </div>

        {/* Monthly Income */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Monthly Income
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
              PHP
            </span>
            <input
              type="number"
              value={employment.monthlyIncome}
              onChange={(e) => update({ monthlyIncome: e.target.value })}
              placeholder="0.00"
              className="w-full pl-14 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
            />
          </div>
        </div>

        {/* Source of Funds */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Primary Source of Funds
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-xl">
              account_balance
            </span>
            <select
              value={employment.sourceOfFunds}
              onChange={(e) => update({ sourceOfFunds: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none appearance-none"
            >
              {fundSources.map((s) => (
                <option key={s.value} value={s.value} disabled={s.value === ""}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/10 flex gap-3">
          <span className="material-symbols-outlined text-primary text-xl shrink-0">info</span>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Your financial information will be used solely for credit assessment purposes and handled
            in accordance with Chinabank's data privacy policy.
          </p>
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3 – Success                                                   */
/* ------------------------------------------------------------------ */

function Step3Success({
  refNo,
  onGoHome,
  onApplyAnother,
}: {
  refNo: string;
  onGoHome: () => void;
  onApplyAnother: () => void;
}) {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 max-w-2xl mx-auto w-full">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
        <span className="material-symbols-outlined text-primary text-6xl">check_circle</span>
      </div>

      <div className="text-center space-y-4 mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight">Application Submitted Successfully</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md mx-auto">
          Thank you for choosing Chinabank. We have received your credit card application and our
          team is currently reviewing it.
        </p>
      </div>

      {/* Reference Number */}
      <div className="w-full bg-white dark:bg-slate-800/50 rounded-xl p-6 shadow-sm border border-primary/10 mb-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Reference Number
            </p>
            <p className="text-2xl font-bold text-primary mt-1">{refNo}</p>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(refNo)}
            className="flex items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10 text-primary font-semibold py-2 px-4 rounded-lg transition-colors border border-primary/20"
          >
            <span className="material-symbols-outlined text-sm">content_copy</span>
            <span>Copy ID</span>
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 gap-4 w-full mb-12">
        <div className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/30">
          <div className="text-primary">
            <span className="material-symbols-outlined">mail</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Email Confirmation</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              A copy of your application details has been sent to your registered email.
            </p>
          </div>
        </div>
        <div className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/30">
          <div className="text-primary">
            <span className="material-symbols-outlined">schedule</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Processing Time</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Our team will complete the verification within 3 to 5 business days.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full flex flex-col gap-4">
        <button
          onClick={onGoHome}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-lg text-lg transition-transform active:scale-[0.98] shadow-lg shadow-primary/20"
        >
          Back to Dashboard
        </button>
        <button
          onClick={onApplyAnother}
          className="w-full bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold py-3 px-8 rounded-lg transition-colors"
        >
          Apply for another card
        </button>
      </div>

      {/* Footer */}
      <div className="w-full pt-8 mt-8 text-center border-t border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 text-sm">
          Please keep your reference number for any inquiries.
          <br />
          For assistance, contact our 24/7 hotline at (02) 888-55-888.
        </p>
      </div>
    </main>
  );
}
