import { NavLink } from "react-router-dom";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-2 pb-6 pt-2 z-50">
      <div className="max-w-md mx-auto flex justify-around items-end">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? "text-primary" : "text-slate-400 dark:text-slate-500"}`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="material-symbols-outlined text-2xl"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                home
              </span>
              <span className="text-[10px] font-bold">Home</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/invest"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? "text-primary" : "text-slate-400 dark:text-slate-500"}`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="material-symbols-outlined text-2xl"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                trending_up
              </span>
              <span className="text-[10px] font-bold">Invest</span>
            </>
          )}
        </NavLink>

        <div className="relative -top-4">
          <button className="size-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center border-4 border-white dark:border-slate-900">
            <span className="material-symbols-outlined text-3xl">qr_code_scanner</span>
          </button>
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 whitespace-nowrap">
            Scan & Pay
          </span>
        </div>

        <NavLink
          to="/cards"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? "text-primary" : "text-slate-400 dark:text-slate-500"}`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="material-symbols-outlined text-2xl"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                credit_card
              </span>
              <span className="text-[10px] font-bold">Cards</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/more"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? "text-primary" : "text-slate-400 dark:text-slate-500"}`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="material-symbols-outlined text-2xl"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                more_horiz
              </span>
              <span className="text-[10px] font-bold">More</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
