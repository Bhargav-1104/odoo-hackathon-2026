export function TextAreaField({
  id,
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  validationSlot,
}) {
  return (
    <div className="auth-field">
      <label className="auth-label" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        className="auth-textarea"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
      />
      {validationSlot}
    </div>
  );
}
