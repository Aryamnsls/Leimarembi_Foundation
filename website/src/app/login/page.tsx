"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, UserPlus, Shield, Users } from "lucide-react";

type Tab = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");
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
      const res = await fetch("http://localhost:5000/api/auth/login", {
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
    } catch (err: any) {
      setError(err.message);
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
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setSuccess(`Welcome, ${data.data.user.name}! Your membership ID is ${data.data.user.membershipNo}. Please login.`);
      setTab("login");
      setLoginData({ email: registerData.email, password: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "480px",
        animation: "fadeIn 0.5s ease-out",
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0A192F, #D4AF37)",
            marginBottom: "1rem",
            boxShadow: "0 8px 32px rgba(212, 175, 55, 0.3)",
          }}>
            <Shield size={32} color="white" />
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
            Member Portal
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Leimarembi Foundation — Digital Governance
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: "0", overflow: "hidden" }}>

          {/* Tab switcher */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderBottom: "1px solid var(--border-color)",
          }}>
            <button
              onClick={() => { setTab("login"); setError(""); setSuccess(""); }}
              style={{
                padding: "1rem",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "all 0.2s",
                background: tab === "login" ? "var(--primary-color)" : "transparent",
                color: tab === "login" ? "white" : "var(--text-secondary)",
                borderRadius: "0",
              }}
            >
              <LogIn size={16} /> Sign In
            </button>
            <button
              onClick={() => { setTab("register"); setError(""); setSuccess(""); }}
              style={{
                padding: "1rem",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "all 0.2s",
                background: tab === "register" ? "var(--primary-color)" : "transparent",
                color: tab === "register" ? "white" : "var(--text-secondary)",
                borderRadius: "0",
              }}
            >
              <UserPlus size={16} /> Register
            </button>
          </div>

          <div style={{ padding: "2rem" }}>

            {/* Role info badges */}
            {tab === "login" && (
              <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div style={{
                  flex: 1, padding: "0.75rem", borderRadius: "8px",
                  background: "rgba(10,25,47,0.07)", border: "1px solid var(--border-color)",
                  textAlign: "center", fontSize: "0.8rem"
                }}>
                  <Users size={16} style={{ marginBottom: "4px", color: "var(--primary-color)" }} />
                  <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>Members</div>
                  <div style={{ color: "var(--text-secondary)" }}>→ Services Portal</div>
                </div>
                <div style={{
                  flex: 1, padding: "0.75rem", borderRadius: "8px",
                  background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)",
                  textAlign: "center", fontSize: "0.8rem"
                }}>
                  <Shield size={16} style={{ marginBottom: "4px", color: "var(--secondary-color)" }} />
                  <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>Admins</div>
                  <div style={{ color: "var(--text-secondary)" }}>→ Management</div>
                </div>
              </div>
            )}

            {/* Alerts */}
            {error && (
              <div style={{
                background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.3)",
                color: "#c0392b", borderRadius: "8px", padding: "0.75rem 1rem",
                marginBottom: "1rem", fontSize: "0.875rem", fontWeight: 500
              }}>
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div style={{
                background: "rgba(39,174,96,0.1)", border: "1px solid rgba(39,174,96,0.3)",
                color: "#27ae60", borderRadius: "8px", padding: "0.75rem 1rem",
                marginBottom: "1rem", fontSize: "0.875rem", fontWeight: 500
              }}>
                ✅ {success}
              </div>
            )}

            {/* LOGIN FORM */}
            {tab === "login" && (
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={loginData.email}
                    onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="you@example.com"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginData.password}
                      onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="Enter your password"
                      style={{ ...inputStyle, paddingRight: "3rem" }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeBtn}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{
                  width: "100%", marginTop: "0.5rem", padding: "0.875rem",
                  fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                  opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer"
                }}>
                  {loading ? "Signing in..." : <><LogIn size={18} /> Sign In</>}
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {tab === "register" && (
              <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Full Name *</label>
                    <input type="text" required value={registerData.name}
                      onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
                      placeholder="Your full name" style={inputStyle} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Email Address *</label>
                    <input type="email" required value={registerData.email}
                      onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                      placeholder="you@example.com" style={inputStyle} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Password *</label>
                    <div style={{ position: "relative" }}>
                      <input type={showPassword ? "text" : "password"} required value={registerData.password}
                        onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                        placeholder="Create a strong password" style={{ ...inputStyle, paddingRight: "3rem" }} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} style={eyeBtn}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input type="tel" value={registerData.phone}
                      onChange={e => setRegisterData({ ...registerData, phone: e.target.value })}
                      placeholder="+91 98765 43210" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Blood Group</label>
                    <select value={registerData.bloodGroup}
                      onChange={e => setRegisterData({ ...registerData, bloodGroup: e.target.value })}
                      style={inputStyle}>
                      <option value="">Select</option>
                      {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Address</label>
                    <input type="text" value={registerData.address}
                      onChange={e => setRegisterData({ ...registerData, address: e.target.value })}
                      placeholder="Your address in Manipur" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Family Members</label>
                    <input type="number" min={1} value={registerData.familyMembersCount}
                      onChange={e => setRegisterData({ ...registerData, familyMembersCount: Number(e.target.value) })}
                      style={inputStyle} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingTop: "1.5rem" }}>
                    <input type="checkbox" id="senior" checked={registerData.isSeniorCitizen}
                      onChange={e => setRegisterData({ ...registerData, isSeniorCitizen: e.target.checked })}
                      style={{ width: "16px", height: "16px", cursor: "pointer" }} />
                    <label htmlFor="senior" style={{ fontSize: "0.875rem", color: "var(--text-secondary)", cursor: "pointer" }}>
                      Senior Citizen
                    </label>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn btn-secondary" style={{
                  width: "100%", marginTop: "0.5rem", padding: "0.875rem",
                  fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                  opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer"
                }}>
                  {loading ? "Registering..." : <><UserPlus size={18} /> Create Membership</>}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "underline" }}>← Back to Home</Link>
          &nbsp;·&nbsp; Leimarembi Foundation © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.4rem",
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "var(--text-secondary)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "8px",
  border: "1px solid var(--border-color)",
  background: "rgba(255,255,255,0.6)",
  color: "var(--text-primary)",
  fontSize: "0.95rem",
  outline: "none",
  transition: "border-color 0.2s",
  backdropFilter: "blur(4px)",
};

const eyeBtn: React.CSSProperties = {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "var(--text-secondary)",
  display: "flex",
  alignItems: "center",
};
