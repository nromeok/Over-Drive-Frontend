import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { authService } from "../api/authService";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, description, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="mb-5">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-3 border border-gray-300 rounded-xl outline-none text-sm focus:ring-2 focus:ring-cyan-400 transition";

// ─── Main page ────────────────────────────────────────────────────────────────

function Profile() {
  const { user, token, updateUserProfile, logout } = useAuth();

  // ── Profile form ──────────────────────────────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    name:  user?.name  || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError,   setProfileError]   = useState("");

  // ── Password form ─────────────────────────────────────────────────────────
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword:     "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError,   setPasswordError]   = useState("");

  // ── Delete account ────────────────────────────────────────────────────────
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError,   setDeleteError]   = useState("");

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleProfileChange = (e) => {
    setProfileForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setProfileError("");
    setProfileSuccess("");
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) { setProfileError("Name is required."); return; }
    setProfileLoading(true);
    setProfileError("");
    setProfileSuccess("");
    try {
      await authService.updateProfile(profileForm, token);
      updateUserProfile(profileForm);
      setProfileSuccess("Profile updated successfully.");
    } catch (err) {
      setProfileError(err.message === "Failed to fetch" ? "Cannot reach the server." : err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (!currentPassword) { setPasswordError("Enter your current password."); return; }
    if (newPassword.length < 6) { setPasswordError("New password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { setPasswordError("Passwords do not match."); return; }

    setPasswordLoading(true);
    setPasswordError("");
    setPasswordSuccess("");
    try {
      await authService.changePassword({ currentPassword, newPassword }, token);
      setPasswordSuccess("Password changed successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordError(err.message === "Failed to fetch" ? "Cannot reach the server." : err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      setDeleteError('Type "DELETE" to confirm.');
      return;
    }
    setDeleteLoading(true);
    setDeleteError("");
    try {
      if (!USE_MOCK) {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/api/auth/account`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Could not delete account.");
        }
      }
      // Mock: just log out
      logout();
    } catch (err) {
      setDeleteError(err.message === "Failed to fetch" ? "Cannot reach the server." : err.message);
      setDeleteLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage your account details and security.</p>
      </div>

      {/* ── Avatar + name ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-cyan-400 flex items-center justify-center text-black text-2xl font-bold flex-shrink-0">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-lg">{user?.name}</p>
          <p className="text-sm text-gray-400">{user?.email}</p>
          {user?.provider && (
            <span className="mt-1 inline-block text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full capitalize">
              {user.provider} account
            </span>
          )}
        </div>
      </div>

      {/* ── Personal info ── */}
      <Section title="Personal Information" description="Update your name, email and phone number.">
        {profileSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
            {profileSuccess}
          </div>
        )}
        {profileError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {profileError}
          </div>
        )}
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <Field label="Full Name">
            <input
              type="text"
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
              className={inputClass}
            />
          </Field>
          <Field label="Email Address">
            <input
              type="email"
              name="email"
              value={profileForm.email}
              onChange={handleProfileChange}
              className={inputClass}
            />
          </Field>
          <Field label="Phone Number">
            <input
              type="tel"
              name="phone"
              value={profileForm.phone}
              onChange={handleProfileChange}
              placeholder="+254 700 000 000"
              className={inputClass}
            />
          </Field>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={profileLoading}
              className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold text-sm rounded-xl transition flex items-center gap-2"
            >
              {profileLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : "Save Changes"}
            </button>
          </div>
        </form>
      </Section>

      {/* ── Change password ── */}
      <Section title="Change Password" description="Use a strong password you don't use elsewhere.">
        {passwordSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
            {passwordSuccess}
          </div>
        )}
        {passwordError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {passwordError}
          </div>
        )}
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Field label="Current Password">
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              className={inputClass}
            />
          </Field>
          <Field label="New Password">
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              placeholder="Min. 6 characters"
              className={inputClass}
            />
          </Field>
          <Field label="Confirm New Password">
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              className={inputClass}
            />
          </Field>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={passwordLoading}
              className="px-6 py-2.5 bg-gray-900 hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition flex items-center gap-2"
            >
              {passwordLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : "Update Password"}
            </button>
          </div>
        </form>
      </Section>

      {/* ── Danger zone ── */}
      <Section title="Danger Zone" description="Permanently delete your account and all your data.">
        <p className="text-sm text-gray-500 mb-4">
          This action cannot be undone. All your valuations and account data will be permanently removed.
        </p>
        {deleteError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {deleteError}
          </div>
        )}
        <div className="space-y-3">
          <Field label='Type "DELETE" to confirm'>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => { setDeleteConfirm(e.target.value); setDeleteError(""); }}
              placeholder="DELETE"
              className="w-full px-4 py-3 border border-red-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-red-300 transition"
            />
          </Field>
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={deleteLoading || deleteConfirm !== "DELETE"}
            className="px-6 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition flex items-center gap-2"
          >
            {deleteLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : "Delete My Account"}
          </button>
        </div>
      </Section>

    </div>
  );
}

export default Profile;
