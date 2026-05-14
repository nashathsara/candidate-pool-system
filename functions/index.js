const express = require('express');
const cors = require('cors');
require('dotenv').config();
const candidateRoutes = require('./routes/candidateRoutes');

// 1. මුලින්ම app එක හදාගන්න ඕනේ (Initialize)
const app = express();

// 2. ඊට පස්සේ තමයි middleware පාවිච්චි කරන්නේ
app.use(cors({ origin: true }));
app.use(express.json());

// 3. ඊළඟට routes සම්බන්ධ කරනවා
app.use('/api/candidates', candidateRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🚀 Candidate Pool System API is running!`);
  console.log(`========================================`);
});
