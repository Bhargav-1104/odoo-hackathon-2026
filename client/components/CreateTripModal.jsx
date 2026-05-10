import { useEffect, useId, useState } from "react";
import { TextField } from "./TextField.jsx";
import { TextAreaField } from "./TextAreaField.jsx";
import { ValidationSlot } from "./ValidationSlot.jsx";
import { createTrip, normalizeTrip } from "../services/tripsApi.js";

const emptyForm = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  budget: "",
};

function getTripDateBounds() {
  const y = new Date().getFullYear();
  return {
    minDate: `${y}-01-01`,
    maxDate: `${y + 10}-12-31`,
  };
}

function isIsoDateString(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}

function formatBoundsHint(minDate, maxDate) {
  const min = new Date(`${minDate}T00:00:00Z`);
  const max = new Date(`${maxDate}T00:00:00Z`);
  const opts = { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" };
  return `${min.toLocaleDateString(undefined, opts)} – ${max.toLocaleDateString(undefined, opts)}`;
}

/**
 * Client-side date checks before POST. Backend remains authoritative.
 * @returns {Record<string, string>}
 */
function validateTripDates(startRaw, endRaw, bounds) {
  const errors = {};
  const start = typeof startRaw === "string" ? startRaw.trim() : "";
  const end = typeof endRaw === "string" ? endRaw.trim() : "";
  const rangeHint = formatBoundsHint(bounds.minDate, bounds.maxDate);

  if (!start) {
    errors.startDate = "Choose a start date.";
  } else if (!isIsoDateString(start)) {
    errors.startDate = "Enter a valid calendar date.";
  } else if (start < bounds.minDate || start > bounds.maxDate) {
    errors.startDate = `Pick a date within ${rangeHint}.`;
  }

  if (!end) {
    errors.endDate = "Choose an end date.";
  } else if (!isIsoDateString(end)) {
    errors.endDate = "Enter a valid calendar date.";
  } else if (end < bounds.minDate || end > bounds.maxDate) {
    errors.endDate = `Pick a date within ${rangeHint}.`;
  }

  if (!errors.startDate && !errors.endDate && end < start) {
    errors.endDate = "End date must be on or after the start date.";
  }

  return errors;
}

function suppressNativeInputValidation(e) {
  e.preventDefault();
}

function mapApiFieldErrors(data) {
  const next = {};
  if (Array.isArray(data?.errors)) {
    for (const err of data.errors) {
      if (!err?.field || !err?.message) continue;
      const { field, message } = err;
      if (field === "start_date") next.startDate = message;
      else if (field === "end_date") next.endDate = message;
      else if (field === "budget") next.budget = message;
      else if (field === "description") next.description = message;
      else if (field === "title") next.title = message;
      else next.title = next.title || message;
    }
  }
  if (data?.message && !Object.keys(next).length) {
    next.title = data.message;
  }
  return next;
}

export function CreateTripModal({ open, onClose, onCreated }) {
  const titleId = useId();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const dateBounds = getTripDateBounds();
  const endDateMin =
    form.startDate &&
    form.startDate >= dateBounds.minDate &&
    form.startDate <= dateBounds.maxDate
      ? form.startDate
      : dateBounds.minDate;

  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setLoading(false);
      setFieldErrors({});
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  function update(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setFieldErrors((prev) => {
        if (!prev[field]) return prev;
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    };
  }

  function onStartDateChange(e) {
    const startDate = e.target.value;
    setForm((prev) => {
      let endDate = prev.endDate;
      if (endDate && startDate && endDate < startDate) {
        endDate = "";
      }
      return { ...prev, startDate, endDate };
    });
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy.startDate;
      delete copy.endDate;
      return copy;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});

    const dateErrors = validateTripDates(form.startDate, form.endDate, dateBounds);
    if (Object.keys(dateErrors).length) {
      setFieldErrors(dateErrors);
      return;
    }

    const budgetRaw = form.budget.trim();
    const budgetNum = budgetRaw === "" ? NaN : Number(budgetRaw);
    if (budgetRaw === "" || !Number.isFinite(budgetNum) || budgetNum < 0) {
      setFieldErrors({ budget: "Enter a valid budget (0 or greater)." });
      return;
    }

    setLoading(true);
    try {
      const { ok, data } = await createTrip({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        start_date: form.startDate,
        end_date: form.endDate,
        budget: budgetNum,
      });

      if (!ok) {
        setFieldErrors(mapApiFieldErrors(data));
        return;
      }

      const trip = normalizeTrip(data?.data?.trip);
      if (trip) {
        onCreated(trip);
      }
      onClose();
    } catch {
      setFieldErrors({
        title: "Unable to reach the server. Check that it is running and try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dash-modal-overlay" role="presentation" onMouseDown={onClose}>
      <div
        className="dash-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="dash-modal__head">
          <div>
            <h2 id={titleId}>Create trip</h2>
            <p>Outline the basics—you can refine stops and bookings later.</p>
          </div>
          <button type="button" className="dash-modal__close" aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form className="dash-form-grid" onSubmit={handleSubmit} noValidate>
          <TextField
            id="trip-title"
            name="title"
            label="Trip title"
            value={form.title}
            onChange={update("title")}
            placeholder="Kyoto spring escape"
            validationSlot={<ValidationSlot message={fieldErrors.title || ""} />}
          />

          <TextAreaField
            id="trip-description"
            name="description"
            label="Description"
            value={form.description}
            onChange={update("description")}
            placeholder="Highlights, goals, or travel rhythm…"
            rows={4}
            validationSlot={<ValidationSlot message={fieldErrors.description || ""} />}
          />

          <div className="dash-form-grid dash-form-grid--dates">
            <TextField
              id="trip-start"
              name="startDate"
              type="date"
              label="Start date"
              value={form.startDate}
              onChange={onStartDateChange}
              onInvalid={suppressNativeInputValidation}
              min={dateBounds.minDate}
              max={dateBounds.maxDate}
              validationSlot={<ValidationSlot message={fieldErrors.startDate || ""} />}
            />
            <TextField
              id="trip-end"
              name="endDate"
              type="date"
              label="End date"
              value={form.endDate}
              onChange={update("endDate")}
              onInvalid={suppressNativeInputValidation}
              min={endDateMin}
              max={dateBounds.maxDate}
              validationSlot={<ValidationSlot message={fieldErrors.endDate || ""} />}
            />
          </div>

          <TextField
            id="trip-budget"
            name="budget"
            type="number"
            label="Budget (USD)"
            value={form.budget}
            onChange={update("budget")}
            placeholder="2500"
            validationSlot={<ValidationSlot message={fieldErrors.budget || ""} />}
          />

          <div className="dash-modal__actions">
            <button type="button" className="dash-btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="dash-btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="dash-btn-primary__spin" aria-hidden />
                  Saving…
                </>
              ) : (
                "Save trip"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
