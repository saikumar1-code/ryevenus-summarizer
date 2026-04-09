# Ryevenus Summarizer

> Multilingual AI text summarization powered by HuggingFace transformer models — built with Next.js and deployable on Vercel Free Tier.

---

## Features

- **Multilingual** — works with English, Spanish, French, German, Chinese, Arabic, Hindi, Russian, and more
- **Dual-mode inference** — HuggingFace API (with token) or built-in extractive mock (no token needed)
- **Models used**
  - English: `sshleifer/distilbart-cnn-12-6`
  - Multilingual: `csebuetnlp/mT5_multilingual_XLSum`
- **Stats panel** — compression ratio, word/char/sentence counts
- **Copy to clipboard** — one click
- **Responsive** — mobile-friendly editorial design
- **No auth required**

---

## Run Locally

```bash
# 1. Clone / unzip the project
cd ryevenus-summarizer

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local and add your HuggingFace token (optional — app works without it in demo mode)

# 4. Start dev server
npm run dev

# Open http://localhost:3000
```

---

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — Ryevenus Summarizer"
git remote add origin https://github.com/YOUR_USERNAME/ryevenus-summarizer.git
git push -u origin main
```

---

## Deploy on Vercel

```bash
# Option A — Vercel CLI
npm i -g vercel
vercel

# Option B — GitHub integration
# 1. Push to GitHub (above)
# 2. Go to https://vercel.com/new
# 3. Import your repository
# 4. Add environment variable: HF_API_TOKEN = your_token
# 5. Click Deploy
```

> Without `HF_API_TOKEN`, the app runs in demo mode (extractive summarization). Add your free token from https://huggingface.co/settings/tokens for full AI inference.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `HF_API_TOKEN` | Optional | HuggingFace Inference API token. Get free at [huggingface.co](https://huggingface.co/settings/tokens) |

---

## Project Structure

```
ryevenus-summarizer/
├── components/
│   └── SummaryResult.js      # Result display component
├── lib/
│   └── summarize.js          # Core summarization logic + mock fallback
├── pages/
│   ├── _app.js
│   ├── _document.js
│   ├── index.js              # Main UI
│   └── api/
│       └── summarize.js      # API route
├── public/
│   └── favicon.svg
├── styles/
│   └── globals.css           # Full design system
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── vercel.json
└── README.md
```

---

## License

MIT
