function StatSkeleton() {
  return (
    <div className="dash-stat dash-stat--skeleton" aria-hidden>
      <div className="dash-skeleton-line dash-skeleton-line--sm" />
      <div className="dash-skeleton-line dash-skeleton-line--lg" />
      <div className="dash-skeleton-line dash-skeleton-line--md" />
    </div>
  );
}

export function DashboardContentSkeleton() {
  return (
    <div className="dash-content" aria-busy="true" aria-live="polite">
      <div className="dash-welcome dash-skeleton-block">
        <div className="dash-skeleton-line dash-skeleton-line--heading" />
        <div className="dash-skeleton-line dash-skeleton-line--body" />
        <div className="dash-skeleton-line dash-skeleton-line--body-short" />
      </div>

      <div className="dash-stats">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>

      <div className="dash-panels">
        <section className="dash-panel dash-panel--skeleton" aria-hidden>
          <div className="dash-panel__head">
            <div>
              <div className="dash-skeleton-line dash-skeleton-line--title" />
              <div className="dash-skeleton-line dash-skeleton-line--caption" />
            </div>
            <div className="dash-skeleton-pill" />
          </div>
          <div className="dash-skeleton-card" />
          <div className="dash-skeleton-card" />
        </section>

        <section className="dash-panel dash-panel--skeleton" aria-hidden>
          <div className="dash-panel__head">
            <div>
              <div className="dash-skeleton-line dash-skeleton-line--title" />
              <div className="dash-skeleton-line dash-skeleton-line--caption" />
            </div>
          </div>
          <div className="dash-skeleton-activity-row" />
          <div className="dash-skeleton-activity-row" />
          <div className="dash-skeleton-activity-row" />
        </section>
      </div>
    </div>
  );
}
