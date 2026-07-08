export default function Navbar({ username, isDarkMode, onThemeToggle, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg app-navbar sticky-top py-3">
      <div className="container-fluid px-3 px-lg-4">
        <div className="d-flex align-items-center gap-3">
          <span className="brand-mark shadow-sm">
            <i className="bi bi-link-45deg fs-4"></i>
          </span>
          <div>
            <div className="fw-semibold dashboard-title fs-5">LinkForge</div>
            <div className="small text-secondary">URL Shortener Dashboard</div>
          </div>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#dashboardNavbar"
          aria-controls="dashboardNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse mt-3 mt-lg-0" id="dashboardNavbar">
          <div className="ms-lg-auto d-flex flex-column flex-lg-row align-items-lg-center gap-3">
            <div className="text-lg-end">
              <div className="section-label mb-1">Logged in as</div>
              <div className="fw-semibold">{username}</div>
            </div>

            <div className="form-check form-switch d-flex align-items-center gap-2 mb-0 ps-0">
              <input
                className="form-check-input ms-0"
                type="checkbox"
                role="switch"
                id="themeToggle"
                checked={isDarkMode}
                onChange={onThemeToggle}
              />
              <label className="form-check-label fw-medium" htmlFor="themeToggle">
                <i className={`bi ${isDarkMode ? "bi-moon-stars" : "bi-sun"} me-2`}></i>
                {isDarkMode ? "Dark" : "Light"} mode
              </label>
            </div>

            <button className="btn btn-outline-primary rounded-pill px-4" onClick={onLogout} type="button">
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}