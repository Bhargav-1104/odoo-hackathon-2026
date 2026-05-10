import { useState } from "react";
import { TextAreaField } from "./TextAreaField.jsx";
import { ValidationSlot } from "./ValidationSlot.jsx";
import { createTripNoteRequest } from "../services/tripApi.js";

const initialForm = { content: "" };

export function AddNoteForm({ tripId, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!form.content.trim()) {
      setErrors({ content: "Note content is required" });
      return;
    }

    setLoading(true);
    try {
      const payload = { content: form.content.trim() };
      const { ok, data } = await createTripNoteRequest(tripId, payload);
      if (!ok) {
        const contentError = Array.isArray(data?.errors)
          ? data.errors.find((err) => err?.field === "content")?.message
          : "";
        setErrors({ content: contentError || "" });
        setFormError(data?.message || "Unable to add note right now.");
        return;
      }
      const created = data?.data?.note || payload;
      onCreated(created);
      setForm(initialForm);
      setErrors({});
    } catch {
      setFormError("Unable to reach server. Please retry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="dash-form-grid trip-form" onSubmit={handleSubmit} noValidate>
      <TextAreaField
        id="trip-note-content"
        name="content"
        label="New note"
        value={form.content}
        onChange={(e) => {
          setForm({ content: e.target.value });
          setErrors({ content: "" });
        }}
        placeholder="Capture journal thoughts, reminders, places to revisit…"
        rows={4}
        validationSlot={<ValidationSlot message={errors.content || ""} />}
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
            Saving…
          </>
        ) : (
          "Add note"
        )}
      </button>
    </form>
  );
}
