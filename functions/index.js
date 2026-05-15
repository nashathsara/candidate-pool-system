const express = require('express');
const cors = require('cors'); 
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai/index.js');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// ==========================================
// 1. GLOBAL MIDDLEWARE (Must come BEFORE routes!)
// ==========================================

// Enable CORS with full preflight settings for your frontend
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse incoming request payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 2. API ROUTES (Must come AFTER middleware!)
// ==========================================
app.use('/api/admin', adminRoutes);

// ==========================================
// 3. SERVER INITIALIZATION
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('\n========================================');
    console.log('🚀 Candidate Pool System API is running!');
    console.log(`📡 Listening on http://localhost:${PORT}`);
    console.log('========================================');
});