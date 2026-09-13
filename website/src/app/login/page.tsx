"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn, UserPlus, Shield } from "lucide-react";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { isSuperAdmin, recordActivity } from "@/lib/superAdminAuth";
import { findOfficer, verifyOfficerPassword, isExecutiveOfficer, findOfficialMember, verifyOfficialMemberPassword, ALL_OFFICIAL_MEMBERS } from "@/lib/executiveOfficers";

type Tab = "login" | "register";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/** Persist session to both localStorage (client) AND a cookie (middleware can read it) */
function saveSession(token: string, user: object) {
  localStorage.setItem("lf_token", token);
  localStorage.setItem("lf_user", JSON.stringify(user));
  // Set cookie for 7 days so Next.js middleware can guard routes
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `lf_token=${token}; path=/; expires=${expires}; SameSite=Lax`;
}

function LoginCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || null;
  const tabParam = searchParams.get("tab");
  // Default tab is Sign In ("login") unless explicitly set to "register"
  const [tab, setTab] = useState<Tab>(tabParam === "register" ? "register" : "login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Login form
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // Auto-check in database if already logged in
  useEffect(() => {
    async function checkAuthInDatabase() {
      const token = localStorage.getItem("lf_token");
      if (token) {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => null);

          if (res && res.ok) {
            const data = await res.json().catch(() => null);
            if (data && data.data) {
              saveSession(token, data.data);
              if (redirectTo) {
                router.push(redirectTo);
              } else if (isSuperAdmin(data.data)) {
                router.push("/superadmin");
              } else if (data.data.role === "ADMIN") {
                router.push("/management");
              } else {
                router.push("/portal");
              }
              return;
            }
          }
        } catch (e) {
          // Silent offline / network fallback using existing valid session
        }

        const userStr = localStorage.getItem("lf_user");
        if (userStr) {
          try {
            const u = JSON.parse(userStr);
            if (redirectTo) {
              router.push(redirectTo);
            } else if (isSuperAdmin(u)) {
              router.push("/superadmin");
            } else {
              router.push(u.role === "ADMIN" ? "/management" : "/portal");
            }
            return;
          } catch {}
        }
      }

      // If NOT logged in or session invalid -> default tab to SIGN IN
      const explicitTab = searchParams.get("tab");
      setTab(explicitTab === "register" ? "register" : "login");
      setCheckingAuth(false);
    }

    checkAuthInDatabase();
  }, [router, redirectTo, searchParams]);


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

  // Google Details Completion Popup Modal
  const [showGoogleDetailsModal, setShowGoogleDetailsModal] = useState(false);
  const [pendingGoogleAuth, setPendingGoogleAuth] = useState<{ token: string; user: any } | null>(null);
  const [googleDetailsForm, setGoogleDetailsForm] = useState({
    bloodGroup: "",
    isSeniorCitizen: false,
    phone: "",
    address: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const credInput = loginData.email.trim();
    const passInput = loginData.password.trim();

    // 1. Instant verification for Official Foundation Members (All 15 Members + Officers + Super Admin)
    const officialMember = findOfficialMember(credInput);

    if (officialMember && verifyOfficialMemberPassword(officialMember, passInput)) {
      const isSuper = officialMember.email === 'aryamansingha60@gmail.com' || officialMember.email === 'binababu.singha@yahoo.com' || officialMember.role === 'SUPER_ADMIN';
      const isOfficerAdmin = ['President', 'Vice-Chairman', 'Managing Director', 'Secretary', 'Treasurer'].includes(officialMember.role) || officialMember.category === 'Leadership';
      
      const memberUser = {
        id: officialMember.id,
        name: officialMember.name,
        email: officialMember.email,
        phone: officialMember.phone,
        role: isSuper ? 'SUPER_ADMIN' : (isOfficerAdmin ? 'ADMIN' : 'MEMBER'),
        designation: officialMember.designation,
        membershipNo: officialMember.id,
        bloodGroup: officialMember.bloodGroup,
        isSeniorCitizen: officialMember.isSeniorCitizen,
        authProvider: 'LOCAL'
      };
      const token = `lf_tok_mem_${Date.now()}`;
      saveSession(token, memberUser);
      recordActivity({
        type: "SIGN_IN",
        userName: memberUser.name,
        userEmail: memberUser.email,
        userPhone: memberUser.phone,
        membershipNo: memberUser.membershipNo,
        bloodGroup: memberUser.bloodGroup,
        isSeniorCitizen: memberUser.isSeniorCitizen,
        provider: "LOCAL",
        details: isSuper ? "Super Administrator Signed In" : `${officialMember.designation} Signed In`,
      });

      if (redirectTo) {
        router.push(redirectTo);
      } else if (isSuper) {
        router.push("/superadmin");
      } else if (memberUser.role === 'ADMIN') {
        router.push("/management");
      } else {
        router.push("/portal");
      }
      setLoading(false);
      return;
    }

    // 2. Database API authentication call
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      saveSession(data.data.token, data.data.user);

      recordActivity({
        type: "SIGN_IN",
        userName: data.data.user.name,
        userEmail: data.data.user.email,
        userPhone: data.data.user.phone,
        membershipNo: data.data.user.membershipNo,
        bloodGroup: data.data.user.bloodGroup,
        isSeniorCitizen: data.data.user.isSeniorCitizen,
        provider: "LOCAL",
        details: isSuperAdmin(data.data.user) ? "Super Admin Logged In" : "Member Signed In",
      });

      if (redirectTo) {
        router.push(redirectTo);
      } else if (isSuperAdmin(data.data.user)) {
        router.push("/superadmin");
      } else if (data.data.user.role === "ADMIN") {
        router.push("/management");
      } else {
        router.push("/portal");
      }
      return;
    } catch (err: unknown) {
      // 3. Static production / offline fallback for locally registered users
      const inputEmailOrPhone = loginData.email.trim().toLowerCase();
      let matchedUser = null;

      try {
        const existingUsersStr = localStorage.getItem('lf_local_users');
        const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];
        const userFound = existingUsers.find((u: any) => 
          (u.email && u.email.toLowerCase() === inputEmailOrPhone) ||
          (u.phone && u.phone.replace(/\D/g, '').includes(inputEmailOrPhone.replace(/\D/g, '')))
        );
        if (userFound) {
          if (userFound.password && userFound.password !== loginData.password) {
            setError("Incorrect password. Please enter the password you created during registration.");
            setLoading(false);
            return;
          }
          matchedUser = userFound;
        }
      } catch {}

      if (matchedUser) {
        const fallbackToken = `lf_tok_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        saveSession(fallbackToken, matchedUser);
        recordActivity({
          type: "SIGN_IN",
          userName: matchedUser.name,
          userEmail: matchedUser.email,
          userPhone: matchedUser.phone,
          membershipNo: matchedUser.membershipNo,
          bloodGroup: matchedUser.bloodGroup,
          isSeniorCitizen: matchedUser.isSeniorCitizen,
          provider: "LOCAL",
          details: isSuperAdmin(matchedUser) ? "Super Admin Logged In" : "Member Signed In",
        });

        if (redirectTo) {
          router.push(redirectTo);
        } else if (isSuperAdmin(matchedUser)) {
          router.push("/superadmin");
        } else if (matchedUser.role === "ADMIN") {
          router.push("/management");
        } else {
          router.push("/portal");
        }
        return;
      }

      // If user is neither in Official Members list, API, nor Local Registrations:
      if (officialMember && !verifyOfficialMemberPassword(officialMember, passInput)) {
        setError("Invalid password for Official Member account. Please check your password or DOB.");
      } else {
        setError("Account not found. Non-preloaded users must click the Register tab to create a membership account first.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.bloodGroup) {
      setError("Please select your Blood Group.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    // Generate unique membership ID
    const memSeq = Math.floor(1000 + Math.random() * 9000);
    const memId = `LF-2026-${memSeq}`;
    const newUserObj = {
      id: `usr_${Date.now()}`,
      name: registerData.name,
      email: registerData.email,
      phone: registerData.phone,
      address: registerData.address,
      bloodGroup: registerData.bloodGroup,
      isSeniorCitizen: registerData.isSeniorCitizen,
      membershipNo: memId,
      role: "MEMBER",
      password: registerData.password,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.data) {
          recordActivity({
            type: "REGISTER",
            userName: data.data.user.name,
            userEmail: data.data.user.email,
            userPhone: data.data.user.phone,
            membershipNo: data.data.user.membershipNo,
            bloodGroup: registerData.bloodGroup,
            isSeniorCitizen: registerData.isSeniorCitizen,
            provider: "LOCAL",
            details: `Official Member Registration • ${registerData.isSeniorCitizen ? "Senior Citizen" : "Non-Senior Citizen"} (${registerData.bloodGroup})`,
          });
          setSuccess(`🎉 Registration Successful, ${data.data.user.name}! Your Membership ID is ${data.data.user.membershipNo}. Please Sign In below.`);
          setTab("login");
          setLoginData({ email: registerData.email, password: "" });
          return;
        }
      }
    } catch {}

    // Static production / offline fallback
    try {
      const existingUsersStr = localStorage.getItem('lf_local_users');
      const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];
      existingUsers.push(newUserObj);
      localStorage.setItem('lf_local_users', JSON.stringify(existingUsers));
    } catch {}

    recordActivity({
      type: "REGISTER",
      userName: newUserObj.name,
      userEmail: newUserObj.email,
      userPhone: newUserObj.phone,
      membershipNo: newUserObj.membershipNo,
      bloodGroup: newUserObj.bloodGroup,
      isSeniorCitizen: newUserObj.isSeniorCitizen,
      provider: "LOCAL",
      details: `Official Member Registration • ${newUserObj.isSeniorCitizen ? "Senior Citizen" : "Non-Senior Citizen"} (${newUserObj.bloodGroup})`,
    });

    setSuccess(`🎉 Registration Successful, ${newUserObj.name}! Your Membership ID is ${newUserObj.membershipNo}. Please Sign In below to access the platform.`);
    setTab("login");
    setLoginData({ email: registerData.email, password: "" });
    setLoading(false);
  };


function parseGoogleJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError("");

    const googleCredential = credentialResponse.credential;
    if (!googleCredential) {
      setError("Unable to obtain Google credentials. Please try again.");
      setLoading(false);
      return;
    }

    let user: any = null;
    let token: string = `lf_tok_g_${Date.now()}`;

    // 1. Attempt Backend API call first if available
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleCredential }),
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.data) {
          user = data.data.user;
          token = data.data.token || token;
        }
      }
    } catch {}

    // 2. Client-side JWT Parsing Fallback (works in production static export with zero network dependence)
    if (!user) {
      const payload = parseGoogleJwt(googleCredential);
      if (payload && payload.email) {
        const email = payload.email.toLowerCase();
        const googleName = payload.name || payload.email.split('@')[0];

        // Check if Super Admin Whitelist
        if (email === "aryamansingha60@gmail.com" || email === "aryamansingha60@gail.com") {
          user = {
            id: "sa_aryaman",
            name: "Aryaman Singha",
            email: "aryamansingha60@gmail.com",
            phone: "7099659804",
            role: "SUPER_ADMIN",
            membershipNo: "LF-SA-001",
            bloodGroup: "A+",
            isSeniorCitizen: false,
          };
        } else if (email === "binababu.singha@yahoo.com") {
          user = {
            id: "sa_bina_babu",
            name: "M. Bina Babu Singha",
            email: "binababu.singha@yahoo.com",
            phone: "7637087931",
            role: "SUPER_ADMIN",
            membershipNo: "LF-SA-002",
            bloodGroup: "AB+",
            isSeniorCitizen: true,
          };
        } else {
          // Check official foundation members list
          const officialMember = findOfficialMember(email);
          if (officialMember) {
            const isOfficerAdmin = ['President', 'Vice-Chairman', 'Managing Director', 'Secretary', 'Treasurer'].includes(officialMember.role) || officialMember.category === 'Leadership';
            user = {
              id: officialMember.id,
              name: officialMember.name,
              email: officialMember.email,
              phone: officialMember.phone,
              role: isOfficerAdmin ? 'ADMIN' : 'MEMBER',
              designation: officialMember.designation,
              membershipNo: officialMember.id,
              bloodGroup: officialMember.bloodGroup,
              isSeniorCitizen: officialMember.isSeniorCitizen,
            };
          } else {
            // Check local users or create new Google member
            try {
              const existingUsersStr = localStorage.getItem('lf_local_users');
              const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];
              const localMatch = existingUsers.find((u: any) => u.email && u.email.toLowerCase() === email);
              if (localMatch) {
                user = localMatch;
              }
            } catch {}

            if (!user) {
              const memSeq = Math.floor(1000 + Math.random() * 9000);
              user = {
                id: `usr_g_${Date.now()}`,
                name: googleName,
                email: email,
                phone: "",
                membershipNo: `LF-2026-${memSeq}`,
                role: "MEMBER",
                bloodGroup: "",
                isSeniorCitizen: false,
              };
            }
          }
        }
      }
    }

    if (!user) {
      setError("Google Authentication failed. Please try signing in with Email/Password or Register.");
      setLoading(false);
      return;
    }

    // If user is Super Admin, allow direct entry
    if (isSuperAdmin(user)) {
      saveSession(token, user);
      recordActivity({
        type: "SIGN_IN",
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone || "7099659804",
        membershipNo: user.membershipNo || "LF-2026-0001",
        bloodGroup: user.bloodGroup || (user.email === "binababu.singha@yahoo.com" ? "AB+" : "A+"),
        isSeniorCitizen: user.email === "binababu.singha@yahoo.com",
        provider: "GOOGLE",
        details: "Super Admin Live Sign-In via Google OAuth",
      });
      router.push("/superadmin");
      setLoading(false);
      return;
    }

    // Mandatory check: If Blood Group is missing, show completion modal
    const hasBloodGroup = Boolean(user.bloodGroup && user.bloodGroup.trim());
    if (!hasBloodGroup) {
      setPendingGoogleAuth({ token, user });
      setGoogleDetailsForm({
        bloodGroup: user.bloodGroup || "",
        isSeniorCitizen: Boolean(user.isSeniorCitizen),
        phone: user.phone || "",
        address: user.address || ""
      });
      setShowGoogleDetailsModal(true);
      setLoading(false);
      return;
    }

    saveSession(token, user);
    recordActivity({
      type: "SIGN_IN",
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      membershipNo: user.membershipNo,
      bloodGroup: user.bloodGroup,
      isSeniorCitizen: user.isSeniorCitizen,
      provider: "GOOGLE",
      details: `Member Signed In via Google • ${user.isSeniorCitizen ? "Senior Citizen" : "Non-Senior Citizen"} (${user.bloodGroup})`,
    });

    if (redirectTo) {
      router.push(redirectTo);
    } else if (user.role === "ADMIN") {
      router.push("/management");
    } else {
      router.push("/portal");
    }
    setLoading(false);
  };

  const handleCompleteGoogleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingGoogleAuth) return;
    if (!googleDetailsForm.bloodGroup) {
      setError("Please select your Blood Group to complete registration.");
      return;
    }

    setLoading(true);
    setError("");

    const updatedUser = {
      ...pendingGoogleAuth.user,
      bloodGroup: googleDetailsForm.bloodGroup,
      isSeniorCitizen: Boolean(googleDetailsForm.isSeniorCitizen),
      phone: googleDetailsForm.phone || pendingGoogleAuth.user.phone || "",
      address: googleDetailsForm.address || pendingGoogleAuth.user.address || "",
    };

    try {
      await fetch(`${API_BASE_URL}/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${pendingGoogleAuth.token}`
        },
        body: JSON.stringify({
          bloodGroup: googleDetailsForm.bloodGroup,
          isSeniorCitizen: googleDetailsForm.isSeniorCitizen,
          phone: googleDetailsForm.phone,
          address: googleDetailsForm.address
        }),
      }).catch(() => {});
    } catch {}

    saveSession(pendingGoogleAuth.token, updatedUser);

    // Live update audit feed for Super Admin
    recordActivity({
      type: "REGISTER",
      userName: updatedUser.name,
      userEmail: updatedUser.email,
      userPhone: updatedUser.phone,
      membershipNo: updatedUser.membershipNo,
      bloodGroup: updatedUser.bloodGroup,
      isSeniorCitizen: updatedUser.isSeniorCitizen,
      provider: "GOOGLE",
      details: `Google Member Registration Completed • ${updatedUser.isSeniorCitizen ? "Senior Citizen (Health Card Eligible)" : "Non-Senior Citizen"} (${updatedUser.bloodGroup})`,
    });

    setShowGoogleDetailsModal(false);
    setLoading(false);

    if (redirectTo) {
      router.push(redirectTo);
    } else if (isSuperAdmin(updatedUser)) {
      router.push("/superadmin");
    } else if (updatedUser.role === "ADMIN") {
      router.push("/management");
    } else {
      router.push("/portal");
    }
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  if (checkingAuth) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div className="card" style={{ padding: "2.5rem 3rem", textAlign: "center", borderRadius: "24px", maxWidth: "420px", width: "100%", boxShadow: "var(--shadow-lg)" }}>
          <div className="spin" style={{ width: "40px", height: "40px", border: "4px solid var(--border-color)", borderTopColor: "var(--primary-color)", borderRadius: "50%", margin: "0 auto 1.5rem" }} />
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--primary-color)", margin: "0 0 0.5rem" }}>
            Verifying Database Session...
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", margin: 0 }}>
            Checking your membership credentials in the database.
          </p>
        </div>
      </div>
    );
  }

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
        {redirectTo && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)',
            borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.825rem',
            color: '#B45309',
            fontWeight: 800
          }}>
            <Shield size={16} style={{ flexShrink: 0 }} />
            <span>🔒 Member Access Rule: Please Register or Sign In to access this section.</span>
          </div>
        )}
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
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google Sign In failed")}
                  text="signin_with"
                  shape="rectangular"
                  size="large"
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "0.5rem 0" }}>
                <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }}></div>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>OR</span>
                <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }}></div>
              </div>

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
            </div>
          )}

          {/* TAB 2: REGISTER FORM */}
          {tab === "register" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google Sign In failed")}
                  text="signup_with"
                  shape="rectangular"
                  size="large"
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "0.5rem 0" }}>
                <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }}></div>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>OR</span>
                <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }}></div>
              </div>

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
                    Blood Group *
                  </label>
                  <select
                    required
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
                    <option value="">-- Select --</option>
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

              {/* Age Category: Senior Citizen vs Non-Senior Citizen */}
              <div style={{ background: "var(--bg-color)", padding: "0.75rem 0.85rem", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.35rem" }}>
                  Age Category & Health Privilege *
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.825rem", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="ageCategory"
                      checked={!registerData.isSeniorCitizen}
                      onChange={() => setRegisterData({ ...registerData, isSeniorCitizen: false })}
                    />
                    <span><strong>Non-Senior Citizen</strong> (General Membership)</span>
                  </label>
                  <label style={{ fontSize: "0.825rem", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#D97706" }}>
                    <input
                      type="radio"
                      name="ageCategory"
                      checked={registerData.isSeniorCitizen}
                      onChange={() => setRegisterData({ ...registerData, isSeniorCitizen: true })}
                    />
                    <span><strong>Senior Citizen (60+ Years)</strong> — ★ Free Health Card Privilege</span>
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-color)", padding: "0.5rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Family Members Count:</span>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={registerData.familyMembersCount}
                  onChange={(e) => setRegisterData({ ...registerData, familyMembersCount: parseInt(e.target.value) || 1 })}
                  style={{ width: "55px", padding: "0.2rem 0.4rem", borderRadius: "4px", border: "1px solid var(--border-color)", fontSize: "0.85rem" }}
                />
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
            </div>
          )}
        </div>
      </div>

      {/* ── GOOGLE REGISTRATION COMPLETION MODAL (DESKTOP & MOBILE RESPONSIVE) ── */}
      {showGoogleDetailsModal && pendingGoogleAuth && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
          padding: "1rem"
        }}>
          <div className="card" style={{
            maxWidth: "480px",
            width: "100%",
            borderRadius: "24px",
            padding: "2rem",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
            border: "2px solid var(--secondary-color)"
          }}>
            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(212, 175, 55, 0.15)", color: "var(--secondary-color)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem" }}>
                <Shield size={28} />
              </div>
              <h3 style={{ margin: "0 0 4px", fontSize: "1.3rem", fontWeight: 900, color: "var(--primary-color)" }}>
                Mandatory Registration Details
              </h3>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Welcome, <strong>{pendingGoogleAuth.user.name}</strong>! Under Leimarembi Foundation charter, please specify your <strong>Blood Group</strong> and <strong>Senior / Non-Senior</strong> status to complete registration.
              </p>
            </div>

            <form onSubmit={handleCompleteGoogleRegistration} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                  Google Account Email
                </label>
                <input
                  type="text"
                  disabled
                  value={pendingGoogleAuth.user.email}
                  style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.05)", color: "var(--text-muted)", fontSize: "0.85rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                  Blood Group * (Required for Health Register)
                </label>
                <select
                  required
                  value={googleDetailsForm.bloodGroup}
                  onChange={(e) => setGoogleDetailsForm({ ...googleDetailsForm, bloodGroup: e.target.value })}
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1.5px solid var(--primary-color)", background: "var(--bg-color)", color: "var(--text-primary)", fontSize: "0.9rem", fontWeight: 700 }}
                >
                  <option value="">-- Select Your Blood Group --</option>
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div style={{ background: "var(--bg-color)", padding: "0.85rem", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
                  Age Category (Senior Citizen Section) *
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="googleSeniorCategory"
                      checked={!googleDetailsForm.isSeniorCitizen}
                      onChange={() => setGoogleDetailsForm({ ...googleDetailsForm, isSeniorCitizen: false })}
                    />
                    <span><strong>Non-Senior Citizen</strong> (General Member)</span>
                  </label>
                  <label style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#D97706" }}>
                    <input
                      type="radio"
                      name="googleSeniorCategory"
                      checked={googleDetailsForm.isSeniorCitizen}
                      onChange={() => setGoogleDetailsForm({ ...googleDetailsForm, isSeniorCitizen: true })}
                    />
                    <span><strong>Senior Citizen (60+ Years)</strong> — ★ Eligible for Free Health Card</span>
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                  Primary Contact Phone Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={googleDetailsForm.phone}
                  onChange={(e) => setGoogleDetailsForm({ ...googleDetailsForm, phone: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-primary)", fontSize: "0.85rem" }}
                />
              </div>

              {error && (
                <p style={{ color: "#EF4444", fontSize: "0.85rem", margin: 0, fontWeight: 700 }}>
                  {error}
                </p>
              )}

              <div style={{ display: "flex", gap: "8px", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowGoogleDetailsModal(false)}
                  className="btn btn-outline"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ flex: 2, justifyContent: "center" }}
                >
                  {loading ? "Saving Profile..." : "Complete Registration & Enter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <Link href="/" style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 600 }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}


export default function LoginPage() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "1234567890-dummy.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Suspense fallback={
        <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="card" style={{ padding: "2rem", textAlign: "center" }}>Loading Member Portal...</div>
        </div>
      }>
        <LoginCard />
      </Suspense>
    </GoogleOAuthProvider>
  );
}
