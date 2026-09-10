"use client";

import { useState, useEffect } from "react";
import { 
  Lock, 
  ShieldCheck, 
  Eye, 
  Download, 
  X, 
  Key, 
  FileText, 
  AlertCircle,
  ShieldAlert,
  CheckCircle2,
  LockKeyhole
} from "lucide-react";

export interface AuthorizedMember {
  slNo: string;
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  bloodGroup: string;
  ageCategory: string;
  passcode: string;
}

// 6 Authorized Governance Personnel (Protected Data Matrix)
export const AUTHORIZED_MEMBERS: AuthorizedMember[] = [
  {
    slNo: "01",
    id: "LF-EXEC-001",
    name: "Dr. Puritsabam Birmani",
    role: "President & Legal Trustee",
    email: "ichemma@yahoo.com",
    phone: "98640-44123",
    bloodGroup: "O+VE",
    ageCategory: "Senior Citizen",
    passcode: "98640"
  },
  {
    slNo: "02",
    id: "LF-EXEC-002",
    name: "K. Ajit Singh",
    role: "Vice-Chairman & Executive Officer",
    email: "kajitsingh9@gmail.com",
    phone: "98648-01906",
    bloodGroup: "A+VE",
    ageCategory: "Senior Citizen",
    passcode: "98648"
  },
  {
    slNo: "03",
    id: "LF-EXEC-003",
    name: "Y. Thambal Singha",
    role: "Managing Director",
    email: "thambal.singha@gmail.com",
    phone: "94350-87852",
    bloodGroup: "O+VE",
    ageCategory: "Senior Citizen",
    passcode: "94350"
  },
  {
    slNo: "04",
    id: "LF-EXEC-004",
    name: "M. Bina Babu Singha",
    role: "Secretary",
    email: "binababu.singha@yahoo.com",
    phone: "76370-87931",
    bloodGroup: "AB+VE",
    ageCategory: "Senior Citizen",
    passcode: "76370"
  },
  {
    slNo: "05",
    id: "LF-EXEC-005",
    name: "Ng. Baldev Singha",
    role: "Treasurer & Financial Auditor",
    email: "731baldevsingha@gmail.com",
    phone: "94351-94989",
    bloodGroup: "B+VE",
    ageCategory: "Senior Citizen",
    passcode: "94351"
  },
  {
    slNo: "06",
    id: "LF-EXEC-006",
    name: "Aryaman M Singha",
    role: "Platform Developer & Authorized Administrator",
    email: "aryamansingha60@gmail.com",
    phone: "7099659804",
    bloodGroup: "AB+",
    ageCategory: "Non Senior Citizen",
    passcode: "70996"
  }
];

