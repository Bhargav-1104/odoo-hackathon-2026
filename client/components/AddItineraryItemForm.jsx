import { useState } from "react";
import { TextField } from "./TextField.jsx";
import { TextAreaField } from "./TextAreaField.jsx";
import { ValidationSlot } from "./ValidationSlot.jsx";
import { createItineraryItemRequest } from "../services/tripApi.js";

const initialForm = { title: "", day_number: "", notes: "" };

export function AddItineraryItemForm({ tripId, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  function update(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };
  }

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required";
    if (!form.day_number || Number(form.day_number) < 1) next.day_number = "Day number must be 1+";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function mapApiErrors(data) {
    const next = {};
    if (Array.isArray(data?.errors)) {
      for (const err of data.errors) {
        if (err?.field && err?.message) next[err.field] = err.message;
      }
    }
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        day_number: Number(form.day_number),
        notes: form.notes.trim(),
      };
      const { ok, data } = await createItineraryItemRequest(tripId, payload);
      if (!ok) {
        setErrors((prev) => ({ ...prev, ...mapApiErrors(data) }));
        setFormError(data?.message || "Unable to create itinerary item.");
        return;
      }
      const created = data?.data?.item || data?.data?.itineraryItem || payload;
      onCreated(created);
      setForm(initialForm);
    } catch {
      setFormError("Unable to reach server. Please retry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="dash-form-grid trip-form" onSubmit={handleSubmit} noValidate>
      <TextField
        id="itinerary-title"
        name="title"
        label="Title"
        value={form.title}
        onChange={update("title")}
        placeholder="Morning walk at Arashiyama"
        validationSlot={<ValidationSlot message={errors.title || ""} />}
      />
      <TextField
        id="itinerary-day"
        name="day_number"
        label="Day number"
        type="number"
        value={form.day_number}
        onChange={update("day_number")}
        placeholder="1"
        validationSlot={<ValidationSlot message={errors.day_number || ""} />}
      />
      <TextAreaField
        id="itinerary-notes"
        name="notes"
        label="Notes"
        value={form.notes}
        onChange={update("notes")}
        placeholder="Any reminders for this item…"
        rows={3}
        validationSlot={<ValidationSlot message={errors.notes || ""} />}
      />
      {formError ? (
        <div className="auth-validation-slot" role="alert">
          {formError}
        </div>
      ) : null}
      <button type="submit" className="dash-btn-primary" disabled={loading}>
        {loading ? (
          <>
            <span className="dash-btn-primary__spin" aria-hidden />
            Adding…
          </>
        ) : (
          "Add itinerary item"
        )}
      </button>
    </form>
  );
}
