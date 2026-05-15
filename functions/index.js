const express = require('express');
const cors = require('cors');
require('dotenv').config();
const candidateRoutes = require('./routes/candidateRoutes');

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.use('/api/candidates', candidateRoutes);

// Basic root health endpoint so GET / returns a friendly message (helps quick checks)
app.get('/', (req, res) => {
  res.status(200).send('Candidate Pool System API is running');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🚀 Candidate Pool System API is running on port ${PORT}!`);
  console.log(`========================================`);
});
