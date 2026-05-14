# 🧠 Candidate Pool System

A **production-ready** smart candidate pool system with AI-powered duplicate detection, ticket management, admin controls, and candidate journey tracking.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

The Candidate Pool System addresses **11 critical gaps** identified in candidate journey flows:

| # | Missing Component | Status |
|---|------------------|--------|
| 1 | Duplicate Handling Interface | ✅ |
| 2 | Ticket Management System | ✅ |
| 3 | Candidate Status Management | ✅ |
| 4 | Data Normalization Visibility | ✅ |
| 5 | Validation Feedback System | ✅ |
| 6 | Partial Match Warning UI | ✅ |
| 7 | Candidate Activity Tracking | ✅ |
| 8 | Candidate Pool Structuring | ✅ |
| 9 | Candidate Sharing Capability | ✅ |
| 10 | Admin Control Interfaces | ✅ |
| 11 | End-State Visibility | ✅ |

---

## ✨ Features

### 🔄 Duplicate Detection & Resolution
- Exact and partial match detection
- Side-by-side profile comparison
- Field-level merge selection
- Admin approval workflow for merges

### 🎫 Ticket Management
- Automatic ticket creation for admin intervention
- Status tracking (Open, In Review, Resolved)
- Approve/Reject/Request Changes actions

### 👤 Candidate Management
- Status tracking (New, Verified, Duplicate, Flagged, Merged, Active)
- Activity timeline with all actions
- Auto + manual tagging system
- Skill-based grouping and segmentation

### 🤖 AI-Powered Features
- Resume parsing (OpenAI, Gemini, Affinda, or spaCy)
- Semantic candidate matching
- Data normalization and scoring
- Chatbot integration (Dialogflow)

### 👨‍💼 Admin Controls
- Merge approval dashboard
- Duplicate review queue
- Full candidate management controls

### 📤 Export & Sharing
- PDF/CSV export
- Email sharing
- Bulk export capabilities

---

## 🛠 Tech Stack

### Frontend
- **React 19** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Firebase** - Backend services

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Firebase** - Database and authentication
- **OpenAI** - AI-powered features
- **Google Generative AI** - AI integration
- **Nodemailer** - Email services
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Input validation
- **Dotenv** - Environment variables

## 📁 Project Structure

```bash
candidate-pool-system/
│
├── frontend/                         # React Frontend
│
│   ├── public/
│   │   └── assets/
│   │       ├── images/
│   │       ├── icons/
│   │       └── logos/
│   │
│   ├── src/
│   │
│   │   ├── components/              # Reusable components
│   │   │
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   ├── Modal/
│   │   │   ├── Spinner/
│   │   │   └── Toast/
│   │   │
│   │   ├── candidate/
│   │   │   ├── CandidateForm/
│   │   │   ├── CandidateList/
│   │   │   ├── CandidateCard/
│   │   │   ├── CandidateProfile/
│   │   │   └── CandidateStatusBadge/
│   │   │
│   │   ├── duplicate/
│   │   │   ├── DuplicateWarning/
│   │   │   ├── DuplicateComparison/
│   │   │   └── MergePreview/
│   │   │
│   │   ├── tickets/
│   │   │   ├── TicketForm/
│   │   │   ├── TicketList/
│   │   │   └── TicketStatus/
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboard/
│   │       └── MergeApproval/
│   │
│   │   ├── pages/                   # Pages
│   │   │   ├── Home/
│   │   │   ├── Candidates/
│   │   │   ├── CandidateDetails/
│   │   │   ├── DuplicateResolution/
│   │   │   ├── Tickets/
│   │   │   └── Admin/
│   │   │
│   │   ├── services/                # API calls
│   │   │   ├── api.js
│   │   │   ├── candidateService.js
│   │   │   ├── duplicateService.js
│   │   │   └── ticketService.js
│   │   │
│   │   ├── hooks/
│   │   │   ├── useCandidates.js
│   │   │   └── useTickets.js
│   │   │
│   │   ├── store/                   # Redux / Context
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   │       ├── candidateSlice.js
│   │   │       ├── duplicateSlice.js
│   │   │       └── ticketSlice.js
│   │   │
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   ├── formatters.js
│   │   │   └── constants.js
│   │   │
│   │   ├── layouts/
│   │   │   ├── MainLayout.tsx
│   │   │   └── AdminLayout.tsx
│   │   │
│   │   ├── styles/
│   │   │   └── globals.css
│   │   │
│   │   ├── App.tsx
│   │   ├── AppRoutes.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── functions/                         # Node.js Backend
│
│   ├── src/
│   │
│   │   ├── controllers/             # Business logic
│   │   │   ├── candidateController.js
│   │   │   ├── duplicateController.js
│   │   │   ├── ticketController.js
│   │   │   └── adminController.js
│   │   │
│   │   ├── routes/                  # API routes
│   │   │   ├── candidateRoutes.js
│   │   │   ├── duplicateRoutes.js
│   │   │   ├── ticketRoutes.js
│   │   │   └── adminRoutes.js
│   │   │
│   │   ├── models/                  # Database models
│   │   │   ├── Candidate.js
│   │   │   ├── Duplicate.js
│   │   │   ├── Ticket.js
│   │   │   └── User.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   └── validationMiddleware.js
│   │   │
│   │   ├── services/                # Helper services
│   │   │   ├── duplicateDetection.js
│   │   │   ├── normalizationService.js
│   │   │   └── exportService.js
│   │   │
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   ├── helpers.js
│   │   │   └── constants.js
│   │   │
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── firebase.js
│   │   │
│   │   ├── uploads/
│   │   │   └── resumes/
│   │   │
│   │   │
│   │   └── index.js
│   │
│   ├── package.json
│   └── .env
│
├── documentation/
│   ├── api-reference.md
│   └── setup.md
│
├── .gitignore
├── README.md
└── package.json

```

---

## 🚀 How to Run

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Firebase account** (for database and authentication)
- **OpenAI API key** (for AI features)
- **Google Generative AI API key** (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nashathsara/candidate-pool-system.git
   cd candidate-pool-system
   ```

2. **Install Backend Dependencies**
   ```bash
   cd functions
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Setup

1. **Backend Environment Variables**
   
   Create a `.env` file in the `functions/` directory:
   ```env
   PORT=5000
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_email_password
   ```

2. **Frontend Environment Variables**
   
   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### Running the Project

1. **Start the Backend Server**
   ```bash
   cd functions
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (or another port as specified by Vite)

3. **Access the Application**
   
   Open your browser and navigate to `http://localhost:5173`

### Production Build

1. **Build the Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Preview Production Build**
   ```bash
   npm run preview
   ```

3. **Start Backend in Production Mode**
   ```bash
   cd functions
   npm start
   ```

### Development Scripts

**Backend (functions/)**
- `npm run dev` - Start development server
- `npm start` - Start production server

**Frontend (frontend/)**
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

---
