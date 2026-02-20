import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAuPp8dNmtd8o4sIoykwnuOK2Wa7LceqwCmf8Fs8uZDQ8BHw2pNWNBk3drz9ueneaIy2MDPdrVa_ZQ8-OCN33WErXYoky4U6K46jrpm3Y0kSdA24q3tXR-d8nD-DZRuOm69ia1oQmb6fYd7YvQT7GQLT2_9ZCnU887Bon3Lsv4SzNlJEzz5EYZ05XVWqmVBJ3kosZtCLPwIdi-_Ig4y1QkDHfUFIORP6bq-azes1e3erDVJRMuRXLoZ_7P9OyPCUvUwROJACmKOwrp3";


export const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed. Please try again.");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch {
      setError("Unable to connect. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden max-w-[480px] mx-auto shadow-xl font-display">
      {/* Top Navigation */}
      <div className="flex items-center bg-white dark:bg-background-dark p-4 pb-4 justify-between sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800">

        {/* Logo */}
        <div className="flex-1 flex justify-center pr-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">CBC</span>
            </div>
            <span className="text-primary font-bold text-lg tracking-tight">
              China Bank
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-4 py-4">
        <div
          className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-xl min-h-[180px] relative border border-primary/5"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
          aria-label="Modern high-rise office building"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="relative p-6">
            <h1 className="text-white text-2xl font-bold leading-tight">
              Welcome Back
            </h1>
            <p className="text-white/80 text-sm">
              Secure access to your accounts
            </p>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-5 px-4 py-4 flex-grow"
      >
        {/* Error Banner */}
        {error && (
          <div className="flex items-start gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            <span className="material-symbols-outlined text-base shrink-0 mt-0.5">
              error
            </span>
            {error}
          </div>
        )}
        {/* Username Field */}
        <div className="flex flex-col w-full">
          <label
            htmlFor="username"
            className="text-slate-900 dark:text-slate-100 text-sm font-semibold pb-2 px-1"
          >
            Username / User ID
          </label>
          <div className="relative">
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your ID"
              autoComplete="username"
              className="flex w-full rounded-lg text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 h-14 placeholder:text-slate-400 px-4 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <span className="material-symbols-outlined">person</span>
            </div>
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col w-full">
          <label
            htmlFor="password"
            className="text-slate-900 dark:text-slate-100 text-sm font-semibold pb-2 px-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="flex w-full rounded-lg text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 h-14 placeholder:text-slate-400 px-4 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
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

        {/* Log In Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-xl">
                  progress_activity
                </span>
                Logging in…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-xl">lock_open</span>
                Log In
              </>
            )}
          </button>
        </div>

        {/* Forgot Password */}
        <div className="text-center">
          <a
            href="#"
            className="text-primary font-medium text-sm hover:underline decoration-2 underline-offset-4"
          >
            Forgot Password?
          </a>
        </div>

        {/* Biometric Quick Access */}
        <div className="flex flex-col items-center gap-3 mt-4">
          <button
            type="button"
            className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary cursor-pointer transition-colors"
            aria-label="Quick login with fingerprint"
          >
            <span className="material-symbols-outlined text-3xl">
              fingerprint
            </span>
          </button>
          <p className="text-xs text-slate-500">Quick Login</p>
        </div>
      </form>

      {/* Footer / Enrollment Section */}
      <div className="mt-auto p-6 bg-slate-100 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
          New to China Bank?
        </p>
        <Link
          to="/register"
          className="block w-full bg-white dark:bg-slate-800 border border-primary text-primary font-semibold py-3 rounded-lg hover:bg-primary/5 transition-colors text-center"
        >
          Enroll in Online Banking
        </Link>
        <div className="flex items-center justify-center gap-2 mt-6 text-slate-400 text-xs">
          <span className="material-symbols-outlined text-sm">
            verified_user
          </span>
          <span>Secure 256-bit SSL Encryption</span>
        </div>
      </div>
    </div>
  );
};
