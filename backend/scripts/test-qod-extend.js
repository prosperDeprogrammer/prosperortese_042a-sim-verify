/**
 * Nokia Network as Code — QoD: POST /qod/v0/sessions/{sessionId}/extend
 * Matches RapidAPI’s generated snippet (p-eu hostname + nokia x-rapidapi-host).
 *
 * You need a real session id from an existing QoD session (create session first).
 *
 * Usage:
 *   cd backend && node scripts/test-qod-extend.js <sessionId>
 *   npm run test:qod -- <sessionId>
 *
 * Env (backend/.env): NAC_API_KEY required.
 * Optional: NAC_QOD_HOSTNAME, NAC_QOD_RAPIDAPI_HOST, QOD_SESSION_ID, QOD_ADDITIONAL_DURATION
 */

const https = require('https');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const sessionId = process.argv[2] || process.env.QOD_SESSION_ID;
const additionalDuration = parseInt(
  process.env.QOD_ADDITIONAL_DURATION || '60',
  10
);

if (!sessionId) {
  console.error(`
Usage:
  node scripts/test-qod-extend.js <sessionId>

Or set QOD_SESSION_ID in .env

Set NAC_API_KEY in backend/.env (same key as RapidAPI / Postman).
`);
  process.exit(1);
}

if (!process.env.NAC_API_KEY) {
  console.error('Missing NAC_API_KEY in backend/.env');
  process.exit(1);
}

const hostname =
  process.env.NAC_QOD_HOSTNAME || 'network-as-code.p-eu.rapidapi.com';
const rapidApiHost =
  process.env.NAC_QOD_RAPIDAPI_HOST ||
  process.env.NAC_RAPIDAPI_HOST ||
  'network-as-code.nokia.rapidapi.com';

const reqPath = `/qod/v0/sessions/${encodeURIComponent(sessionId)}/extend`;
const body = JSON.stringify({
  requestedAdditionalDuration: additionalDuration
});

const options = {
  method: 'POST',
  hostname,
  port: 443,
  path: reqPath,
  headers: {
    'x-rapidapi-key': process.env.NAC_API_KEY,
    'x-rapidapi-host': rapidApiHost,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body, 'utf8')
  }
};

console.log(`→ POST https://${hostname}${reqPath}`);
console.log('→ Body:', body);

const req = https.request(options, (res) => {
  const chunks = [];
  res.on('data', (chunk) => chunks.push(chunk));
  res.on('end', () => {
    const raw = Buffer.concat(chunks).toString('utf8');
    console.log(`← HTTP ${res.statusCode}`);
    try {
      console.log(JSON.stringify(JSON.parse(raw), null, 2));
    } catch {
      console.log(raw);
    }
  });
});

req.on('error', (err) => {
  console.error('Request failed:', err.message);
  process.exit(1);
});

req.write(body);
req.end();
