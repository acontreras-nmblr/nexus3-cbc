export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2">
        <img
          alt="Chinabank Logo"
          className="h-10 w-auto object-contain"
          src="/chinabank-logo.png"
        />
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <span className="material-symbols-outlined text-2xl">notifications</span>
          <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-white dark:border-background-dark" />
        </button>
        <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-2 border-primary/20">
          <div className="w-full h-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-xl">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
