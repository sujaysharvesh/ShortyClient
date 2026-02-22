"use client";

import { Link2 } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div
      className="min-h-screen bg-[#f9f7f4] flex flex-col relative overflow-hidden"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      
    >
      {/* SVG Line Background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.13 }}
      >
        {/* Horizontal lines */}
        {Array.from({ length: 100 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={`${(i + 1) * 3.5}%`}
            x2="100%"
            y2={`${(i + 1) * 3.5}%`}
            stroke="#2a2520"
            strokeWidth="0.6"
          />
        ))}
        {/* Vertical lines */}
        {Array.from({ length: 100 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={`${(i + 1) * 5}%`}
            y1="0"
            x2={`${(i + 1) * 5}%`}
            y2="100%"
            stroke="#2a2520"
            strokeWidth="0.6"
          />
        ))}
        {/* Diagonal accent lines - top left cluster */}
        <line x1="0" y1="0" x2="220" y2="220" stroke="#2a2520" strokeWidth="1.2" />
        <line x1="0" y1="50" x2="220" y2="270" stroke="#2a2520" strokeWidth="0.7" />
        <line x1="0" y1="100" x2="220" y2="320" stroke="#2a2520" strokeWidth="0.7" />
        {/* Diagonal accent lines - bottom right cluster */}
        <line x1="100%" y1="100%" x2="calc(100% - 220px)" y2="calc(100% - 220px)" stroke="#2a2520" strokeWidth="1.2" />
        <line x1="100%" y1="calc(100% - 50px)" x2="calc(100% - 220px)" y2="calc(100% - 270px)" stroke="#2a2520" strokeWidth="0.7" />
        <line x1="100%" y1="calc(100% - 100px)" x2="calc(100% - 220px)" y2="calc(100% - 320px)" stroke="#2a2520" strokeWidth="0.7" />
        {/* Circle accents */}
        <circle cx="85%" cy="15%" r="90" stroke="#2a2520" strokeWidth="0.8" fill="none" />
        <circle cx="85%" cy="15%" r="62" stroke="#2a2520" strokeWidth="0.6" fill="none" />
        <circle cx="85%" cy="15%" r="36" stroke="#2a2520" strokeWidth="0.4" fill="none" />
        <circle cx="15%" cy="80%" r="70" stroke="#2a2520" strokeWidth="0.8" fill="none" />
        <circle cx="15%" cy="80%" r="44" stroke="#2a2520" strokeWidth="0.5" fill="none" />
        {/* Cross markers at intersections */}
        <line x1="85%" y1="calc(15% - 12px)" x2="85%" y2="calc(15% + 12px)" stroke="#2a2520" strokeWidth="0.8" />
        <line x1="calc(85% - 12px)" y1="15%" x2="calc(85% + 12px)" y2="15%" stroke="#2a2520" strokeWidth="0.8" />
        <line x1="15%" y1="calc(80% - 12px)" x2="15%" y2="calc(80% + 12px)" stroke="#2a2520" strokeWidth="0.8" />
        <line x1="calc(15% - 12px)" y1="80%" x2="calc(15% + 12px)" y2="80%" stroke="#2a2520" strokeWidth="0.8" />
      </svg>

      {/* <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 30,
              height: 30,
              background: "#1e1a16",
              borderRadius: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Link2 size={14} color="#f0ece6" strokeWidth={2} />
          </div>
          <span
            style={{
              fontSize: 16,
              fontFamily: "Georgia, serif",
              color: "#1e1a16",
              letterSpacing: "-0.01em",
              fontWeight: 700,
            }}
          >
            Shorty<span style={{ fontWeight: 400, color: "#7c6f5e" }}>URL</span>
          </span>
        </div>

        <nav
          className="flex items-center gap-5"
          style={{ fontSize: 11, color: "#2a2520", letterSpacing: "0.07em" }}
        >
          <span style={{ opacity: 0.45, cursor: "pointer" }}>DOCS</span>
          <span style={{ opacity: 0.45, cursor: "pointer" }}>PRICING</span>
        </nav>
      </header> */}

      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#1e1a16",
              borderRadius: 999,
              padding: "5px 14px 5px 7px",
              marginBottom: 30,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                background: "#f0ece6",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Link2 size={10} color="#1e1a16" strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontSize: 14,
                letterSpacing: "0.12em",
                color: "#f0ece6",
                fontFamily: "Georgia, serif",
                fontWeight: 600,
              }}
            >
              ShortyURL
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2.4rem, 6vw, 3.8rem)",
              fontWeight: 400,
              color: "#1e1a16",
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              marginBottom: 18,
              fontFamily: "Georgia, Times New Roman, serif",
            }}
          >
            Links that fit
            <br />
            <em style={{ fontStyle: "italic", color: "#5c4f3d" }}>anywhere.</em>
          </h1>

          <p
            style={{
              fontSize: 14,
              color: "#5c4f3d",
              lineHeight: 1.7,
              marginBottom: 20,
              opacity: 0.75,
              fontFamily: "Georgia, serif",
            }}
          >
            Create short, elegant links in seconds.
            <br />
            Track clicks. Share confidently.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, justifyContent: "center" }}>
            <div style={{ width: 24, height: 1, background: "#2a2520", opacity: 0.2 }} />
            <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#2a2520", opacity: 0.2 }} />
            <div style={{ width: 24, height: 1, background: "#2a2520", opacity: 0.2 }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
            <Link
              href="/register"
              style={{
                display: "inline-block",
                padding: "12px 48px",
                background: "#1e1a16",
                color: "#f0ece6",
                fontSize: 11,
                letterSpacing: "0.12em",
                fontFamily: "Georgia, serif",
                border: "1px solid #1e1a16",
                borderRadius: 2,
                textDecoration: "none",
                fontWeight: 600,
                transition: "all 0.2s ease",
                boxShadow: "0 2px 10px rgba(30,26,22,0.15)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "#3a332a";
                el.style.borderColor = "#3a332a";
                el.style.boxShadow = "0 4px 18px rgba(30,26,22,0.25)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "#1e1a16";
                el.style.borderColor = "#1e1a16";
                el.style.boxShadow = "0 2px 10px rgba(30,26,22,0.15)";
              }}
            >
              GET STARTED — FREE
            </Link>

            <Link
              href="/login"
              style={{
                display: "inline-block",
                padding: "12px 48px",
                background: "transparent",
                color: "#2a2520",
                fontSize: 11,
                letterSpacing: "0.12em",
                fontFamily: "Georgia, serif",
                border: "1px solid rgba(42,37,32,0.22)",
                borderRadius: 2,
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(42,37,32,0.55)";
                el.style.background = "rgba(42,37,32,0.05)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(42,37,32,0.22)";
                el.style.background = "transparent";
              }}
            >
              SIGN IN
            </Link>
          </div>

          {/* <p
            style={{
              marginTop: 26,
              fontSize: 10,
              color: "#2a2520",
              opacity: 0.3,
              letterSpacing: "0.06em",
              fontFamily: "Georgia, serif",
            }}
          >
            No credit card required · Free forever plan available
          </p> */}
        </div>
      </div>

      <footer
        className="relative z-10 px-6 py-4 flex items-center justify-center"
        style={{ borderTop: "1px solid rgba(42,37,32,0.1)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Link2 size={9} color="#2a2520" style={{ opacity: 0.5 }} />
          <span style={{ fontSize: 10, color: "#2a2520", opacity: 0.5, letterSpacing: "0.06em" }}>
            SHORTYURL © 2026
          </span>
        </div>
        {/* <div style={{ display: "flex", gap: 18, fontSize: 10, color: "#2a2520", opacity: 0.3, letterSpacing: "0.05em" }}>
          <span style={{ cursor: "pointer" }}>Privacy</span>
          <span style={{ cursor: "pointer" }}>Terms</span>
        </div> */}
      </footer>
    </div>
  );
}