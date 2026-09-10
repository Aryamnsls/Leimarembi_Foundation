"use client";

import { useState, useEffect } from "react";
import { ExternalLink, RefreshCw, AlertCircle, X, Globe, Calendar, Share2, Eye, Sparkles } from "lucide-react";

interface RSSArticle {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail?: string;
  source: string;
  sourceColor: string;
  category: "local" | "manipuri" | "assamese" | "bengali";
}

const RSS2JSON_BASE = "https://api.rss2json.com/v1/api.json?rss_url=";

const NEWS_FEEDS = [
  // Local News Feeds (Lakhipur & Cachar District)
  { url: "https://www.sentinelassam.com/cities/silchar-news/feed", name: "Cachar & Lakhipur Local News", color: "#0284C7", category: "local" as const },
  { url: "https://www.sentinelassam.com/barak-valley-news/feed", name: "Cachar District Bulletin", color: "#0369A1", category: "local" as const },

  // Manipuri News Feeds (in English)
  { url: "https://nenow.in/north-east-news/manipur/feed", name: "Northeast Now (Manipur)", color: "#DC2626", category: "manipuri" as const },
  { url: "https://www.eastmojo.com/manipur/feed", name: "EastMojo Manipur", color: "#E11D48", category: "manipuri" as const },
  { url: "https://www.sentinelassam.com/north-east-india-news/manipur-news/feed", name: "The Sentinel Manipur", color: "#7C3AED", category: "manipuri" as const },
  
  // Assamese News Feeds (in English)
  { url: "https://assamtribune.com/feed", name: "The Assam Tribune", color: "#1D4ED8", category: "assamese" as const },
  { url: "https://www.sentinelassam.com/feed", name: "The Sentinel Assam", color: "#2563EB", category: "assamese" as const },

  // Bengali Region / Barak Valley News (in English)
  { url: "https://www.sentinelassam.com/barak-valley-news/feed", name: "Barak Valley News", color: "#059669", category: "bengali" as const }
];

// Fallback curated news items in case RSS API is throttled or offline
const FALLBACK_NEWS: RSSArticle[] = [
  {
    id: "loc-1",
    title: "Lakhipur Sub-Division Development & Cultural Heritage Awareness Drive Launched",
    link: "https://www.sentinelassam.com/cities/silchar-news",
    pubDate: new Date().toISOString(),
    description: "Community leaders and local administrative bodies in Lakhipur, Cachar district convene to discuss infrastructure and youth skill programs.",
    thumbnail: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
    source: "Cachar & Lakhipur News",
    sourceColor: "#0284C7",
    category: "local"
  },
  {
    id: "loc-2",
    title: "Cachar District Artisans & Farmers Exhibition Highlights Indigenous Produce",
    link: "https://www.sentinelassam.com/barak-valley-news",
    pubDate: new Date(Date.now() - 3600000 * 2).toISOString(),
    description: "Exhibitors across Lakhipur and Silchar present traditional handicrafts, organic teas, and regional handloom designs.",
    thumbnail: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=800&q=80",
    source: "Cachar District Bulletin",
    sourceColor: "#0369A1",
    category: "local"
  },
  {
    id: "m-1",
    title: "Manipuri Cultural Revival & Heritage Preservation Program Launched in Imphal",
    link: "https://nenow.in/north-east-news/manipur",
    pubDate: new Date(Date.now() - 3600000 * 3).toISOString(),
    description: "State initiatives promote traditional Meetei Mayek script, folk arts, and community heritage across Manipur centers.",
    thumbnail: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    source: "Northeast Now (Manipur)",
    sourceColor: "#DC2626",
    category: "manipuri"
  },
  {
    id: "m-2",
    title: "Classical Manipuri Ras Lila & Folk Music Festival Celebrates Indigenous Artists",
    link: "https://www.eastmojo.com/manipur",
    pubDate: new Date(Date.now() - 3600000 * 5).toISOString(),
    description: "Artisans and performers gather to showcase ancestral Pena melodies, martial arts, and classical dance routines.",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    source: "EastMojo Manipur",
    sourceColor: "#E11D48",
    category: "manipuri"
  },
  {
    id: "a-1",
    title: "Assam Digital Infrastructure & Regional Connectivity Drive Gains Momentum",
    link: "https://assamtribune.com",
    pubDate: new Date(Date.now() - 3600000 * 8).toISOString(),
    description: "New public portals and community welfare initiatives launch across Guwahati and district headquarters in Assam.",
    thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    source: "The Assam Tribune",
    sourceColor: "#1D4ED8",
    category: "assamese"
  },
  {
    id: "b-1",
    title: "Barak Valley Community Educational Outreach Highlighted in Regional Update",
    link: "https://www.sentinelassam.com/barak-valley-news",
    pubDate: new Date(Date.now() - 3600000 * 12).toISOString(),
    description: "Local welfare organizations emphasize educational outreach, youth training, and digital media access in Cachar district.",
    thumbnail: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    source: "Barak Valley News",
    sourceColor: "#059669",
    category: "bengali"
  }
];

