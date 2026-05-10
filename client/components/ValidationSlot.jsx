export function ValidationSlot({ message, placeholderText = "Validation message" }) {
  const isEmpty = !message;

  return (
    <div
      className={`auth-validation-slot${isEmpty ? " auth-validation-slot--empty" : ""}`}
      role="status"
      aria-live="polite"
    >
      {isEmpty ? placeholderText : message}
    </div>
  );
}
