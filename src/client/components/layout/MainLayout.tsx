import { Outlet } from "react-router-dom";
import { Header } from "../Header.js";
import { BottomNav } from "../BottomNav.js";

export function MainLayout() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <Header />
      <Outlet />
      <BottomNav />
    </div>
  );
}