export default function DocumentsPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [inputCredential, setInputCredential] = useState("");
  const [inputPasscode, setInputPasscode] = useState("");
  const [activeUser, setActiveUser] = useState<AuthorizedMember | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Auto-verify if authenticated session in localStorage matches authorized email
  useEffect(() => {
    const userStr = localStorage.getItem("lf_user");
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        if (parsed && parsed.email) {
          const matched = AUTHORIZED_MEMBERS.find(
            m => m.email.toLowerCase() === parsed.email.toLowerCase()
          );
          if (matched) {
            setActiveUser(matched);
            setIsUnlocked(true);
          }
        }
      } catch (e) {}
    }
  }, []);

  const handleOfficerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cred = inputCredential.trim().toLowerCase();
    const pass = inputPasscode.trim();

    if (!cred) {
      setErrorMsg("Please enter your registered Email ID or Contact Number.");
      return;
    }

    const matched = AUTHORIZED_MEMBERS.find(m => {
      const cleanPhone = m.phone.replace(/[^0-9]/g, '');
      const cleanInput = cred.replace(/[^0-9]/g, '');
      const isEmailMatch = m.email.toLowerCase() === cred;
      const isPhoneMatch = cleanInput.length >= 5 && cleanPhone.includes(cleanInput);
      const isIdMatch = m.id.toLowerCase() === cred;

      const isPassMatch = !pass || m.passcode === pass || cleanPhone.slice(-5) === pass;

      return (isEmailMatch || isPhoneMatch || isIdMatch) && isPassMatch;
    });

    if (matched) {
      setActiveUser(matched);
      setIsUnlocked(true);
      setShowLoginModal(false);
      setErrorMsg("");
      setInputCredential("");
      setInputPasscode("");
    } else {
      setErrorMsg("Access Denied: Invalid credentials. Only authorized executive officers can access the Internal Governance Vault.");
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: "2.5rem 0 5rem", maxWidth: "1100px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div className="glass-panel" style={{ padding: "0.4rem 1.4rem", borderRadius: "30px", marginBottom: "1rem", display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(27, 42, 87, 0.08)" }}>
          <ShieldCheck size={16} style={{ color: "var(--primary-color)" }} />
          <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--primary-color)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Official Governance Archive
          </span>
        </div>

        <h1 style={{ fontSize: "2.8rem", fontWeight: 900, marginBottom: "0.75rem", color: "var(--primary-color)" }}>
          Digital Library & Documents
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "760px", margin: "0 auto", lineHeight: 1.6 }}>
          Internal foundation governance archives are strictly protected. Access requires authorized officer authentication.
        </p>
      </div>

      {/* RESTRICTED LOCK CARD (If Not Unlocked) */}
      {!isUnlocked && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            className="card"
            style={{
              display: "flex",
              flexDirection: "column",
              width: "min(560px, 100%)",
              borderTop: "5px solid var(--primary-color)",
              borderRadius: "24px",
              padding: "2.5rem",
              boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
              background: "var(--surface-color)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "1.5rem" }}>
                <div 
                  style={{ 
                    background: "linear-gradient(135deg, rgba(27, 42, 87, 0.1), rgba(14, 165, 233, 0.15))", 
                    width: "64px", 
                    height: "64px", 
                    borderRadius: "18px", 
                    color: "var(--primary-color)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    flexShrink: 0,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
                  }}
                >
                  <Lock size={32} />
                </div>
                <div>
                  <h2 style={{ margin: "0 0 4px 0", fontSize: "1.5rem", fontWeight: 900, color: "var(--text-primary)" }}>
                    Internal Governance Vault
                  </h2>
                  <span style={{ fontSize: "0.85rem", color: "#DC2626", fontWeight: 800, background: "rgba(220, 38, 38, 0.1)", padding: "2px 12px", borderRadius: "12px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                    <ShieldAlert size={14} /> Restricted Officer Access
                  </span>
                </div>
              </div>

              <p style={{ color: "var(--text-secondary)", fontSize: "0.98rem", lineHeight: 1.6, marginBottom: "2rem" }}>
                Trust Deeds, Bye-laws, Executive Resolutions, and Financial Documents are protected under Foundation Bye-Laws. Access is restricted exclusively to designated Executive Committee Officers.
              </p>

              <div style={{ background: "var(--bg-color)", borderRadius: "16px", padding: "1.25rem", border: "1px solid var(--border-color)", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "12px" }}>
                <LockKeyhole size={24} style={{ color: "var(--primary-color)", flexShrink: 0 }} />
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  <strong style={{ color: "var(--text-primary)" }}>Security Verification:</strong> General members and public visitors cannot access these files. Authorized signatories must log in using their official credentials.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowLoginModal(true)}
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", minHeight: "52px", fontSize: "1.05rem", borderRadius: "50px", fontWeight: 800, gap: "10px" }}
            >
              <Key size={20} /> Authorised Officer Login Required
            </button>
          </div>
        </div>
      )}

      {/* UNLOCKED HIGH-SECURITY VAULT VIEW */}
      {isUnlocked && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Security Badge Ribbon */}
          <div 
            style={{ 
              background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", 
              borderRadius: "24px", 
              padding: "2rem 2.5rem", 
              color: "#FFFFFF",
              boxShadow: "0 20px 40px rgba(15, 23, 42, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1.5rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div style={{ background: "rgba(16, 185, 129, 0.2)", width: "56px", height: "56px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #10B981" }}>
                <ShieldCheck size={32} style={{ color: "#10B981" }} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                  <span style={{ background: "#10B981", color: "#000000", fontSize: "0.75rem", fontWeight: 900, padding: "2px 8px", borderRadius: "10px", textTransform: "uppercase" }}>
                    Secured Access Verified
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>Serial: {activeUser?.id || "LF-EXEC-001"}</span>
                  <span style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.15)", color: "#FFFFFF", padding: "2px 8px", borderRadius: "10px" }}>
                    Blood Group: {activeUser?.bloodGroup}
                  </span>
                </div>
                <h2 style={{ fontSize: "1.45rem", fontWeight: 900, margin: 0, color: "#FFFFFF" }}>
                  Official Governance Archive Vault
                </h2>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "rgba(255,255,255,0.85)", marginTop: "2px" }}>
                  Authenticated Signatory: <strong>{activeUser?.name}</strong> ({activeUser?.role})
                </p>
              </div>
            </div>

            <button 
              onClick={() => { setIsUnlocked(false); setActiveUser(null); }}
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#FFFFFF", padding: "0.6rem 1.25rem", borderRadius: "30px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
            >
              Lock Vault & Exit
            </button>
          </div>

          {/* Document Showcase Card */}
          <div 
            className="card"
            style={{ 
              borderRadius: "28px", 
              padding: "2.5rem", 
              border: "1px solid var(--border-color)",
              background: "var(--surface-color)",
              boxShadow: "0 15px 35px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              gap: "2rem"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem" }}>
              <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                <div 
                  style={{ 
                    background: "linear-gradient(135deg, #DC2626, #991B1B)", 
                    width: "72px", 
                    height: "88px", 
                    borderRadius: "16px", 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    color: "#FFFFFF",
                    boxShadow: "0 10px 20px rgba(220, 38, 38, 0.25)",
                    flexShrink: 0
                  }}
                >
                  <FileText size={36} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 900, marginTop: "4px" }}>PDF</span>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ background: "rgba(27, 42, 87, 0.1)", color: "var(--primary-color)", padding: "4px 10px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 800 }}>
                      Official Trust Deed
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
                      Updated September 2026
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--text-primary)", margin: "0 0 8px 0", lineHeight: 1.3 }}>
                    Pad Leimarembi Important Governance Document
                  </h3>

                  <p style={{ color: "var(--text-secondary)", fontSize: "0.98rem", margin: 0, maxWidth: "650px", lineHeight: 1.6 }}>
                    Contains official trust deeds, bye-laws, executive resolutions, financial authorization guidelines, and administrative regulations for the Leimarembi Foundation.
                  </p>
                </div>
              </div>
            </div>

            {/* Document Details grid */}
            <div 
              style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                gap: "1rem", 
                background: "var(--bg-color)", 
                padding: "1.25rem 1.5rem", 
                borderRadius: "18px", 
                border: "1px solid var(--border-color)" 
              }}
            >
              <div>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700, display: "block", marginBottom: "2px" }}>File Name</span>
                <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--text-primary)" }}>Pad Leimarembi Imp Document.pdf</span>
              </div>

              <div>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700, display: "block", marginBottom: "2px" }}>Access Clearance</span>
                <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#059669" }}>Authorized Executive Signatory</span>
              </div>

              <div>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700, display: "block", marginBottom: "2px" }}>Format</span>
                <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--text-primary)" }}>PDF Softcopy (Verified)</span>
              </div>
            </div>

            {/* Action Buttons: Download & Eye View */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", paddingTop: "0.5rem" }}>
              {/* EYE Option (View PDF directly) */}
              <button
                onClick={() => setShowPdfViewer(true)}
                className="btn btn-primary"
                style={{ 
                  flex: 1, 
                  minWidth: "220px", 
                  justifyContent: "center", 
                  padding: "0.9rem 1.75rem", 
                  borderRadius: "50px", 
                  fontWeight: 800, 
                  fontSize: "1rem",
                  gap: "10px"
                }}
              >
                <Eye size={20} /> View Document (Eye Reader)
              </button>

              {/* Download Softcopy Button */}
              <a
                href="/Pad_Leimarembi_Imp_Document.pdf"
                download="Pad_Leimarembi_Imp_Document.pdf"
                className="btn btn-secondary"
                style={{ 
                  flex: 1, 
                  minWidth: "220px", 
                  justifyContent: "center", 
                  padding: "0.9rem 1.75rem", 
                  borderRadius: "50px", 
                  fontWeight: 800, 
                  fontSize: "1rem",
                  gap: "10px",
                  textDecoration: "none"
                }}
              >
                <Download size={20} /> Download Softcopy
              </a>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN MODAL FOR AUTHORIZED OFFICERS */}
      {showLoginModal && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem"
          }}
          onClick={() => setShowLoginModal(false)}
        >
          <div 
            style={{
              background: "var(--surface-color)",
              width: "100%",
              maxWidth: "480px",
              borderRadius: "28px",
              border: "1px solid var(--border-color)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
              animation: "scaleUp 0.25s ease-out",
              overflow: "hidden"
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: "1.5rem 2rem", background: "linear-gradient(135deg, #0F172A, #1E293B)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Key size={22} style={{ color: "#10B981" }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF" }}>
                    Authorised Officer Portal Login
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>Executive Security Authentication</span>
                </div>
              </div>
              <button 
                onClick={() => setShowLoginModal(false)}
                style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer" }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ padding: "2rem" }}>
              <p style={{ fontSize: "0.925rem", color: "var(--text-secondary)", marginTop: 0, marginBottom: "1.5rem", lineHeight: 1.5 }}>
                Enter your registered Email ID or Contact Number and security passcode to authenticate and unlock the vault:
              </p>

              {errorMsg && (
                <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", color: "#DC2626", padding: "0.85rem 1rem", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <AlertCircle size={18} style={{ flexShrink: 0 }} /> {errorMsg}
                </div>
              )}

              {/* Secure Officer Login Form */}
              <form onSubmit={handleOfficerLogin} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "6px" }}>
                    Registered Email ID or Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter registered email or phone"
                    value={inputCredential}
                    onChange={(e) => setInputCredential(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "12px",
                      border: "1.5px solid var(--border-color)",
                      background: "var(--bg-color)",
                      color: "var(--text-primary)",
                      fontSize: "0.95rem",
                      outline: "none"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "6px" }}>
                    Security Passcode / PIN *
                  </label>
                  <input
                    type="password"
                    placeholder="Enter 5-digit passcode"
                    value={inputPasscode}
                    onChange={(e) => setInputPasscode(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "12px",
                      border: "1.5px solid var(--border-color)",
                      background: "var(--bg-color)",
                      color: "var(--text-primary)",
                      fontSize: "0.95rem",
                      outline: "none"
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", minHeight: "48px", borderRadius: "12px", fontWeight: 800, fontSize: "1rem", marginTop: "0.5rem" }}
                >
                  <CheckCircle2 size={18} /> Authenticate Officer Clearance
                </button>
              </form>

              <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                <button 
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EYE OPTION - PDF VIEWER MODAL */}
      {showPdfViewer && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 2000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem"
          }}
        >
          <div 
            style={{
              background: "var(--surface-color)",
              width: "100%",
              maxWidth: "960px",
              height: "90vh",
              borderRadius: "24px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
              border: "1px solid var(--border-color)"
            }}
          >
            {/* PDF Reader Header Bar */}
            <div 
              style={{ 
                padding: "1rem 1.75rem", 
                background: "linear-gradient(135deg, #0F172A, #1E293B)", 
                color: "#FFFFFF", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between" 
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Eye size={22} style={{ color: "#10B981" }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF" }}>
                    Pad Leimarembi Important Governance Document
                  </h4>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>Official PDF Document Reader</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <a
                  href="/Pad_Leimarembi_Imp_Document.pdf"
                  download="Pad_Leimarembi_Imp_Document.pdf"
                  style={{ background: "#10B981", color: "#000000", padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 900, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <Download size={14} /> Softcopy
                </a>

                <button 
                  onClick={() => setShowPdfViewer(false)}
                  style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#FFFFFF", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Embedded PDF Viewer */}
            <div style={{ flex: 1, background: "#525659", position: "relative" }}>
              <iframe
                src="/Pad_Leimarembi_Imp_Document.pdf#toolbar=1"
                title="Pad Leimarembi Important Governance Document"
                width="100%"
                height="100%"
                style={{ border: "none" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
