export function TextField({
  id,
  label,
  type = "text",
  name,
  value,
  onChange,
  onInvalid,
  placeholder,
  autoComplete,
  min,
  max,
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
        onInvalid={onInvalid}
        placeholder={placeholder}
        autoComplete={autoComplete}
        min={min}
        max={max}
      />
      {validationSlot}
    </div>
  );
}
