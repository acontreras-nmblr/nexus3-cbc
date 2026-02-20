import { useState } from "react";
import { Link } from "react-router-dom";

export const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registration failed. Please try again.");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Unable to connect. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col max-w-[480px] mx-auto shadow-xl font-display items-center justify-center px-8 text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <span className="material-symbols-outlined text-5xl text-green-600 dark:text-green-400">
            check_circle
          </span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Account Registered!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Your account has been registered. Please wait{" "}
            <span className="font-semibold text-primary">3–5 business days</span>{" "}
            for approval.
          </p>
        </div>
        <Link
          to="/"
          className="mt-2 w-full max-w-xs bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors text-center"
        >
          Back to Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col max-w-[480px] mx-auto shadow-xl font-display">
      {/* Header */}
      <header className="bg-white dark:bg-background-dark/50 pt-8 pb-4 px-6 flex flex-col items-center border-b border-primary/10">
        {/* Logo */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">CBC</span>
            </div>
            <span className="text-primary font-bold text-xl tracking-tight">
              China Bank
            </span>
          </div>
        </div>

        {/* Back + Title */}
        <div className="flex items-center w-full">
          <Link
            to="/"
            className="text-slate-900 dark:text-slate-100 hover:text-primary transition-colors"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-xl font-bold flex-1 text-center pr-6">
            Create Your Online Account
          </h1>
        </div>
      </header>

      {/* Main Form */}
      <main className="flex-1 overflow-y-auto px-6 py-8">
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            <span className="material-symbols-outlined text-base shrink-0 mt-0.5">
              error
            </span>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Full Legal Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              placeholder="e.g. Juan Dela Cruz"
              autoComplete="name"
              className="w-full h-12 px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@email.com"
              autoComplete="email"
              className="w-full h-12 px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Phone Number
            </label>
            <div className="flex gap-2">
              <div className="w-24 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium shrink-0">
                +63
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="912 345 6789"
                autoComplete="tel"
                className="flex-1 h-12 px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                className="w-full h-12 px-4 pr-12 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-type password"
                autoComplete="new-password"
                className="w-full h-12 px-4 pr-12 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                <span className="material-symbols-outlined">
                  {showConfirmPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 py-2">
            <div className="flex items-center h-5 mt-0.5">
              <input
                id="agreedToTerms"
                name="agreedToTerms"
                type="checkbox"
                checked={form.agreedToTerms}
                onChange={handleChange}
                className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 focus:ring-primary cursor-pointer accent-primary"
              />
            </div>
            <label
              htmlFor="agreedToTerms"
              className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer"
            >
              I agree to the{" "}
              <a href="#" className="text-primary font-medium underline">
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary font-medium underline">
                Privacy Policy
              </a>
              .
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-xl">
                  progress_activity
                </span>
                Submitting…
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Already have an account?
            <Link to="/" className="text-primary font-bold ml-1">
              Log In
            </Link>
          </p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark px-4 pb-6 pt-3 flex justify-around">
        <Link
          to="/register"
          className="flex flex-col items-center gap-1 text-primary"
        >
          <span className="material-symbols-outlined">person_add</span>
          <span className="text-[10px] font-medium">Register</span>
        </Link>
        <a
          href="#"
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">help</span>
          <span className="text-[10px] font-medium">Support</span>
        </a>
        <a
          href="#"
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">location_on</span>
          <span className="text-[10px] font-medium">Branches</span>
        </a>
        <a
          href="#"
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">more_horiz</span>
          <span className="text-[10px] font-medium">More</span>
        </a>
      </nav>
    </div>
  );
};
