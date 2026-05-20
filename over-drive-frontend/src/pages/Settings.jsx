import { useState } from "react";
import { useAuth } from "../Context/AuthContext";

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, description, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="mb-5 pb-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

// ─── Toggle row ───────────────────────────────────────────────────────────────

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
          checked ? "bg-cyan-400" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

// ─── Select row ───────────────────────────────────────────────────────────────

function SelectRow({ label, description, value, options, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-cyan-400 bg-white text-gray-700"
      >
        {options.map(({ value: v, label: l }) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function Settings() {
  const { logout } = useAuth();

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailValuations:  true,
    emailMarketing:   false,
    pushValuations:   true,
    pushReminders:    false,
  });

  // Preferences
  const [currency, setCurrency]   = useState("KES");
  const [language, setLanguage]   = useState("en");
  const [mileageUnit, setMileageUnit] = useState("km");

  // Privacy
  const [privacy, setPrivacy] = useState({
    shareAnonymousData: true,
    allowAnalytics:     true,
  });

  const [saved, setSaved] = useState(false);

  const toggle = (group, setter) => (key) => (val) => {
    setter((prev) => ({ ...prev, [key]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    // In production: PUT /api/settings with all preferences
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your preferences and notifications.</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
            saved
              ? "bg-green-100 text-green-700"
              : "bg-cyan-400 hover:bg-cyan-500 text-black"
          }`}
        >
          {saved ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </>
          ) : "Save Changes"}
        </button>
      </div>

      {/* ── Notifications ── */}
      <Section title="Email Notifications" description="Choose which emails you want to receive.">
        <ToggleRow
          label="Valuation reports"
          description="Get emailed when your valuation is ready."
          checked={notifications.emailValuations}
          onChange={toggle(notifications, setNotifications)("emailValuations")}
        />
        <ToggleRow
          label="Tips & market updates"
          description="Occasional emails about vehicle market trends."
          checked={notifications.emailMarketing}
          onChange={toggle(notifications, setNotifications)("emailMarketing")}
        />
      </Section>

      <Section title="Push Notifications" description="In-app notification preferences.">
        <ToggleRow
          label="Valuation complete"
          description="Notify me when a valuation finishes processing."
          checked={notifications.pushValuations}
          onChange={toggle(notifications, setNotifications)("pushValuations")}
        />
        <ToggleRow
          label="Reminders"
          description="Remind me to re-value vehicles after 6 months."
          checked={notifications.pushReminders}
          onChange={toggle(notifications, setNotifications)("pushReminders")}
        />
      </Section>

      {/* ── Preferences ── */}
      <Section title="Preferences" description="Customise how the app displays information.">
        <SelectRow
          label="Currency"
          description="Currency used for all valuations."
          value={currency}
          options={[
            { value: "KES", label: "KES — Kenyan Shilling" },
            { value: "USD", label: "USD — US Dollar" },
            { value: "GBP", label: "GBP — British Pound" },
          ]}
          onChange={setCurrency}
        />
        <SelectRow
          label="Mileage unit"
          value={mileageUnit}
          options={[
            { value: "km",    label: "Kilometres (km)" },
            { value: "miles", label: "Miles" },
          ]}
          onChange={setMileageUnit}
        />
        <SelectRow
          label="Language"
          value={language}
          options={[
            { value: "en",    label: "English" },
            { value: "sw",    label: "Swahili" },
          ]}
          onChange={setLanguage}
        />
      </Section>

      {/* ── Privacy ── */}
      <Section title="Privacy" description="Control how your data is used.">
        <ToggleRow
          label="Share anonymous usage data"
          description="Helps us improve the AI model. No personal data is shared."
          checked={privacy.shareAnonymousData}
          onChange={toggle(privacy, setPrivacy)("shareAnonymousData")}
        />
        <ToggleRow
          label="Allow analytics"
          description="Helps us understand how the app is used."
          checked={privacy.allowAnalytics}
          onChange={toggle(privacy, setPrivacy)("allowAnalytics")}
        />
      </Section>

      {/* ── Session ── */}
      <Section title="Session">
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-gray-800">Sign out of all devices</p>
            <p className="text-xs text-gray-400 mt-0.5">
              This will log you out everywhere and clear your session.
            </p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium transition"
          >
            Sign Out
          </button>
        </div>
      </Section>

    </div>
  );
}

export default Settings;
