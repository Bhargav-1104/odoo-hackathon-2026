export function EmptyTripsState({ onCreateTrip }) {
  return (
    <div className="dash-empty dash-empty--trips">
      <div className="dash-empty__icon-wrap" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 22s8-4.5 8-11V5l-8-3-8 3v6c0 6.5 8 11 8 11z" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="dash-empty__title">No trips yet</h3>
      <p className="dash-empty__text">
        Start by sketching your next itinerary—dates, budget, and notes stay in one calm place.
      </p>
      <button type="button" className="dash-btn-primary dash-empty__cta" onClick={onCreateTrip}>
        Create your first trip
      </button>
    </div>
  );
}
