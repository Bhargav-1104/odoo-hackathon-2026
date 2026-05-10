function TravelIllustration() {
  return (
    <svg
      viewBox="0 0 400 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="auth-mountain" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#1e3a4a" />
          <stop offset="1" stopColor="#0d1824" />
        </linearGradient>
        <linearGradient id="auth-sun" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#3dd4c5" stopOpacity="0.9" />
          <stop offset="1" stopColor="#2563eb" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <circle cx="320" cy="48" r="28" fill="url(#auth-sun)" opacity="0.85" />
      <path
        d="M0 160 L110 72 L180 120 L260 48 L400 96 L400 160 Z"
        fill="url(#auth-mountain)"
        opacity="0.95"
      />
      <path
        d="M0 160 L140 96 L220 132 L320 72 L400 110 L400 160 Z"
        fill="#0f1a28"
        opacity="0.88"
      />
      <path
        d="M0 160 L180 120 L260 140 L340 100 L400 118 L400 160 Z"
        fill="#152433"
        opacity="0.92"
      />
    </svg>
  );
}

export function AuthBrandPanel() {
  return (
    <aside className="auth-brand" aria-label="Traveloop branding">
      <div className="auth-brand__glow" aria-hidden />
      <div className="auth-brand__content">
        <div className="auth-brand__logo">
          <span className="auth-brand__logo-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 3v18M5 12h14M8 8l8 8M16 8l-8 8" strokeLinecap="round" />
            </svg>
          </span>
          Traveloop
        </div>
        <div className="auth-brand__headline">
          <h1>Plan trips that feel effortless.</h1>
          <p>
            Curate routes, stays, and moments in one calm workspace—built for travelers who
            prefer clarity over clutter.
          </p>
        </div>
        <div className="auth-brand__visual">
          <TravelIllustration />
        </div>
      </div>
      <p className="auth-brand__footer">© {new Date().getFullYear()} Traveloop · UI preview</p>
    </aside>
  );
}
