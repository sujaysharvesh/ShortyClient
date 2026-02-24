"use client";

import Link from "next/link";
import { Link2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [shortCode, setShortCode] = useState("");
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const path = window.location.pathname;
    const code = path.slice(1);
    setShortCode(code);
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown <= 0) router.replace("/");
  }, [countdown, router]);

  return (
    <div
      className="min-h-screen bg-[#f9f7f4] flex flex-col relative overflow-hidden"
      style={{ fontFamily: "Georgia, Times New Roman, serif" }}
    >
      {/* SVG Line Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.13 }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <line key={`h-${i}`} x1="0" y1={`${(i + 1) * 3.5}%`} x2="100%" y2={`${(i + 1) * 3.5}%`} stroke="#2a2520" strokeWidth="0.6" />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`v-${i}`} x1={`${(i + 1) * 5}%`} y1="0" x2={`${(i + 1) * 5}%`} y2="100%" stroke="#2a2520" strokeWidth="0.6" />
        ))}
        {/* Top-right circle cluster */}
        <circle cx="88%" cy="12%" r="80" stroke="#2a2520" strokeWidth="0.8" fill="none" />
        <circle cx="88%" cy="12%" r="55" stroke="#2a2520" strokeWidth="0.5" fill="none" />
        <circle cx="88%" cy="12%" r="30" stroke="#2a2520" strokeWidth="0.4" fill="none" />
        {/* Crosshair top-right */}
        <line x1="88%" y1="calc(12% - 14px)" x2="88%" y2="calc(12% + 14px)" stroke="#2a2520" strokeWidth="0.8" />
        <line x1="calc(88% - 14px)" y1="12%" x2="calc(88% + 14px)" y2="12%" stroke="#2a2520" strokeWidth="0.8" />
        {/* Bottom-left circle cluster */}
        <circle cx="12%" cy="88%" r="65" stroke="#2a2520" strokeWidth="0.8" fill="none" />
        <circle cx="12%" cy="88%" r="42" stroke="#2a2520" strokeWidth="0.5" fill="none" />
        {/* Crosshair bottom-left */}
        <line x1="12%" y1="calc(88% - 14px)" x2="12%" y2="calc(88% + 14px)" stroke="#2a2520" strokeWidth="0.8" />
        <line x1="calc(12% - 14px)" y1="88%" x2="calc(12% + 14px)" y2="88%" stroke="#2a2520" strokeWidth="0.8" />
        {/* Diagonal accents top-left */}
        <line x1="0" y1="0" x2="180" y2="180" stroke="#2a2520" strokeWidth="1.0" />
        <line x1="0" y1="50" x2="180" y2="230" stroke="#2a2520" strokeWidth="0.6" />
        {/* Diagonal accents bottom-right */}
        <line x1="100%" y1="100%" x2="calc(100% - 180px)" y2="calc(100% - 180px)" stroke="#2a2520" strokeWidth="1.0" />
        <line x1="100%" y1="calc(100% - 50px)" x2="calc(100% - 180px)" y2="calc(100% - 230px)" stroke="#2a2520" strokeWidth="0.6" />
      </svg>

      {/* Header */}
      <header className="relative z-10 flex items-center px-8 py-6" style={{ borderBottom: "1px solid rgba(42,37,32,0.08)" }}>
        <Link href="/" className="flex items-center gap-2.5" style={{ textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, background: "#1e1a16", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Link2 size={15} color="#f0ece6" strokeWidth={2} />
          </div>
          <span style={{ fontSize: 17, fontFamily: "Georgia, serif", color: "#1e1a16", letterSpacing: "-0.01em", fontWeight: 700 }}>
            Shorty<span style={{ fontWeight: 400, color: "#7c6f5e" }}>URL</span>
          </span>
        </Link>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-lg">

          {/* Error badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1e1a16", borderRadius: 999, padding: "5px 14px 5px 8px", marginBottom: 32 }}>
            <div style={{ width: 20, height: 20, background: "#f0ece6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Link2 size={10} color="#1e1a16" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 11, letterSpacing: "0.12em", color: "#f0ece6", fontFamily: "Georgia, serif", fontWeight: 600 }}>
              ERROR · 404
            </span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 400, color: "#1e1a16", lineHeight: 1.08, letterSpacing: "-0.025em", marginBottom: 16, fontFamily: "Georgia, serif" }}>
            Link not{" "}
            <em style={{ fontStyle: "italic", color: "#5c4f3d" }}>found.</em>
          </h1>

          <p style={{ fontSize: 15, color: "#5c4f3d", lineHeight: 1.8, marginBottom: 28, opacity: 0.75 }}>
            The short link you're looking for doesn't exist<br />or may have expired.
          </p>

          {/* Short code display */}
          {shortCode && (
            <div style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(42,37,32,0.12)", borderRadius: 8, padding: "12px 28px", marginBottom: 28, display: "inline-block", backdropFilter: "blur(8px)" }}>
              <span style={{ fontSize: 10, letterSpacing: "0.12em", color: "#8b7f6f", display: "block", marginBottom: 5 }}>
                REQUESTED CODE
              </span>
              <span style={{ fontFamily: "monospace", fontSize: 17, color: "#1e1a16", fontWeight: 600 }}>
                /{shortCode}
              </span>
            </div>
          )}

          {/* Decorative rule */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, justifyContent: "center" }}>
            <div style={{ width: 28, height: 1, background: "#2a2520", opacity: 0.2 }} />
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#2a2520", opacity: 0.2 }} />
            <div style={{ width: 28, height: 1, background: "#2a2520", opacity: 0.2 }} />
          </div>

          {/* Countdown */}
          <p style={{ fontSize: 12, color: "#8b7f6f", marginBottom: 32, letterSpacing: "0.06em" }}>
            Redirecting to homepage in{" "}
            <span style={{ fontWeight: 700, color: "#1e1a16" }}>{countdown}</span>{" "}
            seconds...
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              style={{
                display: "inline-block",
                padding: "13px 44px",
                background: "#1e1a16",
                color: "#f0ece6",
                fontSize: 12,
                letterSpacing: "0.1em",
                fontFamily: "Georgia, serif",
                border: "1px solid #1e1a16",
                borderRadius: 2,
                textDecoration: "none",
                fontWeight: 600,
                boxShadow: "0 2px 12px rgba(30,26,22,0.18)",
              }}
            >
              GO TO HOMEPAGE
            </Link>

            <button
              onClick={() => router.back()}
              style={{
                padding: "13px 44px",
                background: "transparent",
                color: "#2a2520",
                fontSize: 12,
                letterSpacing: "0.1em",
                fontFamily: "Georgia, serif",
                border: "1px solid rgba(42,37,32,0.22)",
                borderRadius: 2,
                cursor: "pointer",
              }}
            >
              GO BACK
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-5 flex items-center justify-between" style={{ borderTop: "1px solid rgba(42,37,32,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Link2 size={10} color="#2a2520" style={{ opacity: 0.3 }} />
          <span style={{ fontSize: 11, color: "#2a2520", opacity: 0.3, letterSpacing: "0.06em" }}>SHORTYURL © 2025</span>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 11, color: "#2a2520", opacity: 0.3, letterSpacing: "0.05em" }}>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </footer>
    </div>
  );
}