const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai/index.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ Configuration ============
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('\n========================================');
    console.log('🚀 Candidate Pool System API is running!');
    console.log('========================================');
});