export function DashboardShell({ sidebarOpen, onCloseSidebar, sidebar, children }) {
  return (
    <div className="dash-app">
      <aside className={`dash-sidebar${sidebarOpen ? " dash-sidebar--open" : ""}`}>{sidebar}</aside>

      <button
        type="button"
        className={`dash-backdrop${sidebarOpen ? " dash-backdrop--visible" : ""}`}
        aria-label="Close menu"
        onClick={onCloseSidebar}
      />

      <div className="dash-main">{children}</div>
    </div>
  );
}
