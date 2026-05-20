import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { vehicleService } from "../api/vehicleService";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
    day: "numeric", month: "long", year: "numeric",
  });
}

const conditionColors = {
  Excellent: "bg-green-100 text-green-700 border-green-200",
  Good:      "bg-blue-100 text-blue-700 border-blue-200",
  Fair:      "bg-yellow-100 text-yellow-700 border-yellow-200",
  Poor:      "bg-red-100 text-red-700 border-red-200",
};

// ─── Confidence meter ─────────────────────────────────────────────────────────

function ConfidenceMeter({ value }) {
  // value is 0–100
  const pct = Math.min(100, Math.max(0, value || 0));
  const color =
    pct >= 80 ? "bg-green-400" :
    pct >= 60 ? "bg-cyan-400"  :
    pct >= 40 ? "bg-yellow-400" : "bg-red-400";

  const label =
    pct >= 80 ? "High confidence" :
    pct >= 60 ? "Moderate confidence" :
    pct >= 40 ? "Low confidence" : "Very low confidence";

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1.5">
        <span>{label}</span>
        <span className="font-semibold text-gray-800">{pct}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Breakdown row ────────────────────────────────────────────────────────────

function BreakdownRow({ label, impact, description }) {
  const isPositive = impact > 0;
  const isNeutral  = impact === 0;

  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      {!isNeutral && (
        <span className={`text-sm font-semibold flex-shrink-0 ${isPositive ? "text-green-600" : "text-red-500"}`}>
          {isPositive ? "+" : ""}{formatCurrency(impact)}
        </span>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
        <div className="h-10 w-48 bg-gray-200 rounded mb-3" />
        <div className="h-3 w-24 bg-gray-100 rounded" />
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function ValuationResult() {
  const { id }       = useParams();
  const location     = useLocation();
  const navigate     = useNavigate();
  const { token }    = useAuth();

  // If navigated from NewValuation, the result is already in location.state
  const [valuation, setValuation] = useState(location.state?.valuation || null);
  const [loading, setLoading]     = useState(!valuation);
  const [error, setError]         = useState(null);

  useEffect(() => {
    if (valuation) return; // already have it
    const fetch = async () => {
      try {
        const data = await vehicleService.getValuationById(id, token);
        setValuation(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, token, valuation]);

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-8" />
        <Skeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!valuation) return null;

  const conditionClass = conditionColors[valuation.condition] || "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      {/* ── Estimated value card ── */}
      <div className="bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-2xl p-6 mb-5 text-black">
        <p className="text-sm font-medium opacity-80 mb-1">Estimated Market Value</p>
        <p className="text-4xl font-bold mb-1">{formatCurrency(valuation.estimatedValue)}</p>
        <p className="text-xs opacity-70">Valued on {formatDate(valuation.createdAt)}</p>

        {valuation.confidence !== undefined && (
          <div className="mt-4">
            <ConfidenceMeter value={valuation.confidence} />
          </div>
        )}
      </div>

      {/* ── Vehicle details ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
        <h2 className="font-semibold text-gray-900 mb-4">Vehicle Details</h2>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center">
            <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {valuation.year} {valuation.make} {valuation.model}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {valuation.condition && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${conditionClass}`}>
                  {valuation.condition}
                </span>
              )}
              {valuation.mileage && (
                <span className="text-xs text-gray-400">
                  {Number(valuation.mileage).toLocaleString()} km
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          {[
            ["Body Type",    valuation.bodyType],
            ["Fuel Type",    valuation.fuelType],
            ["Transmission", valuation.transmission],
            ["Engine Size",  valuation.engineSize ? `${valuation.engineSize} cc` : null],
            ["Color",        valuation.color],
          ]
            .filter(([, v]) => v)
            .map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="font-medium text-gray-800 mt-0.5">{value}</p>
              </div>
            ))}
        </div>
      </div>

      {/* ── AI Breakdown ── */}
      {valuation.breakdown && valuation.breakdown.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <h2 className="font-semibold text-gray-900 mb-1">AI Valuation Breakdown</h2>
          <p className="text-xs text-gray-400 mb-4">
            Factors that influenced the estimated value.
          </p>
          <div>
            {valuation.breakdown.map((item, i) => (
              <BreakdownRow
                key={i}
                label={item.factor || item.label}
                impact={item.impact}
                description={item.description}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Price range ── */}
      {valuation.priceRange && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <h2 className="font-semibold text-gray-900 mb-4">Market Price Range</h2>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-500">Low</span>
            <span className="text-gray-500">High</span>
          </div>
          <div className="relative h-3 bg-gray-100 rounded-full">
            <div className="absolute inset-y-0 left-[20%] right-[20%] bg-cyan-200 rounded-full" />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full border-2 border-white shadow"
              style={{ left: "50%" }}
            />
          </div>
          <div className="flex items-center justify-between text-sm mt-2 font-medium">
            <span className="text-gray-700">{formatCurrency(valuation.priceRange.low)}</span>
            <span className="text-cyan-600 font-bold">{formatCurrency(valuation.estimatedValue)}</span>
            <span className="text-gray-700">{formatCurrency(valuation.priceRange.high)}</span>
          </div>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="flex gap-3">
        <Link
          to="/valuate"
          className="flex-1 text-center py-3 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          New Valuation
        </Link>
        <Link
          to="/history"
          className="flex-1 text-center py-3 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black font-semibold text-sm transition"
        >
          View History
        </Link>
      </div>
    </div>
  );
}

export default ValuationResult;
