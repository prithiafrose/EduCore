import { useRef, useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { resizeImageToDataUrl } from "../../utils/resizeImage";

function AvatarUploader({
  avatarUrl = "",
  name = "",
  size = "md",
  busy = false,
  onSelect,
  onError,
}) {
  const fileRef = useRef(null);
  const [processing, setProcessing] = useState(false);

  const sizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-28 h-28",
  };

  const initials = (name || "?").trim().charAt(0).toUpperCase();

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      onError?.("Image must be smaller than 5 MB.");
      return;
    }

    try {
      setProcessing(true);
      const dataUrl = await resizeImageToDataUrl(file);
      onSelect?.(dataUrl);
    } catch (error) {
      onError?.(error?.message || "Failed to process the image.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative shrink-0">
        <div
          className={`${sizes[size]} rounded-full overflow-hidden ring-4 ring-white/20 bg-white/10 flex items-center justify-center`}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold text-white/90">
              {initials}
            </span>
          )}
        </div>

        {(processing || busy) && (
          <span className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </span>
        )}

        {avatarUrl && (
          <button
            type="button"
            onClick={() => onSelect?.(null)}
            disabled={busy || processing}
            aria-label="Remove profile picture"
            className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-slate-900 border border-white/20 text-slate-200 flex items-center justify-center hover:bg-slate-700 transition disabled:opacity-50"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={busy || processing}
        className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-4 py-2 transition disabled:opacity-50"
      >
        <Camera size={14} />
        {avatarUrl ? "Change Photo" : "Upload Photo"}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

export default AvatarUploader;