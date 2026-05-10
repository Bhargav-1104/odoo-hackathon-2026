import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./AuthPage.jsx";
import DashboardPage from "./DashboardPage.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
