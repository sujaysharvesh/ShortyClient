"use client";

import { useEffect, useState } from "react";
import UrlForm from "@/components/url-form";
import LinksList from "@/components/links-list";
import { useAuth } from "@/provider/AuthContext";
import { UrlResponse } from "@/types/url";
import { urlService } from "@/service/urlService";
import { useRouter } from "next/navigation";
import { Link2, WifiOff, X, RefreshCw } from "lucide-react";
import Logout from "@/components/logout";

function ServerErrorBanner({ message, onDismiss, onRetry }: { message: string; onDismiss: () => void; onRetry?: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        background: "rgba(255,255,255,0.85)",
        border: "1px solid rgba(180,60,40,0.2)",
        borderLeft: "3px solid #b43c28",
        borderRadius: 8,
        padding: "14px 16px",
        marginBottom: 24,
        backdropFilter: "blur(8px)",
        boxShadow: "0 2px 12px rgba(180,60,40,0.08)",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 32,
          height: 32,
          background: "rgba(180,60,40,0.08)",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <WifiOff size={15} color="#b43c28" strokeWidth={2} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#b43c28", letterSpacing: "0.06em", marginBottom: 3, fontFamily: "Georgia, serif" }}>
          SERVER UNAVAILABLE
        </p>
        <p style={{ fontSize: 13, color: "#5c4f3d", lineHeight: 1.6, fontFamily: "Georgia, serif" }}>
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              marginTop: 8,
              fontSize: 11,
              letterSpacing: "0.08em",
              color: "#b43c28",
              background: "none",
              border: "1px solid rgba(180,60,40,0.25)",
              borderRadius: 4,
              padding: "4px 10px",
              cursor: "pointer",
              fontFamily: "Georgia, serif",
              fontWeight: 600,
            }}
          >
            <RefreshCw size={11} />
            RETRY
          </button>
        )}
      </div>

      {/* Dismiss */}
      <button
        onClick={onDismiss}
        style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(92,79,61,0.5)", padding: 2, flexShrink: 0, display: "flex" }}
      >
        <X size={15} />
      </button>
    </div>
  );
}

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [links, setLinks] = useState<UrlResponse[]>([]);
  const [fetching, setFetching] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [retryFn, setRetryFn] = useState<(() => void) | null>(null);

  const fetchLinks = () => {
    setFetching(true);
    setServerError(null);
    urlService
      .getUserUrls()
      .then(setLinks)
      .catch(() => {
        setServerError("Unable to load your links. The server may be temporarily unavailable — please try again in a moment.");
        setRetryFn(() => fetchLinks);
      })
      .finally(() => setFetching(false));
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has("error")) {
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.pathname);
    }
  }, []);

  useEffect(() => {
    if (!loading && user) fetchLinks();
  }, [loading, user]);

  const handleCreateLink = async (originalUrl: string, expirationOption: string) => {
    setServerError(null);
    setRetryFn(null);
    try {
      const newUrl = await urlService.shortenUrl(originalUrl, expirationOption);
      setLinks((prev) => [newUrl, ...prev]);
    } catch (err) {
      console.error("Failed to create link", err);
      setServerError("Could not shorten the link — the server appears to be unavailable. Please check your connection and try again.");
      setRetryFn(null);
    }
  };

  const handleDeleteLink = async (shortUrl: string) => {
    setServerError(null);
    setRetryFn(null);
    const shortCode = shortUrl.split("/").pop() || "";
    try {
      await urlService.deleteUrl(shortCode);
      setLinks((prev) => prev.filter((link) => !link.shortUrl.endsWith(shortCode)));
    } catch (err) {
      console.error("Failed to delete link", err);
      setServerError("Could not delete the link — the server may be temporarily unavailable.");
      setRetryFn(null);
    }
  };

  // useEffect(() => {
  //   if (!loading && !user) router.replace("/login");
  // }, [loading, user, router]);

  if (loading || fetching) {
    return (
      <div
        className="min-h-screen bg-[#f9f7f4] flex flex-col items-center justify-center relative overflow-hidden"
        style={{ fontFamily: "Georgia, Times New Roman, serif" }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.13 }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={`${(i + 1) * 3.5}%`} x2="100%" y2={`${(i + 1) * 3.5}%`} stroke="#2a2520" strokeWidth="0.6" />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`v-${i}`} x1={`${(i + 1) * 5}%`} y1="0" x2={`${(i + 1) * 5}%`} y2="100%" stroke="#2a2520" strokeWidth="0.6" />
          ))}
        </svg>
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#1e1a16] border-t-transparent rounded-full animate-spin" />
          <p style={{ fontSize: 13, color: "#5c4f3d", letterSpacing: "0.08em" }}>LOADING...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div
      className="min-h-screen bg-[#f9f7f4] flex flex-col relative overflow-hidden"
      style={{ fontFamily: "Georgia, Times New Roman, serif" }}
    >
      {/* SVG Line Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.10 }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <line key={`h-${i}`} x1="0" y1={`${(i + 1) * 3.5}%`} x2="100%" y2={`${(i + 1) * 3.5}%`} stroke="#2a2520" strokeWidth="0.6" />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`v-${i}`} x1={`${(i + 1) * 5}%`} y1="0" x2={`${(i + 1) * 5}%`} y2="100%" stroke="#2a2520" strokeWidth="0.6" />
        ))}
        <circle cx="92%" cy="8%" r="70" stroke="#2a2520" strokeWidth="0.7" fill="none" />
        <circle cx="92%" cy="8%" r="48" stroke="#2a2520" strokeWidth="0.5" fill="none" />
        <circle cx="8%" cy="92%" r="55" stroke="#2a2520" strokeWidth="0.7" fill="none" />
        <circle cx="8%" cy="92%" r="34" stroke="#2a2520" strokeWidth="0.5" fill="none" />
      </svg>

      {/* Header */}
      <header
        className="relative z-10 flex items-center justify-between px-8 py-6"
        style={{ borderBottom: "1px solid rgba(42,37,32,0.1)" }}
      >
        <div className="flex items-center gap-2.5">
          <div style={{ width: 32, height: 32, background: "#1e1a16", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Link2 size={15} color="#f0ece6" strokeWidth={2} />
          </div>
          <span style={{ fontSize: 17, fontFamily: "Georgia, serif", color: "#1e1a16", letterSpacing: "-0.01em", fontWeight: 700 }}>
            Shorty<span style={{ fontWeight: 400, color: "#7c6f5e" }}>URL</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(42,37,32,0.05)", border: "1px solid rgba(42,37,32,0.12)", borderRadius: 999, padding: "4px 14px 4px 4px" }}>
            <div style={{ width: 28, height: 28, background: "#1e1a16", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#f0ece6", fontWeight: 600 }}>
              {user.data.username?.[0]?.toUpperCase() ?? "U"}
            </div>
            <span style={{ fontSize: 13, color: "#2a2520", fontWeight: 500 }}>
              {user.data.username}
            </span>
          </div>
          <Logout variant="icon" />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="mb-10 text-center">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1e1a16", borderRadius: 999, padding: "5px 14px 5px 8px", marginBottom: 20 }}>
            <div style={{ width: 20, height: 20, background: "#f0ece6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Link2 size={10} color="#1e1a16" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 11, letterSpacing: "0.12em", color: "#f0ece6", fontFamily: "Georgia, serif", fontWeight: 600 }}>
              YOUR DASHBOARD
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 400, color: "#1e1a16", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 10, fontFamily: "Georgia, serif" }}>
            Welcome back,{" "}
            <em style={{ fontStyle: "italic", color: "#5c4f3d" }}>{user.data.username}.</em>
          </h1>
          <p style={{ fontSize: 14, color: "#5c4f3d", opacity: 0.75, letterSpacing: "0.02em" }}>
            Create clean, shareable links and track their performance.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20, justifyContent: "center" }}>
            <div style={{ width: 28, height: 1, background: "#2a2520", opacity: 0.2 }} />
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#2a2520", opacity: 0.2 }} />
            <div style={{ width: 28, height: 1, background: "#2a2520", opacity: 0.2 }} />
          </div>
        </div>

        {/* Error Banner */}
        {serverError && (
          <ServerErrorBanner
            message={serverError}
            onDismiss={() => { setServerError(null); setRetryFn(null); }}
            onRetry={retryFn ?? undefined}
          />
        )}

        {/* Content grid */}
        <div className="grid gap-8 lg:grid-cols-1">
          <div className="lg:col-span-1">
            <div style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(42,37,32,0.12)", borderRadius: 16, backdropFilter: "blur(8px)" }}>
              <UrlForm onCreateLink={handleCreateLink} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <LinksList links={links} onDeleteLink={handleDeleteLink} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-5 flex items-center justify-center" style={{ borderTop: "1px solid rgba(42,37,32,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Link2 size={10} color="#2a2520" style={{ opacity: 0.3 }} />
          <span style={{ fontSize: 11, color: "#2a2520", opacity: 0.5, letterSpacing: "0.06em" }}>SHORTYURL © 2026</span>
        </div>
      </footer>
    </div>
  );
}