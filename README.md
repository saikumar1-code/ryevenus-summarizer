# 🌍 Ryevenus Summarizer

> **Multilingual AI text summarization powered by Google's mT5 transformer model**

🌐 **Live Demo:** ryevenus-summarizer.vercel.app

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Click%20Here-green?style=for-the-badge)](https://ryevenus-summarizer.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-13.5-black?logo=next.js)](https://nextjs.org/)
[![HuggingFace](https://img.shields.io/badge/🤗-HuggingFace-yellow)](https://huggingface.co/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [AI Model & Architecture](#ai-model--architecture)
5. [Project Structure](#project-structure)
6. [Local Setup](#local-setup)
7. [Deployment on Vercel](#deployment-on-vercel)
8. [API Reference](#api-reference)
9. [Common Errors & Fixes](#common-errors--fixes)
10. [

---

## Project Overview

**Ryevenus Summarizer** is a production-ready web application that uses transformer-based NLP (Natural Language Processing) to generate concise summaries of long texts in 100+ languages.

It leverages:
- **Google's mT5** (multilingual Text-to-Text Transfer Transformer) for abstractive summarization
- **HuggingFace Inference API** to run the model without bundling 300MB+ weights into the app
- **Next.js** for full-stack development (frontend + serverless backend in one codebase)
- **Vercel** for zero-configuration deployment

---

## Features

- ✅ **Multilingual** — supports English, Hindi, Arabic, French, Spanish, Chinese, and 100+ more
- ✅ **Abstractive summarization** — generates new sentences, not just extracts existing ones
- ✅ **Fallback chain** — mT5 → DistilBART → local extractive summarizer
- ✅ **No login required** — completely free to use
- ✅ **Responsive UI** — works perfectly on mobile, tablet, and desktop
- ✅ **Copy to clipboard** — one-click summary copying
- ✅ **Compression stats** — shows how much the text was compressed
- ✅ **Processing time** — displays inference duration

---

## Tech Stack

| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| Frontend    | Next.js 13 (React 18), CSS-in-JS (styled-jsx) |
| Backend     | Next.js API Routes (Serverless Functions)     |
| AI Model    | mT5 / DistilBART via HuggingFace Inference API|
| Tokenizer   | SentencePiece (used by mT5 internally)        |
| Fonts       | Syne (display) + DM Sans (body) — Google Fonts|
| Deployment  | Vercel (free tier compatible)                 |
| Version Ctrl| Git + GitHub                                  |

---

## AI Model & Architecture

### What is mT5?

**mT5 (multilingual T5)** is a multilingual variant of Google's T5 model, trained on the **mC4 dataset** (multilingual Common Crawl) covering 101 languages.

```
Architecture: Encoder-Decoder Transformer
Parameters  : mT5-small = 300M, mT5-base = 580M, mT5-large = 1.2B
Training    : Unsupervised span masking on mC4 corpus
Fine-tuning : csebuetnlp fine-tuned on XL-Sum (44 languages, BBC articles)
Tokenizer   : SentencePiece (unigram language model, 250K vocabulary)
```

### How Tokenization Works

```
Input:  "Artificial intelligence is transforming the world."
         ↓ SentencePiece tokenization
Tokens: ["▁Artificial", "▁intelligence", "▁is", "▁transform", "ing", "▁the", "▁world", "."]
IDs:    [  3891,          12847,            33,    1474,          195,  8,      296,       3 ]
         ↓ Transformer encoding (12 attention layers)
Encoded: [768-dim vector per token]
         ↓ Decoder with beam search
Output tokens: ["▁The", "▁study", "▁of", "▁AI", "▁is", "▁changing", "▁society", "."]
         ↓ Detokenize
Summary: "The study of AI is changing society."
```

### Training vs Fine-tuning vs Inference

| Phase      | What happens                        | Who does it         | When                |
|------------|-------------------------------------|---------------------|---------------------|
| Pre-training | Model learns language from mC4   | Google (done)       | Months on TPUs      |
| Fine-tuning | Model adapts to summarization task | csebuetnlp (done)   | Days on GPUs        |
| **Inference** | **Model generates summaries**   | **Us (via HF API)** | **Milliseconds**    |

> **We are only doing inference.** The model is already trained and fine-tuned by Google/researchers.

### Datasets

- **mC4** — 101-language web crawl used for mT5 pre-training (6.3TB)
- **XL-Sum** — 1.35M article-summary pairs from BBC in 44 languages (fine-tuning)
- **CNN/DailyMail** — 300K English news articles (used for DistilBART fallback)

---

## Project Structure

```
ryevenus-summarizer/
│
├── pages/                   # Next.js pages (file-based routing)
│   ├── _app.js              # App wrapper (global CSS)
│   ├── _document.js         # Custom HTML document (fonts, meta)
│   ├── index.js             # Main page (/)
│   └── api/
│       └── summarize.js     # POST /api/summarize (serverless function)
│
├── components/              # Reusable React components
│   ├── Header.js            # Hero header with language pills
│   ├── SummarizerForm.js    # Text input + language selector + submit
│   ├── LoadingSpinner.js    # Animated AI loading indicator
│   ├── ResultCard.js        # Summary display + copy button + stats
│   └── Footer.js            # Tech stack footer
│
├── styles/
│   └── globals.css          # CSS reset + base styles
│
├── utils/
│   └── summarize.js         # Core AI logic: HF API calls + fallbacks
│
├── public/
│   └── favicon.ico          # App icon
│
├── .env.local.example       # Environment variable template
├── .gitignore               # Files excluded from Git
├── .eslintrc.json           # ESLint configuration
├── next.config.js           # Next.js configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

---

## Local Setup

### Prerequisites

- Node.js 18+ ([download](https://nodejs.org/))
- npm or yarn
- Git

### Step 1 — Clone / Create Project

```bash
# Option A: If you have the zip, extract it and navigate in
cd ryevenus-summarizer

# Option B: Create fresh Next.js project
npx create-next-app@13.5.6 ryevenus-summarizer --no-typescript --no-tailwind --no-app-router
cd ryevenus-summarizer
```

### Step 2 — Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3 — Set Up Environment Variables

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local and add your HuggingFace token (optional but recommended)
# Get a free token at: https://huggingface.co/settings/tokens
nano .env.local
```

### Step 4 — Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. ✅

### Step 5 — Test the API

```bash
# Using curl
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{"text": "Your long text here (at least 50 characters)...", "language": "en"}'

# Expected response:
# {
#   "success": true,
#   "summary": "...",
#   "metadata": { "model": "...", "processingTimeMs": 1200, ... }
# }
```

---

## Deployment on Vercel

### Step 1 — Push to GitHub

```bash
# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "🚀 Initial commit: Ryevenus Summarizer"

# Create repo on GitHub (go to github.com/new)
# Then connect it:
git remote add origin https://github.com/YOUR_USERNAME/ryevenus-summarizer.git
git branch -M main
git push -u origin main
```

### Step 2 — Import on Vercel

1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. Click **"Add New Project"**
3. Click **"Import"** next to your `ryevenus-summarizer` repo
4. Keep all default settings (Framework: **Next.js** auto-detected)

### Step 3 — Add Environment Variables on Vercel

1. In the Vercel project settings, go to **Settings → Environment Variables**
2. Add: `HF_API_TOKEN` = `your_token_here`
3. Set for: **Production**, **Preview**, **Development**

### Step 4 — Deploy

Click **Deploy**. Vercel will:
1. Clone your GitHub repo
2. Run `npm install`
3. Run `npm run build`
4. Deploy to a `.vercel.app` URL

Your app will be live at: `https://ryevenus-summarizer.vercel.app` 🎉

### Step 5 — Auto-Deploys

Every `git push` to `main` will automatically trigger a new deployment on Vercel.

```bash
git add .
git commit -m "✨ Update UI"
git push origin main
# Vercel auto-deploys in ~60 seconds
```

---

## API Reference

### `POST /api/summarize`

Summarizes the provided text using the mT5 model.

**Request Body:**
```json
{
  "text": "Your long text to summarize (50-10000 characters)",
  "language": "en"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "summary": "The generated summary text.",
  "metadata": {
    "model": "csebuetnlp/mT5_multilingual_XLSum",
    "source": "HuggingFace Inference API",
    "inputLength": 1240,
    "outputLength": 142,
    "processingTimeMs": 2340,
    "language": "en",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Text is too short. Please enter at least 50 characters."
}
```

---

## Common Errors & Fixes

### 1. `Module not found: Can't resolve 'X'`
**Why:** A package is imported but not installed.
**Fix:**
```bash
npm install         # Re-install all dependencies
npm install axios   # Install specific missing package
```

### 2. `Build Failed — page has no default export`
**Why:** A page file is missing `export default function`.
**Fix:** Ensure every file in `pages/` has a default export.

### 3. `Serverless Function Timeout (504)`
**Why:** HuggingFace model is cold-starting (first request takes ~20s). Vercel free tier = 10s max.
**Fix:**
- The app automatically falls back to DistilBART → local summarizer
- Add `wait_for_model: false` to skip waiting and return error faster
- Upgrade to Vercel Pro for 60s timeout limit

### 4. `Large model not supported — function too large`
**Why:** You tried to import the model weights directly (transformers.js, etc.).
**Fix:** Never import model weights in the app. Use HuggingFace Inference API (external HTTP call). Our architecture already does this correctly.

### 5. `API route returns 404`
**Why:** File is not in `pages/api/` or has incorrect export.
**Fix:** Verify the file is at `pages/api/summarize.js` with `export default function handler`.

### 6. `HuggingFace API 503 — Model is loading`
**Why:** Free HF models go to sleep and take ~30s to wake up.
**Fix:** The code has `wait_for_model: true` which auto-waits. On first cold start, expect 20-30s delay.

### 7. `CORS error in browser`
**Why:** Calling HuggingFace API directly from browser (you should NOT do this).
**Fix:** Only call from the server-side API route (`pages/api/`). Our architecture is already correct.

### 8. `Environment variable not found`
**Why:** `.env.local` exists locally but not on Vercel.
**Fix:** Add environment variables in Vercel dashboard → Settings → Environment Variables.

---



## License

MIT License — free to use, modify, and distribute.

---

*Built with ❤️ using Next.js + mT5 + HuggingFace*
