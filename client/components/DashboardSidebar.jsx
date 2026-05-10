import { NavLink } from "react-router-dom";

function IconDashboard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 13h6V4H4v9zm10 7h6v-9h-6v9zM14 4v5h6V4h-6zM4 20h6v-5H4v5z" strokeLinejoin="round" />
    </svg>
  );
}

function IconMap() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 20l-6-3V4l6 3 6-3 6 3v13l-6 3-6-3z" strokeLinejoin="round" />
      <path d="M9 10l6-3M15 17l-6-3" />
    </svg>
  );
}

function IconCompass() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9.5 10 10l-.5 4.5 4.5-.5.5-4.5z" strokeLinejoin="round" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

export function DashboardSidebar({ onNavigate, onDismiss }) {
  return (
    <div className="dash-sidebar__inner">
      <div className="dash-sidebar__top">
        <div className="dash-sidebar__brand">
          <span className="dash-sidebar__mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 3v18M5 12h14M8 8l8 8M16 8l-8 8" strokeLinecap="round" />
            </svg>
          </span>
          Traveloop
        </div>
        <button
          type="button"
          className="dash-sidebar__close"
          aria-label="Close menu"
          onClick={() => onDismiss?.()}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <nav className="dash-sidebar__nav" aria-label="Primary">
        <div className="dash-nav__label">Plan</div>
        <NavLink
          to="/dashboard"
          end
          onClick={() => onNavigate?.()}
          className={({ isActive }) =>
            `dash-nav__link${isActive ? " dash-nav__link--active" : ""}`
          }
        >
          <IconDashboard />
          Dashboard
        </NavLink>
        <button
          type="button"
          className="dash-nav__link"
          onClick={() => {
            document.getElementById("dash-upcoming")?.scrollIntoView({ behavior: "smooth" });
            onNavigate?.();
          }}
        >
          <IconMap />
          My trips
        </button>
        <button
          type="button"
          className="dash-nav__link"
          onClick={(e) => {
            e.preventDefault();
            onNavigate?.();
          }}
        >
          <IconCompass />
          Explore
        </button>

        <div className="dash-nav__label dash-nav__label--spaced">Workspace</div>
        <button
          type="button"
          className="dash-nav__link"
          onClick={(e) => {
            e.preventDefault();
            onNavigate?.();
          }}
        >
          <IconSettings />
          Settings
        </button>
      </nav>

      <div className="dash-sidebar__footer">Stay organized · Travel lighter</div>
    </div>
  );
}
