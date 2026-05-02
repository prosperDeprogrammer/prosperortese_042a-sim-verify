const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { verifyUser } = require('./controllers/verifyController');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Main Endpoint: SimVerify Fraud Intelligence API
app.post('/verify-user', verifyUser);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'SimVerify Fraud Intelligence API',
    nokia_nac: 'connected',
    bundle: 'theme5-v2-three-apis',
    mockNumberVerification: process.env.NAC_MOCK_NUMBER_VERIFICATION === 'true'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log('-------------------------------------------');
  console.log('🛡️  SimVerify Fraud Intelligence API');
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`⏱️  Nokia Timeout: ${process.env.NAC_TIMEOUT_MS}ms`);
  console.log(`⚡ Caching: ${process.env.NAC_CACHE_TTL_MS}ms`);
  console.log('-------------------------------------------');
});
