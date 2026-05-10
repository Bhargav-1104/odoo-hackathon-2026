function statusLabel(status) {
  if (!status) return "Planning";
  const normalized = String(status).toLowerCase();
  if (normalized === "completed") return "Completed";
  if (normalized === "upcoming") return "Upcoming";
  return "Planning";
}

export function TripHeroSection({ trip, dateRangeLabel, budgetLabel }) {
  const label = statusLabel(trip?.status);
  return (
    <section className="trip-hero">
      <div className={`trip-status-pill trip-status-pill--${label.toLowerCase()}`}>{label}</div>
      <h1 className="trip-hero__title">{trip?.title || "Untitled trip"}</h1>
      <p className="trip-hero__description">{trip?.description || "No description added yet."}</p>
      <div className="trip-hero__meta">
        <div className="trip-hero__meta-item">
          <span>Date range</span>
          <strong>{dateRangeLabel}</strong>
        </div>
        <div className="trip-hero__meta-item">
          <span>Budget</span>
          <strong>{budgetLabel}</strong>
        </div>
      </div>
    </section>
  );
}
