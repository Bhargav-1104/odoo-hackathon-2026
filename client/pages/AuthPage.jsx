import "../styles/auth.css";
import { AuthBrandPanel } from "../components/AuthBrandPanel.jsx";
import { AuthFormCard } from "../components/AuthFormCard.jsx";

export default function AuthPage() {
  return (
    <div className="auth-page">
      <div className="auth-shell">
        <AuthBrandPanel />
        <div className="auth-form-region">
          <AuthFormCard />
        </div>
      </div>
    </div>
  );
}
