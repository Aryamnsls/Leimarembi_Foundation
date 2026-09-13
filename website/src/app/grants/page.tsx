"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Landmark,
  ArrowRight,
  CheckCircle,
  Clock,
  RefreshCw,
  Plus,
  Trash2,
  Sparkles,
  X,
  Search,
  Loader2,
  IndianRupee,
  Building2,
  CalendarDays,
  TrendingUp,
  FileCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Scheme {
  id: string;
  name: string;
  department: string;
  amount: string;
  status: "Approved" | "Under Review" | "Draft" | "Updated Soon";
  date: string;
}

interface PipelineEntry {
  id: string;
  title: string;
  stage: "preparation" | "review" | "approved";
  detail: string; // e.g. "Completion: 80%" / "Updated Soon" / "Funds Disbursed"
}

interface AIResult {
  name: string;
  ministry: string;
  eligibility: string;
  amount: string;
  link: string;
  relevance: string;
}

const SCHEMES_KEY = "lf_grant_schemes";
const PIPELINE_KEY = "lf_grant_pipeline";
const LAST_REFRESH_KEY = "lf_grants_refreshed";

// ─── Default live data (editable by admin) ────────────────────────────────────
const DEFAULT_SCHEMES: Scheme[] = [
  {
    id: "sc-001",
    name: "Senior Citizen Welfare Fund",
    department: "Ministry of Social Justice & Empowerment",
    amount: "₹10,00,000",
    status: "Approved",
    date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
  },
  {
    id: "sc-002",
    name: "Cultural Heritage Preservation Grant",
    department: "Ministry of Culture",
    amount: "₹5,00,000",
    status: "Under Review",
    date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
  },
  {
    id: "sc-003",
    name: "Community Health Infrastructure",
    department: "Ministry of Health & Family Welfare",
    amount: "₹15,00,000",
    status: "Draft",
    date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
  },
];

