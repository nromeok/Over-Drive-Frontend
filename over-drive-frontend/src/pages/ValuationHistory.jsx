import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function formatCurrency(value) {
  if (!value && value !== 0) return "—";
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const conditionColors = {
  Excellent: "bg-green-100 text-green-700",
  Good:      "bg-blue-100 text-blue-700",
  Fair:      "bg-yellow-100 text-yellow-700",
  Poor:      "bg-red-100 text-red-700",
};

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-cyan-50 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">No valuations yet</h3>
      <p className="text-gray-500 text-sm max-w-xs">
        Your vehicle valuation history will appear here once you run your first valuation.
      </p>
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="bg-white rounded-2xl p-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-36 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="h-5 w-28 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

// ─── History card ─────────────────────────────────────────────────────────────

function HistoryCard({ item, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const { token } = useAuth();

  const handleDelete = async () => {
    if (!window.confirm("Remove this valuation from your history?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/vehicles/${item.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) onDelete(item.id);
    } catch {
      // silently fail — parent will still show the item
    } finally {
      setDeleting(false);
    }
  };

  const conditionClass = conditionColors[item.condition] || "bg-gray-100 text-gray-600";

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
      <div className="flex items-start justify-between gap-4">

        {/* Vehicle icon + info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              {item.year} {item.make} {item.model}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-gray-400">
                {item.mileage ? `${Number(item.mileage).toLocaleString()} km` : "—"}
              </span>
              {item.condition && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${conditionClass}`}>
                  {item.condition}
                </span>
              )}
              <span className="text-xs text-gray-400">{formatDate(item.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Value + actions */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(item.estimatedValue)}
          </span>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
            aria-label="Delete valuation"
          >
            {deleting ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function ValuationHistory() {
  const { token } = useAuth();

  const [history, setHistory]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState("");
  const [sortBy, setSortBy]     = useState("newest");

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/vehicles/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load history.");
        setHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchHistory();
  }, [token]);

  const handleDelete = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // Filter + sort
  const filtered = history
    .filter((item) => {
      const q = search.toLowerCase();
      return (
        !q ||
        item.make?.toLowerCase().includes(q) ||
        item.model?.toLowerCase().includes(q) ||
        String(item.year).includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "highest") return (b.estimatedValue || 0) - (a.estimatedValue || 0);
      if (sortBy === "lowest")  return (a.estimatedValue || 0) - (b.estimatedValue || 0);
      return 0;
    });

  // Summary stats
  const totalValuations = history.length;
  const avgValue = history.length
    ? history.reduce((sum, i) => sum + (i.estimatedValue || 0), 0) / history.length
    : 0;
  const highestValue = history.length
    ? Math.max(...history.map((i) => i.estimatedValue || 0))
    : 0;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Valuation History</h1>
        <p className="text-gray-500 mt-1 text-sm">All your past vehicle valuations in one place.</p>
      </div>

      {/* Stats row */}
      {!loading && !error && history.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">Total Valuations</p>
            <p className="text-2xl font-bold text-gray-900">{totalValuations}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">Average Value</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgValue)}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">Highest Value</p>
            <p className="text-2xl font-bold text-cyan-500">{formatCurrency(highestValue)}</p>
          </div>
        </div>
      )}

      {/* Search + sort */}
      {!loading && !error && history.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by make, model or year..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400 bg-white"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-cyan-400 bg-white text-gray-700"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="highest">Highest value</option>
            <option value="lowest">Lowest value</option>
          </select>
        </div>
      )}

      {/* Content */}
      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && history.length === 0 && <EmptyState />}

      {!loading && !error && history.length > 0 && filtered.length === 0 && (
        <p className="text-center text-gray-400 py-12 text-sm">
          No results for "{search}"
        </p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((item) => (
            <HistoryCard key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ValuationHistory;
