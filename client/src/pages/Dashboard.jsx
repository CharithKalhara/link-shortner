import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import CreateShortLink from "../components/CreateShortLink.jsx";
import StatsCards from "../components/StatsCards.jsx";
import SearchBar from "../components/SearchBar.jsx";
import UrlTable from "../components/UrlTable.jsx";
import DeleteModal from "../components/DeleteModal.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { createUrl, deleteUrl, getDashboard, getUrls } from "../services/api.js";

const defaultStats = {
  totalUrls: 0,
  totalClicks: 0,
  averageClicks: 0,
  mostPopular: null,
};

function buildStatsFromUrls(urls) {
  const totalUrls = urls.length;
  const totalClicks = urls.reduce((sum, url) => sum + (url.clicks || 0), 0);

  return {
    totalUrls,
    totalClicks,
    averageClicks: totalUrls ? Math.round(totalClicks / totalUrls) : 0,
    mostPopular: totalUrls
      ? [...urls].sort((left, right) => (right.clicks || 0) - (left.clicks || 0))[0]?.shortCode || null
      : null,
  };
}

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [stats, setStats] = useState(defaultStats);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("url-shortener-theme") === "dark");

  const username = "alex.morgan";

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", isDarkMode ? "dark" : "light");
    localStorage.setItem("url-shortener-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setErrorMessage("");

      const [dashboardResult, urlsResult] = await Promise.allSettled([getDashboard(), getUrls()]);

      if (!isMounted) {
        return;
      }

      const loadedUrls = urlsResult.status === "fulfilled" ? urlsResult.value : [];
      setUrls(loadedUrls);

      if (dashboardResult.status === "fulfilled") {
        setStats({
          ...defaultStats,
          ...dashboardResult.value,
        });
      } else if (loadedUrls.length) {
        setStats(buildStatsFromUrls(loadedUrls));
        setErrorMessage(dashboardResult.reason?.response?.data?.message || dashboardResult.reason?.message || "Failed to load dashboard summary.");
      } else {
        setStats(defaultStats);
        setErrorMessage(dashboardResult.reason?.response?.data?.message || dashboardResult.reason?.message || "Failed to load dashboard data.");
      }

      if (urlsResult.status === "rejected") {
        const message = urlsResult.reason?.response?.data?.message || urlsResult.reason?.message || "Failed to load URLs.";
        setErrorMessage((currentMessage) => currentMessage || message);
      }

      if (dashboardResult.status === "rejected" && urlsResult.status === "rejected") {
        setStats(defaultStats);
      }

      setLoading(false);
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredUrls = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return urls;
    }

    return urls.filter((url) => {
      return [url.shortCode, url.originalUrl].some((value) => value?.toLowerCase().includes(normalizedSearch));
    });
  }, [searchTerm, urls]);

  const handleCopy = async (shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setToastMessage("Copied successfully");
    } catch (copyError) {
      setErrorMessage(copyError?.message || "Failed to copy the short URL.");
    }
  };

  const handleCreateUrl = async (originalUrl) => {
    const createdUrl = await createUrl(originalUrl);
    const tableUrl = {
      ...createdUrl,
      clicks: createdUrl.clicks ?? 0,
      createdAt: createdUrl.createdAt || new Date().toISOString(),
    };

    setUrls((currentUrls) => {
      const nextUrls = [tableUrl, ...currentUrls];
      setStats(buildStatsFromUrls(nextUrls));
      return nextUrls;
    });
    setErrorMessage("");

    return createdUrl;
  };

  const handleOpen = (originalUrl) => {
    window.open(originalUrl, "_blank", "noopener,noreferrer");
  };

  const handleDeleteRequest = (url) => {
    setSelectedUrl(url);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUrl?._id) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteUrl(selectedUrl._id);
      setUrls((currentUrls) => {
        const remainingUrls = currentUrls.filter((url) => url._id !== selectedUrl._id);
        setStats(remainingUrls.length ? buildStatsFromUrls(remainingUrls) : defaultStats);
        return remainingUrls;
      });
      setSelectedUrl(null);
      setErrorMessage("");
    } catch (deleteError) {
      setErrorMessage(deleteError?.response?.data?.message || deleteError?.message || "Failed to delete URL.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleThemeToggle = () => {
    setIsDarkMode((current) => !current);
  };

  const handleLogout = () => {
    window.location.assign("/");
  };

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(""), 2400);

    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const dismissError = () => setErrorMessage("");

  return (
    <div className="dashboard-shell">
      <Navbar
        username={username}
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
        onLogout={handleLogout}
      />

      <main className="container-fluid px-3 px-lg-4 py-4 py-lg-5">
        <section className="page-hero p-4 p-lg-5 mb-4 fade-in-up">
          <div className="row align-items-center g-4 position-relative z-1">
            <div className="col-12 col-lg-8">
              <div className="section-label mb-2">Dashboard overview</div>
              <h1 className="display-6 fw-bold dashboard-title mb-3">Manage every short link from one polished workspace.</h1>
              <p className="lead text-secondary mb-0">
                Track performance, copy links instantly, and keep your URL library organized with a clean SaaS-style dashboard.
              </p>
            </div>
            <div className="col-12 col-lg-4">
              <div className="p-4 rounded-4 bg-body-tertiary border border-opacity-10">
                <div className="section-label mb-2">Quick status</div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="text-secondary">Short links tracked</span>
                  <span className="fw-semibold">{stats.totalUrls}</span>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-secondary">Theme preference saved</span>
                  <span className="fw-semibold">{isDarkMode ? "Dark" : "Light"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {errorMessage ? (
          <div className="alert alert-danger alert-dismissible fade show rounded-4 shadow-sm" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {errorMessage}
            <button type="button" className="btn-close" aria-label="Close" onClick={dismissError}></button>
          </div>
        ) : null}

        {loading ? <LoadingSpinner /> : <StatsCards stats={stats} />}

        <div className="mt-4">
          <CreateShortLink onCreate={handleCreateUrl} onCopy={handleCopy} />
        </div>

        <div className="mt-4">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} resultCount={filteredUrls.length} />
        </div>

        {loading ? null : (
          <UrlTable
            urls={filteredUrls}
            onCopy={handleCopy}
            onOpen={handleOpen}
            onDelete={handleDeleteRequest}
            emptyMessage={searchTerm.trim() ? "No matching URLs found" : "No shortened URLs yet"}
          />
        )}
      </main>

      {toastMessage ? (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1080 }}>
          <div className="toast copy-toast show" role="status" aria-live="polite" aria-atomic="true">
            <div className="toast-body d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill text-success"></i>
              <span className="fw-semibold">{toastMessage}</span>
            </div>
          </div>
        </div>
      ) : null}

      <DeleteModal
        url={selectedUrl}
        onClose={() => setSelectedUrl(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
