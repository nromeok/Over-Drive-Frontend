import { useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const MAX_FILES   = 6;
const MAX_SIZE_MB = 5;
const ACCEPTED    = ["image/jpeg", "image/png", "image/webp", "image/heic"];

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Single image preview card ────────────────────────────────────────────────

function ImageCard({ file, preview, onRemove }) {
  return (
    <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square">
      <img
        src={preview}
        alt={file.name}
        className="w-full h-full object-cover"
      />
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
        <button
          type="button"
          onClick={onRemove}
          className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
          aria-label="Remove image"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {/* File size badge */}
      <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
        {formatBytes(file.size)}
      </div>
    </div>
  );
}

// ─── Drop zone ────────────────────────────────────────────────────────────────

function DropZone({ onFiles, disabled }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files);
    onFiles(files);
  }, [onFiles, disabled]);

  const handleDragOver = (e) => { e.preventDefault(); if (!disabled) setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const handleInput = (e) => {
    const files = Array.from(e.target.files);
    onFiles(files);
    e.target.value = "";
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-10 text-center transition cursor-pointer ${
        disabled
          ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
          : dragging
          ? "border-cyan-400 bg-cyan-50"
          : "border-gray-300 hover:border-cyan-400 hover:bg-cyan-50/30"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        multiple
        className="hidden"
        onChange={handleInput}
        disabled={disabled}
      />
      <div className="w-14 h-14 rounded-full bg-cyan-50 flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-700 mb-1">
        {dragging ? "Drop your photos here" : "Drag & drop photos here"}
      </p>
      <p className="text-xs text-gray-400">
        or <span className="text-cyan-500 font-medium">browse files</span>
      </p>
      <p className="text-xs text-gray-400 mt-2">
        JPG, PNG, WEBP · Max {MAX_SIZE_MB}MB each · Up to {MAX_FILES} photos
      </p>
    </div>
  );
}

// ─── Tips ─────────────────────────────────────────────────────────────────────

const TIPS = [
  "Front view — full vehicle visible",
  "Rear view",
  "Driver side profile",
  "Interior — dashboard & seats",
  "Engine bay",
  "Any damage or notable features",
];

// ─── Main page ────────────────────────────────────────────────────────────────

function ImageUpload() {
  const { token } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  // If navigated from NewValuation, the valuation ID is in state
  const valuationId = location.state?.valuationId;

  const [images, setImages]     = useState([]); // { file, preview }
  const [errors, setErrors]     = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const addFiles = useCallback((files) => {
    const newErrors = [];
    const valid = [];

    files.forEach((file) => {
      if (!ACCEPTED.includes(file.type)) {
        newErrors.push(`${file.name}: unsupported format.`);
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        newErrors.push(`${file.name}: exceeds ${MAX_SIZE_MB}MB limit.`);
        return;
      }
      if (images.length + valid.length >= MAX_FILES) {
        newErrors.push(`Maximum ${MAX_FILES} photos allowed.`);
        return;
      }
      valid.push({ file, preview: URL.createObjectURL(file) });
    });

    setErrors(newErrors);
    setImages((prev) => [...prev, ...valid].slice(0, MAX_FILES));
  }, [images]);

  const removeImage = (index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUpload = async () => {
    if (images.length === 0) return;
    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      images.forEach(({ file }) => formData.append("images", file));
      if (valuationId) formData.append("valuationId", valuationId);

      const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

      if (USE_MOCK) {
        // Simulate upload delay
        await new Promise((r) => setTimeout(r, 1500));
        navigate(valuationId ? `/valuation/${valuationId}` : "/dashboard");
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/vehicles/images`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Upload failed.");
      }

      navigate(valuationId ? `/valuation/${valuationId}` : "/dashboard");
    } catch (err) {
      setUploadError(
        err.message === "Failed to fetch"
          ? "Cannot reach the server."
          : err.message
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = () => {
    navigate(valuationId ? `/valuation/${valuationId}` : "/dashboard");
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Upload Vehicle Photos</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Photos help our AI give a more accurate valuation. You can add up to {MAX_FILES} images.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — uploader */}
        <div className="lg:col-span-2 space-y-5">

          <DropZone onFiles={addFiles} disabled={images.length >= MAX_FILES} />

          {/* Error list */}
          {errors.length > 0 && (
            <div className="space-y-1">
              {errors.map((e, i) => (
                <p key={i} className="text-xs text-red-500 flex items-center gap-1">
                  <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {e}
                </p>
              ))}
            </div>
          )}

          {/* Image grid */}
          {images.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-700">
                  {images.length} / {MAX_FILES} photos added
                </p>
                <button
                  type="button"
                  onClick={() => { images.forEach(({ preview }) => URL.revokeObjectURL(preview)); setImages([]); }}
                  className="text-xs text-red-400 hover:text-red-600 transition"
                >
                  Remove all
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {images.map(({ file, preview }, i) => (
                  <ImageCard
                    key={i}
                    file={file}
                    preview={preview}
                    onRemove={() => removeImage(i)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Upload error */}
          {uploadError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {uploadError}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleSkip}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Skip for now
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={images.length === 0 || uploading}
              className="flex-1 px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold text-sm transition flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                `Upload ${images.length > 0 ? `${images.length} ` : ""}Photo${images.length !== 1 ? "s" : ""} →`
              )}
            </button>
          </div>
        </div>

        {/* Right — tips */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-fit">
          <h3 className="font-semibold text-gray-900 mb-1 text-sm">Photo tips</h3>
          <p className="text-xs text-gray-400 mb-4">
            Better photos = more accurate valuation. Try to include:
          </p>
          <ul className="space-y-2.5">
            {TIPS.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <div className="w-5 h-5 rounded-full bg-cyan-50 text-cyan-500 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                  {i + 1}
                </div>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
