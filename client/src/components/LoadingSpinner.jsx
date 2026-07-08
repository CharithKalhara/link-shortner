export default function LoadingSpinner() {
  return (
    <div className="panel-card py-5 text-center">
      <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
      <div className="mt-3 fw-semibold">Loading dashboard...</div>
      <div className="text-secondary small">Fetching metrics and URL history</div>
    </div>
  );
}