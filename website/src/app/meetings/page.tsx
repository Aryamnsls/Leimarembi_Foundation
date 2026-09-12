"use client";

import { useState } from "react";
import { 
  Video, 
  Plus, 
  Calendar, 
  Clock, 
  FileText, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Share2, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff, 
  PhoneOff, 
  Sparkles,
  ClipboardList,
  FileCheck,
  Award,
  Layers,
  Search,
  Building2,
  Lock,
  ChevronRight,
  ShieldCheck,
  Key,
  X,
  UserCheck,
  LogOut
} from "lucide-react";

import { 
  EXECUTIVE_OFFICERS, 
  findOfficer, 
  verifyOfficerPassword 
} from "@/lib/executiveOfficers";

export default function MeetingsPage() {
  const [activeTab, setActiveTab] = useState<"notices" | "agendas" | "attendance" | "mom" | "resolutions">("notices");
  const [isLiveMeetingOpen, setIsLiveMeetingOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(true);
  const [newNoticeModal, setNewNoticeModal] = useState(false);

  // Authentication State for Executive Officers
  const [authenticatedOfficer, setAuthenticatedOfficer] = useState<{ name: string; email: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loginInput, setLoginInput] = useState("");
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [actionNotice, setActionNotice] = useState<string>("");

  // Auto-verify if authenticated session in localStorage matches authorized officer
  useState(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("lf_user");
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          if (parsed && (parsed.email || parsed.phone)) {
            const officer = findOfficer(parsed.email || parsed.phone);
            if (officer) {
              setAuthenticatedOfficer({ name: officer.name, email: officer.email });
            }
          }
        } catch (e) {}
      }
    }
  });

  // Helper function to enforce Executive Officer Clearance on actions
  const requireOfficerClearance = (actionCallback: () => void, actionDescription?: string) => {
    if (authenticatedOfficer) {
      actionCallback();
    } else {
      setPendingAction(() => actionCallback);
      setActionNotice(actionDescription || "Access Restricted to Official Executive Officers");
      setAuthError("");
      setShowAuthModal(true);
    }
  };

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const cleanInput = loginInput.trim();
    const cleanPasscode = passcode.trim();

    const officer = findOfficer(cleanInput);

    if (officer && verifyOfficerPassword(officer, cleanPasscode)) {
      setAuthenticatedOfficer({ name: officer.name, email: officer.email });
      setShowAuthModal(false);
      setLoginInput("");
      setPasscode("");
      
      // Execute the pending action if one was triggered
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } else {
      setAuthError("Access Denied: This feature is reserved for the 5 Executive Officers of Leimarembi Foundation. Please enter your registered email/phone and your Date of Birth (DOB) as password.");
    }
  };

  const handleLogoutOfficer = () => {
    setAuthenticatedOfficer(null);
    setIsLiveMeetingOpen(false);
  };

  // Mock data for 5 Meeting Management pillars
  const meetingNotices = [
    {
      id: "MN-2026-09",
      title: "Executive Committee Emergency Meeting on Rural Health Grants",
      date: "14 Sept 2026",
      time: "10:30 AM IST",
      location: "Foundation Board Room & Online Google Meet",
      issuedBy: "Dr. Puritsabam Birmani (President)",
      status: "UPCOMING",
      category: "Executive Body"
    },
    {
      id: "MN-2026-08",
      title: "Quarterly Financial Audit & Scheme Review",
      date: "05 Sept 2026",
      time: "02:00 PM IST",
      location: "Google Meet Virtual Room",
      issuedBy: "M. Bina Babu Singha (Treasurer)",
      status: "COMPLETED",
      category: "Finance & Audit"
    },
    {
      id: "MN-2026-07",
      title: "Cultural Archive & Meetei Mayek Digitization Board Meet",
      date: "28 Aug 2026",
      time: "11:00 AM IST",
      location: "Imphal Resource Center",
      issuedBy: "K. Ajit Singh (Gen. Secretary)",
      status: "COMPLETED",
      category: "Cultural Heritage"
    }
  ];

  const agendas = [
    {
      meetingRef: "MN-2026-09",
      title: "Agenda for Rural Health Grants & Medical Camp Expansion",
      items: [
        { itemNo: "1.0", topic: "Welcome Address & Roll Call of Executive Signatories", lead: "Dr. Puritsabam Birmani" },
        { itemNo: "2.0", topic: "Review of Lakhipur Rural Health Camp & Blood Registry Budget", lead: "M. Bina Babu Singha" },
        { itemNo: "3.0", topic: "Approval of Govt Scheme Proposals & PFMS Integration", lead: "Y. Thambal Singha" },
        { itemNo: "4.0", topic: "Passing of Binding Resolutions & Closing Remarks", lead: "Ng. Baldev Singha" }
      ]
    }
  ];

  const attendanceRecords = [
    { member: "Dr. Puritsabam Birmani", role: "President & Legal Trustee", status: "PRESENT", time: "10:28 AM", verification: "Digital Signature Verified" },
    { member: "K. Ajit Singh", role: "General Secretary", status: "PRESENT", time: "10:29 AM", verification: "Digital Signature Verified" },
    { member: "Y. Thambal Singha", role: "Executive Member", status: "PRESENT", time: "10:30 AM", verification: "Digital Signature Verified" },
    { member: "M. Bina Babu Singha", role: "Treasurer & Executive Member", status: "PRESENT", time: "10:31 AM", verification: "Digital Signature Verified" },
    { member: "Ng. Baldev Singha", role: "Executive Member", status: "PRESENT", time: "10:32 AM", verification: "Digital Signature Verified" },
    { member: "Aryaman M Singha", role: "Executive Officer", status: "PRESENT", time: "10:33 AM", verification: "Digital Signature Verified" }
  ];

  const momList = [
    {
      id: "MOM-2026-08",
      title: "Minutes of Q3 Financial Audit & Governance Review",
      date: "05 Sept 2026",
      keyDecisions: [
        "Approved Q3 Audited Financial Statements with unanimous consent.",
        "Allocated ₹2.5 Lakhs for Meetei Mayek script digital learning guide production.",
        "Authorized General Secretary to sign MoU with state health department."
      ],
      recorder: "K. Ajit Singh (Gen. Secretary)"
    }
  ];

  const resolutions = [
    {
      id: "RES-2026-04",
      title: "Resolution on Digitalization of Foundation Governance Archives",
      proposedBy: "Dr. Puritsabam Birmani",
      secondedBy: "M. Bina Babu Singha",
      votesFor: 6,
      votesAgainst: 0,
      status: "PASSED UNANIMOUSLY",
      effectiveDate: "01 Sept 2026"
    },
    {
      id: "RES-2026-03",
      title: "Resolution Establishing Emergency Medical Relief Fund in Cachar District",
      proposedBy: "K. Ajit Singh",
      secondedBy: "Y. Thambal Singha",
      votesFor: 6,
      votesAgainst: 0,
      status: "PASSED UNANIMOUSLY",
      effectiveDate: "15 Aug 2026"
    }
  ];

  const roomLink = "https://meet.jit.si/Leimarembi_Executive_Meeting_2026";

  const handleCopyLink = () => {
    requireOfficerClearance(() => {
      navigator.clipboard.writeText(roomLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }, "Copy Meeting Invite Link");
  };

  const handleLaunchGoogleMeet = () => {
    requireOfficerClearance(() => {
      window.open("https://meet.google.com/new", "_blank", "noopener,noreferrer");
    }, "Launch Instant Google Meet Room");
  };

  const handleToggleLiveMeeting = () => {
    requireOfficerClearance(() => {
      setIsLiveMeetingOpen(!isLiveMeetingOpen);
    }, "Access HD Embedded Live Meeting Suite");
  };

  const handleIssueNoticeClick = () => {
    requireOfficerClearance(() => {
      setNewNoticeModal(true);
    }, "Issue & Broadcast Executive Meeting Notice");
  };

  const handleJoinSessionClick = () => {
    requireOfficerClearance(() => {
      setIsLiveMeetingOpen(true);
      window.scrollTo({ top: 350, behavior: "smooth" });
    }, "Join Active Executive Video Meeting");
  };

  return (
    <div className="animate-fade-in" style={{ padding: "2.5rem 0 6rem", maxWidth: "1280px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div 
          className="glass-panel" 
          style={{ 
            padding: "0.4rem 1.4rem", 
            borderRadius: "30px", 
            marginBottom: "1.2rem", 
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(14, 165, 233, 0.1)",
            border: "1px solid rgba(14, 165, 233, 0.2)"
          }}
        >
          <Video size={16} style={{ color: "var(--primary-color)" }} />
          <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--primary-color)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Executive Meeting & Virtual Suite
          </span>
        </div>

        <h1 style={{ fontSize: "3rem", fontWeight: 900, margin: "0 0 1rem 0", color: "var(--primary-color)", letterSpacing: "-0.5px" }}>
          Meeting Management
        </h1>
        
        <p style={{ color: "var(--text-secondary)", maxWidth: "760px", margin: "0 auto 1.5rem", fontSize: "1.15rem", lineHeight: 1.6 }}>
          Complete digital governance suite for instant video conferencing, meeting notices, agenda preparation, attendance roll calls, minutes, and binding resolution registers.
        </p>

        {/* Officer Status Badge Bar */}
        {authenticatedOfficer ? (
          <div 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "12px", 
              background: "rgba(16, 185, 129, 0.12)", 
              border: "1px solid rgba(16, 185, 129, 0.3)", 
              padding: "0.6rem 1.25rem", 
              borderRadius: "50px",
              color: "#10B981"
            }}
          >
            <UserCheck size={18} />
            <span style={{ fontSize: "0.9rem", fontWeight: 800 }}>
              Official Member Clearance Granted: {authenticatedOfficer.name}
            </span>
            <button 
              onClick={handleLogoutOfficer}
              style={{
                background: "rgba(220, 38, 38, 0.15)",
                border: "none",
                color: "#DC2626",
                padding: "3px 10px",
                borderRadius: "20px",
                fontSize: "0.75rem",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <LogOut size={12} /> Lock Clearance
            </button>
          </div>
        ) : (
          <div 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "8px", 
              background: "rgba(245, 158, 11, 0.1)", 
              border: "1px solid rgba(245, 158, 11, 0.3)", 
              padding: "0.5rem 1.25rem", 
              borderRadius: "50px",
              color: "#D97706",
              fontSize: "0.875rem",
              fontWeight: 700
            }}
          >
            <Lock size={15} />
            <span>Public Viewing Mode Active • Official Member Credentials Required to Host/Arrange Meetings</span>
          </div>
        )}
      </div>

      {/* INSTANT MEETING LAUNCHER BANNER */}
      <div 
        style={{ 
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", 
          borderRadius: "28px", 
          padding: "2.5rem", 
          color: "#FFFFFF",
          boxShadow: "0 25px 50px rgba(15, 23, 42, 0.25)",
          marginBottom: "3.5rem",
          border: "1px solid rgba(255,255,255,0.1)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div 
                style={{ 
                  background: "linear-gradient(135deg, #2563EB, #1D4ED8)", 
                  width: "64px", 
                  height: "64px", 
                  borderRadius: "20px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  boxShadow: "0 10px 25px rgba(37, 99, 235, 0.4)"
                }}
              >
                <Video size={32} style={{ color: "#FFFFFF" }} />
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ background: "#10B981", color: "#000", padding: "2px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase" }}>
                    Live Meeting Hub
                  </span>
                  <span style={{ fontSize: "0.825rem", color: "rgba(255,255,255,0.7)" }}>Instant Google Meet & Embedded HD Video</span>
                </div>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 900, margin: 0, color: "#FFFFFF" }}>
                  Start Instant Executive Meeting
                </h2>
              </div>
            </div>

            {/* Quick Action Buttons - Wrapped with Official Member Authorization Checks */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {/* Button 1: Embedded Live Meeting Room Toggle */}
              <button
                onClick={handleToggleLiveMeeting}
                style={{
                  background: isLiveMeetingOpen ? "#DC2626" : "linear-gradient(135deg, #10B981, #059669)",
                  color: "#FFFFFF",
                  padding: "0.85rem 1.75rem",
                  borderRadius: "50px",
                  fontWeight: 800,
                  fontSize: "1rem",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)"
                }}
              >
                <Video size={20} />
                {isLiveMeetingOpen ? "Close Embedded Room" : "Launch Embedded Live Video Room"}
              </button>

              {/* Button 2: Direct Google Meet Launch */}
              <button
                onClick={handleLaunchGoogleMeet}
                style={{
                  background: "#4285F4",
                  color: "#FFFFFF",
                  padding: "0.85rem 1.75rem",
                  borderRadius: "50px",
                  fontWeight: 800,
                  fontSize: "1rem",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 10px 25px rgba(66, 133, 244, 0.3)"
                }}
              >
                Google Meet Instant Link <ExternalLink size={18} />
              </button>

              {/* Button 3: Copy Invite Link */}
              <button
                onClick={handleCopyLink}
                style={{
                  background: "rgba(255,255,255,0.12)",
                  color: "#FFFFFF",
                  padding: "0.85rem 1.5rem",
                  borderRadius: "50px",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  border: "1px solid rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <Copy size={16} />
                {copiedLink ? "Invite Link Copied!" : "Copy Meeting Link"}
              </button>
            </div>
          </div>

          {/* EMBEDDED LIVE VIDEO MEETING FRAME */}
          {isLiveMeetingOpen && authenticatedOfficer && (
            <div 
              className="animate-fade-in"
              style={{
                marginTop: "1.5rem",
                borderRadius: "20px",
                overflow: "hidden",
                border: "2px solid rgba(16, 185, 129, 0.5)",
                background: "#000000",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
              }}
            >
              {/* Meeting Control Toolbar */}
              <div style={{ padding: "0.85rem 1.5rem", background: "#1E293B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10B981", boxShadow: "0 0 10px #10B981" }} />
                  <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#FFFFFF" }}>
                    Room: Leimarembi Executive Video Conference • Host: {authenticatedOfficer.name}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button 
                    onClick={() => setMicActive(!micActive)}
                    style={{ background: micActive ? "#334155" : "#DC2626", color: "#FFF", border: "none", width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    title={micActive ? "Mute Microphone" : "Unmute Microphone"}
                  >
                    {micActive ? <Mic size={18} /> : <MicOff size={18} />}
                  </button>

                  <button 
                    onClick={() => setCamActive(!camActive)}
                    style={{ background: camActive ? "#334155" : "#DC2626", color: "#FFF", border: "none", width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    title={camActive ? "Turn Off Camera" : "Turn On Camera"}
                  >
                    {camActive ? <Camera size={18} /> : <CameraOff size={18} />}
                  </button>

                  <button 
                    onClick={() => setIsLiveMeetingOpen(false)}
                    style={{ background: "#DC2626", color: "#FFF", border: "none", padding: "0 14px", borderRadius: "20px", fontWeight: 800, fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <PhoneOff size={14} /> End Session
                  </button>
                </div>
              </div>

              {/* Embedded Video Iframe */}
              <iframe
                src={`${roomLink}#config.prejoinPageEnabled=false`}
                title="Leimarembi Executive Live Video Meeting Room"
                width="100%"
                height="560px"
                style={{ border: "none" }}
                allow="camera; microphone; display-capture; autoplay; clipboard-write"
              />
            </div>
          )}
        </div>
      </div>

      {/* 5 MEETING MANAGEMENT PILLARS TABS BAR */}
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "0.5rem", 
          marginBottom: "3rem", 
          flexWrap: "wrap",
          padding: "0.5rem",
          background: "var(--surface-color)",
          borderRadius: "50px",
          border: "1px solid var(--border-color)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
        }}
      >
        <button
          onClick={() => setActiveTab("notices")}
          style={{
            padding: "0.75rem 1.4rem",
            borderRadius: "40px",
            border: "none",
            fontWeight: 800,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            background: activeTab === "notices" ? "var(--primary-color)" : "transparent",
            color: activeTab === "notices" ? "#FFFFFF" : "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          📌 Meeting Notices
        </button>

        <button
          onClick={() => setActiveTab("agendas")}
          style={{
            padding: "0.75rem 1.4rem",
            borderRadius: "40px",
            border: "none",
            fontWeight: 800,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            background: activeTab === "agendas" ? "var(--primary-color)" : "transparent",
            color: activeTab === "agendas" ? "#FFFFFF" : "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          📝 Agenda Preparation
        </button>

        <button
          onClick={() => setActiveTab("attendance")}
          style={{
            padding: "0.75rem 1.4rem",
            borderRadius: "40px",
            border: "none",
            fontWeight: 800,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            background: activeTab === "attendance" ? "var(--primary-color)" : "transparent",
            color: activeTab === "attendance" ? "#FFFFFF" : "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          👥 Attendance Records
        </button>

        <button
          onClick={() => setActiveTab("mom")}
          style={{
            padding: "0.75rem 1.4rem",
            borderRadius: "40px",
            border: "none",
            fontWeight: 800,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            background: activeTab === "mom" ? "var(--primary-color)" : "transparent",
            color: activeTab === "mom" ? "#FFFFFF" : "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          📄 Minutes of Meetings (MoM)
        </button>

        <button
          onClick={() => setActiveTab("resolutions")}
          style={{
            padding: "0.75rem 1.4rem",
            borderRadius: "40px",
            border: "none",
            fontWeight: 800,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            background: activeTab === "resolutions" ? "var(--primary-color)" : "transparent",
            color: activeTab === "resolutions" ? "#FFFFFF" : "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          🏛️ Resolution Register
        </button>
      </div>

      {/* TAB CONTENT SECTIONS */}

      {/* 1. MEETING NOTICES */}
      {activeTab === "notices" && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--primary-color)", margin: 0 }}>
              Official Meeting Circulars & Notices
            </h2>
            <button 
              onClick={handleIssueNoticeClick}
              className="btn btn-primary" 
              style={{ borderRadius: "30px", gap: "6px", fontWeight: 800 }}
            >
              <Plus size={16} /> Issue New Notice
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {meetingNotices.map((n) => (
              <div 
                key={n.id}
                className="card"
                style={{ 
                  padding: "1.75rem", 
                  borderRadius: "20px", 
                  border: "1px solid var(--border-color)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, background: "rgba(27, 42, 87, 0.1)", color: "var(--primary-color)", padding: "4px 10px", borderRadius: "12px" }}>
                      {n.category}
                    </span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, color: n.status === "UPCOMING" ? "#10B981" : "var(--text-muted)", background: n.status === "UPCOMING" ? "rgba(16, 185, 129, 0.1)" : "var(--bg-color)", padding: "4px 10px", borderRadius: "12px" }}>
                      {n.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 1rem 0", color: "var(--text-primary)", lineHeight: 1.4 }}>
                    {n.title}
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Calendar size={14} /> {n.date} • {n.time}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Building2 size={14} /> {n.location}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><Users size={14} /> Issued by: {n.issuedBy}</div>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem", display: "flex", gap: "8px" }}>
                  <button 
                    onClick={handleJoinSessionClick}
                    className="btn btn-primary" 
                    style={{ flex: 1, justifyContent: "center", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 800 }}
                  >
                    Join Session <Video size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. AGENDA PREPARATION */}
      {activeTab === "agendas" && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--primary-color)", margin: 0 }}>
            Structured Meeting Agendas
          </h2>

          {agendas.map((ag, idx) => (
            <div key={idx} className="card" style={{ padding: "2rem", borderRadius: "24px" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--primary-color)", background: "rgba(14, 165, 233, 0.1)", padding: "4px 12px", borderRadius: "20px" }}>
                  Ref: {ag.meetingRef}
                </span>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 900, margin: "0.75rem 0 0 0" }}>{ag.title}</h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {ag.items.map((it, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderRadius: "14px", background: "var(--bg-color)", border: "1px solid var(--border-color)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontWeight: 900, color: "var(--primary-color)", width: "36px", height: "36px", borderRadius: "50%", background: "rgba(27, 42, 87, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem" }}>
                        {it.itemNo}
                      </span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "0.98rem", color: "var(--text-primary)" }}>{it.topic}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Lead Presenter: {it.lead}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#10B981", background: "rgba(16, 185, 129, 0.1)", padding: "4px 10px", borderRadius: "12px" }}>
                      Scheduled
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. ATTENDANCE RECORDS */}
      {activeTab === "attendance" && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--primary-color)", margin: 0 }}>
                Digital Roll Call & Attendance Sign-In
              </h2>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                Real-time digital sign-in log for Executive Board members.
              </p>
            </div>
            <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: "0.5rem 1.25rem", borderRadius: "30px", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#10B981", fontWeight: 800, fontSize: "0.9rem" }}>
              Quorum Status: 100% Present (Valid Executive Quorum)
            </div>
          </div>

          <div className="card" style={{ padding: "0", borderRadius: "20px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ background: "var(--bg-color)", borderBottom: "1px solid var(--border-color)" }}>
                  <th style={{ padding: "1rem 1.5rem" }}>Member Name</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Executive Role</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Sign-In Time</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((att, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "1rem 1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>{att.member}</td>
                    <td style={{ padding: "1rem 1.5rem", color: "var(--text-secondary)" }}>{att.role}</td>
                    <td style={{ padding: "1rem 1.5rem", color: "var(--text-muted)" }}>{att.time}</td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 800, padding: "4px 10px", borderRadius: "12px", background: att.status === "PRESENT" ? "rgba(16, 185, 129, 0.1)" : "rgba(220, 38, 38, 0.1)", color: att.status === "PRESENT" ? "#10B981" : "#DC2626" }}>
                        {att.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. MINUTES OF MEETINGS (MoM) */}
      {activeTab === "mom" && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--primary-color)", margin: 0 }}>
            Minutes of Meetings (MoM) Archive
          </h2>

          {momList.map((m) => (
            <div key={m.id} className="card" style={{ padding: "2rem", borderRadius: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--primary-color)", background: "rgba(27, 42, 87, 0.1)", padding: "4px 12px", borderRadius: "20px" }}>
                  {m.id} • Recorded {m.date}
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Recorder: {m.recorder}</span>
              </div>

              <h3 style={{ fontSize: "1.35rem", fontWeight: 900, margin: "0 0 1rem 0" }}>{m.title}</h3>

              <div style={{ background: "var(--bg-color)", padding: "1.25rem", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
                <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)" }}>Key Board Decisions:</h4>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  {m.keyDecisions.map((dec, idx) => (
                    <li key={idx} style={{ marginBottom: "6px" }}>{dec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. RESOLUTION REGISTER */}
      {activeTab === "resolutions" && (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--primary-color)", margin: 0 }}>
            Binding Foundation Resolution Register
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {resolutions.map((res) => (
              <div key={res.id} className="card" style={{ padding: "1.75rem", borderRadius: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, background: "rgba(16, 185, 129, 0.1)", color: "#10B981", padding: "4px 10px", borderRadius: "12px" }}>
                    {res.status}
                  </span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--primary-color)" }}>{res.id}</span>
                </div>

                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 1rem 0", color: "var(--text-primary)", lineHeight: 1.4 }}>
                  {res.title}
                </h3>

                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1rem" }}>
                  <div><strong>Proposed By:</strong> {res.proposedBy}</div>
                  <div><strong>Seconded By:</strong> {res.secondedBy}</div>
                  <div><strong>Vote Tally:</strong> {res.votesFor} For / {res.votesAgainst} Against</div>
                  <div><strong>Effective Date:</strong> {res.effectiveDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OFFICIAL MEMBER AUTHORIZATION POPUP MODAL */}
      {showAuthModal && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem"
          }}
          onClick={() => setShowAuthModal(false)}
        >
          <div 
            style={{
              background: "var(--surface-color)",
              width: "100%",
              maxWidth: "480px",
              borderRadius: "28px",
              padding: "2.25rem",
              border: "1px solid var(--border-color)",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.35)",
              position: "relative"
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAuthModal(false)}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "var(--bg-color)",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text-secondary)"
              }}
            >
              <X size={18} />
            </button>

            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div 
                style={{ 
                  width: "60px", 
                  height: "60px", 
                  borderRadius: "20px", 
                  background: "linear-gradient(135deg, #1B2A57, #2563EB)", 
                  display: "inline-flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  color: "#FFFFFF",
                  boxShadow: "0 10px 20px rgba(37, 99, 235, 0.3)",
                  marginBottom: "1rem"
                }}
              >
                <Lock size={28} />
              </div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 900, margin: "0 0 0.5rem 0", color: "var(--primary-color)" }}>
                Official Member Clearance Required
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                This feature is restricted to Authorized Official Members only.
              </p>
              {actionNotice && (
                <div style={{ marginTop: "0.75rem", fontSize: "0.8rem", fontWeight: 800, color: "var(--primary-color)", background: "rgba(14, 165, 233, 0.1)", padding: "6px 12px", borderRadius: "12px", display: "inline-block" }}>
                  Attempted Action: {actionNotice}
                </div>
              )}
            </div>

            {authError && (
              <div 
                style={{ 
                  background: "rgba(220, 38, 38, 0.1)", 
                  border: "1px solid rgba(220, 38, 38, 0.3)", 
                  color: "#DC2626", 
                  padding: "0.85rem 1rem", 
                  borderRadius: "14px", 
                  fontSize: "0.825rem", 
                  lineHeight: 1.4,
                  marginBottom: "1.25rem",
                  display: "flex",
                  gap: "8px",
                  alignItems: "flex-start"
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>{authError}</div>
              </div>
            )}

            {/* Executive Officers Login Hint Banner */}
            <div style={{
              background: "rgba(14, 165, 233, 0.08)",
              border: "1.5px solid rgba(14, 165, 233, 0.3)",
              borderRadius: "12px",
              padding: "0.75rem 1rem",
              display: "flex",
              gap: "10px",
              alignItems: "center",
              marginBottom: "1.25rem"
            }}>
              <span style={{ fontSize: "1.1rem" }}>💡</span>
              <span style={{ fontSize: "0.825rem", color: "var(--text-primary)", lineHeight: 1.4 }}>
                <strong>Executive Officers:</strong> Login with your registered Email or Phone. Your security password is your <strong>Date of Birth (DOB)</strong>.
              </span>
            </div>

            <form onSubmit={handleAuthenticate} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 800, display: "block", marginBottom: "6px", color: "var(--text-primary)" }}>
                  Registered Officer Email / Phone Number *
                </label>
                <input 
                  type="text" 
                  required 
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="e.g., ichemma@yahoo.com or 98640-44123" 
                  style={{ 
                    width: "100%", 
                    padding: "0.85rem 1rem", 
                    borderRadius: "14px", 
                    border: "1px solid var(--border-color)", 
                    background: "var(--bg-color)",
                    fontSize: "0.95rem",
                    color: "var(--text-primary)"
                  }} 
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)" }}>
                    Password (Date of Birth / Passcode) *
                  </label>
                  <span style={{ fontSize: "0.75rem", color: "var(--secondary-color)", fontWeight: 700 }}>
                    DOB as Password
                  </span>
                </div>
                <input 
                  type="password" 
                  required 
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Date of Birth (DD/MM/YYYY or Passcode)" 
                  style={{ 
                    width: "100%", 
                    padding: "0.85rem 1rem", 
                    borderRadius: "14px", 
                    border: "1px solid var(--border-color)", 
                    background: "var(--bg-color)",
                    fontSize: "0.95rem",
                    color: "var(--text-primary)"
                  }} 
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ 
                  width: "100%", 
                  justifyContent: "center", 
                  padding: "0.9rem", 
                  borderRadius: "50px", 
                  fontSize: "1rem", 
                  fontWeight: 800,
                  marginTop: "0.5rem",
                  gap: "8px"
                }}
              >
                <ShieldCheck size={18} /> Authenticate & Proceed
              </button>

              <button 
                type="button" 
                onClick={() => setShowAuthModal(false)}
                className="btn btn-outline" 
                style={{ width: "100%", justifyContent: "center", borderRadius: "50px", fontSize: "0.9rem" }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ISSUE NEW NOTICE MODAL (Officer Only) */}
      {newNoticeModal && authenticatedOfficer && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem"
          }}
          onClick={() => setNewNoticeModal(false)}
        >
          <div 
            style={{
              background: "var(--surface-color)",
              width: "100%",
              maxWidth: "520px",
              borderRadius: "24px",
              padding: "2rem",
              border: "1px solid var(--border-color)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.3)"
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "1.4rem", fontWeight: 900, margin: "0 0 0.5rem 0", color: "var(--primary-color)" }}>
              Issue Executive Meeting Notice
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
              Authorized Publisher: <strong>{authenticatedOfficer.name}</strong>
            </p>
            
            <form onSubmit={e => { e.preventDefault(); setNewNoticeModal(false); }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Meeting Subject *</label>
                <input type="text" required placeholder="e.g., Executive Committee Meeting" style={{ width: "100%", padding: "0.7rem", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-color)" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Date *</label>
                  <input type="date" required style={{ width: "100%", padding: "0.7rem", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-color)" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Time *</label>
                  <input type="time" required style={{ width: "100%", padding: "0.7rem", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-color)" }} />
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: "center", borderRadius: "30px" }}>
                  Publish & Send Circular
                </button>
                <button type="button" onClick={() => setNewNoticeModal(false)} className="btn btn-outline" style={{ borderRadius: "30px" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
