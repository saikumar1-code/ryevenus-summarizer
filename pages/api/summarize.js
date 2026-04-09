import { summarize } from "../../lib/summarize";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'text' field." });
  }

  const trimmed = text.trim();
  const wordCount = trimmed.split(/\s+/).length;

  if (wordCount < 30) {
    return res.status(400).json({
      error: "Text too short. Please provide at least 30 words for summarization.",
    });
  }

  if (trimmed.length > 5000) {
    return res.status(400).json({
      error: "Text too long. Maximum 5000 characters allowed.",
    });
  }

  const token = process.env.HF_API_TOKEN || "";

  try {
    const result = await summarize(trimmed, token);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Summarize API error:", err);
    return res.status(500).json({
      error: "Summarization failed. Please try again.",
      details: err.message,
    });
  }
}
