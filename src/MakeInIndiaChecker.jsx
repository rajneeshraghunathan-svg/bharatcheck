import { useState, useEffect, useRef } from "react";

const SAFFRON = "#FF6B00";
const GREEN = "#1B6B3A";
const NAVY = "#0A1628";
const CREAM = "#FFF8F0";
const GOLD = "#E8A020";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;800&family=Noto+Serif:ital,wght@0,400;0,700;1,400&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${NAVY};
    font-family: 'Baloo 2', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .app {
    max-width: 430px;
    margin: 0 auto;
    min-height: 100vh;
    background: ${NAVY};
    position: relative;
    overflow: hidden;
  }

  /* Decorative wheel */
  .ashoka-bg {
    position: fixed;
    top: -120px;
    right: -120px;
    width: 320px;
    height: 320px;
    opacity: 0.04;
    pointer-events: none;
    z-index: 0;
  }

  .header {
    background: linear-gradient(135deg, ${SAFFRON} 0%, #E85500 100%);
    padding: 20px 20px 28px;
    position: relative;
    z-index: 2;
    clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
  }

  .header-top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 4px;
  }

  .flag-strip {
    display: flex;
    flex-direction: column;
    width: 6px;
    height: 44px;
    border-radius: 3px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .flag-strip div { flex: 1; }
  .flag-strip .s { background: ${SAFFRON}; }
  .flag-strip .w { background: white; }
  .flag-strip .g { background: ${GREEN}; }

  .header h1 {
    font-size: 22px;
    font-weight: 800;
    color: white;
    line-height: 1.1;
    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }

  .header h1 span { color: ${NAVY}; }

  .header-sub {
    color: rgba(255,255,255,0.85);
    font-size: 12px;
    margin-left: 18px;
    font-weight: 400;
    letter-spacing: 0.5px;
  }

  .search-section {
    padding: 28px 20px 16px;
    position: relative;
    z-index: 2;
  }

  .search-label {
    color: ${GOLD};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 10px;
    display: block;
  }

  .search-box {
    display: flex;
    gap: 10px;
    align-items: stretch;
  }

  .search-input {
    flex: 1;
    background: rgba(255,255,255,0.08);
    border: 1.5px solid rgba(255,255,255,0.15);
    border-radius: 14px;
    padding: 14px 16px;
    color: white;
    font-family: 'Baloo 2', sans-serif;
    font-size: 15px;
    outline: none;
    transition: all 0.2s;
  }
  .search-input::placeholder { color: rgba(255,255,255,0.35); }
  .search-input:focus {
    border-color: ${SAFFRON};
    background: rgba(255,107,0,0.08);
    box-shadow: 0 0 0 3px rgba(255,107,0,0.15);
  }

  .search-btn {
    background: linear-gradient(135deg, ${SAFFRON}, #E85500);
    border: none;
    border-radius: 14px;
    padding: 14px 18px;
    color: white;
    font-family: 'Baloo 2', sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    box-shadow: 0 4px 16px rgba(255,107,0,0.4);
    letter-spacing: 0.5px;
  }
  .search-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255,107,0,0.5); }
  .search-btn:active { transform: translateY(0); }
  .search-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .quick-chips {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 12px;
  }
  .chip {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: 5px 12px;
    color: rgba(255,255,255,0.6);
    font-size: 11px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Baloo 2', sans-serif;
  }
  .chip:hover { background: rgba(255,107,0,0.15); border-color: ${SAFFRON}; color: ${SAFFRON}; }

  .results-area {
    padding: 8px 20px 100px;
    position: relative;
    z-index: 2;
  }

  /* Loading */
  .loading-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 32px 20px;
    text-align: center;
  }
  .spinner {
    width: 44px;
    height: 44px;
    border: 3px solid rgba(255,107,0,0.2);
    border-top-color: ${SAFFRON};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 16px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { color: rgba(255,255,255,0.6); font-size: 14px; }
  .loading-sub { color: rgba(255,255,255,0.35); font-size: 11px; margin-top: 4px; }

  /* Verdict Card */
  .verdict-card {
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 14px;
    position: relative;
    overflow: hidden;
    animation: slideUp 0.4s ease-out;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .verdict-indian {
    background: linear-gradient(135deg, rgba(27,107,58,0.4), rgba(27,107,58,0.15));
    border: 1.5px solid rgba(27,107,58,0.5);
  }
  .verdict-foreign {
    background: linear-gradient(135deg, rgba(255,107,0,0.2), rgba(255,107,0,0.05));
    border: 1.5px solid rgba(255,107,0,0.35);
  }

  .verdict-header {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 14px;
  }
  .verdict-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    flex-shrink: 0;
  }
  .icon-indian { background: rgba(27,107,58,0.3); }
  .icon-foreign { background: rgba(255,107,0,0.2); }

  .verdict-title {
    color: white;
    font-size: 18px;
    font-weight: 800;
    line-height: 1.2;
  }
  .verdict-origin {
    color: rgba(255,255,255,0.55);
    font-size: 12px;
    margin-top: 3px;
  }

  .verdict-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .badge-indian { background: rgba(27,107,58,0.4); color: #4ADE80; border: 1px solid rgba(74,222,128,0.3); }
  .badge-foreign { background: rgba(255,107,0,0.2); color: ${SAFFRON}; border: 1px solid rgba(255,107,0,0.3); }

  .verdict-desc {
    color: rgba(255,255,255,0.75);
    font-size: 13.5px;
    line-height: 1.6;
    font-family: 'Noto Serif', serif;
  }

  /* Section cards */
  .section-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 18px;
    margin-bottom: 14px;
    animation: slideUp 0.4s ease-out;
  }

  .section-title {
    color: ${GOLD};
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(232,160,32,0.2);
  }

  /* Alternative product */
  .alt-product {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 14px;
    background: rgba(27,107,58,0.15);
    border: 1px solid rgba(27,107,58,0.3);
    border-radius: 14px;
    margin-bottom: 12px;
  }
  .alt-icon {
    width: 46px;
    height: 46px;
    background: rgba(27,107,58,0.3);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }
  .alt-name { color: white; font-size: 15px; font-weight: 700; }
  .alt-brand { color: #4ADE80; font-size: 12px; margin-top: 2px; }
  .alt-avail { color: rgba(255,255,255,0.45); font-size: 11px; margin-top: 3px; }

  /* Comparison table */
  .comparison-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .comparison-row:last-child { border-bottom: none; }
  .cmp-aspect {
    color: rgba(255,255,255,0.45);
    font-size: 11px;
    width: 80px;
    flex-shrink: 0;
    padding-top: 2px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .cmp-vals { flex: 1; display: flex; gap: 8px; }
  .cmp-val {
    flex: 1;
    padding: 8px 10px;
    border-radius: 10px;
    font-size: 12px;
    line-height: 1.4;
  }
  .cmp-foreign { background: rgba(255,107,0,0.1); color: rgba(255,255,255,0.65); border: 1px solid rgba(255,107,0,0.15); }
  .cmp-indian { background: rgba(27,107,58,0.2); color: rgba(255,255,255,0.8); border: 1px solid rgba(27,107,58,0.25); }
  .cmp-label { font-size: 10px; font-weight: 700; margin-bottom: 3px; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.5px; }

  /* Insights */
  .insight-item {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    animation: slideUp 0.4s ease-out;
  }
  .insight-item:last-child { border-bottom: none; }
  .insight-num {
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, ${SAFFRON}, #E85500);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: 800;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .insight-text { color: rgba(255,255,255,0.7); font-size: 13px; line-height: 1.6; font-family: 'Noto Serif', serif; }
  .insight-text strong { color: white; font-family: 'Baloo 2', sans-serif; }

  /* GDP impact bar */
  .impact-bar-wrap { margin-top: 10px; }
  .impact-bar-label { display: flex; justify-content: space-between; color: rgba(255,255,255,0.5); font-size: 11px; margin-bottom: 6px; }
  .impact-bar-track { background: rgba(255,255,255,0.08); border-radius: 99px; height: 8px; overflow: hidden; }
  .impact-bar-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, ${GREEN}, #4ADE80); transition: width 1s ease-out; }

  /* Empty state */
  .empty-state {
    text-align: center;
    padding: 48px 20px;
    color: rgba(255,255,255,0.25);
  }
  .empty-icon { font-size: 56px; margin-bottom: 16px; opacity: 0.4; }
  .empty-text { font-size: 15px; line-height: 1.6; }

  /* Bottom nav hint */
  .bottom-hint {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 430px;
    background: linear-gradient(to top, ${NAVY} 70%, transparent);
    padding: 16px 20px 24px;
    text-align: center;
    z-index: 10;
  }
  .bottom-bar {
    width: 40px;
    height: 4px;
    background: rgba(255,255,255,0.15);
    border-radius: 99px;
    margin: 0 auto;
  }

  /* Tricolor divider */
  .tricolor-line {
    display: flex;
    height: 3px;
    border-radius: 99px;
    overflow: hidden;
    margin: 6px 0 16px;
  }
  .tricolor-line div { flex: 1; }
  .tc-s { background: ${SAFFRON}; }
  .tc-w { background: white; }
  .tc-g { background: ${GREEN}; }

  .error-card {
    background: rgba(255,50,50,0.1);
    border: 1px solid rgba(255,50,50,0.25);
    border-radius: 16px;
    padding: 16px;
    color: rgba(255,255,255,0.7);
    font-size: 13px;
    text-align: center;
  }

  .make-in-india-stamp {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(27,107,58,0.2);
    border: 1.5px solid rgba(27,107,58,0.4);
    border-radius: 8px;
    padding: 4px 10px;
    color: #4ADE80;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-top: 10px;
  }
`;

const QUICK_EXAMPLES = ["iPhone", "Amul Butter", "Samsung TV", "Maggi", "Tata Tea", "Nike Shoes"];

const SYSTEM_PROMPT = `You are an expert on Indian manufacturing, the Make in India initiative, and the Atmanirbhar Bharat policy. When given a product name, you will:

1. Determine if the product is made in India or is a foreign brand/product.
2. If foreign, suggest the BEST Indian-made alternative available in India.
3. Provide a structured comparison.
4. Give insights on how buying Indian helps India's economy.

ALWAYS respond ONLY with a valid JSON object. No markdown, no preamble. Use this exact structure:

{
  "product": "Exact product name the user asked about",
  "isIndian": true or false,
  "originCountry": "Country of origin",
  "originDetails": "2-3 sentences about the product's manufacturing origin, market presence in India, and any Indian operations",
  "indianAlternative": {
    "name": "Product name",
    "brand": "Brand name",
    "emoji": "A single relevant emoji",
    "availability": "Where available in India (e.g., pan-India in D-Mart, Amazon.in, general retail)",
    "priceRange": "Approximate price range in INR"
  },
  "comparison": [
    { "aspect": "Price", "foreign": "value", "indian": "value" },
    { "aspect": "Quality", "foreign": "value", "indian": "value" },
    { "aspect": "Support", "foreign": "value", "indian": "value" },
    { "aspect": "Jobs", "foreign": "value", "indian": "value" },
    { "aspect": "Ecosystem", "foreign": "value", "indian": "value" }
  ],
  "economicInsights": [
    { "title": "Short title", "detail": "1-2 sentence insight on economic benefit of buying Indian" },
    { "title": "Short title", "detail": "1-2 sentence insight" },
    { "title": "Short title", "detail": "1-2 sentence insight" }
  ],
  "gdpImpactScore": a number between 10 and 95 representing the relative positive GDP impact of switching to Indian alternative,
  "makeInIndiaRating": "HIGH / MEDIUM / LOW" (how strongly you recommend the Indian alternative)
}

If the product IS already Indian, set indianAlternative to null and comparison to [], and focus economicInsights on how the product already contributes to India's economy.`;

export default function App() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [gdpBarWidth, setGdpBarWidth] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (result?.gdpImpactScore) {
      setTimeout(() => setGdpBarWidth(result.gdpImpactScore), 400);
    }
  }, [result]);

  const analyze = async (productName) => {
    const q = (productName || query).trim();
    if (!q) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setGdpBarWidth(0);

    try {
      
      setResult(parsed);
    } catch (e) {
      setError("Could not analyze this product. Please try again.");
    } finally {const res = await fetch("/api/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ product: q })
});
const parsed = await res.json();
      setLoading(false);
    }
  };

  const handleChip = (label) => {
    setQuery(label);
    analyze(label);
  };

  return (
    <div className="app">
      <style>{styles}</style>

      {/* Ashoka wheel background */}
      <svg className="ashoka-bg" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="95" stroke="white" strokeWidth="4"/>
        <circle cx="100" cy="100" r="12" fill="white"/>
        {Array.from({length: 24}).map((_, i) => {
          const angle = (i * 15) * Math.PI / 180;
          const x1 = 100 + 12 * Math.cos(angle);
          const y1 = 100 + 12 * Math.sin(angle);
          const x2 = 100 + 90 * Math.cos(angle);
          const y2 = 100 + 90 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="2"/>;
        })}
      </svg>

      {/* Header */}
      <div className="header">
        <div className="header-top">
          <div className="flag-strip">
            <div className="s"/>
            <div className="w"/>
            <div className="g"/>
          </div>
          <div>
            <h1>Bharat<span>Check</span></h1>
          </div>
        </div>
        <div className="header-sub">Is it Made in India? Find out instantly.</div>
      </div>

      {/* Search */}
      <div className="search-section">
        <span className="search-label">🔍 Enter any product</span>
        <div className="search-box">
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="e.g. Colgate, iPhone, Amul..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && analyze()}
          />
          <button
            className="search-btn"
            onClick={() => analyze()}
            disabled={loading || !query.trim()}
          >
            Analyze →
          </button>
        </div>
        <div className="quick-chips">
          {QUICK_EXAMPLES.map(ex => (
            <div key={ex} className="chip" onClick={() => handleChip(ex)}>{ex}</div>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="results-area">
        {loading && (
          <div className="loading-card">
            <div className="spinner"/>
            <div className="loading-text">Analyzing product origin...</div>
            <div className="loading-sub">Checking Make in India database</div>
          </div>
        )}

        {error && <div className="error-card">⚠️ {error}</div>}

        {result && !loading && (
          <>
            {/* Verdict */}
            <div className={`verdict-card ${result.isIndian ? "verdict-indian" : "verdict-foreign"}`}>
              <div className="verdict-header">
                <div className={`verdict-icon ${result.isIndian ? "icon-indian" : "icon-foreign"}`}>
                  {result.isIndian ? "🇮🇳" : "🌏"}
                </div>
                <div>
                  <div className="verdict-title">{result.product}</div>
                  <div className="verdict-origin">Origin: {result.originCountry}</div>
                </div>
              </div>
              <div className={`verdict-badge ${result.isIndian ? "badge-indian" : "badge-foreign"}`}>
                {result.isIndian ? "✓ Made in India" : "✕ Foreign Product"}
              </div>
              <div className="verdict-desc">{result.originDetails}</div>
              {result.isIndian && (
                <div className="make-in-india-stamp">🏭 Supports Atmanirbhar Bharat</div>
              )}
            </div>

            {/* Indian Alternative */}
            {result.indianAlternative && (
              <div className="section-card">
                <div className="section-title">🇮🇳 Indian Alternative</div>
                <div className="alt-product">
                  <div className="alt-icon">{result.indianAlternative.emoji}</div>
                  <div>
                    <div className="alt-name">{result.indianAlternative.name}</div>
                    <div className="alt-brand">{result.indianAlternative.brand}</div>
                    <div className="alt-avail">📍 {result.indianAlternative.availability}</div>
                    <div className="alt-avail">💰 {result.indianAlternative.priceRange}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Comparison */}
            {result.comparison && result.comparison.length > 0 && (
              <div className="section-card">
                <div className="section-title">⚖️ Comparison</div>
                {result.comparison.map((row, i) => (
                  <div className="comparison-row" key={i}>
                    <div className="cmp-aspect">{row.aspect}</div>
                    <div className="cmp-vals">
                      <div className="cmp-val cmp-foreign">
                        <div className="cmp-label">Foreign</div>
                        {row.foreign}
                      </div>
                      <div className="cmp-val cmp-indian">
                        <div className="cmp-label">Indian 🇮🇳</div>
                        {row.indian}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* GDP Impact */}
            {result.gdpImpactScore && (
              <div className="section-card">
                <div className="section-title">📈 GDP Impact Score</div>
                <div className="impact-bar-wrap">
                  <div className="impact-bar-label">
                    <span>Low Impact</span>
                    <span style={{color: "#4ADE80", fontWeight: 700}}>{result.gdpImpactScore}/100</span>
                    <span>High Impact</span>
                  </div>
                  <div className="impact-bar-track">
                    <div className="impact-bar-fill" style={{width: `${gdpBarWidth}%`}}/>
                  </div>
                </div>
                <div style={{color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 8}}>
                  Estimated positive impact on India's GDP if consumers switch to Indian alternative
                </div>
              </div>
            )}

            {/* Economic Insights */}
            {result.economicInsights && result.economicInsights.length > 0 && (
              <div className="section-card">
                <div className="section-title">💡 Why Buy Indian</div>
                <div className="tricolor-line">
                  <div className="tc-s"/><div className="tc-w"/><div className="tc-g"/>
                </div>
                {result.economicInsights.map((ins, i) => (
                  <div className="insight-item" key={i}>
                    <div className="insight-num">{i + 1}</div>
                    <div className="insight-text">
                      <strong>{ins.title}: </strong>{ins.detail}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Make in India rating */}
            {result.makeInIndiaRating && result.indianAlternative && (
              <div className="section-card" style={{textAlign: "center", padding: "20px"}}>
                <div style={{color: "rgba(255,255,255,0.45)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10}}>
                  Switch to Indian — Recommendation
                </div>
                <div style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: result.makeInIndiaRating === "HIGH" ? "#4ADE80" : result.makeInIndiaRating === "MEDIUM" ? GOLD : SAFFRON
                }}>
                  {result.makeInIndiaRating === "HIGH" ? "🌟 Highly Recommended" : result.makeInIndiaRating === "MEDIUM" ? "👍 Recommended" : "🤔 Consider Switching"}
                </div>
                <div style={{color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 8}}>
                  Jai Hind 🇮🇳 — Every rupee spent on Indian goods strengthens the nation
                </div>
              </div>
            )}
          </>
        )}

        {!loading && !result && !error && (
          <div className="empty-state">
            <div className="empty-icon">🏭</div>
            <div className="empty-text">
              Search any product to discover if it's made in India — and find the best desi alternative if it's not.
            </div>
            <div style={{marginTop: 16, color: "rgba(255,255,255,0.15)", fontSize: 12, letterSpacing: 2}}>
              VOCAL FOR LOCAL
            </div>
          </div>
        )}
      </div>

      <div className="bottom-hint">
        <div className="bottom-bar"/>
      </div>
    </div>
  );
}
