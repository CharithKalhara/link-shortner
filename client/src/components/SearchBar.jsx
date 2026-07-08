export default function SearchBar({ searchTerm, onSearchChange, resultCount }) {
  return (
    <div className="panel-card p-3 p-md-4 mb-4">
      <form className="row g-3 align-items-center" onSubmit={(event) => event.preventDefault()}>
        <div className="col-12 col-lg-8">
          <label htmlFor="urlSearch" className="section-label mb-2">
            Search URLs
          </label>
          <div className="input-group input-group-lg">
            <span className="input-group-text bg-transparent border-end-0">
              <i className="bi bi-search"></i>
            </span>
            <input
              id="urlSearch"
              type="search"
              className="form-control border-start-0"
              placeholder="Search by original URL or short code"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
            />
            <button className="btn btn-primary px-4" type="submit">
              Search
            </button>
          </div>
        </div>

        <div className="col-12 col-lg-4 text-lg-end">
          <div className="section-label mb-2">Visible records</div>
          <div className="fw-semibold fs-5">{resultCount}</div>
        </div>
      </form>
    </div>
  );
}