export function EmptyTripsState({ onCreateTrip }) {
  return (
    <div className="dash-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M12 22s8-4.5 8-11V5l-8-3-8 3v6c0 6.5 8 11 8 11z" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h3>No trips yet</h3>
      <p>
        Start by sketching your next itinerary—dates, budget, and notes stay in one calm place.
      </p>
      <button type="button" className="dash-btn-primary" onClick={onCreateTrip}>
        Create your first trip
      </button>
    </div>
  );
}
