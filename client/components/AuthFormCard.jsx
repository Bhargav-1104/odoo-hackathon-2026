import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthSubmitButton } from "./AuthSubmitButton.jsx";
import { TextField } from "./TextField.jsx";
import { ValidationSlot } from "./ValidationSlot.jsx";
import { loginRequest, signupRequest } from "../services/authApi.js";
import { saveAuthToken } from "../utils/authToken.js";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function mapResponseToFieldErrors(status, data) {
  const next = {};
  if (Array.isArray(data?.errors)) {
    for (const err of data.errors) {
      if (err?.field && err?.message) {
        next[err.field] = err.message;
      }
    }
  }
  if (status === 409 && data?.message) {
    next.email = data.message;
  }
  if (status === 401 && data?.message) {
    next.password = data.message;
  }
  if (Object.keys(next).length === 0 && data?.message) {
    next.email = data.message;
  }
  return next;
}

export function AuthFormCard() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const isSignup = mode === "signup";

  function updateField(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setFieldErrors((prev) => {
        if (!prev[field]) return prev;
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});

    if (isSignup && form.password !== form.confirmPassword) {
      setFieldErrors({
        confirmPassword: "Passwords do not match",
      });
      return;
    }

    setLoading(true);
    try {
      if (isSignup) {
        const { ok, status, data } = await signupRequest({
          name: form.name,
          email: form.email,
          password: form.password,
        });
        if (ok && data?.data?.token) {
          saveAuthToken(data.data.token);
          navigate("/dashboard", { replace: true });
          return;
        }
        setFieldErrors(mapResponseToFieldErrors(status, data));
        return;
      }

      const { ok, status, data } = await loginRequest({
        email: form.email,
        password: form.password,
      });
      if (ok && data?.data?.token) {
        saveAuthToken(data.data.token);
        navigate("/dashboard", { replace: true });
        return;
      }
      setFieldErrors(mapResponseToFieldErrors(status, data));
    } catch {
      setFieldErrors({
        email: "Unable to reach the server. Check that it is running and try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  function switchMode(next) {
    setMode(next);
    setForm(initialForm);
    setFieldErrors({});
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
            validationSlot={<ValidationSlot message={fieldErrors.name || ""} />}
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
          validationSlot={<ValidationSlot message={fieldErrors.email || ""} />}
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
          validationSlot={<ValidationSlot message={fieldErrors.password || ""} />}
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
            validationSlot={<ValidationSlot message={fieldErrors.confirmPassword || ""} />}
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
