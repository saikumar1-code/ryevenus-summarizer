import { HfInference } from "@huggingface/inference";

// Lightweight multilingual summarization model from HuggingFace
// facebook/mbart-large-cc25 is too heavy; we use a distilled approach:
// - Primary: sshleifer/distilbart-cnn-12-6 (English)
// - Multilingual fallback: csebuetnlp/mT5_multilingual_XLSum
const MODELS = {
  en: "sshleifer/distilbart-cnn-12-6",
  multilingual: "csebuetnlp/mT5_multilingual_XLSum",
};

/**
 * Detect rough language from text (heuristic — no heavy lib needed)
 */
export function detectLanguage(text) {
  const latinOnly = /^[\x00-\x7F\s.,!?;:'"()\-]+$/.test(text);
  const hasCyrillic = /[\u0400-\u04FF]/.test(text);
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  const hasCJK = /[\u4E00-\u9FFF\u3040-\u30FF]/.test(text);
  const hasDevanagari = /[\u0900-\u097F]/.test(text);

  if (hasCyrillic || hasArabic || hasCJK || hasDevanagari) return "multilingual";
  if (latinOnly) return "en";
  return "multilingual";
}

/**
 * HuggingFace Inference API call
 */
async function hfSummarize(text, lang, token) {
  const hf = new HfInference(token);
  const model = lang === "en" ? MODELS.en : MODELS.multilingual;

  const wordCount = text.trim().split(/\s+/).length;
  const maxLen = Math.min(Math.max(Math.floor(wordCount * 0.35), 50), 180);
  const minLen = Math.min(Math.max(Math.floor(wordCount * 0.1), 20), 60);

  const result = await hf.summarization({
    model,
    inputs: text,
    parameters: {
      max_length: maxLen,
      min_length: minLen,
      do_sample: false,
    },
  });

  return result.summary_text;
}

/**
 * Mock summarizer — used when no HF token or in demo mode
 * Produces extractive summary (first N sentences + key stats)
 */
export function mockSummarize(text) {
  const sentences = text
    .replace(/([.?!])\s+/g, "$1|")
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  const total = sentences.length;
  const pick = Math.max(2, Math.min(4, Math.floor(total * 0.3)));
  const step = Math.floor(total / pick);

  const selected = [];
  for (let i = 0; i < pick; i++) {
    const idx = Math.min(i * step, total - 1);
    if (sentences[idx]) selected.push(sentences[idx]);
  }

  const wordCount = text.trim().split(/\s+/).length;
  const charCount = text.length;

  return {
    summary: selected.join(" "),
    wordCount,
    charCount,
    sentenceCount: total,
    compressionRatio: Math.round((1 - selected.length / total) * 100),
    model: "extractive-mock",
    isMock: true,
  };
}

/**
 * Main summarize function — tries HF API, falls back to mock
 */
export async function summarize(text, token) {
  const lang = detectLanguage(text);
  const wordCount = text.trim().split(/\s+/).length;
  const charCount = text.length;
  const sentences = text
    .replace(/([.?!])\s+/g, "$1|")
    .split("|")
    .filter((s) => s.trim().length > 10).length;

  if (!token || token === "hf_your_token_here" || token.trim() === "") {
    const mock = mockSummarize(text);
    return mock;
  }

  try {
    const summary = await hfSummarize(text, lang, token);
    const summaryWords = summary.trim().split(/\s+/).length;
    return {
      summary,
      wordCount,
      charCount,
      sentenceCount: sentences,
      compressionRatio: Math.round((1 - summaryWords / wordCount) * 100),
      model: lang === "en" ? MODELS.en : MODELS.multilingual,
      isMock: false,
    };
  } catch (err) {
    console.error("HF API error, falling back to mock:", err.message);
    const mock = mockSummarize(text);
    mock.error = "HF API unavailable — showing extractive summary instead.";
    return mock;
  }
}
