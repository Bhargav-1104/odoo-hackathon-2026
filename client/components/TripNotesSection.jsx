export function TripNotesSection({ notes }) {
  if (!notes.length) {
    return (
      <div className="dash-empty dash-empty--activity">
        <p className="dash-empty__muted">
          No journal notes yet. Capture moments, reminders, and travel reflections here.
        </p>
      </div>
    );
  }

  return (
    <ul className="trip-notes-list">
      {notes.map((note) => (
        <li key={note.id || note.created_at || note.content} className="trip-note-card">
          <p className="trip-note-card__content">{note.content || ""}</p>
          {note.created_at ? (
            <div className="trip-note-card__time">
              {new Date(note.created_at).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
