import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { vehicleService } from "../api/vehicleService";

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

// ─── Skeleton loaders ─────────────────────────────────────────────────────────

function StatSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
      <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
      <div className="h-7 w-28 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-16 bg-gray-100 rounded" />
    </div>
  );
}

function RecentSkeleton() {
  return (
    <div className="flex items-center justify-between py-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-200 flex-shrink-0" />
        <div className="space-y-2">
          <div className="h-3.5 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="h-4 w-24 bg-gray-200 rounded" />
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon, accent }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Recent valuation row ─────────────────────────────────────────────────────

function RecentRow({ item }) {
  const conditionClass = conditionColors[item.condition] || "bg-gray-100 text-gray-600";

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            {item.year} {item.make} {item.model}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400">{formatDate(item.createdAt)}</span>
            {item.condition && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${conditionClass}`}>
                {item.condition}
              </span>
            )}
          </div>
        </div>
      </div>
      <span className="text-sm font-bold text-gray-900 flex-shrink-0">
        {formatCurrency(item.estimatedValue)}
      </span>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function Dashboard() {
  const { user, token } = useAuth();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const data = await vehicleService.getHistory(token);
        setHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  // Derived stats
  const totalValuations = history.length;
  const avgValue = totalValuations
    ? history.reduce((sum, i) => sum + (i.estimatedValue || 0), 0) / totalValuations
    : 0;
  const highestValue = totalValuations
    ? Math.max(...history.map((i) => i.estimatedValue || 0))
    : 0;
  const recentItems = history.slice(0, 5);

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting}, {user?.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Here's an overview of your vehicle valuations.
          </p>
        </div>

        <Link
          to="/valuate"
          className="flex items-center gap-2 bg-cyan-400 hover:bg-cyan-500 transition text-black font-semibold px-5 py-2.5 rounded-xl text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Valuation
        </Link>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Total Valuations"
              value={totalValuations}
              sub={totalValuations === 1 ? "1 vehicle valued" : `${totalValuations} vehicles valued`}
              accent="bg-cyan-50"
              icon={
                <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              }
            />
            <StatCard
              label="Average Value"
              value={formatCurrency(avgValue)}
              sub="across all valuations"
              accent="bg-purple-50"
              icon={
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              }
            />
            <StatCard
              label="Highest Value"
              value={formatCurrency(highestValue)}
              sub="best valuation so far"
              accent="bg-green-50"
              icon={
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              }
            />
          </>
        )}
      </div>

      {/* ── Recent valuations ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Valuations</h2>
          {totalValuations > 5 && (
            <Link
              to="/history"
              className="text-sm text-cyan-500 hover:text-cyan-600 font-medium"
            >
              View all →
            </Link>
          )}
        </div>

        <div className="px-6">
          {loading && (
            <>
              <RecentSkeleton />
              <RecentSkeleton />
              <RecentSkeleton />
            </>
          )}

          {!loading && error && (
            <p className="text-sm text-red-500 py-6">{error}</p>
          )}

          {!loading && !error && recentItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-cyan-50 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">No valuations yet</p>
              <p className="text-xs text-gray-400 mb-4">
                Get an AI-powered estimate for your vehicle in seconds.
              </p>
              <Link
                to="/valuate"
                className="text-sm bg-cyan-400 hover:bg-cyan-500 transition text-black font-semibold px-4 py-2 rounded-xl"
              >
                Start your first valuation
              </Link>
            </div>
          )}

          {!loading && !error && recentItems.length > 0 &&
            recentItems.map((item) => (
              <RecentRow key={item.id} item={item} />
            ))
          }
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <Link
          to="/valuate"
          className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-cyan-200 transition group"
        >
          <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center group-hover:bg-cyan-100 transition">
            <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">New Valuation</p>
            <p className="text-xs text-gray-400 mt-0.5">Get an AI estimate for a vehicle</p>
          </div>
        </Link>

        <Link
          to="/history"
          className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-cyan-200 transition group"
        >
          <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition">
            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">View History</p>
            <p className="text-xs text-gray-400 mt-0.5">Browse all past valuations</p>
          </div>
        </Link>
      </div>

    </div>
  );
}

export default Dashboard;
