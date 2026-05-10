import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/auth.css";
import "../styles/dashboard.css";
import { getTripDetailsRequest } from "../services/tripApi.js";
import { AddItineraryItemForm } from "../components/AddItineraryItemForm.jsx";
import { AddNoteForm } from "../components/AddNoteForm.jsx";
import { ItineraryTimeline } from "../components/ItineraryTimeline.jsx";
import { TripHeroSection } from "../components/TripHeroSection.jsx";
import { TripNotesSection } from "../components/TripNotesSection.jsx";

function formatMoney(amount) {
  const n = Number.parseFloat(amount ?? "");
  if (!Number.isFinite(n)) return "Budget TBD";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatTripRange(startDate, endDate) {
  if (!startDate && !endDate) return "Dates TBD";
  const opts = { month: "short", day: "numeric", year: "numeric" };
  try {
    if (startDate && endDate) {
      const a = new Date(`${startDate}T12:00:00`);
      const b = new Date(`${endDate}T12:00:00`);
      return `${a.toLocaleDateString(undefined, opts)} - ${b.toLocaleDateString(undefined, opts)}`;
    }
    const one = new Date(`${startDate || endDate}T12:00:00`);
    return one.toLocaleDateString(undefined, opts);
  } catch {
    return "Dates TBD";
  }
}

function normalizeDetails(raw) {
  const trip = raw?.trip || {};
  const itineraryItems = Array.isArray(raw?.itineraryItems)
    ? raw.itineraryItems
    : Array.isArray(raw?.itinerary_items)
      ? raw.itinerary_items
      : [];
  const notes = Array.isArray(raw?.notes) ? raw.notes : [];
  return { trip, itineraryItems, notes };
}

export default function TripDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trip, setTrip] = useState(null);
  const [itineraryItems, setItineraryItems] = useState([]);
  const [notes, setNotes] = useState([]);

  async function loadDetails() {
    setLoading(true);
    setError("");
    try {
      const { ok, status, data } = await getTripDetailsRequest(id);
      if (!ok) {
        if (status === 401) {
          navigate("/", { replace: true });
          return;
        }
        setError(data?.message || "Unable to load trip details.");
        return;
      }
      const normalized = normalizeDetails(data?.data);
      setTrip(normalized.trip);
      setItineraryItems(normalized.itineraryItems);
      setNotes(normalized.notes);
    } catch {
      setError("Unable to reach server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDetails();
  }, [id]);

  const dateRangeLabel = useMemo(
    () => formatTripRange(trip?.start_date, trip?.end_date),
    [trip?.start_date, trip?.end_date],
  );
  const budgetLabel = useMemo(() => formatMoney(trip?.budget), [trip?.budget]);

  if (loading) {
    return (
      <div className="dash-root">
        <div className="dash-content">
          <div className="dash-welcome dash-skeleton-block">
            <div className="dash-skeleton-line dash-skeleton-line--heading" />
            <div className="dash-skeleton-line dash-skeleton-line--body" />
          </div>
          <div className="dash-panel dash-panel--skeleton">
            <div className="dash-skeleton-card" />
            <div className="dash-skeleton-card" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dash-root">
        <div className="dash-content">
          <section className="dash-empty dash-empty--activity" role="alert">
            <h2 className="dash-empty__title">Unable to load trip details</h2>
            <p className="dash-empty__text">{error}</p>
            <div className="trip-details-actions">
              <button className="dash-btn-primary" onClick={loadDetails} type="button">
                Retry
              </button>
              <Link to="/dashboard" className="dash-btn-ghost trip-link-btn">
                Back to dashboard
              </Link>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="dash-root">
        <div className="dash-content">
          <section className="dash-empty dash-empty--activity">
            <h2 className="dash-empty__title">Trip not found</h2>
            <p className="dash-empty__text">This trip does not exist or is no longer available.</p>
            <Link to="/dashboard" className="dash-btn-primary trip-link-btn">
              Back to dashboard
            </Link>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-root">
      <div className="dash-content trip-details">
        <div className="trip-details__top">
          <Link to="/dashboard" className="dash-btn-ghost trip-link-btn">
            Back
          </Link>
        </div>

        <TripHeroSection trip={trip} dateRangeLabel={dateRangeLabel} budgetLabel={budgetLabel} />

        <div className="dash-panels trip-details-grid">
          <section className="dash-panel">
            <div className="dash-panel__head">
              <div>
                <h2 className="dash-panel__title">Itinerary timeline</h2>
                <p className="dash-panel__caption">Structured by day for quick planning.</p>
              </div>
            </div>
            <ItineraryTimeline items={itineraryItems} />
          </section>

          <section className="dash-panel">
            <div className="dash-panel__head">
              <div>
                <h2 className="dash-panel__title">Notes & journal</h2>
                <p className="dash-panel__caption">Capture ideas and memories as you plan.</p>
              </div>
            </div>
            <TripNotesSection notes={notes} />
          </section>
        </div>

        <div className="dash-panels trip-details-grid">
          <section className="dash-panel">
            <div className="dash-panel__head">
              <div>
                <h2 className="dash-panel__title">Add itinerary item</h2>
              </div>
            </div>
            <AddItineraryItemForm
              tripId={id}
              onCreated={(item) => setItineraryItems((prev) => [item, ...prev])}
            />
          </section>

          <section className="dash-panel">
            <div className="dash-panel__head">
              <div>
                <h2 className="dash-panel__title">Add note</h2>
              </div>
            </div>
            <AddNoteForm tripId={id} onCreated={(note) => setNotes((prev) => [note, ...prev])} />
          </section>
        </div>
      </div>
    </div>
  );
}
