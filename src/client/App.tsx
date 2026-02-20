import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout.js";
import { Dashboard } from "./pages/Dashboard.js";
import { Transfer } from "./pages/Transfer.js";
import { PayBills } from "./pages/PayBills.js";
import { BuyLoad } from "./pages/BuyLoad.js";
import { Cards } from "./pages/Cards.js";
import { ApplyCard } from "./pages/ApplyCard.js";
import { Rewards } from "./pages/Rewards.js";
import { Loans } from "./pages/Loans.js";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cards" element={<Cards />} />
        </Route>
        <Route path="/transfer" element={<RequireAuth><Transfer /></RequireAuth>} />
        <Route path="/pay-bills" element={<RequireAuth><PayBills /></RequireAuth>} />
        <Route path="/buy-load" element={<RequireAuth><BuyLoad /></RequireAuth>} />
        <Route path="/apply-card" element={<RequireAuth><ApplyCard /></RequireAuth>} />
        <Route path="/rewards" element={<RequireAuth><Rewards /></RequireAuth>} />
        <Route path="/loans" element={<RequireAuth><Loans /></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
};
