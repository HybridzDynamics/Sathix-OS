# SathiX OS — Multilingual Language Engine

Independent multilingual NLP and translation service for Indian languages and international languages, featuring AI4Bharat **IndicTrans2** integration.

---

## 🏗 System Architecture

```text
SathiX Backend
      ↓
Language Engine API (Port 4001)
  ├── Language Detection
  ├── Translation (IndicTrans2 Provider)
  ├── Transliteration & Normalization
  ├── Government Terminology Engine
  ├── Multilingual Embeddings
  └── Summarization
      ↓
Python ML Inference Service (Port 8001 / FastAPI)
```

---

## 📂 Folder Structure

```text
language-engine/
├── api/
│   ├── routes/
│   │   ├── translate.route.js
│   │   ├── detect.route.js
│   │   ├── transliterate.route.js
│   │   ├── summarize.route.js
│   │   ├── language.route.js
│   │   ├── embeddings.route.js
│   │   └── health.route.js
│   ├── controllers/
│   └── index.js
├── services/
│   ├── translation/
│   ├── detection/
│   ├── transliteration/
│   ├── normalization/
│   ├── terminology/
│   ├── summarization/
│   └── embeddings/
├── models/
│   ├── indictrans2/
│   ├── registry/
│   └── configuration/
├── python/
│   ├── translation/
│   │   ├── indictrans2/
│   │   └── inference/
│   ├── detection/
│   ├── embeddings/
│   ├── summarization/
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── datasets/
│   ├── raw/
│   ├── processed/
│   ├── terminology/
│   └── evaluation/
├── training/
│   ├── preprocessing/
│   ├── fine_tuning/
│   ├── configs/
│   ├── checkpoints/
│   ├── export/
│   └── colab/
├── evaluation/
│   ├── translation/
│   ├── detection/
│   ├── transliteration/
│   └── reports/
├── config/
├── middleware/
├── utils/
├── tests/
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── package.json
```

---

## 🚀 Getting Started

### 1. Node.js API Service
```bash
npm install
npm run dev
# Server running at http://localhost:4001
```

### 2. Python ML Service
```bash
cd python
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

---

## 🧪 Testing

```bash
npm test
```
