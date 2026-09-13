"use client";

import { useState, useEffect, useRef } from "react";
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
  LockKeyhole,
  Upload,
  Image,
  File,
  FileSpreadsheet,
  Trash2,
  Plus,
  FolderOpen
} from "lucide-react";

import { 
  EXECUTIVE_OFFICERS, 
  findOfficer, 
  verifyOfficerPassword, 
  isExecutiveOfficer,
  ExecutiveOfficer 
} from "@/lib/executiveOfficers";
import { isSuperAdmin } from "@/lib/superAdminAuth";

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

export const AUTHORIZED_MEMBERS: AuthorizedMember[] = EXECUTIVE_OFFICERS.map(o => ({
  slNo: o.slNo,
  id: o.id,
  name: o.name,
  role: o.designation,
  email: o.email,
  phone: o.phone,
  bloodGroup: o.bloodGroup,
  ageCategory: o.ageCategory,
  passcode: o.passcode
}));

// ----- Document Library -----
interface DocEntry {
  id: string;
  title: string;
  description: string;
  fileName: string;
  filePath: string;
  fileType: "PDF" | "IMAGE" | "DOCX" | "XLSX" | "OTHER";
  tag: string;
  tagColor: string;
  updatedLabel: string;
  isUploaded?: boolean;
  uploadedBlob?: string; // base64 / object URL for user-uploaded files
}

const BUILTIN_DOCS: DocEntry[] = [
  {
    id: "gov-001",
    title: "Pad Leimarembi Important Governance Document",
    description: "Contains official trust deeds, bye-laws, executive resolutions, financial authorization guidelines, and administrative regulations for the Leimarembi Foundation.",
    fileName: "Pad Leimarembi Imp Document.pdf",
    filePath: "/Pad_Leimarembi_Imp_Document.pdf",
    fileType: "PDF",
    tag: "Official Trust Deed",
    tagColor: "rgba(27,42,87,0.12)",
    updatedLabel: "Updated September 2026",
  },
  {
    id: "mem-001",
    title: "Members List – Leimarembi Foundation",
    description: "Complete verified list of all registered members of the Leimarembi Foundation including blood group, age category, email and contact details.",
    fileName: "Members_List.jpeg",
    filePath: "/Members_List.jpeg",
    fileType: "IMAGE",
    tag: "Member Registry",
    tagColor: "rgba(16,185,129,0.12)",
    updatedLabel: "Updated 2026",
  },
  {
    id: "don-001",
    title: "Donation List of Members",
    description: "Official donation ledger capturing contribution records of all foundation members including amounts, dates and payment references.",
    fileName: "Donation_List_of_Members.docx",
    filePath: "/Donation_List_of_Members.docx",
    fileType: "DOCX",
    tag: "Financial Records",
    tagColor: "rgba(245,158,11,0.12)",
    updatedLabel: "Updated 2026",
  },
  {
    id: "blood-001",
    title: "Blood Group Register – All Members",
    description: "Comprehensive blood group register for all Leimarembi Foundation members, maintained for medical emergency reference and welfare coordination.",
    fileName: "New_Blood_Group_List.docx",
    filePath: "/New_Blood_Group_List.docx",
    fileType: "DOCX",
    tag: "Health & Welfare",
    tagColor: "rgba(220,38,38,0.1)",
    updatedLabel: "Updated 2026",
  },
];

function fileTypeIcon(type: DocEntry["fileType"]) {
  switch (type) {
    case "PDF":   return { icon: FileText, color: "#DC2626", label: "PDF" };
    case "IMAGE": return { icon: Image,    color: "#0EA5E9", label: "IMG" };
    case "DOCX":  return { icon: File,     color: "#2563EB", label: "DOC" };
    case "XLSX":  return { icon: FileSpreadsheet, color: "#16A34A", label: "XLS" };
    default:      return { icon: File,     color: "#6B7280", label: "FILE" };
  }
}

function detectFileType(name: string): DocEntry["fileType"] {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["jpg","jpeg","png","gif","webp","svg","bmp"].includes(ext)) return "IMAGE";
  if (ext === "pdf") return "PDF";
  if (["doc","docx"].includes(ext)) return "DOCX";
  if (["xls","xlsx","csv"].includes(ext)) return "XLSX";
  return "OTHER";
}

