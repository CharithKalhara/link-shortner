const statsConfig = [
  {
    key: "totalUrls",
    title: "Total URLs",
    icon: "bi-link-45deg",
    tone: "text-primary",
  },
  {
    key: "totalClicks",
    title: "Total Clicks",
    icon: "bi-mouse2",
    tone: "text-info",
  },
  {
    key: "averageClicks",
    title: "Average Clicks",
    icon: "bi-graph-up-arrow",
    tone: "text-success",
  },
  {
    key: "mostPopular",
    title: "Most Popular URL",
    icon: "bi-fire",
    tone: "text-warning",
  },
];

export default function StatsCards({ stats }) {
  return (
    <div className="row g-4">
      {statsConfig.map((stat) => (
        <div key={stat.key} className="col-12 col-md-6 col-xl-3">
          <div className="card metric-card h-100 fade-in-up">
            <div className="card-body p-4">
              <div className="d-flex align-items-start justify-content-between gap-3">
                <div>
                  <div className="metric-label mb-2">{stat.title}</div>
                  <div className="metric-value">
                    {stat.key === "mostPopular" ? stats[stat.key] || "-" : stats[stat.key]}
                  </div>
                </div>
                <div className={`metric-icon ${stat.tone}`}>
                  <i className={`bi ${stat.icon} fs-4`}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}