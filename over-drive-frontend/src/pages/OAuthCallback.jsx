import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

/**
 * OAuthCallback
 *
 * After Google/Facebook OAuth, the backend redirects here with:
 *   /auth/callback?token=<jwt>&user=<base64-encoded-json>
 *
 * This page reads those params, stores them, updates auth state,
 * then sends the user to the dashboard.
 *
 * Ask your backend team to redirect to:
 *   http://localhost:5173/auth/callback?token=TOKEN&user=BASE64_USER
 */
function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(atob(userParam));
        loginWithToken(token, user);
        navigate("/dashboard", { replace: true });
      } catch {
        navigate("/login?error=oauth_failed", { replace: true });
      }
      return;
    }

    // Nothing useful in the URL
    navigate("/login", { replace: true });
  }, [searchParams, loginWithToken, navigate]);

  return (
    <div className="min-h-screen bg-[#EEF2F5] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 text-sm">Completing sign in...</p>
      </div>
    </div>
  );
}

export default OAuthCallback;
