"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Feature = "chat" | "minutes" | "grants" | "translate" | "documents";
type ChatMessage = { role: "user" | "assistant"; text: string };

// ─── Constants ────────────────────────────────────────────────────────────────
const FEATURES: { id: Feature; icon: string; label: string; subtitle: string }[] = [
  { id: "chat",      icon: "💬", label: "AI Chat",         subtitle: "Foundation Assistant" },
  { id: "minutes",   icon: "📋", label: "Meeting Minutes", subtitle: "Auto-Generator"       },
  { id: "grants",    icon: "🏛️", label: "Grant Alerts",    subtitle: "Scheme Finder"        },
  { id: "translate", icon: "🌐", label: "Translation",     subtitle: "3 Languages"          },
  { id: "documents", icon: "📄", label: "Document Search", subtitle: "Search & Summary System" },
];

const TRANSLATE_PAIRS = [
  "English → Manipuri (Meitei)",
  "Manipuri (Meitei) → English",
  "English → Assamese",
  "Assamese → English",
  "Manipuri → Assamese",
  "Assamese → Manipuri",
];

const GRANT_SECTORS = [
  "Health & Medical",
  "Cultural Preservation",
  "Education & Youth",
  "Women Empowerment",
  "Sports Development",
  "Community Infrastructure",
  "Senior Citizen Welfare",
  "Digital Governance",
];

const INITIAL_CHAT: ChatMessage[] = [
  {
    role: "assistant",
    text: "Khurumjari! 🙏 I am the **LFA AI Assistant** for the Leimarembi Foundation.\n\nI can help you with:\n• Information about our 12 executive committee members\n• Foundation programs: Health, Culture, Grants, Management\n• How to navigate this digital platform\n• General questions about our community initiatives\n\nHow can I assist you today?",
  },
];

// ─── Markdown-like renderer (bold, bullets, line breaks) ──────────────────────
function RenderText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div style={{ lineHeight: 1.65 }}>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        // Bullet
        if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "2px" }}>
              <span style={{ color: "var(--secondary-color)", fontWeight: 700, flexShrink: 0 }}>•</span>
              <span dangerouslySetInnerHTML={{ __html: boldify(trimmed.slice(2)) }} />
            </div>
          );
        }
        // Heading (##)
        if (trimmed.startsWith("## ")) {
          return <div key={i} style={{ fontWeight: 700, fontSize: "1.05rem", marginTop: "12px", marginBottom: "4px", color: "var(--secondary-color)" }}>{trimmed.slice(3)}</div>;
        }
        // Heading (#)
        if (trimmed.startsWith("# ")) {
          return <div key={i} style={{ fontWeight: 800, fontSize: "1.15rem", marginTop: "14px", marginBottom: "6px" }}>{trimmed.slice(2)}</div>;
        }
        // Table row
        if (trimmed.startsWith("|")) {
          return <div key={i} style={{ fontFamily: "monospace", fontSize: "0.82rem", whiteSpace: "pre-wrap", background: "rgba(0,0,0,0.04)", padding: "2px 6px", borderRadius: "4px", marginBottom: "2px" }}>{trimmed}</div>;
        }
        // Horizontal rule
        if (trimmed === "---" || trimmed === "***") {
          return <hr key={i} style={{ border: "none", borderTop: "1px solid var(--border-color)", margin: "10px 0" }} />;
        }
        // Empty line
        if (!trimmed) return <br key={i} />;
        // Normal paragraph
        return <div key={i} style={{ marginBottom: "2px" }} dangerouslySetInnerHTML={{ __html: boldify(line) }} />;
      })}
    </div>
  );
}

function boldify(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

// ─── Typing Dots ──────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "4px 0" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: "8px", height: "8px",
            borderRadius: "50%",
            background: "var(--ai-accent)",
            display: "inline-block",
            animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Copy Button ──────────────────────────────────────────────────────────────
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      title="Copy to clipboard"
      style={{
        background: "transparent", border: "1px solid var(--border-color)",
        borderRadius: "6px", padding: "4px 10px", cursor: "pointer",
        color: "var(--text-secondary)", fontSize: "0.75rem",
        display: "flex", alignItems: "center", gap: "4px",
        transition: "all 0.2s",
      }}
    >
      {copied ? "✅ Copied!" : "📋 Copy"}
    </button>
  );
}