const STORAGE_KEY = "lf_uploaded_docs";

export default function DocumentsPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<DocEntry | null>(null);
  const [inputCredential, setInputCredential] = useState("");
  const [inputPasscode, setInputPasscode] = useState("");
  const [activeUser, setActiveUser] = useState<AuthorizedMember | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isAdminOrSuperAdmin, setIsAdminOrSuperAdmin] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<DocEntry[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadTag, setUploadTag] = useState("Foundation Document");
  const [dragOver, setDragOver] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-verify session
  useEffect(() => {
    const userStr = typeof window !== "undefined" ? localStorage.getItem("lf_user") : null;
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        if (parsed) {
          const isPrivileged =
            isSuperAdmin(parsed) ||
            isExecutiveOfficer(parsed) ||
            parsed.role === "ADMIN" ||
            parsed.role === "SUPER_ADMIN";
          setIsAdminOrSuperAdmin(isPrivileged);
          if (parsed.email || parsed.phone) {
            const officer = findOfficer(parsed.email || parsed.phone);
            if (officer) {
              setActiveUser({
                slNo: "slNo" in officer ? officer.slNo : "00",
                id: officer.id,
                name: officer.name,
                role: officer.designation,
                email: officer.email,
                phone: officer.phone,
                bloodGroup: officer.bloodGroup,
                ageCategory: officer.ageCategory,
                passcode: officer.passcode,
              });
              setIsUnlocked(true);
            }
          }
        }
      } catch (e) {}
    }

    // Load persisted uploaded docs
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setUploadedDocs(JSON.parse(saved));
    } catch {}
  }, []);

  const saveUploadedDocs = (docs: DocEntry[]) => {
    setUploadedDocs(docs);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(docs)); } catch {}
  };

  const handleOfficerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const cred = inputCredential.trim();
    const pass = inputPasscode.trim();
    if (!cred) { setErrorMsg("Please enter your registered Email ID or Contact Number."); return; }
    const officer = findOfficer(cred);
    if (!officer) { setErrorMsg("Access Denied: Officer not found. Please use your registered Executive Officer email or phone number."); return; }
    const isValid = verifyOfficerPassword(officer, pass);
    if (isValid) {
      const activeObj: AuthorizedMember = {
        slNo: "slNo" in officer ? officer.slNo : "00",
        id: officer.id,
        name: officer.name,
        role: officer.designation,
        email: officer.email,
        phone: officer.phone,
        bloodGroup: officer.bloodGroup,
        ageCategory: officer.ageCategory,
        passcode: officer.passcode,
      };
      setActiveUser(activeObj);
      setIsUnlocked(true);
      setShowLoginModal(false);
      setErrorMsg("");
      setInputCredential("");
      setInputPasscode("");
      try {
        const existingStr = localStorage.getItem("lf_user");
        const existing = existingStr ? JSON.parse(existingStr) : {};
        const isSuper = officer.email === "aryamansingha60@gmail.com" || officer.email === "binababu.singha@yahoo.com";
        localStorage.setItem("lf_user", JSON.stringify({
          ...existing,
          name: officer.name,
          email: officer.email,
          phone: officer.phone,
          role: isSuper ? "SUPER_ADMIN" : "ADMIN",
          designation: officer.designation,
          bloodGroup: officer.bloodGroup,
          isSeniorCitizen: officer.isSeniorCitizen,
        }));
        localStorage.setItem("lf_token", localStorage.getItem("lf_token") || `lf_tok_exec_${Date.now()}`);
      } catch {}
    } else {
      setErrorMsg(isAdminOrSuperAdmin
        ? "Access Denied: Invalid security password. Please enter your Date of Birth (DOB) or designated passcode."
        : "Access Denied: Invalid security clearance password. Please check your credentials.");
    }
  };

  // File Upload handlers
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setPendingFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPendingFile(file);
  };

  const handleUploadSubmit = () => {
    if (!pendingFile) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const newDoc: DocEntry = {
        id: `upload-${Date.now()}`,
        title: uploadTitle || pendingFile.name.replace(/\.[^.]+$/, ""),
        description: uploadDesc || `Uploaded document – ${pendingFile.name}`,
        fileName: pendingFile.name,
        filePath: dataUrl,
        fileType: detectFileType(pendingFile.name),
        tag: uploadTag || "Foundation Document",
        tagColor: "rgba(99,102,241,0.12)",
        updatedLabel: `Uploaded ${new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}`,
        isUploaded: true,
        uploadedBlob: dataUrl,
      };
      const updated = [...uploadedDocs, newDoc];
      saveUploadedDocs(updated);
      setShowUploadModal(false);
      setPendingFile(null);
      setUploadTitle("");
      setUploadDesc("");
      setUploadTag("Foundation Document");
    };
    reader.readAsDataURL(pendingFile);
  };

  const handleDeleteDoc = (id: string) => {
    const updated = uploadedDocs.filter(d => d.id !== id);
    saveUploadedDocs(updated);
  };

  const allDocs = [...BUILTIN_DOCS, ...uploadedDocs];

  return (
    <div className="animate-fade-in" style={{ padding: "2.5rem 0 5rem", maxWidth: "1100px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div className="glass-panel" style={{ padding: "0.4rem 1.4rem", borderRadius: "30px", marginBottom: "1rem", display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(27,42,87,0.08)" }}>
          <ShieldCheck size={16} style={{ color: "var(--primary-color)" }} />
          <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--primary-color)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Official Governance Archive
          </span>
        </div>
        <h1 style={{ fontSize: "2.8rem", fontWeight: 900, marginBottom: "0.75rem", color: "var(--primary-color)" }}>
          Digital Library &amp; Documents
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "760px", margin: "0 auto", lineHeight: 1.6 }}>
          Internal foundation governance archives are strictly protected. Access requires authorized officer authentication.
        </p>
      </div>

      {/* RESTRICTED LOCK CARD */}
      {!isUnlocked && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="card" style={{ display: "flex", flexDirection: "column", width: "min(560px,100%)", borderTop: "5px solid var(--primary-color)", borderRadius: "24px", padding: "2.5rem", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", background: "var(--surface-color)", position: "relative", overflow: "hidden" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "1.5rem" }}>
                <div style={{ background: "linear-gradient(135deg,rgba(27,42,87,0.1),rgba(14,165,233,0.15))", width: "64px", height: "64px", borderRadius: "18px", color: "var(--primary-color)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 8px 20px rgba(0,0,0,0.05)" }}>
                  <Lock size={32} />
                </div>
                <div>
                  <h2 style={{ margin: "0 0 4px 0", fontSize: "1.5rem", fontWeight: 900, color: "var(--text-primary)" }}>Internal Governance Vault</h2>
                  <span style={{ fontSize: "0.85rem", color: "#DC2626", fontWeight: 800, background: "rgba(220,38,38,0.1)", padding: "2px 12px", borderRadius: "12px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                    <ShieldAlert size={14} /> Restricted Officer Access
                  </span>
                </div>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.98rem", lineHeight: 1.6, marginBottom: "2rem" }}>
                Trust Deeds, Bye-laws, Executive Resolutions, and Financial Documents are protected under Foundation Bye-Laws. Access is restricted exclusively to designated Executive Committee Officers.
              </p>
              <div style={{ background: "var(--bg-color)", borderRadius: "16px", padding: "1.25rem", border: "1px solid var(--border-color)", marginBottom: isAdminOrSuperAdmin ? "1.5rem" : "2rem", display: "flex", alignItems: "center", gap: "12px" }}>
                <LockKeyhole size={24} style={{ color: "var(--primary-color)", flexShrink: 0 }} />
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  <strong style={{ color: "var(--text-primary)" }}>Security Verification:</strong>{" "}
                  {isAdminOrSuperAdmin
                    ? "Authorized signatories must log in using their registered email/phone and Date of Birth (DOB)."
                    : "Access is restricted exclusively to authenticated Executive Committee Officers with security clearance."}
                </div>
              </div>
              {/* DOB Hint – ONLY for Admin/SuperAdmin */}
              {isAdminOrSuperAdmin && (
                <div style={{ background: "rgba(14,165,233,0.08)", border: "1.5px solid rgba(14,165,233,0.3)", borderRadius: "14px", padding: "0.9rem 1.1rem", display: "flex", gap: "10px", alignItems: "center", marginBottom: "1.75rem" }}>
                  <span style={{ fontSize: "1.2rem" }}>💡</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: 700 }}>
                    Officer Access Hint: Your login password is your <strong>Date of Birth (DOB)</strong>.
                  </span>
                </div>
              )}
            </div>
            <button onClick={() => setShowLoginModal(true)} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", minHeight: "52px", fontSize: "1.05rem", borderRadius: "50px", fontWeight: 800, gap: "10px" }}>
              <Key size={20} /> Authorised Officer Login Required
            </button>
          </div>
        </div>
      )}

      {/* UNLOCKED VAULT VIEW */}
      {isUnlocked && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Security badge */}
          <div style={{ background: "linear-gradient(135deg,#0F172A 0%,#1E293B 100%)", borderRadius: "24px", padding: "2rem 2.5rem", color: "#FFFFFF", boxShadow: "0 20px 40px rgba(15,23,42,0.3)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div style={{ background: "rgba(16,185,129,0.2)", width: "56px", height: "56px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #10B981" }}>
                <ShieldCheck size={32} style={{ color: "#10B981" }} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                  <span style={{ background: "#10B981", color: "#000000", fontSize: "0.75rem", fontWeight: 900, padding: "2px 8px", borderRadius: "10px", textTransform: "uppercase" }}>Secured Access Verified</span>
                  <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)" }}>Serial: {activeUser?.id || "LF-EXEC-001"}</span>
                  <span style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.15)", color: "#FFFFFF", padding: "2px 8px", borderRadius: "10px" }}>Blood Group: {activeUser?.bloodGroup}</span>
                </div>
                <h2 style={{ fontSize: "1.45rem", fontWeight: 900, margin: 0, color: "#FFFFFF" }}>Official Governance Archive Vault</h2>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "rgba(255,255,255,0.85)", marginTop: "2px" }}>
                  Authenticated Signatory: <strong>{activeUser?.name}</strong> ({activeUser?.role})
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={() => setShowUploadModal(true)}
                style={{ background: "rgba(99,102,241,0.85)", border: "1px solid rgba(99,102,241,0.5)", color: "#FFFFFF", padding: "0.6rem 1.25rem", borderRadius: "30px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Upload size={16} /> Upload Document
              </button>
              <button onClick={() => { setIsUnlocked(false); setActiveUser(null); }} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#FFFFFF", padding: "0.6rem 1.25rem", borderRadius: "30px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
                Lock Vault &amp; Exit
              </button>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "1rem" }}>
            {[
              { label: "Total Documents", value: allDocs.length, color: "#6366F1" },
              { label: "Built-in Records", value: BUILTIN_DOCS.length, color: "#10B981" },
              { label: "Uploaded Files", value: uploadedDocs.length, color: "#F59E0B" },
              { label: "Access Level", value: "Read / Write", color: "#0EA5E9" },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: "1.25rem 1.5rem", borderRadius: "18px", border: `1.5px solid ${s.color}22`, background: "var(--surface-color)" }}>
                <div style={{ fontSize: "1.8rem", fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700, marginTop: "2px" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Document Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {allDocs.map(doc => {
              const { icon: Icon, color: iconColor, label: iconLabel } = fileTypeIcon(doc.fileType);
              return (
                <div key={doc.id} className="card" style={{ borderRadius: "28px", padding: "2.5rem", border: "1px solid var(--border-color)", background: "var(--surface-color)", boxShadow: "0 15px 35px rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                    {/* File type icon */}
                    <div style={{ background: `linear-gradient(135deg,${iconColor},${iconColor}aa)`, width: "72px", height: "88px", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#FFFFFF", boxShadow: `0 10px 20px ${iconColor}44`, flexShrink: 0 }}>
                      <Icon size={32} />
                      <span style={{ fontSize: "0.7rem", fontWeight: 900, marginTop: "4px" }}>{iconLabel}</span>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                        <span style={{ background: doc.tagColor, color: "var(--text-primary)", padding: "4px 10px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 800 }}>{doc.tag}</span>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>{doc.updatedLabel}</span>
                        {doc.isUploaded && <span style={{ background: "rgba(99,102,241,0.15)", color: "#6366F1", padding: "2px 8px", borderRadius: "8px", fontSize: "0.7rem", fontWeight: 800 }}>UPLOADED</span>}
                      </div>
                      <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--text-primary)", margin: "0 0 8px 0", lineHeight: 1.3 }}>{doc.title}</h3>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", margin: 0, lineHeight: 1.6 }}>{doc.description}</p>
                    </div>

                    {doc.isUploaded && (
                      <button onClick={() => handleDeleteDoc(doc.id)} style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)", color: "#DC2626", padding: "6px 8px", borderRadius: "10px", cursor: "pointer", flexShrink: 0 }} title="Remove document">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {/* Details grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem", background: "var(--bg-color)", padding: "1.25rem 1.5rem", borderRadius: "18px", border: "1px solid var(--border-color)", margin: "1.5rem 0" }}>
                    <div>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700, display: "block", marginBottom: "2px" }}>File Name</span>
                      <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--text-primary)", wordBreak: "break-all" }}>{doc.fileName}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700, display: "block", marginBottom: "2px" }}>Access Clearance</span>
                      <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#059669" }}>Authorized Executive Signatory</span>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700, display: "block", marginBottom: "2px" }}>Format</span>
                      <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--text-primary)" }}>{doc.fileType} (Verified)</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <button
                      onClick={() => setViewingDoc(doc)}
                      className="btn btn-primary"
                      style={{ flex: 1, minWidth: "200px", justifyContent: "center", padding: "0.9rem 1.75rem", borderRadius: "50px", fontWeight: 800, fontSize: "1rem", gap: "10px" }}
                    >
                      <Eye size={20} /> View Document (Eye Reader)
                    </button>
                    <a
                      href={doc.filePath}
                      download={doc.fileName}
                      className="btn btn-secondary"
                      style={{ flex: 1, minWidth: "200px", justifyContent: "center", padding: "0.9rem 1.75rem", borderRadius: "50px", fontWeight: 800, fontSize: "1rem", gap: "10px", textDecoration: "none" }}
                    >
                      <Download size={20} /> Download Softcopy
                    </a>
                  </div>
                </div>
              );
            })}

            {/* Add New Document Placeholder */}
            <button
              onClick={() => setShowUploadModal(true)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", padding: "2.5rem", borderRadius: "28px", border: "2px dashed var(--border-color)", background: "transparent", color: "var(--text-muted)", cursor: "pointer", transition: "all 0.2s ease", fontSize: "1rem", fontWeight: 700 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--primary-color)"; (e.currentTarget as HTMLElement).style.color = "var(--primary-color)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
            >
              <Plus size={36} />
              <span>Upload a New Document to the Digital Library</span>
              <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>Supports PDF, Word, Excel, Images, and all file types</span>
            </button>
          </div>
        </div>
      )}

      {/* ======== LOGIN MODAL ======== */}
      {showLoginModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.8)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }} onClick={() => setShowLoginModal(false)}>
          <div style={{ background: "var(--surface-color)", width: "100%", maxWidth: "480px", borderRadius: "28px", border: "1px solid var(--border-color)", boxShadow: "0 30px 60px rgba(0,0,0,0.3)", animation: "scaleUp 0.25s ease-out", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "1.5rem 2rem", background: "linear-gradient(135deg,#0F172A,#1E293B)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Key size={22} style={{ color: "#10B981" }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF" }}>Authorised Officer Portal Login</h3>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>Executive Security Authentication</span>
                </div>
              </div>
              <button onClick={() => setShowLoginModal(false)} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer" }}><X size={22} /></button>
            </div>

            <div style={{ padding: "2rem" }}>
              {isAdminOrSuperAdmin && (
                <div style={{ background: "rgba(14,165,233,0.08)", border: "1.5px solid rgba(14,165,233,0.3)", borderRadius: "14px", padding: "0.85rem 1rem", display: "flex", gap: "10px", alignItems: "center", marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>💡</span>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", lineHeight: 1.4 }}>
                    <strong>Officer Hint:</strong> Enter your registered Email or Phone. Your security password is your <strong>Date of Birth (DOB)</strong>.
                  </div>
                </div>
              )}
              {errorMsg && (
                <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", color: "#DC2626", padding: "0.85rem 1rem", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <AlertCircle size={18} style={{ flexShrink: 0 }} /> {errorMsg}
                </div>
              )}
              <form onSubmit={handleOfficerLogin} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "6px" }}>Registered Email ID or Phone Number *</label>
                  <input type="text" required placeholder="Enter registered email or phone" value={inputCredential} onChange={e => setInputCredential(e.target.value)} style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "12px", border: "1.5px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-primary)", fontSize: "0.95rem", outline: "none" }} />
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)" }}>
                      {isAdminOrSuperAdmin ? "Password (Date of Birth / PIN) *" : "Executive Security Password *"}
                    </label>
                    <span style={{ fontSize: "0.75rem", color: isAdminOrSuperAdmin ? "var(--secondary-color)" : "var(--text-muted)", fontWeight: 700 }}>
                      {isAdminOrSuperAdmin ? "DOB as Password" : "Clearance Required"}
                    </span>
                  </div>
                  <input type="password" required placeholder={isAdminOrSuperAdmin ? "Enter Date of Birth (e.g. DD/MM/YYYY or Passcode)" : "Enter executive security password"} value={inputPasscode} onChange={e => setInputPasscode(e.target.value)} style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "12px", border: "1.5px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-primary)", fontSize: "0.95rem", outline: "none" }} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", minHeight: "48px", borderRadius: "12px", fontWeight: 800, fontSize: "1rem", marginTop: "0.5rem" }}>
                  <CheckCircle2 size={18} /> Authenticate Officer Clearance
                </button>
              </form>
              <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                <button type="button" onClick={() => setShowLoginModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======== DOCUMENT VIEWER MODAL ======== */}
      {viewingDoc && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)", zIndex: 2000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
          <div style={{ background: "var(--surface-color)", width: "100%", maxWidth: "960px", height: "90vh", borderRadius: "24px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", border: "1px solid var(--border-color)" }}>
            <div style={{ padding: "1rem 1.75rem", background: "linear-gradient(135deg,#0F172A,#1E293B)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Eye size={22} style={{ color: "#10B981" }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF" }}>{viewingDoc.title}</h4>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>Official Document Reader – {viewingDoc.fileType}</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <a href={viewingDoc.filePath} download={viewingDoc.fileName} style={{ background: "#10B981", color: "#000000", padding: "6px 14px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 900, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <Download size={14} /> Download
                </a>
                <button onClick={() => setViewingDoc(null)} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#FFFFFF", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Viewer body */}
            <div style={{ flex: 1, background: "#525659", position: "relative", overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {viewingDoc.fileType === "PDF" && (
                <iframe src={`${viewingDoc.filePath}#toolbar=1`} title={viewingDoc.title} width="100%" height="100%" style={{ border: "none" }} />
              )}
              {viewingDoc.fileType === "IMAGE" && (
                <img src={viewingDoc.filePath} alt={viewingDoc.title} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", padding: "1rem" }} />
              )}
              {(viewingDoc.fileType === "DOCX" || viewingDoc.fileType === "XLSX") && !viewingDoc.isUploaded && (
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(`https://leimarembifoundation.org${viewingDoc.filePath}`)}&embedded=true`}
                  title={viewingDoc.title}
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                />
              )}
              {(viewingDoc.fileType === "DOCX" || viewingDoc.fileType === "XLSX" || viewingDoc.fileType === "OTHER") && viewingDoc.isUploaded && (
                <div style={{ textAlign: "center", color: "#FFFFFF", padding: "3rem" }}>
                  <FolderOpen size={64} style={{ marginBottom: "1rem", color: "#10B981" }} />
                  <h3 style={{ marginBottom: "0.75rem" }}>{viewingDoc.fileName}</h3>
                  <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "1.5rem" }}>This file type cannot be previewed in-browser. Please download the file to view it.</p>
                  <a href={viewingDoc.filePath} download={viewingDoc.fileName} style={{ background: "#10B981", color: "#000000", padding: "0.75rem 1.75rem", borderRadius: "30px", fontWeight: 800, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    <Download size={18} /> Download &amp; Open
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======== UPLOAD MODAL ======== */}
      {showUploadModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15,23,42,0.85)", backdropFilter: "blur(10px)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }} onClick={() => { setShowUploadModal(false); setPendingFile(null); }}>
          <div style={{ background: "var(--surface-color)", width: "100%", maxWidth: "540px", borderRadius: "28px", border: "1px solid var(--border-color)", boxShadow: "0 30px 60px rgba(0,0,0,0.35)", overflow: "hidden", animation: "scaleUp 0.25s ease-out" }} onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div style={{ padding: "1.5rem 2rem", background: "linear-gradient(135deg,#1e1b4b,#312e81)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Upload size={22} style={{ color: "#A5B4FC" }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>Upload to Digital Library</h3>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.65)" }}>All file types supported — PDF, Word, Excel, Images &amp; more</span>
                </div>
              </div>
              <button onClick={() => { setShowUploadModal(false); setPendingFile(null); }} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer" }}><X size={22} /></button>
            </div>

            <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{ border: `2px dashed ${dragOver ? "var(--primary-color)" : "var(--border-color)"}`, borderRadius: "18px", padding: "2rem", textAlign: "center", cursor: "pointer", background: dragOver ? "rgba(27,42,87,0.06)" : "var(--bg-color)", transition: "all 0.2s ease" }}
              >
                <input ref={fileInputRef} type="file" accept="*/*" style={{ display: "none" }} onChange={handleFileSelect} />
                {pendingFile ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <CheckCircle2 size={36} style={{ color: "#10B981" }} />
                    <strong style={{ color: "var(--text-primary)", wordBreak: "break-all" }}>{pendingFile.name}</strong>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{(pendingFile.size / 1024).toFixed(1)} KB — Click to change</span>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <Upload size={36} style={{ color: "var(--primary-color)", opacity: 0.6 }} />
                    <strong style={{ color: "var(--text-primary)" }}>Drag &amp; drop or click to select a file</strong>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, and any other format</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "6px" }}>Document Title <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>(optional)</span></label>
                <input type="text" placeholder="e.g. Annual Financial Report 2026" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "12px", border: "1.5px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-primary)", fontSize: "0.95rem", outline: "none" }} />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "6px" }}>Description <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>(optional)</span></label>
                <textarea placeholder="Brief description of this document..." value={uploadDesc} onChange={e => setUploadDesc(e.target.value)} rows={3} style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "12px", border: "1.5px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-primary)", fontSize: "0.95rem", outline: "none", resize: "vertical" }} />
              </div>

              {/* Tag / Category */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "6px" }}>Document Category</label>
                <select value={uploadTag} onChange={e => setUploadTag(e.target.value)} style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "12px", border: "1.5px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-primary)", fontSize: "0.95rem", outline: "none" }}>
                  <option>Foundation Document</option>
                  <option>Member Registry</option>
                  <option>Financial Records</option>
                  <option>Health &amp; Welfare</option>
                  <option>Meeting Minutes</option>
                  <option>Legal &amp; Trust Deed</option>
                  <option>Executive Resolution</option>
                  <option>Governance Archive</option>
                  <option>Other</option>
                </select>
              </div>

              <button
                onClick={handleUploadSubmit}
                disabled={!pendingFile}
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center", minHeight: "52px", borderRadius: "14px", fontWeight: 800, fontSize: "1rem", gap: "10px", opacity: pendingFile ? 1 : 0.5 }}
              >
                <Upload size={20} /> Add to Digital Library
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
