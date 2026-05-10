export function AuthSubmitButton({ children, loading, disabled }) {
  return (
    <button className="auth-submit" type="submit" disabled={disabled || loading}>
      {loading ? (
        <>
          <span className="auth-submit__spinner" aria-hidden />
          <span>Please wait…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
