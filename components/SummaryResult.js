import { useState } from "react";

export default function SummaryResult({ result }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      // fallback
      const el = document.createElement("textarea");
      el.value = result.summary;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="result-section">
      {result.error && (
        <div className="error-box" style={{ marginBottom: 16 }}>
          ⚠ {result.error}
        </div>
      )}

      <div className="result-header">
        <span className="result-label">Summary</span>
        <div className="result-rule" />
      </div>

      <div className="result-text">{result.summary}</div>

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-val">{result.wordCount}</span>
          <span className="stat-key">Words In</span>
        </div>
        <div className="stat-item">
          <span className="stat-val">{result.charCount}</span>
          <span className="stat-key">Characters</span>
        </div>
        <div className="stat-item">
          <span className="stat-val">{result.sentenceCount}</span>
          <span className="stat-key">Sentences</span>
        </div>
        <div className="stat-item">
          <span className="stat-val">{result.compressionRatio}%</span>
          <span className="stat-key">Compressed</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div className="model-pill">
          <span className={`model-dot${result.isMock ? " mock" : ""}`} />
          {result.isMock ? "Extractive (demo mode)" : result.model}
        </div>

        <button className={`btn-copy${copied ? " copied" : ""}`} onClick={handleCopy}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
