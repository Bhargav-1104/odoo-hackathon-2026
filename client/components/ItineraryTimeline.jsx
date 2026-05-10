export function ItineraryTimeline({ items }) {
  if (!items.length) {
    return (
      <div className="dash-empty dash-empty--activity">
        <p className="dash-empty__muted">No itinerary items yet. Add your first activity below.</p>
      </div>
    );
  }

  const sorted = [...items].sort((a, b) => Number(a.day_number) - Number(b.day_number));

  return (
    <div className="trip-timeline">
      {sorted.map((item) => (
        <article key={item.id || `${item.day_number}-${item.title}`} className="trip-timeline__card">
          <div className="trip-timeline__day">Day {item.day_number || "?"}</div>
          <h3 className="trip-timeline__title">{item.title || "Untitled itinerary item"}</h3>
          <p className="trip-timeline__notes">{item.notes || "No notes added for this stop."}</p>
        </article>
      ))}
    </div>
  );
}
