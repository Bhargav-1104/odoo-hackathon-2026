export function TextField({
  id,
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
  validationSlot,
}) {
  return (
    <div className="auth-field">
      <label className="auth-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        className="auth-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      {validationSlot}
    </div>
  );
}
