# 🍐 Pear Media — AI Text & Image Generation Studio

A full-stack web application that integrates multiple AI APIs to perform **text enhancement** and **image generation** workflows. Built with the **MERN stack** using **MVC architecture**.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Express](https://img.shields.io/badge/Express-4-green) ![MongoDB](https://img.shields.io/badge/MongoDB-8-darkgreen) ![Node.js](https://img.shields.io/badge/Node.js-18+-green)

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [API Integrations](#-api-integrations)
- [Project Structure](#-project-structure)
- [Setup & Installation](#-setup--installation)
- [API Keys Setup](#-api-keys-setup)
- [Running the Application](#-running-the-application)
- [Deployment](#-deployment)
- [Workflow Screenshots](#-workflow-screenshots)

---

## ✨ Features

### Text → Image Workflow
1. **Input**: User enters a text prompt describing the desired image
2. **AI Analysis**: Google Gemini analyzes tone, intent, themes, and suggests improvements
3. **Prompt Enhancement**: AI generates an optimized prompt for image generation
4. **User Approval**: User reviews, edits, and approves the enhanced prompt
5. **Image Generation**: Stable Diffusion XL generates the image from the approved prompt
6. **Download**: User can download the generated image

### Image → Variations Workflow
1. **Upload**: User uploads an image (drag & drop or file picker, up to 10MB)
2. **AI Analysis**: Google Gemini Vision detects objects, theme, mood, style, colors, and composition
3. **Variation Prompts**: AI generates 3 unique variation prompts based on the analysis
4. **Generation**: Stable Diffusion XL generates creative variations of the original image
5. **Download**: User can download each variation individually

---

## 🏗 Architecture

```
MVC Architecture
├── Models      → MongoDB schemas (Generation history)
├── Views       → React frontend (SPA)
├── Controllers → Express request handlers
├── Services    → API integration business logic
└── Routes      → Express route definitions
```

---

## 🛠 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS 3      |
| Backend    | Node.js, Express.js 4               |
| Database   | MongoDB with Mongoose               |
| APIs       | Google Gemini 2.0, Hugging Face     |
| AI Models  | Gemini Flash, Stable Diffusion XL   |

---

## 🔗 API Integrations

| API                   | Purpose                                    | Type       |
|-----------------------|--------------------------------------------|------------|
| **Google Gemini 2.0** | Text analysis, prompt enhancement, image analysis (vision) | Free Tier |
| **Hugging Face**      | Image generation via Stable Diffusion XL   | Free Tier  |

### How APIs are Used

- **Google Gemini** (`gemini-2.0-flash`):
  - Analyzes text prompts for tone, intent, and themes
  - Enhances prompts for optimal image generation
  - Analyzes uploaded images using vision capabilities (objects, mood, style, colors)
  - Generates variation prompts from image analysis

- **Hugging Face Inference API** (`stabilityai/stable-diffusion-xl-base-1.0`):
  - Generates images from text prompts
  - Creates image variations from AI-generated prompts

---

## 📁 Project Structure

```
pear-media/
├── backend/                    # Express.js Backend (MVC)
│   ├── config/
│   │   └── config.js           # Environment configuration
│   ├── controllers/
│   │   ├── textController.js   # Text workflow handlers
│   │   └── imageController.js  # Image workflow handlers
│   ├── models/
│   │   └── Generation.js       # MongoDB schema
│   ├── routes/
│   │   ├── textRoutes.js       # Text API routes
│   │   └── imageRoutes.js      # Image API routes
│   ├── services/
│   │   ├── geminiService.js    # Google Gemini integration
│   │   └── huggingfaceService.js # Hugging Face integration
│   ├── .env.example            # Environment template
│   ├── server.js               # Entry point
│   └── package.json
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── StepIndicator.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── TextWorkflow.jsx
│   │   │   └── ImageWorkflow.jsx
│   │   ├── services/
│   │   │   └── api.js          # Axios API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (optional — app runs without it)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/pear-media.git
cd pear-media
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your API keys (see next section).

---

## 🔑 API Keys Setup

### Google Gemini API (Free)

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Gmail account
3. Click **"Create API Key"**
4. Copy the key and paste into `GEMINI_API_KEY` in `.env`

### Hugging Face API (Free)

1. Go to [Hugging Face](https://huggingface.co/join)
2. Create an account
3. Go to [Settings → Access Tokens](https://huggingface.co/settings/tokens)
4. Create a new token with **Read** access
5. Copy the token and paste into `HUGGINGFACE_API_KEY` in `.env`

### Final `.env` File

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pear-media
GEMINI_API_KEY=AIzaSy...your-key
HUGGINGFACE_API_KEY=hf_...your-token
```

---

## ▶️ Running the Application

### Development Mode

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
Server starts at `http://localhost:5000`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Frontend starts at `http://localhost:3000` (proxied to backend)

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Start backend (serves frontend)
cd ../backend
NODE_ENV=production npm start
```

Access at `http://localhost:5000`

---

## 🌐 Deployment

### Deploy to Render (Recommended)

1. Push code to GitHub
2. Go to [Render](https://render.com) and create a **Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Build Command**: `cd frontend && npm install && npm run build && cd ../backend && npm install`
   - **Start Command**: `cd backend && node server.js`
   - **Environment Variables**: Add `GEMINI_API_KEY`, `HUGGINGFACE_API_KEY`, `NODE_ENV=production`

### Deploy to Vercel (Frontend) + Render (Backend)

1. Deploy frontend to Vercel with `VITE_API_URL` pointing to your backend URL
2. Deploy backend to Render as a web service

---

## 🖼 Workflow Screenshots

### Home Page
- Clean landing page with two workflow cards
- Powered-by section showing integrated technologies

### Text → Image Workflow
- Step 1: Enter text prompt
- Step 2: View AI analysis (tone, intent, themes) + enhanced prompt with edit capability
- Step 3: View and download generated image

### Image Variations Workflow
- Step 1: Upload image via drag & drop or file picker
- Step 2: View AI analysis (objects, theme, mood, style, colors, composition)
- Step 3: View and download generated variations

---

## 📝 API Endpoints

| Method | Endpoint              | Description                     |
|--------|-----------------------|---------------------------------|
| GET    | `/api/health`         | Health check                    |
| POST   | `/api/text/analyze`   | Analyze and enhance text prompt |
| POST   | `/api/text/generate`  | Generate image from prompt      |
| POST   | `/api/image/analyze`  | Analyze uploaded image          |
| POST   | `/api/image/variations` | Generate image variations     |

---

## 📄 License

MIT License — Built for Pear Media Assignment
