"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn, UserPlus, Shield } from "lucide-react";

type Tab = "login" | "register";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function LoginCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegisterParam = searchParams.get("tab") === "register" || searchParams.get("mode") === "register" || searchParams.get("tab") === "signup";
  const [tab, setTab] = useState<Tab>(isRegisterParam ? "register" : "login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Login form
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // Register form
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    bloodGroup: "",
    isSeniorCitizen: false,
    familyMembersCount: 1,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save token
      localStorage.setItem("lf_token", data.data.token);
      localStorage.setItem("lf_user", JSON.stringify(data.data.user));

      // Redirect based on role
      if (data.data.user.role === "ADMIN") {
        router.push("/management");
      } else {
        router.push("/portal");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setSuccess(`Welcome, ${data.data.user.name}! Your membership ID is ${data.data.user.membershipNo}. Please login.`);
      setTab("login");
      setLoginData({ email: registerData.email, password: "" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
    }}>
      {/* Portal Branding Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--primary-color), var(--info-color))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1rem auto",
          boxShadow: "var(--shadow-md)",
          color: "#FFFFFF"
        }}>
          <Shield size={28} />
        </div>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--primary-color)", margin: "0 0 0.4rem" }}>
          Member Portal
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", margin: 0 }}>
          Leimarembi Foundation — Digital Governance & Community Access
        </p>
      </div>

      {/* Unified Card Container */}
      <div className="card" style={{
        width: "100%",
        maxWidth: "460px",
        padding: "0",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "var(--shadow-lg)"
      }}>
        {/* Tab Selector Bar */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          background: "#F1F5F9",
          borderBottom: "1px solid var(--border-color)"
        }}>
          <button
            type="button"
            onClick={() => setTab("login")}
            style={{
              padding: "1rem",
              border: "none",
              background: tab === "login" ? "var(--surface-color)" : "transparent",
              color: tab === "login" ? "var(--primary-color)" : "var(--text-secondary)",
              fontWeight: tab === "login" ? 800 : 600,
              fontSize: "0.95rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              borderBottom: tab === "login" ? "3px solid var(--info-color)" : "3px solid transparent",
              transition: "all 0.2s ease"
            }}
          >
            <LogIn size={18} /> Sign In
          </button>

          <button
            type="button"
            onClick={() => setTab("register")}
            style={{
              padding: "1rem",
              border: "none",
              background: tab === "register" ? "var(--surface-color)" : "transparent",
              color: tab === "register" ? "var(--primary-color)" : "var(--text-secondary)",
              fontWeight: tab === "register" ? 800 : 600,
              fontSize: "0.95rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              borderBottom: tab === "register" ? "3px solid var(--info-color)" : "3px solid transparent",
              transition: "all 0.2s ease"
            }}
          >
            <UserPlus size={18} /> Register
          </button>
        </div>

        <div style={{ padding: "2rem" }}>
          {error && (
            <div style={{
              background: "rgba(225, 29, 72, 0.1)",
              border: "1px solid rgba(225, 29, 72, 0.3)",
              color: "#E11D48",
              borderRadius: "10px",
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
              marginBottom: "1.25rem",
              fontWeight: 600
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: "rgba(22, 163, 74, 0.1)",
              border: "1px solid rgba(22, 163, 74, 0.3)",
              color: "#16A34A",
              borderRadius: "10px",
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
              marginBottom: "1.25rem",
              fontWeight: 600
            }}>
              {success}
            </div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {tab === "login" && (
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.7rem 0.9rem",
                    borderRadius: "10px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-color)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                  Password *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.7rem 2.4rem 0.7rem 0.9rem",
                      borderRadius: "10px",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-color)",
                      color: "var(--text-primary)",
                      fontSize: "0.9rem",
                      outline: "none"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "var(--text-muted)",
                      cursor: "pointer"
                    }}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center", minHeight: "44px", fontSize: "0.95rem", marginTop: "0.5rem" }}
              >
                {loading ? "Signing In..." : "Sign In to Member Account"}
              </button>

              <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0.75rem 0 0" }}>
                Don&apos;t have an account yet?{" "}
                <button
                  type="button"
                  onClick={() => setTab("register")}
                  style={{ background: "none", border: "none", color: "var(--info-color)", fontWeight: 800, cursor: "pointer" }}
                >
                  Create New Membership
                </button>
              </p>
            </form>
          )}

          {/* TAB 2: REGISTER FORM */}
          {tab === "register" && (
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "10px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-color)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "10px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-color)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                  Password *
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Create a password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.65rem 2.4rem 0.65rem 0.85rem",
                      borderRadius: "10px",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-color)",
                      color: "var(--text-primary)",
                      fontSize: "0.9rem",
                      outline: "none"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "var(--text-muted)",
                      cursor: "pointer"
                    }}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                    Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.75rem",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-color)",
                      color: "var(--text-primary)",
                      fontSize: "0.85rem",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                    Blood Group
                  </label>
                  <select
                    value={registerData.bloodGroup}
                    onChange={(e) => setRegisterData({ ...registerData, bloodGroup: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.75rem",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-color)",
                      color: "var(--text-primary)",
                      fontSize: "0.85rem",
                      outline: "none"
                    }}
                  >
                    <option value="">Select</option>
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Your address in Manipur"
                  value={registerData.address}
                  onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-color)",
                    color: "var(--text-primary)",
                    fontSize: "0.85rem",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-color)", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="checkbox"
                    checked={registerData.isSeniorCitizen}
                    onChange={(e) => setRegisterData({ ...registerData, isSeniorCitizen: e.target.checked })}
                  />
                  Senior Citizen
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Family:</span>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={registerData.familyMembersCount}
                    onChange={(e) => setRegisterData({ ...registerData, familyMembersCount: parseInt(e.target.value) || 1 })}
                    style={{ width: "45px", padding: "0.2rem 0.4rem", borderRadius: "4px", border: "1px solid var(--border-color)", fontSize: "0.85rem" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-secondary"
                style={{ width: "100%", justifyContent: "center", minHeight: "44px", fontSize: "0.95rem", marginTop: "0.5rem" }}
              >
                {loading ? "Creating Account..." : "Create Membership Account"}
              </button>

              <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0.5rem 0 0" }}>
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  style={{ background: "none", border: "none", color: "var(--info-color)", fontWeight: 800, cursor: "pointer" }}
                >
                  Sign In Here
                </button>
              </p>
            </form>
          )}
        </div>
      </div>

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <Link href="/" style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="card" style={{ padding: "2rem", textAlign: "center" }}>Loading Member Portal...</div>
      </div>
    }>
      <LoginCard />
    </Suspense>
  );
}
