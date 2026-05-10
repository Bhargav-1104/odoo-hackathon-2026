function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" strokeLinecap="round" />
    </svg>
  );
}

function IconWallet() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M20 12V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-4" />
      <path d="M18 12h.01" strokeLinecap="round" />
    </svg>
  );
}

export function TripCard({ title, dateRangeLabel, budgetLabel }) {
  return (
    <article className="dash-trip-card">
      <h3 className="dash-trip-card__title">{title}</h3>
      <div className="dash-trip-card__meta">
        <span className="dash-trip-card__badge">
          <IconCalendar />
          {dateRangeLabel}
        </span>
        <span className="dash-trip-card__badge">
          <IconWallet />
          {budgetLabel}
        </span>
      </div>
    </article>
  );
}
