"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL, BASE_URL, OAUTH_URL } from "@/lib/config";
import { Link2, Eye, EyeOff, Check, X } from "lucide-react";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({ username: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const MAX_USERNAME_LENGTH = 30;
  const MAX_EMAIL_LENGTH = 100;
  const MAX_PASSWORD_LENGTH = 128;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let limitedValue = value;
    if (name === "username" && value.length > MAX_USERNAME_LENGTH) limitedValue = value.slice(0, MAX_USERNAME_LENGTH);
    else if (name === "email" && value.length > MAX_EMAIL_LENGTH) limitedValue = value.slice(0, MAX_EMAIL_LENGTH);
    else if ((name === "password" || name === "confirmPassword") && value.length > MAX_PASSWORD_LENGTH) limitedValue = value.slice(0, MAX_PASSWORD_LENGTH);
    setFormData({ ...formData, [name]: limitedValue });
    if (error) setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    if (formData.username.length < 3) { setError("Username must be at least 3 characters long"); setIsLoading(false); return; }
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match"); setIsLoading(false); return; }
    if (formData.password.length < 6) { setError("Password must be at least 6 characters long"); setIsLoading(false); return; }
    try {
      const response = await fetch(`${API_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: formData.username, email: formData.email, password: formData.password }),
      });
      if (!response.ok) { setError("Registration failed"); setIsLoading(false); return; }
      router.push("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${OAUTH_URL}/oauth2/authorize/google`;
  };

  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword;

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid rgba(42,37,32,0.15)",
    borderRadius: 8,
    background: "#fff",
    color: "#1e1a16",
    fontSize: 13,
    fontFamily: "Georgia, serif",
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: "#1e1a16",
    letterSpacing: "0.04em",
    marginBottom: 6,
    display: "block",
  };

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
        <circle cx="88%" cy="12%" r="80" stroke="#2a2520" strokeWidth="0.7" fill="none" />
        <circle cx="88%" cy="12%" r="55" stroke="#2a2520" strokeWidth="0.5" fill="none" />
        <circle cx="12%" cy="88%" r="60" stroke="#2a2520" strokeWidth="0.7" fill="none" />
        <line x1="100%" y1="100%" x2="calc(100% - 200px)" y2="calc(100% - 200px)" stroke="#2a2520" strokeWidth="1.0" />
        <line x1="100%" y1="calc(100% - 50px)" x2="calc(100% - 200px)" y2="calc(100% - 250px)" stroke="#2a2520" strokeWidth="0.6" />
      </svg>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <Link href="/" className="flex items-center gap-2.5" style={{ textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, background: "#1e1a16", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Link2 size={15} color="#f0ece6" strokeWidth={2} />
          </div>
          <span style={{ fontSize: 17, fontFamily: "Georgia, serif", color: "#1e1a16", letterSpacing: "-0.01em", fontWeight: 700 }}>
            Shorty<span style={{ fontWeight: 400, color: "#7c6f5e" }}>URL</span>
          </span>
        </Link>
      </header>

      {/* Main */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px]">
          <div
            style={{
              background: "rgba(255,255,255,0.75)",
              border: "1px solid rgba(42,37,32,0.12)",
              borderRadius: 16,
              padding: 36,
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 24px rgba(30,26,22,0.07)",
            }}
          >
            {/* Heading */}
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 400, color: "#1e1a16", letterSpacing: "-0.02em", marginBottom: 6, fontFamily: "Georgia, serif" }}>
                Create your account
              </h1>
              <p style={{ fontSize: 13, color: "#5c4f3d", opacity: 0.75, letterSpacing: "0.02em" }}>
                Join ShortyURL and start sharing smarter.
              </p>
            </div>

            {/* Google */}
            <button
              onClick={handleGoogleSignIn}
              type="button"
              disabled={isLoading}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "11px 16px",
                border: "1px solid rgba(42,37,32,0.15)",
                borderRadius: 8,
                background: "#fff",
                cursor: "pointer",
                fontSize: 13,
                color: "#2a2520",
                fontFamily: "Georgia, serif",
                letterSpacing: "0.02em",
                marginBottom: 20,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.909-2.258c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853" />
                <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9.001c0 1.452.348 2.827.957 4.041l3.007-2.332z" fill="#FBBC05" />
                <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(42,37,32,0.12)" }} />
              <span style={{ fontSize: 12, color: "#5c4f3d", opacity: 0.6, letterSpacing: "0.06em" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "rgba(42,37,32,0.12)" }} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {error && (
                <div style={{ padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8 }}>
                  <p style={{ fontSize: 12, color: "#b91c1c" }}>{error}</p>
                </div>
              )}

              {/* Username */}
              <div>
                <label style={labelStyle}>Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                  maxLength={MAX_USERNAME_LENGTH}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = "rgba(42,37,32,0.5)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(42,37,32,0.15)")}
                />
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength={MAX_EMAIL_LENGTH}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = "rgba(42,37,32,0.5)")}
                  onBlur={e => (e.target.style.borderColor = "rgba(42,37,32,0.15)")}
                />
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    maxLength={MAX_PASSWORD_LENGTH}
                    style={{ ...inputStyle, paddingRight: 40 }}
                    onFocus={e => (e.target.style.borderColor = "rgba(42,37,32,0.5)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(42,37,32,0.15)")}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(42,37,32,0.4)", padding: 0, display: "flex" }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label style={labelStyle}>Confirm password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    maxLength={MAX_PASSWORD_LENGTH}
                    style={{ ...inputStyle, paddingRight: 40 }}
                    onFocus={e => (e.target.style.borderColor = "rgba(42,37,32,0.5)")}
                    onBlur={e => (e.target.style.borderColor = "rgba(42,37,32,0.15)")}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(42,37,32,0.4)", padding: 0, display: "flex" }}>
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6 }}>
                    {passwordsMatch
                      ? <><Check size={12} color="#16a34a" /><span style={{ fontSize: 11, color: "#16a34a" }}>Passwords match</span></>
                      : <><X size={12} color="#dc2626" /><span style={{ fontSize: 11, color: "#dc2626" }}>Passwords do not match</span></>
                    }
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "13px",
                  background: "#1e1a16",
                  color: "#f0ece6",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  fontFamily: "Georgia, serif",
                  border: "1px solid #1e1a16",
                  borderRadius: 6,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  marginTop: 4,
                  opacity: isLoading ? 0.7 : 1,
                  boxShadow: "0 2px 12px rgba(30,26,22,0.15)",
                }}
              >
                {isLoading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <span style={{ width: 14, height: 14, border: "2px solid #f0ece6", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                    CREATING ACCOUNT...
                  </span>
                ) : (
                  "CREATE ACCOUNT"
                )}
              </button>
            </form>

            {/* Sign in link */}
            <div style={{ marginTop: 24 }}>
              <div style={{ height: 1, background: "rgba(42,37,32,0.08)", marginBottom: 16 }} />
              <p style={{ textAlign: "center", fontSize: 12, color: "#5c4f3d", opacity: 0.7, letterSpacing: "0.03em" }}>
                Already have an account?{" "}
                <Link href="/login" style={{ color: "#1e1a16", fontWeight: 700, textDecoration: "none" }}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
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

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}