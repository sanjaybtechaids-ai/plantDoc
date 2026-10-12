# 🌿 Plant Doctor — Full-Stack AI Optical Agronomy & Plant Health Platform

**Plant Doctor** is a production-ready, full-stack botanical health application powered by **Next.js 16 (App Router)**, **TypeScript**, **Google Gemini Multimodal Vision API**, and **Supabase (PostgreSQL + Storage + Row Level Security)**.

---

## ✨ Features

- **🔬 AI Optical Agronomy & Disease Detection**: Upload or capture plant foliage photos for instant computer vision pathology, disease classification, and severity estimation.
- **📊 AI-Estimated Health Score**: Dynamic health score (0–100) categorization (*Healthy, Good, Needs Attention, Poor, Critical*).
- **🌿 Integrated Pest Management (IPM)**: Immediate triage actions, natural botanical remedies (neem oil, *Bacillus subtilis*), and chemical treatment categories with safety warnings.
- **🧪 Botanical Nutrition Guidance**: Visual assessment of possible nutrient concerns (*N, P, K, micronutrients*) and organic fertilizer recommendations.
- **🛒 Curated Marketplace**: Curated database of verified agricultural supplies with real purchase links (**no hallucinated URLs**).
- **📈 Longitudinal Daily Surveillance**: Upload sequential check-in photos to track lesion remission, calculate health score deltas, and review daily progress summaries.
- **💬 Multimodal Agronomic Chatbot**: Interactive consultation supporting text questions and image attachments with structured diagnosis cards.
- **🛡️ Secure Backend & RLS**: Server-side Google Gemini SDK and Supabase Service Role credentials. PostgreSQL Row Level Security (RLS) protects user data.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI / Computer Vision**: [Google Gemini Multimodal API](https://ai.google.dev/) (`@google/genai` / `@google/generative-ai`)
- **Database & Storage**: [Supabase](https://supabase.com/) (PostgreSQL & Supabase Storage)
- **Validation**: [Zod](https://zod.dev/)
- **Styling**: Vanilla CSS & Tailwind CSS
- **Icons & Animations**: [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Charts**: [Recharts](https://recharts.org/)

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Asraf-ali123/plantDoc.git
cd plantDoc
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory (refer to `.env.example`):

```env
# Google Gemini API Key (Server-side only)
GEMINI_API_KEY=your_gemini_api_key

# Configurable Gemini Vision Model (e.g. gemini-2.5-flash, gemini-1.5-flash)
GEMINI_MODEL=gemini-2.5-flash

# Supabase URL & Public Anon Key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase Service Role Key (Server-side only)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Database Migration (Supabase)

Run the SQL migration in your Supabase SQL Editor:
```
supabase/migrations/20261012_initial_schema.sql
```
This sets up all tables (`plants`, `plant_diagnoses`, `plant_monitoring`, `monitoring_reminders`, `products`, `conversations`, `messages`), Row Level Security policies, indexes, and initial product seeds.

### 4. Run Development Server

```bash
npm run dev
```

The application will listen on all network interfaces (`0.0.0.0`):
- **Local:** [http://localhost:3000](http://localhost:3000)
- **Network (LAN):** `http://<YOUR-IP>:3000` (Access from phone/tablet on same Wi-Fi)

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check for AI and database connection |
| `POST` | `/api/plants/analyze` | Optical plant diagnosis & triage via Gemini Vision |
| `POST` | `/api/plants/identify` | Botanical taxonomy classification |
| `GET` / `POST` | `/api/plants` | List user plants or register new plant |
| `GET` / `PATCH` / `DELETE` | `/api/plants/[id]` | View, update, or remove plant |
| `GET` | `/api/diagnosis/[id]` | Retrieve past clinical diagnosis |
| `GET` | `/api/monitoring` | List monitoring surveillance logs |
| `GET` | `/api/monitoring/[plantId]` | Longitudinal health timeline |
| `POST` | `/api/monitoring/[plantId]/upload` | Daily follow-up photo upload & comparative analysis |
| `POST` | `/api/monitoring/[plantId]/compare` | Sequential image-to-image comparison |
| `POST` | `/api/monitoring/check` | Schedule daily check-in reminders |
| `POST` | `/api/chat` | Multimodal agronomic chatbot |
| `POST` | `/api/treatments/recommend` | Integrated Pest Management (IPM) guidelines |
| `POST` | `/api/fertilizers/recommend` | Plant nutrition and fertilizer recommendations |
| `GET` | `/api/products/recommendations` | Curated agricultural supplies catalog |

---

## 📄 License

This project is licensed under the MIT License.
