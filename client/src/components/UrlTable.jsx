function formatDate(value) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getShortUrl(url) {
  if (url.shortUrl) {
    return url.shortUrl;
  }

  const apiBaseUrl = import.meta.env.VITE_API_URL || "https://server-33tius242-charith-s-projects.vercel.app/api";
  const publicBaseUrl = import.meta.env.VITE_PUBLIC_BASE_URL || apiBaseUrl.replace(/\/api\/?$/, "");

  return `${publicBaseUrl.replace(/\/$/, "")}/${url.shortCode}`;
}

export default function UrlTable({ urls, onCopy, onOpen, onDelete, emptyMessage = "No shortened URLs yet" }) {
  if (!urls.length) {
    return (
      <div className="panel-card empty-state">
        <i className="bi bi-inbox d-block mb-3"></i>
        <h5 className="fw-bold mb-2">{emptyMessage}</h5>
        <p className="mb-0">Create your first shortened URL and it will appear here.</p>
      </div>
    );
  }

  return (
    <div className="panel-card table-wrap">
      <div className="card-header px-4 py-3">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <div className="section-label mb-1">URL library</div>
            <h5 className="mb-0 fw-bold">Recent shortened links</h5>
          </div>
          <div className="text-secondary small">Scroll horizontally on smaller screens</div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th>Short URL</th>
              <th>Original URL</th>
              <th>Clicks</th>
              <th>Created Date</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url) => {
              const shortUrl = getShortUrl(url);

              return (
                <tr key={url._id || url.shortCode}>
                  <td>
                    <a href={shortUrl} target="_blank" rel="noreferrer" className="fw-semibold text-decoration-none">
                      {url.shortCode}
                    </a>
                    <div className="small text-secondary">{shortUrl}</div>
                  </td>
                  <td>
                    <div className="truncate-url" title={url.originalUrl}>
                      {url.originalUrl}
                    </div>
                  </td>
                  <td>
                    <span className="badge rounded-pill text-bg-primary-subtle text-primary-emphasis px-3 py-2">
                      {url.clicks ?? 0}
                    </span>
                  </td>
                  <td>{formatDate(url.createdAt)}</td>
                  <td className="text-end">
                    <div className="btn-group" role="group" aria-label={`Actions for ${url.shortCode}`}>
                      <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => onCopy(shortUrl)}>
                        <i className="bi bi-files me-1"></i>
                        Copy
                      </button>
                      <button type="button" className="btn btn-outline-success btn-sm" onClick={() => onOpen(url.originalUrl)}>
                        <i className="bi bi-box-arrow-up-right me-1"></i>
                        Open
                      </button>
                      <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => onDelete(url)}>
                        <i className="bi bi-trash me-1"></i>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
