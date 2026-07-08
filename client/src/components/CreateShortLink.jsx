import { useState } from "react";

export default function CreateShortLink({ onCreate, onCopy }) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [createdUrl, setCreatedUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedUrl = originalUrl.trim();

    if (!trimmedUrl) {
      setCreatedUrl(null);
      setSuccessMessage("");
      setErrorMessage("Please enter a URL to shorten.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      const newUrl = await onCreate(trimmedUrl);

      setCreatedUrl(newUrl);
      setOriginalUrl("");
      setSuccessMessage("Short link created successfully.");
    } catch (createError) {
      setCreatedUrl(null);
      setSuccessMessage("");
      setErrorMessage(createError?.response?.data?.message || createError?.message || "Failed to create a short link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (createdUrl?.shortUrl) {
      onCopy(createdUrl.shortUrl);
    }
  };

  return (
    <section className="panel-card create-link-panel fade-in-up">
      <div className="card-header px-4 py-3">
        <div className="section-label mb-1">Create short link</div>
        <h5 className="mb-0 fw-bold">Enter URL</h5>
      </div>

      <form className="p-4" onSubmit={handleSubmit}>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg">
            <label className="form-label fw-semibold" htmlFor="originalUrl">
              URL
            </label>
            <input
              id="originalUrl"
              type="url"
              className="form-control form-control-lg"
              placeholder="https://google.com"
              value={originalUrl}
              onChange={(event) => setOriginalUrl(event.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="col-12 col-lg-auto">
            <button type="submit" className="btn btn-primary btn-lg w-100" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                  Creating
                </>
              ) : (
                <>
                  <i className="bi bi-link-45deg me-2"></i>
                  Create Short Link
                </>
              )}
            </button>
          </div>
        </div>

        {errorMessage ? (
          <div className="alert alert-danger mt-3 mb-0" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="alert alert-success mt-3 mb-0" role="status">
            <i className="bi bi-check-circle me-2"></i>
            {successMessage}
          </div>
        ) : null}

        {createdUrl?.shortUrl ? (
          <div className="short-url-result mt-4">
            <div>
              <div className="section-label mb-1">Short URL</div>
              <a href={createdUrl.shortUrl} target="_blank" rel="noreferrer" className="fw-semibold text-decoration-none">
                {createdUrl.shortUrl}
              </a>
            </div>
            <button type="button" className="btn btn-outline-primary" onClick={handleCopy}>
              <i className="bi bi-files me-2"></i>
              Copy
            </button>
          </div>
        ) : null}
      </form>
    </section>
  );
}
