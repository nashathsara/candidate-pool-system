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

### Option 1: Base Configuration (Lightweight)
### Option 2: Advanced AI & Enterprise
### Option 3: Lean AI Stack (Recommended)

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
│   │   │   ├── MainLayout.jsx
│   │   │   └── AdminLayout.jsx
│   │   │
│   │   ├── styles/
│   │   │   └── globals.css
│   │   │
│   │   ├── App.jsx
│   │   ├── AppRoutes.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
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