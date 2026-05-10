export function DashboardHeader({
  onOpenSidebar,
  onOpenCreateTrip,
  title = "Dashboard",
  subtitle = "Plan smarter journeys with clarity.",
}) {
  return (
    <header className="dash-header">
      <button
        type="button"
        className="dash-header__menu"
        aria-label="Open menu"
        onClick={onOpenSidebar}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      </button>

      <div className="dash-header__title-wrap">
        <h1 className="dash-header__title">{title}</h1>
        <p className="dash-header__subtitle">{subtitle}</p>
      </div>

      <div className="dash-header__search">
        <label className="dash-search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3-3" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            className="dash-search"
            placeholder="Search trips, cities, notes…"
            aria-label="Search"
          />
        </label>
      </div>

      <div className="dash-header__actions">
        <button type="button" className="dash-icon-btn" aria-label="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" strokeLinejoin="round" />
            <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" />
          </svg>
        </button>
        <span className="dash-avatar" aria-hidden />
        <button type="button" className="dash-btn-primary" onClick={onOpenCreateTrip}>
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden
          >
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          New trip
        </button>
      </div>
    </header>
  );
}
