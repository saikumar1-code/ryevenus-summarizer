import { useState, useCallback } from "react";
import Head from "next/head";
import SummaryResult from "../components/SummaryResult";

const MAX_CHARS = 5000;
const MIN_WORDS = 30;

const LANGUAGES = [
  "English", "Español", "Français", "Deutsch", "中文",
  "日本語", "العربية", "हिन्दी", "Русский", "Português",
];

const SAMPLE_TEXT = `Artificial intelligence has transformed nearly every sector of the modern economy. 
From healthcare diagnostics that detect diseases earlier than ever, to autonomous vehicles 
reshaping transportation, to recommendation engines shaping our daily media consumption — AI 
is pervasive. Yet, with this rapid proliferation comes a set of complex challenges. 
Questions around algorithmic bias, data privacy, job displacement, and the concentration 
of technological power in the hands of a few corporations have moved from academic debates 
to urgent policy discussions. Governments worldwide are now grappling with how to regulate 
AI systems in ways that promote innovation while protecting citizens. The European Union's 
AI Act, for instance, represents the first comprehensive attempt at risk-based AI regulation. 
Meanwhile, in the United States, executive orders and voluntary industry commitments are 
being tested against the relentless pace of AI development. Researchers argue that 
transparency, explainability, and robust safety testing must become standard practices. 
The future of AI depends not just on technical breakthroughs but on the governance frameworks 
and ethical norms societies choose to build around them.`;

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const canSubmit = wordCount >= MIN_WORDS && charCount <= MAX_CHARS && !loading;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Summarization failed.");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [text, canSubmit]);

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSample = () => {
    setText(SAMPLE_TEXT.trim());
    setResult(null);
    setError(null);
  };

  const handleClear = () => {
    setText("");
    setResult(null);
    setError(null);
  };

  return (
    <>
      <Head>
        <title>Ryevenus Summarizer</title>
      </Head>

      <div className="page-wrapper">
        {/* ── Header ── */}
        <header className="site-header">
          <div className="logo-eyebrow">AI Summarization Engine</div>
          <h1 className="logo-title">
            Ryevenus <span>Summarizer</span>
          </h1>
          <p className="logo-subtitle">
            Multilingual text condensation powered by transformer models
          </p>
          <div className="header-divider" />
        </header>

        {/* ── Language strip ── */}
        <div className="lang-row">
          {LANGUAGES.map((lang) => (
            <span key={lang} className="lang-badge">{lang}</span>
          ))}
        </div>

        {/* ── Main card ── */}
        <div className="card">
          <div className="form-label">
            Input Text
            <span style={{ display: "flex", gap: 12 }}>
              <button
                onClick={handleSample}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--gold)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  textDecoration: "underline",
                  padding: 0,
                }}
              >
                Load sample
              </button>
            </span>
          </div>

          <textarea
            className="textarea"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setResult(null);
              setError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Paste any article, essay, or document here — in any language…"
            disabled={loading}
            aria-label="Text to summarize"
          />

          <div className="controls-row">
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <span className={`char-counter${charCount > MAX_CHARS ? " over" : ""}`}>
                {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} chars
              </span>
              <span className="char-counter">
                {wordCount} {wordCount === 1 ? "word" : "words"} {wordCount < MIN_WORDS && wordCount > 0 ? `(need ${MIN_WORDS - wordCount} more)` : ""}
              </span>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {text && (
                <button className="btn-clear" onClick={handleClear}>
                  Clear
                </button>
              )}
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={!canSubmit}
                title="Ctrl+Enter to summarize"
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Summarizing…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M4 6h16M4 10h12M4 14h8M4 18h6" />
                    </svg>
                    Summarize
                  </>
                )}
              </button>
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", letterSpacing: "0.06em" }}>
              Tip: Press Ctrl+Enter to summarize quickly
            </span>
          </div>

          {/* ── Error ── */}
          {error && <div className="error-box">{error}</div>}

          {/* ── Result ── */}
          <SummaryResult result={result} />
        </div>

        {/* ── Footer ── */}
        <footer className="site-footer">
          <p>
            Ryevenus Summarizer · Powered by{" "}
            <a href="https://huggingface.co" target="_blank" rel="noopener noreferrer">
              HuggingFace Inference
            </a>{" "}
            · Built with Next.js
          </p>
          <p style={{ marginTop: 6 }}>
            No API token? Runs in demo mode with extractive summarization automatically.
          </p>
        </footer>
      </div>
    </>
  );
}
