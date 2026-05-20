import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Splash() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  // Fade in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute w-72 h-72 bg-cyan-400/5 rounded-full blur-2xl top-10 right-10 pointer-events-none" />
      <div className="absolute w-48 h-48 bg-cyan-400/5 rounded-full blur-2xl bottom-10 left-10 pointer-events-none" />

      {/* Content */}
      <div
        className={`flex flex-col items-center text-center transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Robotic car SVG logo */}
        <div className="mb-8 relative">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl scale-110" />

          <div className="relative w-36 h-36 rounded-full bg-gray-900 border border-cyan-400/30 flex items-center justify-center shadow-2xl">
            <svg
              viewBox="0 0 120 80"
              className="w-24 h-16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Car body */}
              <rect x="10" y="35" width="100" height="28" rx="6" fill="#0e7490" />

              {/* Cabin / roof */}
              <path
                d="M30 35 L38 16 Q40 12 44 12 L76 12 Q80 12 82 16 L90 35 Z"
                fill="#164e63"
              />

              {/* Windshield */}
              <path
                d="M42 33 L48 17 Q49 14 52 14 L68 14 Q71 14 72 17 L78 33 Z"
                fill="#22d3ee"
                opacity="0.6"
              />

              {/* AI circuit lines on body */}
              <line x1="20" y1="46" x2="40" y2="46" stroke="#22d3ee" strokeWidth="1" opacity="0.5" />
              <line x1="40" y1="46" x2="40" y2="52" stroke="#22d3ee" strokeWidth="1" opacity="0.5" />
              <line x1="40" y1="52" x2="55" y2="52" stroke="#22d3ee" strokeWidth="1" opacity="0.5" />
              <line x1="65" y1="46" x2="100" y2="46" stroke="#22d3ee" strokeWidth="1" opacity="0.5" />
              <line x1="65" y1="46" x2="65" y2="52" stroke="#22d3ee" strokeWidth="1" opacity="0.5" />
              <line x1="65" y1="52" x2="80" y2="52" stroke="#22d3ee" strokeWidth="1" opacity="0.5" />

              {/* Circuit dots */}
              <circle cx="40" cy="46" r="2" fill="#22d3ee" opacity="0.8" />
              <circle cx="65" cy="46" r="2" fill="#22d3ee" opacity="0.8" />
              <circle cx="55" cy="52" r="1.5" fill="#22d3ee" opacity="0.6" />
              <circle cx="80" cy="52" r="1.5" fill="#22d3ee" opacity="0.6" />

              {/* Headlights */}
              <rect x="10" y="40" width="10" height="6" rx="2" fill="#22d3ee" opacity="0.9" />
              <rect x="100" y="40" width="10" height="6" rx="2" fill="#22d3ee" opacity="0.9" />

              {/* Headlight glow */}
              <rect x="6" y="41" width="6" height="4" rx="1" fill="#22d3ee" opacity="0.3" />
              <rect x="108" y="41" width="6" height="4" rx="1" fill="#22d3ee" opacity="0.3" />

              {/* Front wheel */}
              <circle cx="30" cy="63" r="10" fill="#1e293b" stroke="#22d3ee" strokeWidth="2" />
              <circle cx="30" cy="63" r="5" fill="#0e7490" />
              <circle cx="30" cy="63" r="2" fill="#22d3ee" />

              {/* Rear wheel */}
              <circle cx="90" cy="63" r="10" fill="#1e293b" stroke="#22d3ee" strokeWidth="2" />
              <circle cx="90" cy="63" r="5" fill="#0e7490" />
              <circle cx="90" cy="63" r="2" fill="#22d3ee" />

              {/* Antenna */}
              <line x1="60" y1="12" x2="60" y2="4" stroke="#22d3ee" strokeWidth="1.5" />
              <circle cx="60" cy="3" r="2" fill="#22d3ee" />

              {/* Robot eye / sensor on cabin */}
              <circle cx="60" cy="24" r="4" fill="#0e7490" stroke="#22d3ee" strokeWidth="1" />
              <circle cx="60" cy="24" r="2" fill="#22d3ee" opacity="0.9" />
              <circle cx="61" cy="23" r="0.8" fill="white" opacity="0.8" />
            </svg>
          </div>
        </div>

        {/* Brand name */}
        <h1 className="text-5xl font-bold mb-2 tracking-tight">
          <span className="text-cyan-400">Over</span>
          <span className="text-white">Drive</span>
        </h1>

        {/* Tagline */}
        <p className="text-gray-400 text-base mb-2">AI Vehicle Valuation Platform</p>
        <p className="text-gray-600 text-sm mb-12 max-w-xs">
          Know your vehicle's true market value — instantly.
        </p>

        {/* Get Started button */}
        <button
          onClick={() => navigate("/login")}
          className="group relative px-10 py-4 bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-lg rounded-2xl transition-all duration-300 shadow-lg shadow-cyan-400/30 hover:shadow-cyan-400/50 hover:scale-105 active:scale-95"
        >
          Get Started
          <svg
            className="inline-block ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>

        {/* Already have account */}
        <p className="mt-6 text-gray-600 text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-cyan-400 hover:text-cyan-300 font-medium transition"
          >
            Sign in
          </button>
        </p>
      </div>

      {/* Bottom version tag */}
      <p className="absolute bottom-6 text-gray-700 text-xs">v1.0.0</p>
    </div>
  );
}

export default Splash;
