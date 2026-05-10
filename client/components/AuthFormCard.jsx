import { useState } from "react";
import { AuthSubmitButton } from "./AuthSubmitButton.jsx";
import { TextField } from "./TextField.jsx";
import { ValidationSlot } from "./ValidationSlot.jsx";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function AuthFormCard() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  function updateField(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => setLoading(false), 900);
  }

  function switchMode(next) {
    setMode(next);
    setForm(initialForm);
    setLoading(false);
  }

  return (
    <div className="auth-glass">
      <header className="auth-glass__header">
        <h2>{isSignup ? "Create your account" : "Welcome back"}</h2>
        <p>
          {isSignup
            ? "Join Traveloop to organize itineraries and share plans with your crew."
            : "Sign in to pick up where you left off with your next adventure."}
        </p>
      </header>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {isSignup && (
          <TextField
            id="auth-name"
            name="name"
            label="Full name"
            value={form.name}
            onChange={updateField("name")}
            placeholder="Alex Rivera"
            autoComplete="name"
            validationSlot={<ValidationSlot message="" />}
          />
        )}

        <TextField
          id="auth-email"
          name="email"
          type="email"
          label="Email"
          value={form.email}
          onChange={updateField("email")}
          placeholder="you@example.com"
          autoComplete="email"
          validationSlot={<ValidationSlot message="" />}
        />

        <TextField
          id="auth-password"
          name="password"
          type="password"
          label="Password"
          value={form.password}
          onChange={updateField("password")}
          placeholder="••••••••"
          autoComplete={isSignup ? "new-password" : "current-password"}
          validationSlot={<ValidationSlot message="" />}
        />

        {isSignup && (
          <TextField
            id="auth-confirm"
            name="confirmPassword"
            type="password"
            label="Confirm password"
            value={form.confirmPassword}
            onChange={updateField("confirmPassword")}
            placeholder="Repeat password"
            autoComplete="new-password"
            validationSlot={<ValidationSlot message="" />}
          />
        )}

        <AuthSubmitButton loading={loading}>
          {isSignup ? "Create account" : "Sign in"}
        </AuthSubmitButton>

        <div className="auth-toggle-row">
          <span>{isSignup ? "Already have an account?" : "New to Traveloop?"}</span>
          <button
            type="button"
            className="auth-toggle-btn"
            onClick={() => switchMode(isSignup ? "login" : "signup")}
          >
            {isSignup ? "Sign in" : "Create an account"}
          </button>
        </div>
      </form>
    </div>
  );
}
