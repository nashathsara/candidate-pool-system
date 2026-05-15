const express = require('express');
const cors = require('cors');
require('dotenv').config();
const candidateRoutes = require('./routes/candidateRoutes');

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.use('/api/candidates', candidateRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🚀 Candidate Pool System API is running!`);
  console.log(`========================================`);
});
