import { useEffect, useMemo, useState } from "react";
import "../styles/auth.css";
import "../styles/dashboard.css";
import { CreateTripModal } from "../components/CreateTripModal.jsx";
import { DashboardContentSkeleton } from "../components/DashboardContentSkeleton.jsx";
import { DashboardHeader } from "../components/DashboardHeader.jsx";
import { DashboardShell } from "../components/DashboardShell.jsx";
import { DashboardSidebar } from "../components/DashboardSidebar.jsx";
import { EmptyTripsState } from "../components/EmptyTripsState.jsx";
import { RecentActivityList } from "../components/RecentActivityList.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { TripCard } from "../components/TripCard.jsx";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function formatMoney(amount) {
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatTripRange(startDate, endDate) {
  if (!startDate && !endDate) return "Dates TBD";
  const opts = { month: "short", day: "numeric", year: "numeric" };
  try {
    if (startDate && endDate) {
      const a = new Date(`${startDate}T12:00:00`);
      const b = new Date(`${endDate}T12:00:00`);
      return `${a.toLocaleDateString(undefined, opts)} – ${b.toLocaleDateString(undefined, opts)}`;
    }
    const one = new Date(`${startDate || endDate}T12:00:00`);
    return one.toLocaleDateString(undefined, opts);
  } catch {
    return "Dates TBD";
  }
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const start = new Date(`${dateStr}T12:00:00`);
  const startDay = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((startDay - today) / (24 * 60 * 60 * 1000));
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [trips, setTrips] = useState([]);
  const [activities, setActivities] = useState([]);
  const [layoutReady, setLayoutReady] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const id = window.setTimeout(() => setLayoutReady(true), 380);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!sidebarOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [sidebarOpen]);

  const stats = useMemo(() => {
    const today = todayIso();
    const upcoming = trips.filter((t) => !t.endDate || t.endDate >= today);
    const budgetSum = trips.reduce((sum, t) => sum + (Number.isFinite(t.budget) ? t.budget : 0), 0);

    let nextDays = null;
    const futureStarts = trips
      .map((t) => ({ id: t.id, d: daysUntil(t.startDate) }))
      .filter((x) => x.d !== null && x.d >= 0)
      .sort((a, b) => a.d - b.d);
    if (futureStarts.length) nextDays = futureStarts[0].d;

    return {
      totalTrips: trips.length,
      upcomingTrips: upcoming.length,
      budgetPlanned: budgetSum,
      nextTripDays: nextDays,
    };
  }, [trips]);

  const upcomingSorted = useMemo(() => {
    const today = todayIso();
    return [...trips]
      .filter((t) => !t.endDate || t.endDate >= today)
      .sort((a, b) => String(a.startDate).localeCompare(String(b.startDate)));
  }, [trips]);

  function handleTripCreated(payload) {
    const budget = Number.parseFloat(payload.budget);
    const trip = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now()),
      title: payload.title || "Untitled trip",
      description: payload.description,
      startDate: payload.startDate,
      endDate: payload.endDate,
      budget: Number.isFinite(budget) ? budget : 0,
    };

    setTrips((prev) => [trip, ...prev]);
    setActivities((prev) => [
      {
        id: `${trip.id}-activity`,
        text: `Created “${trip.title}”`,
        timeLabel: new Date().toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      },
      ...prev,
    ]);
  }

  return (
    <div className="dash-root">
      <DashboardShell
        sidebarOpen={sidebarOpen}
        onCloseSidebar={closeSidebar}
        sidebar={<DashboardSidebar onNavigate={closeSidebar} onDismiss={closeSidebar} />}
      >
        <DashboardHeader
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenCreateTrip={() => setModalOpen(true)}
        />

        {!layoutReady ? (
          <DashboardContentSkeleton />
        ) : (
          <div className="dash-content">
            <section className="dash-welcome" aria-labelledby="dash-welcome-heading">
              <h2 id="dash-welcome-heading">Welcome back, traveler</h2>
              <p>
                Your dashboard keeps itineraries, budgets, and momentum in sync—whether you are
                plotting a weekend escape or a multi-city route.
              </p>
            </section>

            <section className="dash-stats" aria-label="Travel statistics">
              <StatCard label="Total trips" value={stats.totalTrips} hint="Across all drafts & plans" />
              <StatCard
                label="Upcoming"
                value={stats.upcomingTrips}
                hint="Trips that have not ended yet"
              />
              <StatCard
                label="Budget planned"
                value={formatMoney(stats.budgetPlanned)}
                hint="Sum of trip budgets you have entered"
              />
              <StatCard
                label="Next departure"
                value={stats.nextTripDays === null ? "—" : `${stats.nextTripDays} days`}
                hint={
                  stats.nextTripDays === null
                    ? "Add dates to see a countdown"
                    : "Until your nearest start date"
                }
              />
            </section>

            <div className="dash-panels">
              <section
                className="dash-panel"
                id="dash-upcoming"
                aria-labelledby="dash-upcoming-title"
              >
                <div className="dash-panel__head dash-panel__head--stack-sm">
                  <div>
                    <h2 className="dash-panel__title" id="dash-upcoming-title">
                      Upcoming trips
                    </h2>
                    <p className="dash-panel__caption">
                      Cards update as you add plans—hover for emphasis.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="dash-btn-ghost dash-panel__cta"
                    onClick={() => setModalOpen(true)}
                  >
                    Add trip
                  </button>
                </div>

                {!trips.length ? (
                  <EmptyTripsState onCreateTrip={() => setModalOpen(true)} />
                ) : (
                  <div
                    className={`dash-trip-grid dash-trip-grid--responsive${upcomingSorted.length > 1 ? " dash-trip-grid--multi" : ""}`}
                  >
                    {upcomingSorted.map((trip) => (
                      <TripCard
                        key={trip.id}
                        title={trip.title}
                        dateRangeLabel={formatTripRange(trip.startDate, trip.endDate)}
                        budgetLabel={trip.budget > 0 ? formatMoney(trip.budget) : "Budget TBD"}
                      />
                    ))}
                  </div>
                )}
              </section>

              <section className="dash-panel" aria-labelledby="dash-activity-title">
                <div className="dash-panel__head">
                  <div>
                    <h2 className="dash-panel__title" id="dash-activity-title">
                      Recent activity
                    </h2>
                    <p className="dash-panel__caption">
                      A lightweight timeline of changes in your workspace.
                    </p>
                  </div>
                </div>
                <RecentActivityList items={activities} />
              </section>
            </div>
          </div>
        )}
      </DashboardShell>

      <CreateTripModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleTripCreated}
      />
    </div>
  );
}
