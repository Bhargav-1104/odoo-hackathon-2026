import { useEffect, useId, useState } from "react";
import { TextField } from "./TextField.jsx";
import { TextAreaField } from "./TextAreaField.jsx";
import { ValidationSlot } from "./ValidationSlot.jsx";

const emptyForm = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  budget: "",
};

export function CreateTripModal({ open, onClose, onCreated }) {
  const titleId = useId();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

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
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onCreated({
        title: form.title.trim(),
        description: form.description.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        budget: form.budget.trim(),
      });
      onClose();
    }, 650);
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

        <form className="dash-form-grid" onSubmit={handleSubmit}>
          <TextField
            id="trip-title"
            name="title"
            label="Trip title"
            value={form.title}
            onChange={update("title")}
            placeholder="Kyoto spring escape"
            validationSlot={<ValidationSlot message="" />}
          />

          <TextAreaField
            id="trip-description"
            name="description"
            label="Description"
            value={form.description}
            onChange={update("description")}
            placeholder="Highlights, goals, or travel rhythm…"
            rows={4}
            validationSlot={<ValidationSlot message="" />}
          />

          <div className="dash-form-grid dash-form-grid--dates">
            <TextField
              id="trip-start"
              name="startDate"
              type="date"
              label="Start date"
              value={form.startDate}
              onChange={update("startDate")}
              validationSlot={<ValidationSlot message="" />}
            />
            <TextField
              id="trip-end"
              name="endDate"
              type="date"
              label="End date"
              value={form.endDate}
              onChange={update("endDate")}
              validationSlot={<ValidationSlot message="" />}
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
            validationSlot={<ValidationSlot message="" />}
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