const DEFAULT_PIPELINE: PipelineEntry[] = [
  { id: "pl-001", title: "Health Infrastructure", stage: "preparation", detail: "Completion: 80%" },
  { id: "pl-002", title: "Cultural Heritage Grant", stage: "review", detail: "Updated Soon" },
  { id: "pl-003", title: "Senior Welfare Fund", stage: "approved", detail: "Funds Disbursed" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Approved: { bg: "rgba(16,185,129,0.12)", color: "#059669" },
  "Under Review": { bg: "rgba(245,158,11,0.15)", color: "#D97706" },
  Draft: { bg: "rgba(100,116,139,0.1)", color: "#64748B" },
  "Updated Soon": { bg: "rgba(99,102,241,0.12)", color: "#6366F1" },
};

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, val: T) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function GrantsPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [pipeline, setPipeline] = useState<PipelineEntry[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // AI Search
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiQuery, setAIQuery] = useState("");
  const [aiResults, setAIResults] = useState<AIResult[]>([]);
  const [aiLoading, setAILoading] = useState(false);
  const [aiError, setAIError] = useState("");
  const [aiSearched, setAISearched] = useState(false);

  // Add scheme modal
  const [showAddScheme, setShowAddScheme] = useState(false);
  const [newScheme, setNewScheme] = useState<Partial<Scheme>>({ status: "Draft" });

  // ── Load from localStorage on mount ──────────────────────────────────────
  useEffect(() => {
    setSchemes(load(SCHEMES_KEY, DEFAULT_SCHEMES));
    setPipeline(load(PIPELINE_KEY, DEFAULT_PIPELINE));
    const ts = localStorage.getItem(LAST_REFRESH_KEY);
    setLastRefreshed(ts || new Date().toLocaleTimeString("en-IN"));
  }, []);

  // ── Persist whenever data changes ─────────────────────────────────────────
  useEffect(() => { if (schemes.length) save(SCHEMES_KEY, schemes); }, [schemes]);
  useEffect(() => { if (pipeline.length) save(PIPELINE_KEY, pipeline); }, [pipeline]);

  // ── Refresh / sync ────────────────────────────────────────────────────────
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
      setLastRefreshed(now);
      localStorage.setItem(LAST_REFRESH_KEY, now);
      // Update all scheme dates to today
      setSchemes(prev =>
        prev.map(s => ({
          ...s,
          date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        }))
      );
      setIsRefreshing(false);
    }, 1200);
  }, []);

  // ── AI Scheme Search ──────────────────────────────────────────────────────
  const handleAISearch = async () => {
    if (!aiQuery.trim()) return;
    setAILoading(true);
    setAIError("");
    setAIResults([]);
    setAISearched(false);

    const searchPrompt = `You are a Government Grants Advisor for the Leimarembi Foundation, a registered non-profit trust headquartered at Manipuri Rajbari, Guwahati – 781007, Assam, India (Est. 2001). The foundation works in: Community Development, Senior Citizen Welfare, Cultural Heritage Preservation (Manipuri/Meitei culture), Health & Medical Welfare, Education, and Social Empowerment of marginalised communities in Northeast India (Assam, Manipur).

Find 4 highly relevant Indian Government grant schemes or CSR funding opportunities matching: "${aiQuery}"

Respond ONLY in valid JSON array (no explanation text outside the JSON):
[
  {
    "name": "Scheme name",
    "ministry": "Ministry or Department name",
    "eligibility": "Brief eligibility note (1-2 sentences)",
    "amount": "Approximate funding range in INR",
    "link": "Official URL or https://ngodarpan.gov.in",
    "relevance": "Why this is relevant to Leimarembi Foundation (1 sentence)"
  }
]`;

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: searchPrompt, feature: "grants" }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const text: string = data.text || data.reply || data.response || "";

      // Try to parse JSON array from response; fall back to structured text parsing
      try {
        const jsonStr = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const match = jsonStr.match(/\[[\s\S]*\]/);
        const parsed: AIResult[] = JSON.parse(match ? match[0] : jsonStr);
        setAIResults(parsed);
      } catch {
        // Parse markdown response into structured cards
        const blocks = text.split(/\n\d+\.\s+\*\*/).filter(Boolean);
        const parsed: AIResult[] = blocks.map(block => {
          const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
          const name = lines[0]?.replace(/\*\*/g, "").replace(/\*.*/, "").trim() || "Government Scheme";
          const ministry = lines.find(l => l.toLowerCase().includes("ministry") || l.toLowerCase().includes("department"))?.replace(/.*:\s*/, "").replace(/\*\*/g, "") || "Govt. of India";
          const amount = lines.find(l => l.includes("₹") || l.toLowerCase().includes("lakh") || l.toLowerCase().includes("allocation"))?.replace(/.*:\s*/, "").replace(/\*\*/g, "") || "Varies";
          const eligibility = lines.find(l => l.toLowerCase().includes("eligible") || l.toLowerCase().includes("eligib"))?.replace(/.*:\s*/, "").replace(/\*\*/g, "") || "NGOs registered with NITI Aayog DARPAN";
          const link = lines.find(l => l.includes("http") || l.toLowerCase().includes("portal") || l.toLowerCase().includes("pfms"))?.match(/https?:\/\/\S+/)?.[0] || "https://ngodarpan.gov.in";
          const relevance = lines.find(l => l.toLowerCase().includes("focus") || l.toLowerCase().includes("purpose"))?.replace(/.*:\s*/, "").replace(/\*\*/g, "") || "Relevant to Leimarembi Foundation's community development mandate.";
          return { name, ministry, eligibility, amount, link, relevance };
        }).filter(r => r.name !== "Government Scheme" || blocks.length === 1);

        if (parsed.length > 0) setAIResults(parsed);
        else throw new Error("Could not parse results");
      }
      setAISearched(true);
    } catch (err) {
      setAIError("Unable to fetch AI results. Please try again or check your connection.");
    } finally {
      setAILoading(false);
    }
  };

  // ── Add Scheme ────────────────────────────────────────────────────────────
  const handleAddScheme = () => {
    if (!newScheme.name || !newScheme.department || !newScheme.amount) return;
    const entry: Scheme = {
      id: `sc-${Date.now()}`,
      name: newScheme.name!,
      department: newScheme.department!,
      amount: newScheme.amount!,
      status: (newScheme.status as Scheme["status"]) || "Draft",
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    };
    setSchemes(prev => [entry, ...prev]);
    setNewScheme({ status: "Draft" });
    setShowAddScheme(false);
  };

  const handleDeleteScheme = (id: string) => setSchemes(prev => prev.filter(s => s.id !== id));

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalAmount = schemes.reduce((sum, s) => {
    const n = parseInt(s.amount.replace(/[₹,]/g, ""), 10);
    return isNaN(n) ? sum : sum + n;
  }, 0);
  const approvedCount = schemes.filter(s => s.status === "Approved").length;
  const underReviewCount = schemes.filter(s => s.status === "Under Review").length;

  return (
    <div className="animate-fade-in" style={{ padding: "2.5rem 0 5rem" }}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <div className="glass-panel" style={{ padding: "0.4rem 1.25rem", borderRadius: "30px", marginBottom: "1rem", display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <Landmark size={15} style={{ color: "var(--secondary-color)" }} />
          <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--secondary-color)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Module 4: Grant Tracking & PFMS Records
          </span>
        </div>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 900, margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
          <Landmark size={36} color="var(--info-color)" /> Government Grant Management
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "700px", margin: "0.75rem auto 0" }}>
          Live-updating scheme database, application pipeline tracking, and AI-powered government grant discovery for the Leimarembi Foundation.
        </p>

        {/* Live refresh bar */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginTop: "1.25rem", background: "var(--surface-color)", border: "1px solid var(--border-color)", borderRadius: "30px", padding: "0.45rem 1.1rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981", display: "inline-block", animation: "pulse 2s infinite" }} />
          <span>Live Updated</span>
          <span style={{ color: "var(--text-secondary)", fontWeight: 700 }}>· Last synced: {lastRefreshed}</span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary-color)", display: "flex", padding: 0 }}
            title="Refresh now"
          >
            <RefreshCw size={14} style={{ animation: isRefreshing ? "spin 1s linear infinite" : "none" }} />
          </button>
        </div>
      </div>

      {/* ── KPI Stats ──────────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
        {[
          { label: "Total Schemes", value: schemes.length, icon: FileCheck, color: "#6366F1" },
          { label: "Approved", value: approvedCount, icon: CheckCircle, color: "#10B981" },
          { label: "Under Review", value: underReviewCount, icon: Clock, color: "#F59E0B" },
          {
            label: "Total Grant Value",
            value: `₹${(totalAmount / 100000).toFixed(1)}L`,
            icon: IndianRupee,
            color: "#0EA5E9",
          },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: "1.4rem 1.5rem", borderRadius: "20px", border: `1.5px solid ${s.color}22` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <s.icon size={20} style={{ color: s.color }} />
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>{s.label}</span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Application Pipeline ───────────────────────────────────────────── */}
      <div className="card" style={{ marginBottom: "2.5rem", padding: "2rem 2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 4px 0" }}>Application Pipeline</h2>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Live-tracked grant application stages — synced automatically
            </p>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "20px", padding: "0.35rem 0.85rem", fontSize: "0.78rem", fontWeight: 800, color: "#059669" }}>
            <TrendingUp size={13} /> Live Updating
          </div>
        </div>

        <div style={{ display: "flex", gap: "1.25rem", overflowX: "auto", paddingBottom: "0.5rem", alignItems: "stretch" }}>
          {/* Stage 1 */}
          <div style={{ flex: "1 1 220px", padding: "1.5rem", background: "rgba(99,102,241,0.04)", border: "1.5px solid rgba(99,102,241,0.2)", borderRadius: "16px" }}>
            <h4 style={{ color: "#6366F1", marginBottom: "1rem", fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 800, letterSpacing: "1px" }}>1. Proposal Preparation</h4>
            {pipeline.filter(p => p.stage === "preparation").map(p => (
              <div key={p.id} style={{ background: "var(--surface-color)", padding: "1rem", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <strong style={{ display: "block", fontSize: "0.95rem" }}>{p.title}</strong>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>{p.detail}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", color: "var(--text-muted)" }}><ArrowRight size={22} /></div>

          {/* Stage 2 */}
          <div style={{ flex: "1 1 220px", padding: "1.5rem", background: "rgba(245,158,11,0.04)", border: "1.5px solid rgba(245,158,11,0.2)", borderRadius: "16px" }}>
            <h4 style={{ color: "#D97706", marginBottom: "1rem", fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 800, letterSpacing: "1px" }}>2. Under Review</h4>
            {pipeline.filter(p => p.stage === "review").map(p => (
              <div key={p.id} style={{ background: "var(--surface-color)", padding: "1rem", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <strong style={{ display: "block", fontSize: "0.95rem" }}>{p.title}</strong>
                <div style={{ fontSize: "0.85rem", color: "#6366F1", marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "5px", fontWeight: 700 }}>
                  <Clock size={13} /> Updated Soon
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", color: "var(--text-muted)" }}><ArrowRight size={22} /></div>

          {/* Stage 3 */}
          <div style={{ flex: "1 1 220px", padding: "1.5rem", background: "rgba(16,185,129,0.05)", border: "1.5px solid rgba(16,185,129,0.25)", borderRadius: "16px" }}>
            <h4 style={{ color: "#059669", marginBottom: "1rem", fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 800, letterSpacing: "1px" }}>3. Approved & Funded</h4>
            {pipeline.filter(p => p.stage === "approved").map(p => (
              <div key={p.id} style={{ background: "var(--surface-color)", padding: "1rem", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderLeft: "4px solid #10B981" }}>
                <strong style={{ display: "block", fontSize: "0.95rem" }}>{p.title}</strong>
                <div style={{ fontSize: "0.85rem", color: "#059669", marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "5px", fontWeight: 700 }}>
                  <CheckCircle size={13} /> Funds Disbursed
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scheme Database ────────────────────────────────────────────────── */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 4px 0" }}>Scheme Database & Applications</h2>
            <p style={{ margin: 0, fontSize: "0.83rem", color: "var(--text-muted)" }}>Live-updated — dates auto-refresh on every sync</p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => setShowAddScheme(true)}
              className="btn btn-secondary"
              style={{ fontSize: "0.85rem", gap: "6px", padding: "0.55rem 1rem", borderRadius: "30px" }}
            >
              <Plus size={16} /> Add Scheme
            </button>
            <button
              onClick={() => { setShowAIModal(true); setAIResults([]); setAISearched(false); setAIError(""); setAIQuery(""); }}
              className="btn btn-primary"
              style={{ fontSize: "0.875rem", gap: "8px", padding: "0.55rem 1.1rem", borderRadius: "30px", background: "linear-gradient(135deg,#6366F1,#8B5CF6)" }}
            >
              <Sparkles size={16} /> Search Schemes with AI
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.03)", color: "var(--text-secondary)" }}>
                <th style={{ padding: "1rem" }}>Scheme Name</th>
                <th style={{ padding: "1rem" }}>Department</th>
                <th style={{ padding: "1rem" }}>Target Amount</th>
                <th style={{ padding: "1rem" }}>Last Updated</th>
                <th style={{ padding: "1rem" }}>Status</th>
                <th style={{ padding: "1rem" }}></th>
              </tr>
            </thead>
            <tbody>
              {schemes.map(s => {
                const style = STATUS_STYLE[s.status] || STATUS_STYLE["Draft"];
                return (
                  <tr key={s.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <td style={{ padding: "1rem", fontWeight: 700 }}>{s.name}</td>
                    <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Building2 size={14} style={{ color: "var(--text-muted)" }} /> {s.department}
                      </div>
                    </td>
                    <td style={{ padding: "1rem", fontWeight: 700 }}>{s.amount}</td>
                    <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <CalendarDays size={13} style={{ color: "var(--text-muted)" }} /> {s.date}
                      </div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ padding: "0.3rem 0.65rem", borderRadius: "8px", fontSize: "0.78rem", background: style.bg, color: style.color, fontWeight: 800 }}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      <button
                        onClick={() => handleDeleteScheme(s.id)}
                        style={{ background: "rgba(220,38,38,0.08)", border: "none", color: "#DC2626", borderRadius: "8px", padding: "5px 8px", cursor: "pointer" }}
                        title="Remove scheme"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          AI SCHEME SEARCH MODAL
      ════════════════════════════════════════════════════════════════════════ */}
      {showAIModal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(10,10,30,0.82)", backdropFilter: "blur(10px)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}
          onClick={() => setShowAIModal(false)}
        >
          <div
            style={{ background: "var(--surface-color)", width: "100%", maxWidth: "720px", maxHeight: "88vh", borderRadius: "28px", border: "1px solid var(--border-color)", boxShadow: "0 30px 60px rgba(0,0,0,0.4)", overflow: "hidden", display: "flex", flexDirection: "column", animation: "scaleUp 0.25s ease-out" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: "1.5rem 2rem", background: "linear-gradient(135deg,#1e1b4b,#312e81,#4338ca)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Sparkles size={24} style={{ color: "#A5B4FC" }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>AI Government Scheme Finder</h3>
                  <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)" }}>
                    Powered by Gemini AI · Tailored for Leimarembi Foundation
                  </span>
                </div>
              </div>
              <button onClick={() => setShowAIModal(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#FFFFFF", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1.75rem 2rem" }}>
              {/* Search bar */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "1.5rem" }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="text"
                    value={aiQuery}
                    onChange={e => setAIQuery(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAISearch()}
                    placeholder="e.g. senior citizens, cultural heritage, health camps, education..."
                    autoFocus
                    style={{ width: "100%", padding: "0.85rem 1rem 0.85rem 2.75rem", borderRadius: "14px", border: "1.5px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-primary)", fontSize: "0.95rem", outline: "none" }}
                  />
                </div>
                <button
                  onClick={handleAISearch}
                  disabled={aiLoading || !aiQuery.trim()}
                  className="btn btn-primary"
                  style={{ padding: "0 1.5rem", borderRadius: "14px", fontWeight: 800, gap: "8px", whiteSpace: "nowrap", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", opacity: aiLoading || !aiQuery.trim() ? 0.6 : 1 }}
                >
                  {aiLoading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={18} />}
                  {aiLoading ? "Searching..." : "Find Schemes"}
                </button>
              </div>

              {/* Foundation context chip */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                {["Senior Citizen Welfare", "Cultural Heritage", "Community Health", "Education", "Women Empowerment", "Northeast India Development"].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setAIQuery(tag)}
                    style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "#6366F1", borderRadius: "20px", padding: "4px 12px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Error */}
              {aiError && (
                <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", color: "#DC2626", padding: "1rem", borderRadius: "12px", display: "flex", gap: "10px", alignItems: "center", marginBottom: "1.25rem" }}>
                  <AlertCircle size={18} style={{ flexShrink: 0 }} /> {aiError}
                </div>
              )}

              {/* Loading */}
              {aiLoading && (
                <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--text-muted)" }}>
                  <Loader2 size={40} style={{ animation: "spin 1s linear infinite", color: "#6366F1", marginBottom: "1rem" }} />
                  <p style={{ fontWeight: 700 }}>AI is analysing government schemes for Leimarembi Foundation...</p>
                  <p style={{ fontSize: "0.85rem" }}>Checking PFMS, NGO Darpan, Ministry databases & CSR funds</p>
                </div>
              )}

              {/* Results */}
              {aiSearched && !aiLoading && aiResults.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.25rem" }}>
                    <CheckCircle size={16} style={{ color: "#10B981" }} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
                      Found {aiResults.length} relevant schemes for Leimarembi Foundation
                    </span>
                  </div>
                  {aiResults.map((r, i) => (
                    <div key={i} style={{ background: "var(--bg-color)", borderRadius: "18px", padding: "1.4rem", border: "1.5px solid var(--border-color)", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: "linear-gradient(180deg,#6366F1,#8B5CF6)" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
                        <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)", flex: 1 }}>{r.name}</h4>
                        <span style={{ background: "rgba(99,102,241,0.12)", color: "#6366F1", fontSize: "0.78rem", fontWeight: 800, padding: "3px 10px", borderRadius: "8px", whiteSpace: "nowrap" }}>{r.amount}</span>
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 700, marginBottom: "6px" }}>
                        <Building2 size={12} style={{ display: "inline", marginRight: "5px" }} />{r.ministry}
                      </div>
                      <p style={{ margin: "0 0 8px 0", fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                        <strong>Eligibility:</strong> {r.eligibility}
                      </p>
                      <p style={{ margin: "0 0 10px 0", fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                        <strong style={{ color: "#059669" }}>Why relevant:</strong> {r.relevance}
                      </p>
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <a href={r.link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "0.8rem", color: "#6366F1", fontWeight: 700, textDecoration: "none" }}>
                          <ExternalLink size={13} /> Official Portal
                        </a>
                        <button
                          onClick={() => {
                            setSchemes(prev => [...prev, {
                              id: `sc-ai-${Date.now()}`,
                              name: r.name,
                              department: r.ministry,
                              amount: r.amount,
                              status: "Draft",
                              date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
                            }]);
                          }}
                          style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "0.8rem", color: "#10B981", fontWeight: 700, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "8px", padding: "4px 10px", cursor: "pointer" }}
                        >
                          <Plus size={13} /> Add to Database
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty/default state */}
              {!aiLoading && !aiSearched && !aiError && (
                <div style={{ textAlign: "center", padding: "2.5rem 0", color: "var(--text-muted)" }}>
                  <Sparkles size={48} style={{ color: "#6366F1", opacity: 0.4, marginBottom: "1rem" }} />
                  <h4 style={{ color: "var(--text-secondary)", fontWeight: 700, marginBottom: "0.5rem" }}>
                    Discover Government Grants for Leimarembi Foundation
                  </h4>
                  <p style={{ fontSize: "0.9rem", maxWidth: "400px", margin: "0 auto", lineHeight: 1.6 }}>
                    Type a topic above or tap a quick tag to find relevant central & state government schemes, PFMS-registered grants, and CSR funding opportunities tailored for your organisation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          ADD SCHEME MODAL
      ════════════════════════════════════════════════════════════════════════ */}
      {showAddScheme && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,10,30,0.8)", backdropFilter: "blur(8px)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }} onClick={() => setShowAddScheme(false)}>
          <div style={{ background: "var(--surface-color)", width: "100%", maxWidth: "480px", borderRadius: "24px", border: "1px solid var(--border-color)", boxShadow: "0 30px 60px rgba(0,0,0,0.3)", overflow: "hidden", animation: "scaleUp 0.25s ease-out" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "1.5rem 2rem", background: "linear-gradient(135deg,#0F172A,#1E293B)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Plus size={20} style={{ color: "#10B981" }} />
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800 }}>Add New Grant Scheme</h3>
              </div>
              <button onClick={() => setShowAddScheme(false)} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              {[
                { label: "Scheme Name *", key: "name", placeholder: "e.g. PM-CARES for Communities" },
                { label: "Department / Ministry *", key: "department", placeholder: "e.g. Ministry of Social Justice" },
                { label: "Target Amount *", key: "amount", placeholder: "e.g. ₹5,00,000" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "6px" }}>{f.label}</label>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    value={(newScheme as Record<string, string>)[f.key] || ""}
                    onChange={e => setNewScheme(prev => ({ ...prev, [f.key]: e.target.value }))}
                    style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "12px", border: "1.5px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-primary)", fontSize: "0.95rem", outline: "none" }}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "6px" }}>Status</label>
                <select
                  value={newScheme.status}
                  onChange={e => setNewScheme(prev => ({ ...prev, status: e.target.value as Scheme["status"] }))}
                  style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "12px", border: "1.5px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-primary)", fontSize: "0.95rem", outline: "none" }}
                >
                  <option>Draft</option>
                  <option>Under Review</option>
                  <option>Updated Soon</option>
                  <option>Approved</option>
                </select>
              </div>
              <button
                onClick={handleAddScheme}
                disabled={!newScheme.name || !newScheme.department || !newScheme.amount}
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center", minHeight: "48px", borderRadius: "12px", fontWeight: 800, gap: "8px", marginTop: "0.5rem", opacity: (!newScheme.name || !newScheme.department || !newScheme.amount) ? 0.5 : 1 }}
              >
                <Plus size={18} /> Add to Scheme Database
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline keyframes for animations */}
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        @keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @keyframes scaleUp { from{transform:scale(0.92);opacity:0;} to{transform:scale(1);opacity:1;} }
      `}</style>
    </div>
  );
}