function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, "")
    .trim();
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return dateStr;
  }
}

export default function NewsPage() {
  const [articles, setArticles] = useState<RSSArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "local" | "manipuri" | "assamese" | "bengali">("all");
  const [selectedArticle, setSelectedArticle] = useState<RSSArticle | null>(null);

  const fetchAllFeeds = async () => {
    setLoading(true);
    setError(false);
    
    let fetchedArticles: RSSArticle[] = [];
    
    try {
      const promises = NEWS_FEEDS.map(async (feed, idx) => {
        try {
          const res = await fetch(`${RSS2JSON_BASE}${encodeURIComponent(feed.url)}&count=8`);
          const data = await res.json();
          if (data.status === "ok" && data.items?.length) {
            return data.items.map((item: any, itemIdx: number) => ({
              id: `${feed.category}-${idx}-${itemIdx}`,
              title: item.title,
              link: item.link,
              pubDate: item.pubDate,
              description: stripHtml(item.description || item.content || ""),
              thumbnail: item.thumbnail || item.enclosure?.link,
              source: feed.name,
              sourceColor: feed.color,
              category: feed.category
            }));
          }
        } catch (e) {
          console.warn("Feed fetch failed:", feed.name);
        }
        return [];
      });
      
      const results = await Promise.all(promises);
      results.forEach(res => {
        fetchedArticles = [...fetchedArticles, ...res];
      });
      
      // Sort by pubDate descending
      fetchedArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
      
      if (fetchedArticles.length > 0) {
        setArticles(fetchedArticles);
      } else {
        // Use rich fallbacks if API gives no results
        setArticles(FALLBACK_NEWS);
      }
    } catch {
      setArticles(FALLBACK_NEWS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllFeeds();
  }, []);

  const filteredArticles = activeTab === "all" 
    ? articles 
    : articles.filter(art => art.category === activeTab);

  return (
    <div className="animate-fade-in" style={{ padding: "2.5rem 0 6rem", maxWidth: "1280px", margin: "0 auto" }}>
      {/* Header Section */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
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
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981", boxShadow: "0 0 10px #10B981" }} />
          <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--primary-color)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Real-Time English News Feed
          </span>
        </div>

        <h1 style={{ fontSize: "3rem", fontWeight: 900, margin: "0 0 1rem 0", color: "var(--primary-color)", letterSpacing: "-0.5px" }}>
          Leimarembi News Hub
        </h1>
        
        <p style={{ color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto 2rem", fontSize: "1.15rem", lineHeight: 1.6 }}>
          Live curated updates across Manipuri, Assamese, and Regional Northeast news — delivered in clear English.
        </p>

        {/* Refresh Button */}
        <button 
          onClick={fetchAllFeeds} 
          className="btn btn-primary" 
          style={{ 
            margin: "0 auto", 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "8px",
            borderRadius: "50px",
            padding: "0.75rem 1.75rem",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
          }}
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh Real-Time News
        </button>
      </div>

      {/* Category Navigation Bar */}
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "0.75rem", 
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
          onClick={() => setActiveTab("all")}
          style={{
            padding: "0.75rem 1.75rem",
            borderRadius: "40px",
            border: "none",
            fontWeight: 800,
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            background: activeTab === "all" ? "var(--primary-color)" : "transparent",
            color: activeTab === "all" ? "#FFFFFF" : "var(--text-secondary)",
            boxShadow: activeTab === "all" ? "0 4px 14px rgba(0,0,0,0.15)" : "none"
          }}
        >
          🌟 All News ({articles.length})
        </button>

        <button
          onClick={() => setActiveTab("local")}
          style={{
            padding: "0.75rem 1.75rem",
            borderRadius: "40px",
            border: "none",
            fontWeight: 800,
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            background: activeTab === "local" ? "#0284C7" : "transparent",
            color: activeTab === "local" ? "#FFFFFF" : "var(--text-secondary)",
            boxShadow: activeTab === "local" ? "0 4px 14px rgba(2,132,199,0.3)" : "none"
          }}
        >
          📍 Local News (Lakhipur & Cachar)
        </button>

        <button
          onClick={() => setActiveTab("manipuri")}
          style={{
            padding: "0.75rem 1.75rem",
            borderRadius: "40px",
            border: "none",
            fontWeight: 800,
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            background: activeTab === "manipuri" ? "#DC2626" : "transparent",
            color: activeTab === "manipuri" ? "#FFFFFF" : "var(--text-secondary)",
            boxShadow: activeTab === "manipuri" ? "0 4px 14px rgba(220,38,38,0.3)" : "none"
          }}
        >
          ⛰️ Manipuri News
        </button>

        <button
          onClick={() => setActiveTab("assamese")}
          style={{
            padding: "0.75rem 1.75rem",
            borderRadius: "40px",
            border: "none",
            fontWeight: 800,
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            background: activeTab === "assamese" ? "#1D4ED8" : "transparent",
            color: activeTab === "assamese" ? "#FFFFFF" : "var(--text-secondary)",
            boxShadow: activeTab === "assamese" ? "0 4px 14px rgba(29,78,216,0.3)" : "none"
          }}
        >
          🌾 Assamese News
        </button>

        <button
          onClick={() => setActiveTab("bengali")}
          style={{
            padding: "0.75rem 1.75rem",
            borderRadius: "40px",
            border: "none",
            fontWeight: 800,
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            background: activeTab === "bengali" ? "#059669" : "transparent",
            color: activeTab === "bengali" ? "#FFFFFF" : "var(--text-secondary)",
            boxShadow: activeTab === "bengali" ? "0 4px 14px rgba(5,150,105,0.3)" : "none"
          }}
        >
          🌊 Bengali Region News
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div 
              key={i} 
              style={{ 
                background: "var(--surface-color)", 
                borderRadius: "20px", 
                padding: "1.5rem", 
                border: "1px solid var(--border-color)", 
                aspectRatio: "1 / 1.15", 
                display: "flex", 
                flexDirection: "column" 
              }}
            >
              <div style={{ flex: 1, background: "var(--border-color)", borderRadius: "12px", marginBottom: "1rem", opacity: 0.5, animation: "pulse 1.5s ease-in-out infinite" }} />
              <div style={{ height: "20px", background: "var(--border-color)", borderRadius: "6px", marginBottom: "12px", animation: "pulse 1.5s ease-in-out infinite" }} />
              <div style={{ height: "14px", background: "var(--border-color)", borderRadius: "6px", width: "70%", animation: "pulse 1.5s ease-in-out infinite" }} />
            </div>
          ))}
        </div>
      )}

      {/* News Grid (Cube / Vertical Aspect Ratio) */}
      {!loading && filteredArticles.length > 0 && (
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
            gap: "2rem",
            alignItems: "stretch" 
          }}
        >
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              style={{ 
                background: "var(--surface-color)", 
                borderRadius: "24px", 
                overflow: "hidden",
                border: "1px solid var(--border-color)", 
                display: "flex", 
                flexDirection: "column", 
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", 
                cursor: "pointer",
                aspectRatio: "1 / 1.15",
                position: "relative",
                boxShadow: "0 10px 30px rgba(0,0,0,0.04)"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.12)";
                e.currentTarget.style.borderColor = art.sourceColor;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.04)";
                e.currentTarget.style.borderColor = "var(--border-color)";
              }}
            >
              {/* Image / Graphic Container */}
              {art.thumbnail ? (
                <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
                  <img 
                    src={art.thumbnail} 
                    alt={art.title} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} 
                  />
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.85) 100%)" }} />
                  
                  {/* Category Tag Overlay */}
                  <div style={{ position: "absolute", top: "1rem", left: "1rem", display: "flex", gap: "6px" }}>
                    <span 
                      style={{ 
                        background: art.sourceColor, 
                        color: "#FFFFFF", 
                        padding: "4px 12px", 
                        borderRadius: "20px", 
                        fontSize: "0.75rem", 
                        fontWeight: 800, 
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)" 
                      }}
                    >
                      {art.source}
                    </span>
                  </div>

                  {/* Title & Info on Image */}
                  <div style={{ position: "absolute", bottom: "1.25rem", left: "1.25rem", right: "1.25rem" }}>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.35, margin: "0 0 8px 0", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {art.title}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "rgba(255,255,255,0.85)", fontSize: "0.78rem" }}>
                      <span>{formatDate(art.pubDate)}</span>
                      <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px", background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: "12px", backdropFilter: "blur(4px)" }}>
                        <Eye size={12} /> Read Article
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: "1.75rem", display: "flex", flexDirection: "column", height: "100%", background: `linear-gradient(145deg, var(--surface-color), ${art.sourceColor}10)` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <span style={{ color: art.sourceColor, fontSize: "0.75rem", fontWeight: 800, background: `${art.sourceColor}18`, padding: "4px 12px", borderRadius: "20px" }}>
                      {art.source}
                    </span>
                    <Sparkles size={16} style={{ color: art.sourceColor, opacity: 0.8 }} />
                  </div>
                  
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.4, marginBottom: "0.75rem", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {art.title}
                  </h3>
                  
                  {art.description && (
                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0, flex: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {art.description}
                    </p>
                  )}

                  <div style={{ marginTop: "auto", borderTop: "1px solid var(--border-color)", paddingTop: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>{formatDate(art.pubDate)}</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: art.sourceColor, display: "flex", alignItems: "center", gap: "4px" }}>
                      Read <Eye size={14} />
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Interactive Modal to Read Full News Article */}
      {selectedArticle && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem"
          }}
          onClick={() => setSelectedArticle(null)}
        >
          <div 
            style={{
              background: "var(--surface-color)",
              width: "100%",
              maxWidth: "680px",
              borderRadius: "28px",
              overflow: "hidden",
              border: "1px solid var(--border-color)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
              animation: "scaleUp 0.25s ease-out"
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-color)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ background: selectedArticle.sourceColor, color: "#FFF", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 800 }}>
                  {selectedArticle.source}
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  {formatDate(selectedArticle.pubDate)}
                </span>
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: "4px" }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: "2rem", maxHeight: "70vh", overflowY: "auto" }}>
              {selectedArticle.thumbnail && (
                <img 
                  src={selectedArticle.thumbnail} 
                  alt="" 
                  style={{ width: "100%", maxHeight: "280px", objectFit: "cover", borderRadius: "16px", marginBottom: "1.5rem" }} 
                />
              )}

              <h2 style={{ fontSize: "1.65rem", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.35, marginBottom: "1rem" }}>
                {selectedArticle.title}
              </h2>

              <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "2rem" }}>
                {selectedArticle.description || "Click below to read the full report directly from the official news publisher."}
              </p>

              {/* Actions Bar */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <a 
                  href={selectedArticle.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: "center", padding: "0.85rem 1.5rem", borderRadius: "50px", textDecoration: "none", fontWeight: 800 }}
                >
                  Read Full Article on {selectedArticle.source} <ExternalLink size={16} />
                </a>
                <button 
                  onClick={() => setSelectedArticle(null)} 
                  className="btn btn-outline"
                  style={{ padding: "0.85rem 1.5rem", borderRadius: "50px", fontWeight: 700 }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