// ─── Result Box ───────────────────────────────────────────────────────────────
function ResultBox({ text }: { text: string }) {
  return (
    <div style={{
      background: "var(--surface-color)",
      border: "1px solid var(--border-color)",
      borderRadius: "12px",
      padding: "1.5rem",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
        <CopyBtn text={text} />
      </div>
      <RenderText text={text} />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AIPage() {
  const [activeTab, setActiveTab] = useState<Feature>("chat");

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Minutes state
  const [minutesInput, setMinutesInput] = useState("");
  const [minutesResult, setMinutesResult] = useState("");
  const [minutesLoading, setMinutesLoading] = useState(false);

  // Grants state
  const [grantsInput, setGrantsInput] = useState("");
  const [grantsSector, setGrantsSector] = useState(GRANT_SECTORS[0]);
  const [grantsResult, setGrantsResult] = useState("");
  const [grantsLoading, setGrantsLoading] = useState(false);

  // Translate state
  const [translateInput, setTranslateInput] = useState("");
  const [translatePair, setTranslatePair] = useState(TRANSLATE_PAIRS[0]);
  const [translateResult, setTranslateResult] = useState("");
  const [translateLoading, setTranslateLoading] = useState(false);

  // Documents state
  const [docsInput, setDocsInput] = useState("");
  const [docsResult, setDocsResult] = useState("");
  const [docsLoading, setDocsLoading] = useState(false);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  // ── API caller ──────────────────────────────────────────────────────────────
  const callGemini = useCallback(async (
    feature: Feature,
    prompt: string,
    history?: ChatMessage[]
  ): Promise<string> => {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feature, prompt, history }),
    });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || "Unknown error");
    return data.text;
  }, []);

  // ── Chat send ───────────────────────────────────────────────────────────────
  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: ChatMessage = { role: "user", text: chatInput.trim() };
    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setChatInput("");
    setChatLoading(true);
    try {
      const text = await callGemini("chat", userMsg.text, chatMessages);
      setChatMessages([...newHistory, { role: "assistant", text }]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setChatMessages([...newHistory, { role: "assistant", text: `⚠️ **Error:** ${msg}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  // ── Generic tool handler ────────────────────────────────────────────────────
  const runTool = async (
    feature: Feature,
    prompt: string,
    setResult: (v: string) => void,
    setLoading: (v: boolean) => void
  ) => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const text = await callGemini(feature, prompt);
      setResult(text);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setResult(`⚠️ **Error:** ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // ─── Styles (scoped via CSS-in-JS style tag) ───────────────────────────────
  const css = `
    :root { --ai-accent: #7C3AED; --ai-accent-light: rgba(124,58,237,0.12); }
    [data-theme="dark"] { --ai-accent: #A78BFA; --ai-accent-light: rgba(167,139,250,0.15); }
    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
      30% { transform: translateY(-6px); opacity: 1; }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .ai-tab-btn {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      padding: 14px 20px; border: 1px solid var(--border-color);
      border-radius: 12px; cursor: pointer; background: var(--surface-color);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      color: var(--text-secondary); transition: all 0.25s ease;
      min-width: 110px; text-align: center; flex-shrink: 0;
    }
    .ai-tab-btn:hover {
      border-color: var(--ai-accent); color: var(--ai-accent);
      transform: translateY(-2px); box-shadow: 0 6px 20px rgba(124,58,237,0.18);
    }
    .ai-tab-btn.active {
      background: var(--ai-accent-light); border-color: var(--ai-accent);
      color: var(--ai-accent); box-shadow: 0 4px 16px rgba(124,58,237,0.2);
    }
    .ai-tab-btn .icon { font-size: 1.6rem; }
    .ai-tab-btn .label { font-weight: 700; font-size: 0.8rem; letter-spacing: 0.3px; }
    .ai-tab-btn .sub { font-size: 0.68rem; opacity: 0.7; }

    .ai-textarea {
      width: 100%; border-radius: 10px; padding: 14px;
      border: 1.5px solid var(--border-color); outline: none;
      background: var(--surface-color); backdrop-filter: blur(8px);
      color: var(--text-primary); font-family: inherit; font-size: 0.95rem;
      line-height: 1.6; resize: vertical; transition: border-color 0.2s;
    }
    .ai-textarea:focus { border-color: var(--ai-accent); }

    .ai-select {
      padding: 10px 14px; border-radius: 8px;
      border: 1.5px solid var(--border-color); outline: none;
      background: var(--surface-color); backdrop-filter: blur(8px);
      color: var(--text-primary); font-family: inherit; font-size: 0.9rem;
      cursor: pointer; transition: border-color 0.2s; width: 100%;
    }
    .ai-select:focus { border-color: var(--ai-accent); }

    .ai-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 12px 28px; border-radius: 10px; border: none; cursor: pointer;
      font-weight: 700; font-size: 0.95rem; font-family: inherit;
      background: var(--ai-accent); color: #fff; transition: all 0.25s;
    }
    .ai-btn:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.35); }
    .ai-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

    .ai-loading-bar {
      height: 3px; border-radius: 4px; overflow: hidden;
      background: rgba(124,58,237,0.15); margin: 12px 0;
    }
    .ai-loading-bar-inner {
      height: 100%; width: 40%;
      background: linear-gradient(90deg, transparent, var(--ai-accent), transparent);
      background-size: 200%;
      animation: shimmer 1.2s infinite;
    }

    .chat-bubble { animation: slideIn 0.3s ease-out; }

    .chat-input-wrap {
      display: flex; gap: 10px; padding: 16px;
      border-top: 1px solid var(--border-color);
      background: var(--surface-color); backdrop-filter: blur(12px);
    }
    .chat-input {
      flex: 1; padding: 12px 16px; border-radius: 10px;
      border: 1.5px solid var(--border-color); outline: none;
      background: rgba(255,255,255,0.08); color: var(--text-primary);
      font-family: inherit; font-size: 0.95rem; transition: border-color 0.2s;
    }
    .chat-input:focus { border-color: var(--ai-accent); }

    .hero-banner {
      background: linear-gradient(135deg, #4C1D95 0%, #6D28D9 35%, #0A192F 100%);
      border-radius: 16px; padding: 2rem 2.5rem; margin-bottom: 2rem;
      position: relative; overflow: hidden;
    }
    .hero-banner::before {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(ellipse at top right, rgba(167,139,250,0.3), transparent 60%);
    }
    .hero-banner::after {
      content: '🤖'; position: absolute; right: 2rem; top: 50%;
      transform: translateY(-50%); font-size: 5rem; opacity: 0.12;
    }

    .tool-section { animation: slideIn 0.35s ease-out; }

    @media (max-width: 640px) {
      .ai-tab-btn { min-width: 80px; padding: 10px 8px; }
      .ai-tab-btn .icon { font-size: 1.3rem; }
      .ai-tab-btn .label { font-size: 0.7rem; }
      .ai-tab-btn .sub { display: none; }
      .hero-banner { padding: 1.5rem; }
      .hero-banner::after { font-size: 3rem; right: 1rem; }
    }
  `;

  const panelStyle: React.CSSProperties = {
    background: "var(--surface-color)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderRadius: "16px",
    border: "1px solid var(--border-color)",
    overflow: "hidden",
  };

  // ─── Render tab content ────────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeTab) {
      // ── CHAT ────────────────────────────────────────────────────────────────
      case "chat":
        return (
          <div className="tool-section" style={{ ...panelStyle, display: "flex", flexDirection: "column", height: "520px" }}>
            {/* Header */}
            <div style={{
              padding: "16px 20px", borderBottom: "1px solid var(--border-color)",
              display: "flex", alignItems: "center", gap: "12px",
              background: "var(--ai-accent-light)",
            }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: "var(--ai-accent)", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "1.2rem", flexShrink: 0,
              }}>🤖</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>LFA AI Assistant</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  Powered by Google Gemini • Foundation Knowledge Base
                </div>
              </div>
              <button
                onClick={() => setChatMessages(INITIAL_CHAT)}
                style={{
                  marginLeft: "auto", background: "transparent",
                  border: "1px solid var(--border-color)", borderRadius: "6px",
                  padding: "4px 10px", cursor: "pointer", color: "var(--text-secondary)",
                  fontSize: "0.75rem",
                }}
                title="Clear chat history"
              >
                🗑️ Clear
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px" }}>
              {chatMessages.map((msg, i) => (
                <div key={i} className="chat-bubble" style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  {msg.role === "assistant" && (
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      background: "var(--ai-accent)", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "1rem", flexShrink: 0,
                      marginRight: "10px", alignSelf: "flex-end",
                    }}>🤖</div>
                  )}
                  <div style={{
                    maxWidth: "72%", padding: "12px 16px", borderRadius: "14px",
                    background: msg.role === "user"
                      ? "var(--ai-accent)"
                      : "var(--surface-color)",
                    color: msg.role === "user" ? "#fff" : "var(--text-primary)",
                    border: msg.role === "assistant" ? "1px solid var(--border-color)" : "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                    fontSize: "0.9rem",
                  }}>
                    <RenderText text={msg.text} />
                  </div>
                  {msg.role === "user" && (
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      background: "var(--secondary-color)", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "1rem", flexShrink: 0,
                      marginLeft: "10px", alignSelf: "flex-end",
                    }}>👤</div>
                  )}
                </div>
              ))}
              {chatLoading && (
                <div className="chat-bubble" style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    background: "var(--ai-accent)", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "1rem", flexShrink: 0,
                  }}>🤖</div>
                  <div style={{
                    padding: "12px 16px", borderRadius: "14px",
                    border: "1px solid var(--border-color)",
                    background: "var(--surface-color)",
                  }}>
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input-wrap">
              <input
                id="ai-chat-input"
                className="chat-input"
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendChat()}
                placeholder="Ask about members, grants, culture, health programs…"
                disabled={chatLoading}
                autoComplete="off"
              />
              <button
                id="ai-chat-send"
                className="ai-btn"
                onClick={sendChat}
                disabled={chatLoading || !chatInput.trim()}
                style={{ padding: "12px 20px", flexShrink: 0 }}
              >
                {chatLoading ? "⏳" : "📨"} Send
              </button>
            </div>
          </div>
        );

      // ── MEETING MINUTES ──────────────────────────────────────────────────────
      case "minutes":
        return (
          <div className="tool-section" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={panelStyle}>
              <div style={{ padding: "20px", borderBottom: "1px solid var(--border-color)", background: "var(--ai-accent-light)" }}>
                <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                  📋 Automatic Meeting Minutes Generator
                </h3>
                <p style={{ margin: "6px 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Paste your raw meeting notes, bullet points, or rough summary below. AI will format them into official, printable minutes.
                </p>
              </div>
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <textarea
                  id="minutes-input"
                  className="ai-textarea"
                  rows={8}
                  value={minutesInput}
                  onChange={(e) => setMinutesInput(e.target.value)}
                  placeholder={`Example:\nDate: 28 Aug 2026\nAttendees: President Dr. Phuritsabam, Secretary M. Bina Babu, Treasurer Ng. Baldev\n\nAgenda 1: Reviewed health camp schedule — decided to hold camp on 15 Sep at Kekranagar\nAgenda 2: Discussed grant application for cultural preservation\nAction: Secretary to submit IGNCA application by 5 Sep\nNext meeting: 10 Sep 2026`}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {minutesInput.length} characters
                  </span>
                  <button
                    id="minutes-generate-btn"
                    className="ai-btn"
                    onClick={() => runTool("minutes", minutesInput, setMinutesResult, setMinutesLoading)}
                    disabled={minutesLoading || !minutesInput.trim()}
                  >
                    {minutesLoading ? "⏳ Generating…" : "✨ Generate Minutes"}
                  </button>
                </div>
                {minutesLoading && <div className="ai-loading-bar"><div className="ai-loading-bar-inner" /></div>}
              </div>
            </div>
            {minutesResult && <ResultBox text={minutesResult} />}
          </div>
        );

      // ── GRANTS ───────────────────────────────────────────────────────────────
      case "grants":
        return (
          <div className="tool-section" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={panelStyle}>
              <div style={{ padding: "20px", borderBottom: "1px solid var(--border-color)", background: "var(--ai-accent-light)" }}>
                <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                  🏛️ Government Grant Opportunity Finder
                </h3>
                <p style={{ margin: "6px 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Describe your project idea and select a sector. AI will identify relevant government schemes, eligibility criteria, and application portals.
                </p>
              </div>
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "8px" }}>
                    Project Sector
                  </label>
                  <select
                    id="grants-sector-select"
                    className="ai-select"
                    value={grantsSector}
                    onChange={(e) => setGrantsSector(e.target.value)}
                  >
                    {GRANT_SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "8px" }}>
                    Project Description
                  </label>
                  <textarea
                    id="grants-input"
                    className="ai-textarea"
                    rows={6}
                    value={grantsInput}
                    onChange={(e) => setGrantsInput(e.target.value)}
                    placeholder={`Example:\nWe want to organise a 3-day health camp in Kekranagar village targeting 200+ senior citizens. Activities include free medical check-ups, eye screening, dental care, and distribution of medicines. Our NGO has NITI Aayog DARPAN registration.`}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {grantsInput.length} characters
                  </span>
                  <button
                    id="grants-find-btn"
                    className="ai-btn"
                    onClick={() => runTool("grants", `Sector: ${grantsSector}\n\nProject Description:\n${grantsInput}`, setGrantsResult, setGrantsLoading)}
                    disabled={grantsLoading || !grantsInput.trim()}
                  >
                    {grantsLoading ? "⏳ Searching…" : "🔍 Find Grant Schemes"}
                  </button>
                </div>
                {grantsLoading && <div className="ai-loading-bar"><div className="ai-loading-bar-inner" /></div>}
              </div>
            </div>
            {grantsResult && <ResultBox text={grantsResult} />}
          </div>
        );

      // ── TRANSLATE ────────────────────────────────────────────────────────────
      case "translate":
        return (
          <div className="tool-section" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={panelStyle}>
              <div style={{ padding: "20px", borderBottom: "1px solid var(--border-color)", background: "var(--ai-accent-light)" }}>
                <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                  🌐 Language Translation — English · Manipuri · Assamese
                </h3>
                <p style={{ margin: "6px 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Translate official documents, notices, or communications across all three languages of the community.
                </p>
              </div>
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "8px" }}>
                    Translation Direction
                  </label>
                  <select
                    id="translate-pair-select"
                    className="ai-select"
                    value={translatePair}
                    onChange={(e) => setTranslatePair(e.target.value)}
                  >
                    {TRANSLATE_PAIRS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "8px" }}>
                    Text to Translate
                  </label>
                  <textarea
                    id="translate-input"
                    className="ai-textarea"
                    rows={6}
                    value={translateInput}
                    onChange={(e) => setTranslateInput(e.target.value)}
                    placeholder="Enter the text you want to translate here…"
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {translateInput.length} characters
                  </span>
                  <button
                    id="translate-btn"
                    className="ai-btn"
                    onClick={() => runTool("translate", `Translate the following text (${translatePair}):\n\n${translateInput}`, setTranslateResult, setTranslateLoading)}
                    disabled={translateLoading || !translateInput.trim()}
                  >
                    {translateLoading ? "⏳ Translating…" : "🌐 Translate"}
                  </button>
                </div>
                {translateLoading && <div className="ai-loading-bar"><div className="ai-loading-bar-inner" /></div>}
              </div>
            </div>
            {translateResult && <ResultBox text={translateResult} />}
          </div>
        );

      // ── DOCUMENTS ────────────────────────────────────────────────────────────
      case "documents":
        return (
          <div className="tool-section" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={panelStyle}>
              <div style={{ padding: "20px", borderBottom: "1px solid var(--border-color)", background: "var(--ai-accent-light)" }}>
                <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                  📄 Document Search System & Summarizer
                </h3>
                <p style={{ margin: "6px 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  Paste any document excerpt (trust deed, bye-laws, government letter, grant application). AI searches its database, extracts key clauses, action items, and explains it in plain language.
                </p>
              </div>
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <textarea
                  id="documents-input"
                  className="ai-textarea"
                  rows={9}
                  value={docsInput}
                  onChange={(e) => setDocsInput(e.target.value)}
                  placeholder={`Paste document text here…\n\nExample: Clause 5 of the Trust Deed: The Trust shall not carry on any activity for the purpose of profit or gain of any individual member…`}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {docsInput.length} characters
                  </span>
                  <button
                    id="documents-analyse-btn"
                    className="ai-btn"
                    onClick={() => runTool("documents", docsInput, setDocsResult, setDocsLoading)}
                    disabled={docsLoading || !docsInput.trim()}
                  >
                    {docsLoading ? "⏳ Analysing…" : "🔬 Search & Analyse"}
                  </button>
                </div>
                {docsLoading && <div className="ai-loading-bar"><div className="ai-loading-bar-inner" /></div>}
              </div>
            </div>
            {docsResult && <ResultBox text={docsResult} />}
          </div>
        );
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="animate-fade-in" style={{ padding: "2rem 0 4rem" }}>

        {/* ── Hero Banner ──────────────────────────────────────────────────── */}
        <div className="hero-banner">
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <span style={{ fontSize: "1.8rem" }}>⚡</span>
              <span style={{
                background: "rgba(255,255,255,0.15)", borderRadius: "20px",
                padding: "4px 14px", fontSize: "0.75rem", fontWeight: 700,
                color: "#E9D5FF", letterSpacing: "1px", textTransform: "uppercase",
              }}>
                Powered by Google Gemini
              </span>
            </div>
            <h1 style={{ color: "#fff", fontSize: "2.2rem", margin: "0 0 8px", fontWeight: 900, lineHeight: 1.2 }}>
              AI Intelligence Hub
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", margin: 0, fontSize: "1rem", maxWidth: "580px" }}>
              5 AI-powered tools for the Leimarembi Foundation — Chat Assistant, Meeting Minutes,
              Grant Finder, Translation & Document Search System.
            </p>
          </div>
        </div>

        {/* ── Tab Navigation ───────────────────────────────────────────────── */}
        <div style={{
          display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "4px",
          marginBottom: "1.75rem", scrollbarWidth: "none",
        }}>
          {FEATURES.map((f) => (
            <button
              key={f.id}
              id={`ai-tab-${f.id}`}
              className={`ai-tab-btn ${activeTab === f.id ? "active" : ""}`}
              onClick={() => setActiveTab(f.id)}
            >
              <span className="icon">{f.icon}</span>
              <span className="label">{f.label}</span>
              <span className="sub">{f.subtitle}</span>
            </button>
          ))}
        </div>

        {/* ── Active Feature Content ───────────────────────────────────────── */}
        {renderContent()}

        {/* ── Footer note ─────────────────────────────────────────────────── */}
        <div style={{
          marginTop: "2rem", padding: "16px 20px",
          border: "1px dashed var(--border-color)", borderRadius: "10px",
          fontSize: "0.8rem", color: "var(--text-secondary)",
          display: "flex", alignItems: "center", gap: "10px",
        }}>
          <span style={{ fontSize: "1.1rem" }}>🔐</span>
          <span>
            All AI requests are routed through a secure server-side proxy. Your API key is never exposed to the browser.
            AI responses may contain inaccuracies — always verify important information with foundation officials.
          </span>
        </div>

      </div>
    </>
  );
}
