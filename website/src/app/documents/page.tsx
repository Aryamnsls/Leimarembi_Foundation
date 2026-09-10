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
  CheckCircle2, 
  UserCheck, 
  AlertCircle,
  FileCheck,
  Building2,
  Calendar,
  Layers,
  ArrowRight
} from "lucide-react";

// 5 Legal Authorised Executive Members
const AUTHORIZED_MEMBERS = [
  { id: "LF-EXEC-001", name: "Dr. N. Tombi Singh", role: "President & Legal Trustee", email: "president@leimarembi.org", code: "EXEC001" },
  { id: "LF-EXEC-002", name: "K. Ibomcha Meitei", role: "General Secretary", email: "secretary@leimarembi.org", code: "EXEC002" },
  { id: "LF-EXEC-003", name: "S. Pramodini Devi", role: "Treasurer & Financial Auditor", email: "treasurer@leimarembi.org", code: "EXEC003" },
  { id: "LF-EXEC-004", name: "M. Ningthemba Sharma", role: "Trustee Board Chairman", email: "trustee@leimarembi.org", code: "EXEC004" },
  { id: "LF-EXEC-005", name: "Adv. Rajen Singh", role: "Legal Standing Counsel", email: "legal@leimarembi.org", code: "EXEC005" }
];

export default function DocumentsPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedMemberCode, setSelectedMemberCode] = useState("");
  const [passcode, setPasscode] = useState("");
  const [activeUser, setActiveUser] = useState<typeof AUTHORIZED_MEMBERS[0] | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Check if session token exists in localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("lf_user");
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        // Default unlock if logged in user is admin/executive or matched
        if (parsed.role === "ADMIN" || parsed.role === "MEMBER") {
          setActiveUser(AUTHORIZED_MEMBERS[0]);
          setIsUnlocked(true);
        }
      } catch (e) {}
    }
  }, []);

  const handleAuthorizedLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const matched = AUTHORIZED_MEMBERS.find(
      m => m.code === selectedMemberCode || m.email.toLowerCase() === selectedMemberCode.toLowerCase()
    );

    if (matched) {
      setActiveUser(matched);
      setIsUnlocked(true);
      setShowLoginModal(false);
      setErrorMsg("");
    } else {
      setErrorMsg("Unauthorized credentials. Only 5 Legal Authorized Committee Members can access this vault.");
    }
  };

  const handleQuickUnlock = (member: typeof AUTHORIZED_MEMBERS[0]) => {
    setActiveUser(member);
    setIsUnlocked(true);
    setShowLoginModal(false);
    setErrorMsg("");
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
        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "720px", margin: "0 auto", lineHeight: 1.6 }}>
          Official foundation governance documents are protected and accessible to <strong>5 authorised executive committee members</strong> only.
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
              justifyContent: "space-between",
              width: "min(520px, 100%)",
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
                  <h2 style={{ margin: "0 0 4px 0", fontSize: "1.45rem", fontWeight: 900, color: "var(--text-primary)" }}>
                    Internal Governance
                  </h2>
                  <span style={{ fontSize: "0.85rem", color: "#DC2626", fontWeight: 800, background: "rgba(220, 38, 38, 0.1)", padding: "2px 10px", borderRadius: "12px", display: "inline-block" }}>
                    🔒 Restricted Access
                  </span>
                </div>
              </div>

              <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.6, marginBottom: "2rem" }}>
                Trust Deeds, Bye-laws, Executive Resolutions, and Member Directories are protected and accessible only to authorised executive committee members.
              </p>

              <div style={{ background: "var(--bg-color)", borderRadius: "16px", padding: "1.25rem", border: "1px solid var(--border-color)", marginBottom: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-primary)", fontWeight: 800, fontSize: "0.9rem", marginBottom: "8px" }}>
                  <UserCheck size={18} style={{ color: "#059669" }} /> 5 Authorized Executive Signatories:
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {AUTHORIZED_MEMBERS.map((m) => (
                    <span key={m.id} style={{ fontSize: "0.75rem", background: "var(--surface-color)", border: "1px solid var(--border-color)", padding: "4px 8px", borderRadius: "8px", color: "var(--text-secondary)", fontWeight: 600 }}>
                      {m.role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowLoginModal(true)}
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", minHeight: "52px", fontSize: "1.05rem", borderRadius: "50px", fontWeight: 800, gap: "10px" }}
            >
              <Lock size={20} /> Requires Member Login
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
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ background: "#10B981", color: "#000000", fontSize: "0.75rem", fontWeight: 900, padding: "2px 8px", borderRadius: "10px", textTransform: "uppercase" }}>
                    Secured Access Verified
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>Serial: LF-GOV-2026-0091</span>
                </div>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 900, margin: 0, color: "#FFFFFF" }}>
                  Official Executive Governance Vault
                </h2>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>
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
                <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#059669" }}>5 Authorised Executives</span>
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

      {/* LOGIN MODAL FOR 5 LEGAL AUTHORIZED USERS */}
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
              maxWidth: "540px",
              borderRadius: "28px",
              overflow: "hidden",
              border: "1px solid var(--border-color)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
              animation: "scaleUp 0.25s ease-out"
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: "1.5rem 2rem", background: "linear-gradient(135deg, #0F172A, #1E293B)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Key size={22} style={{ color: "#10B981" }} />
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF" }}>
                  Authorized Member Login
                </h3>
              </div>
              <button 
                onClick={() => setShowLoginModal(false)}
                style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer" }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ padding: "2rem" }}>
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: 0, marginBottom: "1.5rem", lineHeight: 1.5 }}>
                Restricted Access: Only the <strong>5 Legal Authorized Executive Members</strong> listed below can authenticate to access the Governance Vault.
              </p>

              {errorMsg && (
                <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", color: "#DC2626", padding: "0.75rem 1rem", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 700, marginBottom: "1.25rem" }}>
                  {errorMsg}
                </div>
              )}

              {/* 5 Authorized Executive Buttons (1-Click Select) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                  Select Authorized Executive Account:
                </span>
                {AUTHORIZED_MEMBERS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleQuickUnlock(m)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.85rem 1.15rem",
                      borderRadius: "14px",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-color)",
                      color: "var(--text-primary)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "var(--primary-color)";
                      e.currentTarget.style.background = "rgba(14, 165, 233, 0.05)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "var(--border-color)";
                      e.currentTarget.style.background = "var(--bg-color)";
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>{m.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{m.role} • <span style={{ color: "var(--primary-color)" }}>{m.id}</span></div>
                    </div>
                    <span style={{ fontSize: "0.8rem", background: "var(--primary-color)", color: "#FFF", padding: "4px 10px", borderRadius: "20px", fontWeight: 800 }}>
                      Authenticate <ArrowRight size={12} style={{ display: "inline", marginLeft: "2px" }} />
                    </span>
                  </button>
                ))}
              </div>

              <div style={{ textAlign: "center" }}>
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
