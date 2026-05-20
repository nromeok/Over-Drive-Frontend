import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function humaniseError(msg) {
  if (!msg) return "Something went wrong. Please try again.";
  if (msg === "Failed to fetch" || msg.includes("NetworkError") || msg.includes("fetch"))
    return "Cannot reach the server. Make sure the backend is running.";
  if (msg.includes("401") || msg.toLowerCase().includes("invalid credentials"))
    return "Incorrect email or password.";
  return msg;
}

function Login() {
  const { login, loading, error, isAuthenticated, clearAuthError } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e) => {
    clearAuthError();
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    if (result.success) navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#EEF2F5] flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold">
          <span className="text-cyan-400">Over </span>
          <span className="text-cyan-400">Drive</span>
        </h1>
        <p className="mt-2 text-gray-700">AI Vehicle Valuation Platform</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white/40 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-white/30">

        <h2 className="text-3xl font-bold text-black mb-2">Welcome Back</h2>
        <p className="text-gray-800 mb-6">Sign in to access your dashboard</p>

        {/* Error banner */}
        {error && (
          <div className="mb-5 flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="flex-1">{humaniseError(error)}</span>
            <button onClick={clearAuthError} className="text-red-400 hover:text-red-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-5">
            <label className="block mb-2 font-medium text-sm">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full p-4 rounded-2xl border border-gray-300 bg-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block mb-2 font-medium text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              required
              className="w-full p-4 rounded-2xl border border-gray-300 bg-white/50 outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Options */}
          <div className="flex items-center justify-between mb-6 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#" className="text-cyan-400 hover:text-cyan-500">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-400 hover:bg-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 text-black font-semibold py-4 rounded-2xl text-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In →"
            )}
          </button>
        </form>

        <div className="border-t border-gray-300 my-6" />

        <p className="text-center text-gray-800 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-cyan-400 font-semibold hover:text-cyan-500">
            Sign up for Free
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
