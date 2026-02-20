import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout.js";
import { Dashboard } from "./pages/Dashboard.js";
import { Transfer } from "./pages/Transfer.js";
import { PayBills } from "./pages/PayBills.js";
import { BuyLoad } from "./pages/BuyLoad.js";
import { Cards } from "./pages/Cards.js";
import { ApplyCard } from "./pages/ApplyCard.js";
import { Rewards } from "./pages/Rewards.js";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cards" element={<Cards />} />
        </Route>
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/pay-bills" element={<PayBills />} />
        <Route path="/buy-load" element={<BuyLoad />} />
        <Route path="/apply-card" element={<ApplyCard />} />
        <Route path="/rewards" element={<Rewards />} />
      </Routes>
    </BrowserRouter>
  );
};
