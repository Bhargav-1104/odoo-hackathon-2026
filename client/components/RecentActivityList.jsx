export function RecentActivityList({ items }) {
  if (!items.length) {
    return (
      <div className="dash-empty dash-empty--activity" role="status">
        <p className="dash-empty__muted">
          No recent activity yet. Creating or updating trips will show up here.
        </p>
      </div>
    );
  }

  return (
    <ul className="dash-activity">
      {items.map((item) => (
        <li key={item.id} className="dash-activity__item">
          <span className="dash-activity__dot" aria-hidden />
          <div>
            <div className="dash-activity__text">{item.text}</div>
            <div className="dash-activity__time">{item.timeLabel}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
