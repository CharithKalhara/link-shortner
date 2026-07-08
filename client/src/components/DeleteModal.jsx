export default function DeleteModal({ url, onClose, onConfirm, isDeleting }) {
  if (!url) {
    return null;
  }

  return (
    <>
      <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 border-0 shadow-lg">
            <div className="modal-header border-0 pb-0">
              <div>
                <div className="section-label mb-1">Confirm delete</div>
                <h5 className="modal-title fw-bold">Delete this shortened URL?</h5>
              </div>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              <p className="mb-2 text-secondary">
                This action will remove the short link and its analytics from the dashboard.
              </p>
              <div className="p-3 rounded-3 bg-body-tertiary">
                <div className="small text-secondary">Short code</div>
                <div className="fw-semibold">{url.shortCode}</div>
              </div>
            </div>

            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-light rounded-pill px-4" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger rounded-pill px-4" onClick={onConfirm} disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-trash me-2"></i>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}