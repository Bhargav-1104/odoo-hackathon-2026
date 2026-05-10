export function StatCard({ label, value, hint }) {
  return (
    <article className="dash-stat">
      <div className="dash-stat__label">{label}</div>
      <div className="dash-stat__value">{value}</div>
      {hint ? <div className="dash-stat__hint">{hint}</div> : null}
    </article>
  );
}
